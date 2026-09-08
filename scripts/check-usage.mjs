import ts from 'typescript';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
async function load(file){const source=await readFile(file,'utf8');return import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText).toString('base64'))}
const {catalog}=await load('packages/ui/src/catalog.ts');
const {usageCode}=await load('apps/docs/src/usage.ts');
await mkdir('.usage-check',{recursive:true});
for(const item of catalog){const code=usageCode(item.id,item.exportName,item.source).replaceAll('./components/aretusa/','../packages/ui/src/');await writeFile('.usage-check/'+item.id+'.tsx',code);}
await writeFile('.usage-check/tsconfig.json',JSON.stringify({extends:'../tsconfig.json',include:['./*.tsx'],compilerOptions:{types:['react']}}));
const result=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--project','.usage-check/tsconfig.json'],{encoding:'utf8'});
process.stdout.write(result.stdout);process.stderr.write(result.stderr);
if(result.status!==0)process.exitCode=1;else console.log('All '+catalog.length+' public usage examples typecheck.');
