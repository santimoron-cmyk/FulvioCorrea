import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {physicianNode,editorialAuthor,membershipView} from './practice-view.mjs';
import {localizePath} from './routes.mjs';
const practice=JSON.parse(fs.readFileSync('data/practice.json'));
const origin=JSON.parse(fs.readFileSync('config.json')).origin;
const doctor=physicianNode(practice,origin);
assert.deepEqual(doctor.sameAs,practice.sameAs);
assert.equal(physicianNode({...practice,societies:[],affiliations:[]},origin).memberOf,undefined);
assert.ok(physicianNode(practice,origin).memberOf.some(m=>m.alternateName==='FILACP'));
for(const [i,s] of practice.societies.entries()){
 const m=doctor.memberOf[i];assert.equal(m.roleName,s.role);assert.equal(m.memberOf.name,s.name);assert.equal(m.memberOf.sameAs,s.source);
 const noRole=physicianNode({...practice,societies:[{...s,role:''}]},origin);assert.equal(noRole.memberOf[0]['@type'],'MedicalOrganization');
 for(const lang of ['en','es'])assert.ok(membershipView(practice,lang).includes(s[lang]));
}
assert.deepEqual(editorialAuthor({...practice,authorApproved:true},'en',origin),{'@id':origin+'/#physician'});
assert.equal(editorialAuthor({...practice,authorApproved:false},'en',origin)['@type'],'Organization');
vm.runInNewContext(fs.readFileSync('contact-widget.js','utf8'),{});
vm.runInNewContext(fs.readFileSync('thank-you.js','utf8'),{});
const ghlChat=JSON.parse(fs.readFileSync('data/chat.json','utf8')).provider==='ghl';vm.runInNewContext(fs.readFileSync('ghl-chat.js','utf8'),{document:{getElementById:()=>null}});
for(const page of JSON.parse(fs.readFileSync('pages.json'))){const h=fs.readFileSync(page.file,'utf8');
 assert.equal((h.match(/<\/body>/g)||[]).length,1,page.route+' corrupt body insertion');
 // Chat provider (data/chat.json): native = launcher + Sofía dialog; ghl = launcher only (GHL loads on first click).
 assert.match(h,ghlChat?/<\/button><\/div><script defer src="\/contact.js"><\/script>/:/<\/dialog><script defer src="\/contact.js"><\/script>/,page.route+' widget script must be outside form attributes');
 assert.equal(h.includes('src="/contact.js"'),h.includes('id="contact-open"'));
 // The launcher is just "Sofía": no "virtual assistant" label, visible or accessible.
 assert.doesNotMatch(h.match(/<div class="contact-launcher"><button[^>]*>/)?.[0]||'',/virtual assistant|asistente virtual/i,page.route);assert.equal(h.includes('id="contact-dialog"'),!ghlChat&&h.includes('id="contact-open"'));
 assert.equal(h.includes('src="/thank-you.js"'),h.includes('id="thanks-confirmation"'));
 if(ghlChat&&h.includes('id="contact-open"')){const t=JSON.parse(h.match(/data-texts="([^"]*)"/)[1].replaceAll('&quot;','"').replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>'));
  // GHL texts follow the page language, name Sofía (never the dashboard's Eileen) and use the S avatar, not a photo.
  assert.equal(t.heading,'Sofía',page.route);assert.equal(t.subtitle,undefined,page.route);assert.match(t.promptAvatar,/^data:image\/svg\+xml/);assert.doesNotMatch(JSON.stringify(t),/Eileen|Enter your question|Ingresa una pregunta|virtual assistant|asistente virtual/i,page.route);
  assert.match(t.legalMsg,page.lang==='es'?/SMS.*correos.*tarifas/:/SMS.*emails.*rates/,page.route+' consent meaning');assert.equal(!!t.labels,page.lang==='es');
  // The conversation starts right away: no text promises a later callback (only the "nobody available" fallback may).
  assert.equal(t.subHeading,page.lang==='es'?'Déjanos tu nombre y teléfono y Sofía te responde enseguida.':'Share your name and phone number and Sofía will reply right away.',page.route);
  const {liveChatUserInactiveMsg,...now}=t;assert.doesNotMatch(JSON.stringify(now),/contactar|will contact|en breve|shortly|get back to you|Danos un momento|Give us a moment|later|más tarde/i,page.route+' callback tone');}
 if(page.route===`/${page.lang}/`||page.route===localizePath(`/${page.lang}/about/`)||page.route===localizePath(`/${page.lang}/international-patients/`)||page.procedure&&!page.ads||/\/blog\/[^/]+\/$/.test(page.route)){
  const main=h.split('<main id="main">')[1].split('</main>')[0];for(const s of practice.societies)assert.ok(main.includes('href="'+s.source+'"'),page.route+' missing visible membership');
 }
}
// The launcher is visible on load everywhere, including home (no parked/hidden state).
assert.doesNotMatch(fs.readFileSync('dist/app.js','utf8')+fs.readFileSync('dist/style.css','utf8'),/parked/);
// The new verifier must actually reject missing structured membership and visible proof links.
const file='dist/en/about/index.html',original=fs.readFileSync(file,'utf8');
try{
 const missing=original.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/,(_,raw)=>{const nodes=JSON.parse(raw);delete nodes.find(x=>x['@type']==='Physician').memberOf;return '<script type="application/ld+json">'+JSON.stringify(nodes)+'</script>';});
 fs.writeFileSync(file,missing);let result=spawnSync(process.execPath,['verify.mjs'],{encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/physician missing memberOf/);
 fs.writeFileSync(file,original.replaceAll('href="'+practice.societies[0].source+'"','href="#main"'));result=spawnSync(process.execPath,['verify.mjs'],{encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/about missing visible membership/);
}finally{fs.writeFileSync(file,original);const result=spawnSync(process.execPath,['verify.mjs'],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);process.stdout.write(result.stdout);}
console.log('PASS: society roles/empty data, unchanged sameAs, both author approval states, visible membership, conditional scripts, per-language chat texts, visible launcher, DOM guards and negative verifier tests.');
