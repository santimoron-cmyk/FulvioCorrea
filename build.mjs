// Build entry point: `npm run build` (Linux, macOS, Windows, Cloudflare Pages).
// dist/ is a generated artifact: it is deleted first and rebuilt from versioned sources only.
import {minify} from 'terser';
import fs from 'node:fs';
import {resolveSiteEnv} from './site-env.mjs';
import {prepareDist,checkSourceAssets,checkDistAssets,sourceReferences,sourceAssets} from './assets.mjs';
import {IMAGE_RENAMES,buildImageDerivatives,decorateDistImages,pruneUnreferencedAssets} from './media.mjs';
import {writeCloudflareAdapter} from './cloudflare.mjs';
// Any failure prints a readable message (no stack noise) and exits with code 1, which fails the Cloudflare build.
const fail=e=>{console.error('\nBUILD FAILED\n'+(e?.message||e)+'\n');process.exit(1);};process.on('uncaughtException',fail);process.on('unhandledRejection',fail);
if(process.argv.includes('--production'))process.env.SITE_ENV='production';
if(process.argv.includes('--preview'))process.env.SITE_ENV='preview';
const site=resolveSiteEnv();process.env.SITE_ENV=site.mode;
console.log(`Build mode: ${site.mode.toUpperCase()} (${site.reason})`);
// 1. Fail early, with a clear list, if any referenced asset is missing from assets/.
const src=checkSourceAssets();for(const w of src.warnings)console.warn('WARN assets:',w);
const referenced=new Set(sourceReferences().filter(r=>!r.draft).map(r=>r.asset));
for(const name of Object.values(IMAGE_RENAMES))referenced.add(name);
for(const name of Object.keys(IMAGE_RENAMES))referenced.delete(name);
for(const asset of [...referenced]){if(!/^blog-.+\.webp$/.test(asset)||asset.includes('-og.')||/-\d+\.webp$/.test(asset))continue;for(const extra of ['.avif','-800.webp','-800.avif','-og.webp','-og.avif','-og.jpg'].map(suffix=>asset.replace(/\.webp$/,suffix)))if(fs.existsSync('assets/'+extra))referenced.add(extra);}
const skipped=sourceAssets().filter(f=>!referenced.has(f)&&!f.startsWith('fonts/'));
if(skipped.length)console.warn('Excluded from deploy (kept in assets/): '+skipped.join(', '));
// 2. Fresh dist/ + copy of referenced assets, then responsive/OG/icon derivatives.
console.log(`Assets: ${prepareDist(referenced)} files copied from assets/ to dist/assets/ (${src.references} distinct references checked).`);
await buildImageDerivatives();
// 3. Render pages.
await import('./render.mjs');
await import('./enhance.mjs');
await import('./audit.mjs');
fs.writeFileSync('dist/style.css',(fs.readFileSync('style.css','utf8')+'\n'+fs.readFileSync('theme-luxury.css','utf8')).replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*([{}:;,])\s*/g,'$1').trim());
// contact.js is the chat-provider bundle (data/chat.json): the native Sofía widget or the lazy GHL loader.
const chatProvider=JSON.parse(fs.readFileSync('data/chat.json','utf8')).provider;
for(const [file,sources] of Object.entries({'app.js':['app.js'],'contact.js':chatProvider==='ghl'?['ghl-chat.js']:['phone-country.js','contact-widget.js'],'thank-you.js':['thank-you.js'],'event-signup.js':['event-signup.js']})){
 const compact=await minify(sources.map(f=>fs.readFileSync(f,'utf8')).join('\n'),{compress:true,mangle:true,format:{comments:false}});fs.writeFileSync('dist/'+file,compact.code);
}
// Widget code is included only with its dialog; confirmation code only on confirmation pages.
for(const file of fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html'))){let h=fs.readFileSync('dist/'+file,'utf8');const scripts=(h.includes('id="contact-open"')?'<script defer src="/contact.js"></script>':'')+(h.includes('id="thanks-confirmation"')?'<script defer src="/thank-you.js"></script>':'')+(h.includes('id="event-signup-form"')?'<script defer src="/event-signup.js"></script>':'');fs.writeFileSync('dist/'+file,h.replace('</body>',()=>scripts+'</body>'));}
decorateDistImages();
pruneUnreferencedAssets();
// The former browser-language redirect is no longer used by any page.
if(fs.existsSync('dist/locale.js'))fs.unlinkSync('dist/locale.js');
// 4. Hosting adapter (Cloudflare Pages): _headers, _redirects, robots.txt, Functions config.
writeCloudflareAdapter(site.mode==='production');
// 5. Every /assets/ reference in the generated site must resolve (exact case), no file > 25 MiB.
const out=checkDistAssets();for(const w of out.warnings)console.warn('WARN assets:',w);
console.log(`Assets OK: ${out.assets} files in dist/assets, ${out.references} referenced; dist/ total ${out.files} files.`);
await import('./verify.mjs');
