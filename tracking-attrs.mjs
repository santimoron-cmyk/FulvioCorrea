// Stable, non-visual data attributes for GTM (GTM-THZVNS9B). No new JS, no CSS, no copy change.
// body[data-page-type], [data-cta] + [data-cta-location] on CTAs, details[data-faq-id] on FAQ items.
// The before/after gallery carries data-gallery / data-gallery-item (results-view.mjs).
const slug=s=>String(s).replace(/<[^>]*>/g,'').replace(/&[a-z#0-9]+;/gi,' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48).replace(/-+$/,'');
const TYPES={'':'home',procedures:'procedure_index',procedimientos:'procedure_index',blog:'blog_index','before-after':'before_after','antes-y-despues':'before_after',faq:'faq','preguntas-frecuentes':'faq',contact:'contact',contacto:'contact','book-consultation':'book','agendar-valoracion':'book',about:'about','sobre-el-doctor':'about','international-patients':'international','pacientes-internacionales':'international','capri-clinic':'clinic','clinica-capri':'clinic',resources:'resource',recursos:'resource',testimonials:'testimonials',testimonios:'testimonials',privacy:'legal',privacidad:'legal',terms:'legal',terminos:'legal',sms:'legal','thank-you':'thank_you',gracias:'thank_you','image-sources':'legal','404':'not_found',ads:'ads'};
export function pageType({route='',ads=false,procedure=false,post=false}={}){
 if(ads)return 'ads';const seg=route.split('/').filter(Boolean);if(seg[0]==='en'||seg[0]==='es')seg.shift();
 if(seg[0]==='404')return 'not_found';if(procedure&&seg.length>1)return 'procedure';if(post&&seg.length>1)return 'blog_post';
 if((seg[0]==='resources'||seg[0]==='recursos')&&seg.length>1)return 'resource';return TYPES[seg[0]||'']||'other';
}
const GENERIC=new Set(['section','wrap','no-top','article','light','dark','sources']);
const label=(tag,attrs,n)=>{const id=attrs.match(/\sid="([^"]+)"/)?.[1];if(id)return slug(id);const cls=(attrs.match(/\sclass="([^"]*)"/)?.[1]||'').split(/\s+/).filter(c=>c&&!GENERIC.has(c));const c=cls[0]||'';if(/^(page-)?hero$/.test(c))return 'hero';return c?slug(c):`${tag}-${n}`;};
export function trackingAttrs(h,{type='other'}={}){
 h=h.replace(/<body\b([^>]*)>/,(m,a)=>/\sdata-page-type=/.test(a)?m:`<body${a} data-page-type="${type}">`);
 // CTA location: header, footer, or the top-level <section> of <main> that contains the CTA; 'floating' otherwise.
 let region='',depth=0,top='',n=0;
 h=h.replace(/<(\/?)(header|footer|main|section)\b([^>]*)>|<(a|button)\b([^>]*)>/g,(m,close,tag,attrs,el,ea)=>{
  if(tag){if(tag==='section'){if(region!=='main')return m;if(close){depth=Math.max(0,depth-1);if(!depth)top='';}else{if(!depth)top=label('section',attrs,++n);depth++;}return m;}
   region=close?'':tag;return m;}
  if(!/\sdata-(cta|open-contact)\b/.test(ea)||/\sdata-(cta-location|language)=/.test(ea))return m;
  const where=region==='main'?(top||'main'):(region||'floating');
  let extra=` data-cta-location="${where}"`;
  if(!/\sdata-cta=/.test(ea))extra=` data-cta="${slug(ea.match(/\sid="([^"]+)"/)?.[1]||(where==='main'?'inline':where)+'-consult')}"`+extra;
  return `<${el}${ea}${extra}>`;});
 // FAQ / accordion items: plain <details> (or data-topic) followed by <summary>; menus, pickers and transcripts excluded.
 const seen=new Map();
 h=h.replace(/<details((?:\s+data-topic="[^"]*")?)><summary>([\s\S]*?)<\/summary>/g,(m,a,q)=>{const s=slug(q);if(!s||/transcript|transcripci/.test(s))return m;const k=seen.get(s)||0;seen.set(s,k+1);return `<details${a} data-faq-id="${k?s+'-'+(k+1):s}"><summary>${q}</summary>`;});
 return h;
}
