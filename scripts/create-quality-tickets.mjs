import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const repo='emanueledenaro/aretusa';
function gh(args,input){const r=spawnSync('gh',args,{encoding:'utf8',input:input?JSON.stringify(input):undefined,maxBuffer:16*1024*1024});if(r.status!==0)throw Error(args.join(' ')+'\n'+(r.stderr||r.stdout));return r.stdout.trim()?JSON.parse(r.stdout):null}
function api(route,body){return gh(['api',...(body?['--method','POST','--input','-']:[]),route],body)}
const all=gh(['api','--paginate','--slurp','repos/'+repo+'/issues?state=all&per_page=100']).flat();
const existing=new Map(all.flatMap(i=>{const match=i.body?.match(/Aretusa-Item: ([a-z0-9-]+)/);return match?[[match[1],i]]:[]}));
const labelSet=new Set(gh(['label','list','--repo',repo,'--json','name']).map(l=>l.name));
for(const [name,color] of [['quality-review','8B5E3C'],['mobile-first','35777D'],['component','6F7D50'],['block','A5763A']])if(!labelSet.has(name))api('repos/'+repo+'/labels',{name,color});
const epicBody='## Objective\n\nRaise every Aretusa component and block to the project design and engineering quality contract. Mobile-first, deliberate visual hierarchy, complete behavior and consumer-ready source.\n\n## Completion rule\n\nEvery child issue needs rendered visual evidence, responsive and interaction checks, typed usage and consumer installation proof. P0/P1/P2 findings or pending applicable gates prevent release-ready. Catalog count and smoke renders do not prove completion.\n\n## Rules\n\n- [Design principles](https://github.com/'+repo+'/blob/main/docs/design-principles.md)\n- [Code standards](https://github.com/'+repo+'/blob/main/docs/code-standards.md)\n- [Quality contract](https://github.com/'+repo+'/blob/main/docs/quality-contract.md)\n\nAretusa-Quality: per-component-v1';
let epic=all.find(i=>i.body?.includes('Aretusa-Quality: per-component-v1'));
if(!epic){epic=api('repos/'+repo+'/issues',{title:'Aretusa design engineering: per-component quality gate',body:epicBody,labels:['quality-review','mobile-first','ready-for-agent']});console.log('Created quality epic #'+epic.number)}
const registry=JSON.parse(await readFile('packages/cli/registry/index.json','utf8'));
const scenarios=JSON.parse(await readFile('docs/quality/component-scenarios.json','utf8'));
const blockSpecific={
'header-block':['Review wordmark, navigation, active state and action hierarchy.','Use mobile disclosure with focus and escape behavior; keep every destination reachable.','Test long product names, narrow widths, zoom and sticky-header collisions.'],
'hero-block':['Balance headline, supporting text, media and primary/secondary actions.','Start with a mobile-first hierarchy and reflow intentionally on wider screens.','Test long copy, missing media and action clarity without layout shifts.'],
'editorial-block':['Refine reading measure, section label, heading and body rhythm.','Preserve meaningful semantic headings and source order.','Test long copy, links, narrow parents and 200% text zoom.'],
'feature-grid':['Maintain consistent card anatomy with varied content lengths.','Stack before squeezing readable text or actions.','Verify keyboard order and responsive grid density.'],
'faqblock':['Compose headings and Accordion with a coherent reading rhythm.','Verify keyboard expansion, focus and direct links where supported.','Test long questions, answers and narrow mobile widths.'],
'ctablock':['Make one primary next step clear without excessive decoration.','Preserve action semantics and loading/disabled states.','Test multiline headings and touch-size actions on mobile.'],
'footer-block':['Keep identity, legal/support links and grouped navigation legible.','Preserve link semantics and a predictable mobile order.','Test long links, translation-length copy and narrow widths.'],
'form-block':['Compose label, control, hint/error and submit feedback consistently.','Verify real validation, loading, success/error callbacks and form semantics.','Test keyboard, mobile input, focus-to-error and short viewports.'],
'login-block':['Review credentials, help, error and submit hierarchy.','Verify pending, rejected and successful callback states without fabricated authentication.','Test autofill, password managers, mobile keyboard and focus recovery.'],
'signup-block':['Make account-creation requirements and validation clear.','Verify valid/invalid/pending/rejected outcomes with correct input semantics.','Test long labels, mobile keyboard and accessible error association.'],
'application-shell':['Refine sidebar groups, active state, header and workspace rhythm.','Provide functional collapsed and mobile navigation without losing destinations.','Test keyboard, narrow viewports, long navigation and independent content scrolling.']
};
const deps={
'button-group':['button'],'field':['label','input'],'input-group':['input'],'date-picker':['calendar','input','popover'],
'alert-dialog':['button'],'dialog':['button'],'drawer':['dialog'],'sheet':['dialog'],'popover':['button'],'tooltip':['button'],'hover-card':[],
'command':['dialog','input'],'dropdown-menu':['button'],'context-menu':['dropdown-menu'],'menubar':['dropdown-menu'],
'sidebar':['navigation-menu'],'pagination':['button'],'carousel':['button'],'data-table':['table','input','pagination'],'chart':['table'],
'message':['bubble'],'message-scroller':['message'],'questionnaire':['field','radio-group','progress','button'],
'header-block':['navigation-menu','button'],'hero-block':['typography','button'],'editorial-block':['typography'],
'feature-grid':['card'],'faqblock':['accordion'],'ctablock':['button','typography'],'footer-block':['navigation-menu'],
'form-block':['field','input','button'],'login-block':['field','input','button'],'signup-block':['field','input','button'],'application-shell':['button','navigation-menu']
};
const checks=[
'Design review: hierarchy, optical spacing, typography, alignment, radius, surface and state contrast are deliberate and token-based.',
'Complete all applicable idle/hover/focus/active/selected/disabled/loading/empty/error/success and long-content states; explain non-applicable states.',
'Verify 320/390/768/1024/1440 CSS-pixel layouts, a narrow parent where meaningful, 200% text zoom and no page overflow.',
'Verify keyboard, touch, accessible names/state/errors, focus and reduced motion; document any dense-target exception.',
'Review the public TypeScript API, controlled/uncontrolled behavior, refs/events and dependency/bundle impact.',
'Compile the documented usage, install the registry item in a clean consumer and verify source/preview parity.',
'Attach commit, test commands/results, rendered evidence and review findings; all applicable gates pass with no unresolved P0/P1/P2 defects.'
];
await mkdir('docs/quality/tickets',{recursive:true});
const coverage={version:1,epic:epic.number,contract:'docs/quality-contract.md',items:[]};
let previous=[];try{previous=JSON.parse(await readFile('docs/quality/coverage.json','utf8')).items||[]}catch(e){if(e.code!=='ENOENT')throw e}
for(const entry of registry.items){const id=entry.name,name=entry.type==='block'?id:entry.name.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
const specific=scenarios[id]||blockSpecific[id];if(!specific)throw Error('Missing component-specific scenarios: '+id);
const body='## Parent\n\n#'+epic.number+'\n\n## What to deliver\n\nBring '+name+' to the Aretusa design and code quality contract, from rendered behavior through documented, installable source. Existing code is a starting point, not evidence of completion.\n\n## Component-specific scenarios\n\n'+specific.map(s=>'- [ ] '+s).join('\n')+'\n\n## Shared acceptance gates\n\n'+checks.map(s=>'- [ ] '+s).join('\n')+'\n\n## Rules\n\nFollow the repository design principles, code standards and quality contract. Use the aretusa-component and aretusa-review project skills.\n\n## Dependency policy\n\nPrerequisite items: '+((deps[id]||[]).join(', ')||'none')+'. Native blocking links will be added after the full catalog is registered.\n\n## Evidence\n\nStatus remains implemented until behavior, visual and consumer gates have evidence. Use docs/quality/evidence-template.md.\n\nAretusa-Item: '+id;
await writeFile('docs/quality/tickets/'+id+'.md','# '+name+'\n\n'+body+'\n');
let issue=existing.get(id);if(!issue){issue=api('repos/'+repo+'/issues',{title:(entry.type==='block'?'Block':'Component')+' / '+name+' / design, behavior and responsive quality',body,labels:['quality-review','mobile-first',entry.type==='block'?'block':'component','ready-for-agent']});existing.set(id,issue);}
coverage.items.push({id,name,type:entry.type,issue:issue.number,databaseId:issue.id,url:issue.html_url,status:'implemented',gates:{design:'pending',responsive:'pending',interaction:'pending',code:'pending',distribution:'pending'},dependencies:deps[id]||[]});
const prior=previous.find(p=>p.id===id&&p.issue===issue.number);if(prior){const row=coverage.items.at(-1);row.status=prior.status;row.gates=prior.gates;if(prior.evidence)row.evidence=prior.evidence}
await writeFile('docs/quality/coverage.json',JSON.stringify(coverage,null,2)+'\n');
if(coverage.items.length%5===0)console.log('Tracked '+coverage.items.length+'/'+registry.items.length+' items. Latest #'+issue.number);
}
const children=api('repos/'+repo+'/issues/'+epic.number+'/sub_issues?per_page=100')||[];
for(const item of coverage.items){if(!children.some(c=>c.id===item.databaseId))api('repos/'+repo+'/issues/'+epic.number+'/sub_issues',{sub_issue_id:item.databaseId});const current=api('repos/'+repo+'/issues/'+item.issue+'/dependencies/blocked_by')||[];for(const dependency of item.dependencies){const blocker=coverage.items.find(i=>i.id===dependency);if(!blocker)throw Error('Unknown dependency '+dependency);if(!current.some(c=>c.id===blocker.databaseId))api('repos/'+repo+'/issues/'+item.issue+'/dependencies/blocked_by',{issue_id:blocker.databaseId})}}
const finalBody=epicBody+'\n\n## Catalog\n\n'+coverage.items.map(i=>'- [ ] #'+i.issue+' '+i.name).join('\n');
gh(['api','--method','PATCH','repos/'+repo+'/issues/'+epic.number,'--input','-'],{body:finalBody});
const currentParentDeps=api('repos/'+repo+'/issues/5/dependencies/blocked_by')||[];
if(!currentParentDeps.some(i=>i.id===epic.id))api('repos/'+repo+'/issues/5/dependencies/blocked_by',{issue_id:epic.id});
await writeFile('docs/quality/index.md','# Component quality tracker\n\nEvery component and block has its own issue and evidence gates. No item is release-ready by default.\n\nParent: [#'+epic.number+']('+epic.html_url+')\n\n| Item | Type | Issue | Status |\n| --- | --- | --- | --- |\n'+coverage.items.map(i=>'| '+i.name+' | '+i.type+' | [#'+i.issue+']('+i.url+') | '+i.status+' |').join('\n')+'\n');
console.log('Completed: '+coverage.items.length+' individual tickets, native sub-issues and dependencies. Epic #'+epic.number);
