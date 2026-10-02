import {esc} from './editorial.mjs';
// CAPRI surgical clinic (data/facility.json). Phone and hours are the clinic's, not Dr. Correa's office line.
export function clinicNode(data,origin){
 const address=data.address?{'@type':'PostalAddress',...data.address}:{'@type':'PostalAddress',addressLocality:data.city,addressCountry:data.country};
 const hours=(data.openingHours||[]).map(h=>({'@type':'OpeningHoursSpecification',dayOfWeek:h.days.map(d=>'https://schema.org/'+d),opens:h.opens,closes:h.closes}));
 return {'@context':'https://schema.org','@type':'MedicalClinic','@id':origin+'/#capri-clinic',name:data.name,address,...(data.telephone?{telephone:data.telephone}:{}),...(hours.length?{openingHoursSpecification:hours}:{}),...(data.sameAs?.length?{sameAs:data.sameAs}:{})};
}
export function clinicContact(lang,data){
 const es=lang==='es',lines=data.addressLines?.[lang]||[data.city+', Colombia'];
 return `<p><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(lines.join(', '))}" target="_blank" rel="noopener">${lines.map(esc).join('<br>')}</a></p>${data.telephone?`<p>${es?'Teléfono de la clínica':'Clinic phone'}: <a href="tel:${esc(data.telephone)}">${esc(data.telephoneDisplay||data.telephone)}</a></p>`:''}${data.openingHoursText?.[lang]?`<p>${es?'Horario de la clínica':'Clinic hours'}: ${esc(data.openingHoursText[lang])}</p>`:''}`;
}
export function facilityView(lang,data,practice,origin){
 const c=data[lang],es=lang==='es',url=origin+`/${lang}/capri-clinic/`,clinicId=origin+'/#capri-clinic';
 const cta=id=>`<button type="button" class="button" data-cta="${id}" data-open-contact aria-haspopup="dialog" aria-controls="contact-dialog">${esc(c.cta)}</button>`;
 const body=`<section class="page-hero wrap" data-surface="charcoal"><p class="eyebrow">${esc(c.eyebrow)}</p><h1>${c.heading}</h1><p class="lead">${esc(c.intro)}</p>${cta('capri-hero')}</section>
 <section class="section" data-surface="black"><div class="wrap result-philosophy-grid"><div><p class="eyebrow">CAPRI / CARTAGENA</p><h2>${esc(c.settingTitle)}</h2></div><p>${esc(c.settingText)}</p></div></section>
 <section class="section" data-surface="plum"><div class="wrap"><h2>${c.distinctionTitle}</h2><p>${esc(c.distinctionIntro)}</p><div class="result-philosophy-grid"><article><p class="eyebrow">${es?'Valoración':'Consultation'}</p><h3>${esc(c.officeTitle)}</h3><p><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(practice.addressLines.join(', '))}" target="_blank" rel="noopener">${practice.addressLines.map(esc).join('<br>')}</a></p><p>${esc(c.officeText)}</p><a class="textlink" href="/${lang}/about/">${es?'Conoce al doctor':'Meet the doctor'}<span aria-hidden="true">↗</span></a></article><article><p class="eyebrow">${es?'Cirugía':'Surgery'}</p><h3>${esc(data.name)}</h3>${clinicContact(lang,data)}<p>${esc(c.clinicText)}</p></article></div></div></section>
 <section class="section" data-surface="charcoal"><div class="wrap"><h2>${esc(c.planningTitle)}</h2><p>${esc(c.planningIntro)}</p><div class="travel-grid">${c.questions.map(([title,text],i)=>`<article><span class="number">0${i+1}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div></div></section>
 <section class="section" data-surface="black"><div class="wrap result-philosophy-grid"><h2>${esc(c.travelTitle)}</h2><div><p>${esc(c.travelText)}</p><a class="textlink" href="/${lang}/international-patients/">${esc(c.travelLink)}<span aria-hidden="true">↗</span></a></div></div></section>
 <section class="section" data-surface="plum"><div class="wrap article"><h2>${esc(c.faqTitle)}</h2>${c.faqs.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>
 <section class="section" data-surface="charcoal"><div class="wrap"><h2>${esc(c.closingTitle)}</h2><p>${esc(c.closingText)}</p>${cta('capri-closing')}</div></section>`;
 return {body,title:c.title,description:c.description,schemas:[
  clinicNode(data,origin),
  {'@context':'https://schema.org','@type':'WebPage','@id':url+'#webpage',url,name:c.title,description:c.description,inLanguage:lang,about:{'@id':clinicId},mentions:{'@id':origin+'/#physician'},dateModified:data.checked},
  {'@context':'https://schema.org','@type':'FAQPage',inLanguage:lang,mainEntity:c.faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}
 ]};
}
