import fs from 'node:fs';
import {esc} from './editorial.mjs';
import {membershipView} from './practice-view.mjs';
const officePhotos=JSON.parse(fs.readFileSync('data/office-photos.json','utf8'));
function officeGallery(lang){
 const {width,height,widths}=officePhotos;
 const set=(base,ext)=>widths.map(w=>`/assets/${base}${w===width?'':'-'+w}.${ext} ${w}w`).join(', ');
 const sizesFor=i=>i===0?'(max-width: 700px) 88vw, (max-width: 1100px) 58vw, 840px':i<3?'(max-width: 700px) 88vw, (max-width: 1100px) 28vw, 420px':'(max-width: 700px) 88vw, (max-width: 1100px) 44vw, 630px';
 return officePhotos.items.map((item,i)=>{
  const base=lang==='es'?item.baseEs:item.base,sizes=sizesFor(i);
  return `<figure><picture><source type="image/avif" srcset="${set(base,'avif')}" sizes="${sizes}"><img src="/assets/${base}.webp" alt="${esc(item.alt[lang])}" width="${width}" height="${height}" srcset="${set(base,'webp')}" sizes="${sizes}" data-fixed-srcset="1" data-keep-loading="1" loading="lazy" decoding="async"></picture></figure>`;
 }).join('');
}
export function internationalView(lang,data,practice,procedures,posts){
 const c=data[lang],es=lang==='es',cta=id=>`<button type="button" class="button" data-cta="${id}" data-open-contact aria-haspopup="dialog" aria-controls="contact-dialog">${esc(c.cta)} ↗</button>`;
 const reading=posts.filter(p=>p.lang===lang&&/tourism|turismo|stay|recovery|recuperacion/.test(p.slug));
 const h1=es?'Cirugía plástica en Cartagena para pacientes internacionales':'Plastic surgery in Cartagena for international patients';
 const body=`<section class="page-hero wrap" data-surface="charcoal"><p class="eyebrow">${esc(c.eyebrow)}</p><p class="slogan">${c.headline}</p><h1>${h1}</h1><p class="lead">${esc(c.intro)}</p>${cta('international-hero')}</section>
 <section class="section" data-surface="black"><div class="wrap"><p class="eyebrow">01 / ${es?'Tu recorrido':'Your journey'}</p><h2>${c.journeyTitle}</h2><p>${esc(c.journeyIntro)}</p><div class="travel-grid">${c.steps.map(([title,text],i)=>`<article><span class="number">0${i+1}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div></div></section>
 <section class="section office-visit" data-surface="charcoal" id="office"><div class="wrap"><p class="eyebrow">02 / ${es?'Tu visita':'Your visit'}</p><h2>${es?'Nuestro consultorio<br><em>en Cartagena.</em>':'Our office<br><em>in Cartagena.</em>'}</h2><p>${esc(es?'Estas fotografías muestran el consultorio en Cartagena, donde conoces al equipo.':'These photographs show the consultation office in Cartagena, where you meet the team.')}</p><div class="office-gallery">${officeGallery(lang)}</div></div></section>
 <section class="section" data-surface="plum"><div class="wrap result-philosophy-grid"><div><p class="eyebrow">03 / ${es?'Organización y apoyo':'Planning and support'}</p><h2>${c.supportTitle}</h2><p>${esc(c.supportText)}</p></div><div><h3>${esc(c.checkTitle)}</h3><ul>${c.checklist.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div></section>
 <section class="section" data-surface="charcoal"><div class="wrap result-philosophy-grid"><div><p class="eyebrow">04 / ${es?'Una decisión informada':'An informed decision'}</p><h2>${esc(c.trustTitle)}</h2><p>${esc(c.trustText)}</p>${membershipView(practice,lang)}<a class="textlink" href="/${lang}/about/">${es?'Conoce al Dr. Fulvio Correa':'Meet Dr. Fulvio Correa'} ↗</a></div><div><h3>${es?'Explora los procedimientos':'Explore the procedures'}</h3><ul class="cluster-links">${procedures.filter(p=>p.lang===lang&&p.offeredConfirmed).map(p=>`<li><a href="/${lang}/procedures/${p.slug}/">${esc(p.name)}</a></li>`).join('')}</ul></div></div></section>
 <section class="section" data-surface="black" id="patient-experiences"><div class="wrap"><p class="eyebrow">05 / ${es?'Testimonios':'Testimonials'}</p><h2>${c.storiesTitle}</h2><p>${esc(c.storiesIntro)}</p><div class="travel-grid">${data.videos.map((v,i)=>`<details class="travel-video"><summary>${esc(c.watch)} 0${i+1}</summary><video controls playsinline preload="none" width="360" height="640" aria-label="${esc(c.watch)} ${i+1}" src="${esc(v.url)}"><a href="${esc(v.url)}">${esc(c.videoFallback)}</a></video><p><a class="textlink" href="${esc(v.url)}" target="_blank" rel="noopener">${esc(c.videoFallback)} ↗</a></p></details>`).join('')}</div></div></section>
 <section class="section" data-surface="plum"><div class="wrap article"><h2>${esc(c.faqTitle)}</h2>${c.faqs.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>
 <section class="section" data-surface="charcoal"><div class="wrap"><h2>${esc(c.readingTitle)}</h2><ul class="cluster-links">${reading.map(p=>`<li><a href="/${lang}/blog/${p.slug}/">${esc(p.title)}</a></li>`).join('')}</ul></div></section>
 <section class="section" data-surface="black"><div class="wrap"><h2>${esc(c.closingTitle)}</h2><p>${esc(c.closing)}</p>${cta('international-closing')}</div></section>`;
 return {body,title:c.title,description:c.description,schemas:[{'@context':'https://schema.org','@type':'FAQPage',inLanguage:lang,mainEntity:c.faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}]};
}
