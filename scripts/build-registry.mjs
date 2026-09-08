import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import ts from 'typescript';
const root = process.cwd();
const text = await readFile("packages/ui/src/catalog.ts", "utf8");
const compiled = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { catalog } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const themeSource=await readFile('packages/ui/src/theme.ts','utf8');
await writeFile('packages/cli/src/theme.mjs',ts.transpileModule(themeSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
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
const program=ts.createProgram(['packages/ui/src/index.ts'],{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,jsx:ts.JsxEmit.ReactJSX,skipLibCheck:true,esModuleInterop:true});
const checker=program.getTypeChecker();
const relevant=new Set('children tone size loading disabled trigger title description onConfirm confirmLabel onOpenChange open footer placement label options hint error ratio as editorial value onValueChange defaultValue min max step length onChange items defaultOpen type orientation src onRemove slides columns rows caption data kind compact left right questions onComplete author time side action name links eyebrow onSubmit id className name placeholder required checked onCheckedChange defaultChecked'.split(' '));
function apiFor(module,name){const source=program.getSourceFile(path.resolve('packages/ui/src/'+module+'.tsx'))||program.getSourceFile('packages/ui/src/'+module+'.tsx');if(!source)return [];const symbol=checker.getSymbolAtLocation(source);if(!symbol)return [];const exp=checker.getExportsOfModule(symbol).find(s=>s.name===name);if(!exp)return [];const signatures=checker.getTypeOfSymbolAtLocation(exp,source).getCallSignatures();const param=signatures[0]?.parameters[0];if(!param)return [];const type=checker.getTypeOfSymbolAtLocation(param,source);return type.getProperties().filter(p=>relevant.has(p.name)).map(p=>({name:p.name,required:!(p.flags&ts.SymbolFlags.Optional),type:checker.typeToString(checker.getTypeOfSymbolAtLocation(p,source),undefined,ts.TypeFormatFlags.NoTruncation).slice(0,180)}));}
for (const entry of catalog)
  items.push({
    ...entry,
    type: "component",
    api:apiFor(entry.module,entry.exportName),
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
  "LoginBlock",
  "SignupBlock",
  "ApplicationShell",
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
