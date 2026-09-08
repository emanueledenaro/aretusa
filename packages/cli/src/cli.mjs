#!/usr/bin/env node
import {
  readFile,
  writeFile,
  mkdir,
  stat,
  lstat,
  realpath,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const args = process.argv.slice(2),
  command = args[0] || "help";
function flag(name, fallback) {
  const i = args.indexOf(name);
  return i < 0 ? fallback : args[i + 1];
}
const cwd = path.resolve(flag("--cwd", process.cwd()));
const registryPath = path.resolve(
  flag(
    "--registry",
    fileURLToPath(new URL("../registry/index.json", import.meta.url)),
  ),
);
const exists = async (p) => {
  try {
    await stat(p);
    return true;
  } catch (e) {
    if (e.code === "ENOENT") return false;
    throw e;
  }
};
function within(root, relative) {
  if (
    typeof relative !== "string" ||
    !relative ||
    path.isAbsolute(relative) ||
    relative.split(/[\\/]/).includes("..")
  )
    throw Error("Unsafe path: " + relative);
  const out = path.resolve(root, relative);
  if (!out.startsWith(root + path.sep)) throw Error("Unsafe path: " + relative);
  return out;
}
async function safeParents(target) {
  let p = target;
  while (p !== cwd) {
    try {
      if ((await lstat(p)).isSymbolicLink())
        throw Error("Symlink path refused: " + p);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    const parent = path.dirname(p);
    if (parent === p) throw Error("Path escapes project");
    p = parent;
  }
}
async function load() {
  const r = JSON.parse(await readFile(registryPath, "utf8"));
  if (r.version !== 1 || !Array.isArray(r.items))
    throw Error("Unsupported registry");
  const names = new Set();
  for (const item of r.items) {
    if (!/^[a-z0-9-]+$/.test(item.name) || names.has(item.name))
      throw Error("Invalid or duplicate item");
    names.add(item.name);
    if (!Array.isArray(item.files)) throw Error("Missing files");
    for (const f of item.files) {
      within(cwd, f.path);
      if (typeof f.content !== "string") throw Error("Invalid source");
    }
  }
  const seen = new Set(),
    stack = new Set();
  function check(item) {
    if (stack.has(item.name)) throw Error("Registry dependency cycle");
    if (seen.has(item.name)) return;
    stack.add(item.name);
    for (const dep of item.registryDependencies || []) {
      const match = r.items.find((i) => i.name === dep);
      if (!match) throw Error("Missing dependency: " + dep);
      check(match);
    }
    stack.delete(item.name);
    seen.add(item.name);
  }
  for (const item of r.items) check(item);
  return r;
}
async function run() {
  if (command === "help" || args.includes("--help")) {
    console.log(
      "Aretusa by TrinacriaLabs\nCommands: init, list, view <item>, add <item>, validate\nOptions: --cwd <project> --registry <local JSON> --dry-run\nSources are copied into your project. Existing differing files are never overwritten.",
    );
    return;
  }
  await mkdir(cwd, { recursive: true });
  if (command === "init") {
    const file = path.join(cwd, "aretusa.json");
    if (await exists(file)) {
      console.log("aretusa.json already exists; preserved.");
      return;
    }
    await writeFile(
      file,
      JSON.stringify(
        { version: 1, directory: "src/components/aretusa" },
        null,
        2,
      ) + "\n",
      { flag: "wx" },
    );
    console.log(
      "Created aretusa.json. Add Tailwind v4 and import the installed theme CSS in your app.",
    );
    return;
  }
  const registry = await load();
  if (command === "validate") {
    console.log("Registry valid: " + registry.items.length + " items");
    return;
  }
  if (command === "list") {
    console.log(
      registry.items.map((i) => i.name + "  " + i.description).join("\n"),
    );
    return;
  }
  const item = registry.items.find((i) => i.name === args[1]);
  if (!item) throw Error("Unknown item: " + (args[1] || "(missing)"));
  if (command === "view") {
    console.log(JSON.stringify(item, null, 2));
    return;
  }
  if (command !== "add") throw Error("Unknown command: " + command);
  const config = JSON.parse(
    await readFile(path.join(cwd, "aretusa.json"), "utf8"),
  );
  if (config.version !== 1) throw Error("Unsupported configuration");
  const base = within(cwd, config.directory);
  await safeParents(base);
  const collected = new Map(),
    visiting = new Set();
  function visit(entry) {
    if (collected.has(entry.name)) return;
    if (visiting.has(entry.name)) throw Error("Registry dependency cycle");
    visiting.add(entry.name);
    for (const dep of entry.registryDependencies || []) {
      const found = registry.items.find((i) => i.name === dep);
      if (!found) throw Error("Missing dependency: " + dep);
      visit(found);
    }
    visiting.delete(entry.name);
    collected.set(entry.name, entry);
  }
  visit(item);
  const files = new Map(),
    dependencies = new Set();
  for (const entry of collected.values()) {
    for (const dep of entry.dependencies || []) dependencies.add(dep);
    for (const f of entry.files) {
      const dest = within(base, f.path);
      if (files.has(dest) && files.get(dest) !== f.content)
        throw Error("Conflicting registry files");
      files.set(dest, f.content);
    }
  }
  const pending = [];
  for (const [dest, content] of files) {
    await safeParents(dest);
    if (await exists(dest)) {
      if ((await readFile(dest, "utf8")) !== content)
        throw Error(
          "Local changes preserved. Conflict: " + path.relative(cwd, dest),
        );
    } else pending.push([dest, content]);
  }
  if (args.includes("--dry-run"))
    console.log("Dry run. No source files written.");
  else
    for (const [dest, content] of pending) {
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, content, { flag: "wx" });
    }
  console.log(
    (args.includes("--dry-run") ? "Would create " : "Created ") +
      pending.length +
      " files for " +
      item.name,
  );
  for (const [dest] of pending) console.log("  " + path.relative(cwd, dest));
  if (dependencies.size)
    console.log(
      "Install dependencies:\nnpm install " +
        [...dependencies].sort().join(" "),
    );
  console.log(
    "Import " +
      config.directory +
      "/styles.css from your app CSS. Configure Tailwind to scan the installed source directory.",
  );
}
run().catch((e) => {
  console.error("Aretusa: " + e.message);
  process.exitCode = 1;
});
