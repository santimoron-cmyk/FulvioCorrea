import {esc} from './editorial.mjs';
export function membershipNodes(practice){
 return (practice.societies||[]).map(s=>{
  const organization={'@type':'MedicalOrganization',name:s.name,url:s.url||new URL(s.source).origin+'/',sameAs:s.source};
  return s.role?{'@type':'OrganizationRole',roleName:s.role,memberOf:organization}:organization;
 });
}
export function physicianNode(practice,origin,lang='en'){
 const memberOf=membershipNodes(practice);
 const alumniOf=(practice.education||[]).filter(e=>e.en&&e.es).map(e=>({'@type':/university|universidad/i.test(e.en+' '+e.es)?'CollegeOrUniversity':'EducationalOrganization',name:(lang==='es'?e.es:e.en).split('·').pop().trim()}));
 return {'@context':'https://schema.org','@type':'Physician','@id':origin+'/#physician',name:practice.name,url:origin+`/${lang}/`,image:origin+'/assets/doctor.webp',medicalSpecialty:'https://schema.org/PlasticSurgery',address:{'@type':'PostalAddress',...practice.address,addressRegion:'Bolívar'},...(alumniOf.length?{alumniOf}:{}),...(practice.phone?{telephone:practice.phone}:{}),...(practice.sameAs?.length?{sameAs:practice.sameAs}:{}),...(memberOf.length?{memberOf}:{})};
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
