import { mkdtemp, writeFile, readFile, mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import os from "node:os";
const root = process.cwd();
const consumer = await mkdtemp(
  path.join(os.tmpdir(), "aretusa-real-consumer-"),
);
function run(bin, args) {
  const r = spawnSync(bin, args, {
    cwd: consumer,
    encoding: "utf8",
    timeout: 180000,
  });
  if (r.status !== 0) throw Error(r.stderr || r.stdout || String(r.error));
  return r.stdout;
}
const cli = path.join(root, "packages/cli/src/cli.mjs");
run(process.execPath, [cli, "init", "--cwd", consumer]);
run(process.execPath, [cli, "add", "dialog", "--cwd", consumer]);
run(process.execPath, [cli, "add", "field", "--cwd", consumer]);
run(process.execPath, [cli, "add", "shimmer", "--cwd", consumer]);
run(process.execPath, [cli, "add", "scroll-fade", "--cwd", consumer]);
run(process.execPath, [cli, "add", "react-hook-form", "--cwd", consumer]);
run(process.execPath, [cli, "add", "tanstack-form", "--cwd", consumer]);
const registry = JSON.parse(
  await readFile(path.join(root, "packages/cli/registry/index.json"), "utf8"),
);
const manifest = JSON.parse(
  await readFile(path.join(root, "package.json"), "utf8"),
);
const required = new Set([
  "react",
  "react-dom",
  ...registry.items
    .filter((item) => ["dialog", "field", "shimmer", "scroll-fade", "react-hook-form", "tanstack-form"].includes(item.name))
    .flatMap((item) => item.dependencies),
]);
const dependencies = Object.fromEntries(
  [...required].map((name) => {
    const version = manifest.dependencies[name] ?? manifest.devDependencies[name];
    if (!version)
      throw Error("Registry dependency has no verified version: " + name);
    return [name, version];
  }),
);
await writeFile(
  path.join(consumer, "package.json"),
  JSON.stringify(
    {
      type: "module",
      scripts: { build: "tsc --noEmit && vite build" },
      dependencies,
      devDependencies: {
        typescript: "^5.9.3",
        vite: "^6.4.2",
        "@vitejs/plugin-react": "^5.0.4",
        "@tailwindcss/vite": "^4.1.0",
        "@types/react": "^19.2.0",
        "@types/react-dom": "^19.2.0",
      },
    },
    null,
    2,
  ),
);
await writeFile(
  path.join(consumer, "index.html"),
  '<!doctype html><html lang="en"><head><title>Aretusa consumer</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
);
await writeFile(
  path.join(consumer, "tsconfig.json"),
  JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      lib: ["ES2022", "DOM"],
      module: "ESNext",
      moduleResolution: "Bundler",
      jsx: "react-jsx",
      strict: true,
      skipLibCheck: true,
      esModuleInterop: true,
      noEmit: true,
    },
    include: ["src"],
  }),
);
await writeFile(
  path.join(consumer, "vite.config.js"),
  "import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import tailwind from '@tailwindcss/vite';export default defineConfig({plugins:[react(),tailwind()]});",
);
await writeFile(
  path.join(consumer, "src/main.tsx"),
  "import React from 'react';import {Shimmer} from './components/aretusa/shimmer';import {ScrollFade,useScrollFade} from './components/aretusa/scroll-fade';import {useForm} from 'react-hook-form';import {HookFormField} from './components/aretusa/react-hook-form';import {useForm as useTanStackForm} from '@tanstack/react-form';import {TanStackFormField,focusFirstInvalidField} from './components/aretusa/tanstack-form';import {createRoot} from 'react-dom/client';import {Button} from './components/aretusa/button';import {Modal} from './components/aretusa/overlays';import {Input,Field} from './components/aretusa/forms';import './components/aretusa/styles.css';function Profile(){const form=useForm<{name:string}>({defaultValues:{name:''}});return <form noValidate onSubmit={form.handleSubmit(()=>{})}><HookFormField control={form.control} name='name' label='Name' rules={{required:'Enter your name.'}}>{({field,controlProps})=><Input {...field} {...controlProps}/>}</HookFormField></form>;}function Visit(){const form=useTanStackForm({defaultValues:{name:''},onSubmitInvalid:({formApi})=>{setTimeout(()=>focusFirstInvalidField(formApi),0);}});return <form noValidate onSubmit={(e)=>{e.preventDefault();void form.handleSubmit();}}><form.Field name='name' validators={{onChange:({value})=>value?undefined:'Enter your name.'}}>{(field)=><TanStackFormField field={field} label='Name'>{({controlProps})=><Input {...controlProps} name={field.name} value={field.state.value} onChange={(e)=>field.handleChange(e.target.value)} onBlur={field.handleBlur}/>}</TanStackFormField>}</form.Field></form>;}function Activity(){const {ref,edges}=useScrollFade({axis:'both'});return <div className='relative'><div ref={ref} role='region' aria-label='Activity' tabIndex={0} className='h-20 overflow-auto'><p>Installed scroll fade</p></div><ScrollFade edges={edges} depth={24}/></div>;}createRoot(document.getElementById('root')!).render(<Modal trigger={<Button>Open</Button>} title='Consumer' description='Installed source'><Shimmer>Loading preview</Shimmer><Activity/><Profile/><Visit/><Field label='Name'><Input/></Field></Modal>);",
);
console.log("Clean consumer: " + consumer);
console.log(run("npm", ["install", "--no-audit", "--no-fund"]));
console.log(run("npm", ["run", "build"]));
console.log(
  "Consumer typecheck and production build passed. Fixture retained for inspection: " +
    consumer,
);
