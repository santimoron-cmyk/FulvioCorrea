import {esc} from './editorial.mjs';
import {clinicContact,clinicNode} from './facility-view.mjs';
// Contact page (EN /en/contact/, ES /es/contacto/). Phones come from data/practice.json (office, Colombia),
// the messaging-only US number (practice.messagingDisplay) and data/facility.json (CAPRI clinic line). No office hours are published.
export function officePhones(practice,lang,location){
 const es=lang==='es';
 return `${practice.phone?`<a href="tel:${esc(practice.phone)}" id="${location}-phone" data-event="phone_click" data-location="${location}">${es?'Tel. Colombia':'Phone (Colombia)'}: ${esc(practice.phoneDisplay||practice.phone)}</a><br>`:''}${practice.messagingDisplay?`${es?'WhatsApp · SMS (EE. UU.)':'WhatsApp · SMS (US)'}: ${esc(practice.messagingDisplay)}`:''}`;
}
// Office hours (team) and Dr. Correa's consultation days, both in Colombia time; CAPRI hours stay in clinicContact().
export function officeHours(practice,lang,brief=false){
 if(brief)return practice.hoursBrief?.[lang]?esc(practice.hoursBrief[lang]):'';
 return [practice.openingHoursText?.[lang],practice.consultationHoursText?.[lang]].filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join('');
}
export function contactView(lang,practice,facility,origin){
 const es=lang==='es',t=(en,sp)=>es?sp:en,route=es?'/es/contact/':'/en/contact/';
 const cta=id=>`<button type="button" class="button" data-cta="${id}" data-open-contact aria-haspopup="dialog" aria-controls="contact-dialog">${t('Chat with Sofía','Habla con Sofía')}<span aria-hidden="true">↗</span></button>`;
 const title=t('Contact the Practice in Cartagena','Contacto del consultorio en Cartagena');
 const description=t('Phone, WhatsApp and address for Dr. Fulvio Correa’s consultation office in Cartagena, Colombia, plus the address and hours of CAPRI, his surgical clinic.','Teléfono, WhatsApp y dirección del consultorio del Dr. Fulvio Correa en Cartagena, Colombia, y dirección y horario de CAPRI, su clínica quirúrgica.');
 const body=`<section class="page-hero wrap" data-surface="charcoal"><p class="eyebrow">${t('Contact','Contacto')}</p><h1>${t('Contact Dr. Fulvio Correa’s practice in Cartagena','Contacta al consultorio del Dr. Fulvio Correa en Cartagena')}</h1><p class="lead">${t('Call the office, send a message or speak with Sofía to plan your consultation.','Llama al consultorio, envía un mensaje o habla con Sofía para planear tu valoración.')}</p>${cta('contact-page-hero')}</section>
 <section class="section" data-surface="plum"><div class="wrap result-philosophy-grid"><article><p class="eyebrow">01 / ${t('Consultation','Valoración')}</p><h2>${t('Dr. Correa’s consultation office','Consultorio del Dr. Correa')}</h2><p><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(practice.addressLines.join(', '))}" target="_blank" rel="noopener">${practice.addressLines.map(esc).join('<br>')}</a></p><p>${officePhones(practice,lang,'contact')}</p>${officeHours(practice,lang)}<p>${t('The US number receives WhatsApp and SMS messages only.','El número de EE. UU. solo recibe mensajes de WhatsApp y SMS.')}</p><a class="textlink" href="/${lang}/about/">${t('Meet the doctor','Conoce al doctor')}<span aria-hidden="true">↗</span></a></article><article><p class="eyebrow">02 / ${t('Surgery','Cirugía')}</p><h2>${esc(facility.name)}</h2>${clinicContact(lang,facility)}<p>${t('This phone and these hours belong to CAPRI Clinic, not to Dr. Correa’s office.','Este teléfono y este horario son de la Clínica CAPRI, no del consultorio del Dr. Correa.')}</p><a class="textlink" href="/${lang}/capri-clinic/">${t('Explore the surgical clinic','Conoce la clínica quirúrgica')}<span aria-hidden="true">↗</span></a></article></div></section>
 <section class="section" data-surface="charcoal"><div class="wrap"><h2>${t('Before your first conversation','Antes de tu primera conversación')}</h2><p>${t('Your consultation and your surgery take place in two different locations. Confirm the address and arrival instructions for each appointment with the team.','Tu valoración y tu cirugía se realizan en dos lugares diferentes. Confirma con el equipo la dirección y las indicaciones de llegada de cada cita.')}</p><a class="textlink" href="/${lang}/resources/your-consultation/">${t('Prepare your consultation','Prepara tu valoración')}<span aria-hidden="true">↗</span></a> ${cta('contact-page-closing')}</div></section>`;
 const schemas=[{'@context':'https://schema.org','@type':'ContactPage','@id':origin+route+'#webpage',url:origin+route,name:title,description,inLanguage:lang,about:{'@id':origin+'/#physician'},mentions:{'@id':origin+'/#capri-clinic'}},clinicNode(facility,origin)];
 return {title,description,body,schemas};
}
