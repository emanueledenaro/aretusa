import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
const root = process.cwd();
const text = await readFile("packages/ui/src/catalog.ts", "utf8");
const compiled = ts.transpileModule(text, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { catalog } = await import(
  "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
);
const themeSource = await readFile("packages/ui/src/theme.ts", "utf8");
await writeFile(
  "packages/cli/src/theme.mjs",
  ts.transpileModule(themeSource, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
);
const sourceRoot = path.resolve("packages/ui/src");
async function resolveLocal(specifier, fromFile) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  if (!base.startsWith(sourceRoot + path.sep))
    throw Error("UI source import escapes its root: " + specifier);
  for (const candidate of [
    base,
    base + ".tsx",
    base + ".ts",
    base + ".css",
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch (e) {
      if (e.code !== "ENOENT" && e.code !== "ENOTDIR") throw e;
    }
  }
  throw Error("Unresolved UI import: " + specifier + " from " + fromFile);
}
function packageName(specifier) {
  if (specifier.startsWith("node:"))
    throw Error("Node-only import in UI source");
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}
async function itemFiles(module) {
  const files = new Map(),
    dependencies = new Set(["react-dom"]);
  async function visit(file) {
    if (files.has(file)) return;
    const content = await readFile(file, "utf8");
    files.set(file, content);
    if (file.endsWith(".css")) {
      for (const match of content.matchAll(/@import\s+["']([^"']+)["']/g)) {
        if (match[1].startsWith("."))
          await visit(await resolveLocal(match[1], file));
        else dependencies.add(packageName(match[1]));
      }
      return;
    }
    const source = ts.createSourceFile(
      file,
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    for (const node of source.statements) {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const specifier = node.moduleSpecifier.text;
        if (specifier.startsWith("."))
          await visit(await resolveLocal(specifier, file));
        else dependencies.add(packageName(specifier));
      }
    }
  }
  await visit(
    await resolveLocal("./" + module, path.join(sourceRoot, "__entry__.tsx")),
  );
  await visit(path.join(sourceRoot, "styles.css"));
  return {
    files: [...files].map(([file, content]) => ({
      path: path.relative(sourceRoot, file).split(path.sep).join("/"),
      content,
    })),
    dependencies: [...dependencies].sort(),
  };
}
const items = [];
const program = ts.createProgram(["packages/ui/src/index.ts"], {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  skipLibCheck: true,
  esModuleInterop: true,
});
const checker = program.getTypeChecker();
const relevant = new Set(
  "enabled speed highlight fade children shape decorative tone size loading disabled trigger title description onConfirm confirmLabel onOpenChange open footer placement label options hint error ratio as editorial value onValueChange defaultValue min max step length onChange items defaultOpen type orientation src onRemove slides columns rows caption data kind compact left right questions onComplete author time side action name links eyebrow onSubmit id className name placeholder required checked onCheckedChange defaultChecked".split(
    " ",
  ),
);
function apiFor(module, name) {
  const source =
    program.getSourceFile(path.resolve("packages/ui/src/" + module + ".tsx")) ||
    program.getSourceFile("packages/ui/src/" + module + ".tsx");
  if (!source) return [];
  const symbol = checker.getSymbolAtLocation(source);
  if (!symbol) return [];
  const exp = checker.getExportsOfModule(symbol).find((s) => s.name === name);
  if (!exp) return [];
  const signatures = checker
    .getTypeOfSymbolAtLocation(exp, source)
    .getCallSignatures();
  const param = signatures[0]?.parameters[0];
  if (!param) return [];
  const type = checker.getTypeOfSymbolAtLocation(param, source);
  return type
    .getProperties()
    .filter((p) => relevant.has(p.name))
    .map((p) => ({
      name: p.name,
      required: !(p.flags & ts.SymbolFlags.Optional),
      type: checker
        .typeToString(
          checker.getTypeOfSymbolAtLocation(p, source),
          undefined,
          ts.TypeFormatFlags.NoTruncation,
        )
        .slice(0, 180),
    }));
}
for (const entry of catalog)
  items.push({
    ...entry,
    type: entry.module === "utilities" ? "utility" : "component",
    api: apiFor(entry.source, entry.exportName),
    ...(await itemFiles(entry.source)),
  });
for (const name of [
  "HeaderBlock",
  "HeroBlock",
  "EditorialBlock",
  "FeatureGrid",
  "FAQBlock",
  "CTABlock",
  "FooterBlock",
  "FormBlock",
  "LoginBlock",
  "SignupBlock",
  "ApplicationShell",
])
  items.push({
    name,
    id: name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
    description: "Original Aretusa page section.",
    type: "block",
    source: "blocks",
    ...(await itemFiles("blocks")),
  });
const registry = {
  version: 1,
  name: "aretusa",
  items: items.map((i) => ({ ...i, name: i.id })),
};
await mkdir("packages/cli/registry", { recursive: true });
await mkdir("apps/docs/public/r", { recursive: true });
await writeFile("packages/cli/registry/index.json", JSON.stringify(registry));
await writeFile("apps/docs/public/r/index.json", JSON.stringify(registry));
for (const item of registry.items)
  await writeFile(
    "apps/docs/public/r/" + item.name + ".json",
    JSON.stringify(item),
  );
console.log(
  "Built " +
    registry.items.length +
    " original registry items (" +
    registry.items.filter(item => item.type === "component").length +
    " components, " + registry.items.filter(item => item.type === "utility").length + " utilities).",
);
