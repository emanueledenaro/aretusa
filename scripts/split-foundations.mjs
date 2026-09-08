import {readFile,writeFile} from 'node:fs/promises';
import ts from 'typescript';
const root='packages/ui/src/';
const source=await readFile(root+'basic.tsx','utf8');
if(source.includes('export * from "./button"')){console.log('Foundations are already separated.');process.exit(0)}
const ast=ts.createSourceFile('basic.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const groups={button:['ButtonProps','Button'],avatar:['AvatarProps','Avatar'],badge:['Badge'],card:['Card','CardHeader','CardTitle','CardDescription','CardFooter'],separator:['Separator'],skeleton:['Skeleton'],spinner:['Spinner'],alert:['Alert'],empty:['Empty'],progress:['Progress'],'aspect-ratio':['AspectRatio'],kbd:['Kbd'],'button-group':['ButtonGroup'],item:['Item'],typography:['Typography'],direction:['Direction']};
function nameOf(n){if(ts.isVariableStatement(n))return n.declarationList.declarations[0]?.name.getText(ast);return n.name?.getText(ast)}
const declarations=ast.statements.filter(n=>!ts.isImportDeclaration(n));
if(declarations.some(n=>!Object.values(groups).flat().includes(nameOf(n))))throw Error('Unmapped foundation declaration');
for(const [file,names] of Object.entries(groups)){const body=declarations.filter(n=>names.includes(nameOf(n))).map(n=>n.getFullText(ast).trim()).join('\n\n');const imports=[];if(/\bReact\b/.test(body))imports.push('import * as React from "react";');const icons=['LoaderCircle','UserRound'].filter(n=>new RegExp('\\b'+n+'\\b').test(body));if(icons.length)imports.push('import { '+icons.join(', ')+' } from "lucide-react";');if(/\bcx\b/.test(body))imports.push('import { cx } from "./utils";');await writeFile(root+file+'.tsx',imports.join('\n')+'\n\n'+body+'\n')}
await writeFile(root+'basic.tsx',Object.keys(groups).map(name=>'export * from "./'+name+'";').join('\n')+'\n');
const catalogText=await readFile(root+'catalog.ts','utf8');
const {catalog}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(catalogText,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const next=catalog.map(e=>({...e,source:e.module==='basic'?e.id:e.module}));
await writeFile(root+'catalog.ts','export const catalog = '+JSON.stringify(next,null,2)+' as const;\nexport type ComponentId = typeof catalog[number]["id"];\n');
const direct={overlays:{basic:['Button']},navigation:{basic:['Button']},data:{basic:['Button','Empty']},conversation:{basic:['Button','Progress']},blocks:{basic:['Button','Card','CardTitle','CardDescription']}};
const exports=Object.fromEntries(Object.entries(groups).flatMap(([file,names])=>names.map(n=>[n,file])));
for(const [file,modules] of Object.entries(direct)){let text=await readFile(root+file+'.tsx','utf8');text=text.replace(/import\s*\{([^}]+)\}\s*from\s*["']\.\/basic["'];?/g,(_,names)=>{const grouped=new Map();for(const n of names.split(',').map(n=>n.trim()).filter(Boolean)){const destination=exports[n];if(!destination)throw Error('Unknown import '+n);grouped.set(destination,[...(grouped.get(destination)||[]),n])}return [...grouped].map(([destination,names])=>'import { '+names.join(', ')+' } from "./'+destination+'";').join('\n')});await writeFile(root+file+'.tsx',text)}
console.log('Separated '+Object.keys(groups).length+' original foundation sources; internal barrel preserved.');
