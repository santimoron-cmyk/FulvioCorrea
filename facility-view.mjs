import {esc} from './editorial.mjs';
export function facilityView(lang,data,practice,origin){
 const c=data[lang],es=lang==='es',url=origin+`/${lang}/capri-clinic/`,clinicId=origin+'/#capri-clinic';
 const cta=id=>`<button type="button" class="button" data-cta="${id}" data-open-contact aria-haspopup="dialog" aria-controls="contact-dialog">${esc(c.cta)} ↗</button>`;
 const body=`<section class="page-hero wrap" data-surface="charcoal"><p class="eyebrow">${esc(c.eyebrow)}</p><h1>${c.heading}</h1><p class="lead">${esc(c.intro)}</p>${cta('capri-hero')}</section>
 <section class="section" data-surface="black"><div class="wrap result-philosophy-grid"><div><p class="eyebrow">CAPRI / CARTAGENA</p><h2>${esc(c.settingTitle)}</h2></div><p>${esc(c.settingText)}</p></div></section>
 <section class="section" data-surface="plum"><div class="wrap"><h2>${c.distinctionTitle}</h2><p>${esc(c.distinctionIntro)}</p><div class="result-philosophy-grid"><article><p class="eyebrow">01 / ${es?'Valoración':'Consultation'}</p><h3>${esc(c.officeTitle)}</h3><p>${practice.addressLines.map(esc).join('<br>')}</p><p>${esc(c.officeText)}</p><a class="textlink" href="/${lang}/about/">${es?'Conoce al doctor':'Meet the doctor'} ↗</a></article><article><p class="eyebrow">02 / ${es?'Cirugía':'Surgery'}</p><h3>${esc(data.name)}</h3><p>${esc(data.city)}, Colombia</p><p>${esc(c.clinicText)}</p></article></div></div></section>
 <section class="section" data-surface="charcoal"><div class="wrap"><h2>${esc(c.planningTitle)}</h2><p>${esc(c.planningIntro)}</p><div class="travel-grid">${c.questions.map(([title,text],i)=>`<article><span class="number">0${i+1}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div></div></section>
 <section class="section" data-surface="black"><div class="wrap result-philosophy-grid"><h2>${esc(c.travelTitle)}</h2><div><p>${esc(c.travelText)}</p><a class="textlink" href="/${lang}/international-patients/">${esc(c.travelLink)} ↗</a></div></div></section>
 <section class="section" data-surface="plum"><div class="wrap article"><h2>${esc(c.faqTitle)}</h2>${c.faqs.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>
 <section class="section" data-surface="charcoal"><div class="wrap"><h2>${esc(c.closingTitle)}</h2><p>${esc(c.closingText)}</p>${cta('capri-closing')}</div></section>`;
 return {body,title:c.title,description:c.description,schemas:[
  {'@context':'https://schema.org','@type':'MedicalClinic','@id':clinicId,name:data.name,address:{'@type':'PostalAddress',addressLocality:data.city,addressCountry:data.country}},
  {'@context':'https://schema.org','@type':'WebPage','@id':url+'#webpage',url,name:c.title,description:c.description,inLanguage:lang,about:{'@id':clinicId},mentions:{'@id':origin+'/#physician'},dateModified:data.checked},
  {'@context':'https://schema.org','@type':'FAQPage',inLanguage:lang,mainEntity:c.faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}
 ]};
}
