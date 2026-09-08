import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import ts from 'typescript';
const root = process.cwd();
const text = await readFile("packages/ui/src/catalog.ts", "utf8");
const compiled = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { catalog } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const imports = {
  basic: ["utils"],
  forms: ["utils"],
  overlays: ["basic", "utils"],
  navigation: ["basic", "overlays", "utils"],
  data: ["basic", "forms", "navigation", "utils"],
  conversation: ["basic", "forms"],
  blocks: ["basic", "forms", "navigation"],
};
const deps = {
  basic: ["react", "lucide-react", "clsx", "tailwind-merge"],
  forms: [
    "react",
    "radix-ui",
    "lucide-react",
    "react-day-picker",
    "date-fns",
    "clsx",
    "tailwind-merge",
  ],
  overlays: ["react", "radix-ui", "lucide-react"],
  navigation: ["react", "radix-ui", "lucide-react"],
  data: ["react", "recharts", "lucide-react"],
  conversation: ["react", "lucide-react"],
  blocks: ["react"],
};
async function itemFiles(mod) {
  const names = new Set();
  function add(m) {
    if (names.has(m)) return;
    names.add(m);
    for (const d of imports[m] || []) add(d);
  }
  add(mod);
  const files = [];
  const dependencies = new Set(["react-dom", "tailwindcss"]);
  for (const m of names) {
    const file = m + (m === "utils" ? ".ts" : ".tsx");
    files.push({
      path: file,
      content: await readFile(path.join("packages/ui/src", file), "utf8"),
    });
    for (const d of deps[m] || []) dependencies.add(d);
  }
  files.push({
    path: "styles.css",
    content: await readFile("packages/ui/src/styles.css", "utf8"),
  });
  return { files, dependencies: [...dependencies].sort() };
}
const items = [];
for (const entry of catalog)
  items.push({
    ...entry,
    type: "component",
    ...(await itemFiles(entry.module)),
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
])
  items.push({
    name,
    id: name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
    description: "Original Aretusa page section.",
    type: "block",
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
    catalog.length +
    " components).",
);
