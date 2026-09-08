import {readFile,access} from 'node:fs/promises';
const registry=JSON.parse(await readFile('packages/cli/registry/index.json','utf8'));
const coverage=JSON.parse(await readFile('docs/quality/coverage.json','utf8'));
const known=new Map(coverage.items.map(i=>[i.id,i]));
if(known.size!==coverage.items.length)throw Error('Duplicate quality entries');
const gates=['design','responsive','interaction','code','distribution'];
for(const item of registry.items){const row=known.get(item.name);if(!row)throw Error('Missing quality ticket: '+item.name);if(!Number.isInteger(row.issue)||row.issue<=0)throw Error('Invalid issue: '+item.name);await access('docs/quality/tickets/'+item.name+'.md');for(const gate of gates)if(!['pending','passed','failed','not-applicable'].includes(row.gates?.[gate]))throw Error('Missing gate '+gate+' for '+item.name);if(row.status==='release-ready'&&(!row.evidence||gates.some(g=>row.gates[g]!=='passed'&&row.gates[g]!=='not-applicable')))throw Error('Unproven release-ready claim: '+item.name)}
for(const name of ['aretusa-component','aretusa-review','aretusa-release'])await access('.agents/skills/'+name+'/SKILL.md');
const pending=coverage.items.filter(i=>i.status!=='release-ready');
console.log(registry.items.length+' registry items have individual quality tickets and gate records.');
console.log(pending.length+' items still require complete release-readiness evidence.');
if(process.argv.includes('--release')&&pending.length){console.error('Release blocked: component quality evidence is incomplete.');process.exitCode=1}
