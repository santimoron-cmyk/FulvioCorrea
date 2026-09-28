import {esc} from './editorial.mjs';
import fs from 'node:fs';
// Surgical clinic where Dr. Correa operates (data/facility.json); referenced from the Physician node as hospitalAffiliation.
function clinicData(){try{return JSON.parse(fs.readFileSync('data/facility.json','utf8'));}catch{return null;}}
export function membershipNodes(practice){
 return [...(practice.societies||[]).map(s=>{
  const organization={'@type':'MedicalOrganization',name:s.name,...(s.alternateName?{alternateName:s.alternateName}:{}),url:s.url||new URL(s.source).origin+'/',sameAs:s.source};
  return s.role?{'@type':'OrganizationRole',roleName:s.role,memberOf:organization}:organization;
 }),...(practice.affiliations||[]).map(a=>({'@type':'MedicalOrganization',name:a.name,...(a.alternateName?{alternateName:a.alternateName}:{})}))];
}
export function physicianNode(practice,origin,lang='en',facility=clinicData()){
 const memberOf=membershipNodes(practice);
 const alumniOf=(practice.education||[]).filter(e=>e.en&&e.es).map(e=>({'@type':/university|universidad/i.test(e.en+' '+e.es)?'CollegeOrUniversity':'EducationalOrganization',name:e.organization||(lang==='es'?e.es:e.en).split('·').pop().trim(),...(e.location?{address:e.location}:{})}));
 return {'@context':'https://schema.org','@type':'Physician','@id':origin+'/#physician',name:practice.name,url:origin+`/${lang}/`,image:origin+'/assets/dr-fulvio-correa-plastic-surgeon-cartagena-1200.webp',medicalSpecialty:'https://schema.org/PlasticSurgery',address:{'@type':'PostalAddress',...practice.address,addressRegion:'Bolívar'},...(practice.description?.[lang]?{description:practice.description[lang]}:{}),...(alumniOf.length?{alumniOf}:{}),...(practice.knowsAbout?.[lang]?{knowsAbout:practice.knowsAbout[lang]}:{}),...(practice.phone?{telephone:practice.phone}:{}),...(practice.sameAs?.length?{sameAs:practice.sameAs}:{}),...(memberOf.length?{memberOf}:{}),...(practice.knowsLanguage?.length?{knowsLanguage:practice.knowsLanguage}:{}),...(practice.openingHours?.length?{openingHoursSpecification:practice.openingHours.map(h=>({'@type':'OpeningHoursSpecification',dayOfWeek:h.days.map(d=>'https://schema.org/'+d),opens:h.opens,closes:h.closes}))}:{}),...(facility?.name?{hospitalAffiliation:{'@type':'MedicalClinic','@id':origin+'/#capri-clinic',name:facility.name}}:{})};
}
export function membershipView(practice,lang){
 return (practice.societies||[]).map(s=>`<p class="membership">${esc(s[lang]||s.name)}<br><a href="${esc(s.source)}" target="_blank" rel="noopener">${lang==='es'?'Verificar membresía':'Verify membership'} ↗</a></p>`).join('');
}
export function editorialAuthor(practice,lang,origin){
 return practice.authorApproved?{'@id':origin+'/#physician'}:{'@type':'Organization',name:lang==='en'?'Editorial team · Dr. Fulvio Correa’s practice':'Equipo editorial · Consultorio Dr. Fulvio Correa',url:origin+`/${lang}/about/`};
}
export function authorView(practice,lang){
 const name=editorialAuthor(practice,lang,'').name||practice.name;
 return `<aside class="author-block"><div><a href="/${lang}/about/">${esc(name)}</a>${practice.societies?.length?`${practice.authorApproved?'':`<p>${lang==='en'?'Practice physician':'Médico del consultorio'}: ${esc(practice.name)}</p>`}${membershipView(practice,lang)}`:''}</div></aside>`;
}
// Official biography (data/doctor-bio.json): semantic H2/H3 sections rendered as HTML, no extra CSS or JS.
export function bioView(bio,lang){
 const c=bio[lang],href=slug=>`/${lang}/procedures/${slug}/`,paras=list=>(list||[]).map(p=>`<p>${esc(p)}</p>`).join('');
 const extras=s=>(s.links?`<ul class="cluster-links">${s.links.map(([slug,label])=>`<li><a href="${href(slug)}">${esc(label)}</a></li>`).join('')}</ul>`:'')+(s.page?`<p><a href="/${lang}/${s.page[0]}">${esc(s.page[1])} ↗</a></p>`:'');
 return `<section class="section wrap no-top"><article class="article-body" data-doctor-bio><p class="eyebrow">${esc(c.eyebrow)}</p>${c.sections.map(s=>`<h2>${esc(s.h2)}</h2>${paras(s.p)}${s.quote?`<blockquote><p>${esc(s.quote)}</p></blockquote>`:''}${paras(s.after)}${extras(s)}${(s.sub||[]).map(x=>`<h3>${esc(x.h3)}</h3>${paras(x.p)}${extras(x)}`).join('')}`).join('')}</article></section>`;
}
// ProfilePage + Person for the doctor page; the Person points to the Physician (practice) node.
export function profileNode(practice,origin,lang,route){
 const doc=physicianNode(practice,origin,lang);
 return {'@context':'https://schema.org','@type':'ProfilePage','@id':origin+route+'#profile',url:origin+route,inLanguage:lang,mainEntity:{'@type':'Person','@id':origin+'/#dr-fulvio-correa',name:practice.name,jobTitle:lang==='es'?'Cirujano plástico':'Plastic surgeon',image:doc.image,description:doc.description,...(doc.alumniOf?{alumniOf:doc.alumniOf}:{}),...(doc.memberOf?{memberOf:doc.memberOf}:{}),...(doc.knowsAbout?{knowsAbout:doc.knowsAbout}:{}),...(doc.knowsLanguage?{knowsLanguage:doc.knowsLanguage}:{}),...(doc.sameAs?{sameAs:doc.sameAs}:{}),worksFor:{'@id':origin+'/#physician'},workLocation:{'@type':'Place',address:doc.address}}};
}
