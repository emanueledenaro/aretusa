import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
const cli = path.resolve("packages/cli/src/cli.mjs");
test("init creates a consumer config without replacing package scripts", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "aretusa-consumer-"));
  try {
    const r = spawnSync(process.execPath, [cli, "init", "--cwd", cwd], {
      encoding: "utf8",
    });
    assert.equal(r.status, 0, r.stderr);
    const config = JSON.parse(
      await readFile(path.join(cwd, "aretusa.json"), "utf8"),
    );
    assert.equal(config.version, 1);
    assert.equal(config.directory, "src/components/aretusa");
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
test("add installs source and refuses to replace a consumer edit", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "aretusa-add-"));
  const run = (...args) =>
    spawnSync(process.execPath, [cli, ...args, "--cwd", cwd], {
      encoding: "utf8",
    });
  try {
    assert.equal(run("init").status, 0);
    assert.equal(run("add", "button").status, 0);
    const file = path.join(cwd, "src/components/aretusa/basic.tsx");
    assert.match(await readFile(file, "utf8"), /export const Button/);
    await writeFile(file, "local edit");
    const result = run("add", "button");
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Conflict/);
    assert.equal(await readFile(file, "utf8"), "local edit");
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
test("dry-run leaves source absent", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "aretusa-dry-"));
  try {
    spawnSync(process.execPath, [cli, "init", "--cwd", cwd]);
    const r = spawnSync(
      process.execPath,
      [cli, "add", "dialog", "--dry-run", "--cwd", cwd],
      { encoding: "utf8" },
    );
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(await readdir(cwd), ["aretusa.json"]);
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
test("registry validation rejects unresolved dependencies", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "aretusa-invalid-"));
  try {
    const file = path.join(cwd, "registry.json");
    await writeFile(
      file,
      JSON.stringify({
        version: 1,
        items: [
          { name: "button", files: [], registryDependencies: ["missing"] },
        ],
      }),
    );
    const r = spawnSync(
      process.execPath,
      [cli, "validate", "--registry", file, "--cwd", cwd],
      { encoding: "utf8" },
    );
    assert.equal(r.status, 1);
    assert.match(r.stderr, /Missing dependency/);
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
