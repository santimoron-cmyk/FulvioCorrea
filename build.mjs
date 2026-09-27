import {minify} from 'terser';
import fs from 'node:fs';
if(process.argv.includes('--production'))process.env.SITE_ENV='production';
if(process.argv.includes('--preview'))process.env.SITE_ENV='preview';
if(process.env.SITE_ENV&&!['preview','production'].includes(process.env.SITE_ENV))throw Error('Invalid SITE_ENV');
await import('./render.mjs');
await import('./enhance.mjs');
await import('./audit.mjs');
fs.writeFileSync('dist/style.css',(fs.readFileSync('style.css','utf8')+'\n'+fs.readFileSync('theme-luxury.css','utf8')).replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*([{}:;,])\s*/g,'$1').trim());
for(const [file,sources] of Object.entries({'app.js':['app.js'],'contact.js':['phone-country.js','contact-widget.js'],'thank-you.js':['thank-you.js']})){
 const compact=await minify(sources.map(f=>fs.readFileSync(f,'utf8')).join('\n'),{compress:true,mangle:true,format:{comments:false}});fs.writeFileSync('dist/'+file,compact.code);
}
// Widget code is included only with its dialog; confirmation code only on confirmation pages.
for(const file of fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html'))){let h=fs.readFileSync('dist/'+file,'utf8');const scripts=(h.includes('id="contact-dialog"')?'<script defer src="/contact.js"></script>':'')+(h.includes('id="thanks-confirmation"')?'<script defer src="/thank-you.js"></script>':'');fs.writeFileSync('dist/'+file,h.replace('</body>',()=>scripts+'</body>'));}
// The former browser-language redirect is no longer used by any page.
if(fs.existsSync('dist/locale.js'))fs.unlinkSync('dist/locale.js');
await import('./verify.mjs');
