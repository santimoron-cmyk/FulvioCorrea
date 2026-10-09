// Shared event constants and the earlier Fulvio-branded Mommy Makeover copy.
// Public URLs (Aromas shell, event-aromas-view.mjs): /beauty-aesthetics-talk-doral/ and /es/conversatorio-belleza-estetica-doral/.
// Production does not publish the Fulvio -v1 backup. eventBody stays here so those URLs can be rendered again later; if they are, they must stay noindex and out of the sitemap.
// To switch the public URLs back, render eventBody here on EVENT_SLUG instead of aromasEventHtml.
// Form → /api/lead (event-signup.js). The live tag is EVENT_TAG; this backup still sends EVENT_TAG_V1.
// Copy rules: health-tourism orientation, not a medical consultation; no prices, results, guarantees or clinical detail;
// Aromas is host and strategic ally and does not perform the procedure. Nader's bio only restates aromaslaser.com.
export const EVENT_SLUG='beauty-aesthetics-talk-doral/';
export const EVENT_SLUG_V1='mommy-makeover-talk-doral-v1/';
export const EVENT_TAG='conversatorio-belleza-estetica-doral-nov2026';
export const EVENT_TAG_V1='charla-mommy-makeover-doral-oct2026';
export const EVENT_CONSENT_VERSION='event-doral-consent-2026-09-30';
const HOST={name:'Aromas Med Spa',street:'9831 NW 58th St #149',city:'Doral',region:'FL',zip:'33178',country:'US',phone:'(305) 591-3005',tel:'+13055913005',url:'https://aromaslaser.com/',source:'https://aromaslaser.com/doral-location/'};
const INSTAGRAM='https://www.instagram.com/drfulviocorrea/';
const copy={
 es:{
  title:'Charla Mommy Makeover en Doral',
  description:'Charla presencial en Aromas Med Spa (Doral, FL) sobre turismo de salud en Colombia y programas personalizados todo incluido para tu Mommy Makeover. Cupos limitados.',
  eyebrow:'Charla presencial · Doral, Florida',
  h1:'Mommy Makeover en Colombia.<br><em>Una charla pensada para ti.</em>',
  lead:'Ser mamá transforma tu vida, y es natural querer volver a sentirte tú. Te invitamos a una charla cercana y tranquila sobre turismo de salud en Colombia: cómo funcionan los programas personalizados y todo incluido para tu Mommy Makeover en Cartagena, desde la primera conversación hasta tu regreso a casa.',
  cta:'Reservar mi cupo',
  facts:[['Fecha','27 al 29 de octubre (fecha exacta por confirmar)'],['Hora','Por confirmar'],['Lugar',`${HOST.name} · ${HOST.street}, ${HOST.city}, ${HOST.region} ${HOST.zip}`],['Cupos','30 cupos · luego, lista de espera']],
  spots:'Los cupos son limitados. Cuando se completen los 30 lugares, abriremos una lista de espera y te avisaremos si se libera un cupo.',
  aboutLabel:'Sobre la charla',
  aboutTitle:'Información clara,<br><em>a tu ritmo.</em>',
  items:[['Turismo de salud, explicado con calma','Cómo se organiza un viaje a Cartagena pensado para tu proceso: la preparación antes de viajar, las etapas durante tu estadía y el acompañamiento en la recuperación.'],['Programas personalizados todo incluido','Qué significa un programa hecho a tu medida en Colombia y cómo el equipo coordina cada etapa contigo, para que viajes con tranquilidad.'],['Tus preguntas, en persona','Un espacio para resolver tus dudas generales sobre el viaje y el proceso, en un ambiente cercano y junto a otras mamás.']],
  noteTitle:'Importante',
  note:'Esta charla es una asesoría de turismo de salud, no una consulta médica. Cualquier valoración médica se realiza directamente con el cirujano, de forma individual.',
  hostLabel:'Anfitrión y aliado estratégico',
  hostTitle:'Te recibimos en<br><em>Aromas Med Spa, Doral.</em>',
  hostText:'Aromas Med Spa es el anfitrión y aliado estratégico de esta charla y nos abre las puertas de su sede en Doral. Aromas Med Spa no realiza el procedimiento de Mommy Makeover; su papel es recibirte y acompañar la organización del encuentro.',
  hostPhone:'Teléfono',hostSite:'Visitar aromaslaser.com',hostMap:'Cómo llegar',
  doctorsLabel:'Conoce a los doctores',
  doctorsTitle:'Conoce a<br><em>los doctores.</em>',
  fulvioRole:'Cirujano plástico en Cartagena, Colombia',
  fulvioBio:'Miembro de Número de la Sociedad Colombiana de Cirugía Plástica (SCCP). Acompaña a pacientes internacionales que planean su cirugía en Cartagena.',
  fulvioSite:'fulviocorrea.com',fulvioIg:'Instagram @drfulviocorrea',
  fulvioAlt:'Dr. Fulvio Correa, cirujano plástico en Cartagena, Colombia, sonriendo con uniforme quirúrgico negro',
  naderRole:'Fundador y director clínico de Aromas Med Spa',
  naderBio:'Originario de Colombia, se graduó en medicina en la Universidad del Norte en 1990 y fundó Aromas Med Spa en Doral en 2008, donde dirige la atención de medicina estética y de bienestar.',
  naderSite:'aromaslaser.com',
  naderAlt:'Alberto Nader, fundador y director clínico de Aromas Med Spa en Doral, Florida, sonriendo con uniforme negro de Aromas',
  logoAlt:'Logo de Aromas Med Spa',
  formLabel:'Registro',
  formTitle:'Reserva<br><em>tu cupo.</em>',
  formText:'Déjanos tus datos y el equipo de Aromas Med Spa te contactará por WhatsApp para confirmar la fecha, la hora y tu cupo.',
  labels:{name:'Nombre y apellido',whatsapp:'WhatsApp (con código de país)',email:'Correo electrónico',city:'Ciudad donde vives',companion:'¿Vienes con acompañante?',yes:'Sí',no:'No'},
  phoneHint:'Ejemplo: +1 305 555 0123. Si no escribes el código, asumimos +1 (EE. UU.).',
  consent:'Acepto que el equipo de Aromas Med Spa y el equipo del Dr. Fulvio Correa me contacten por WhatsApp y correo electrónico sobre esta charla y mi interés en un programa de turismo de salud. Puedo pedir que dejen de contactarme en cualquier momento.',
  privacy:'Política de privacidad',
  submit:'Reservar mi cupo',
 },
 en:{
  title:'Mommy Makeover Talk in Doral',
  description:'In-person talk at Aromas Med Spa (Doral, FL) on health tourism in Colombia and personalized all-inclusive Mommy Makeover programs. Limited spots.',
  eyebrow:'In-person talk · Doral, Florida',
  h1:'Mommy Makeover in Colombia.<br><em>A talk made for you.</em>',
  lead:'Becoming a mom changes your life, and it is natural to want to feel like yourself again. Join us for a warm, relaxed talk about health tourism in Colombia: how personalized, all-inclusive programs for your Mommy Makeover in Cartagena work, from the first conversation to your trip back home.',
  cta:'Save my spot',
  facts:[['Date','October 27–29 (exact date to be confirmed)'],['Time','To be confirmed'],['Venue',`${HOST.name} · ${HOST.street}, ${HOST.city}, ${HOST.region} ${HOST.zip}`],['Spots','30 spots · then a waitlist']],
  spots:'Spots are limited. Once all 30 are taken, we will open a waitlist and let you know if a spot opens up.',
  aboutLabel:'About the talk',
  aboutTitle:'Clear information,<br><em>at your own pace.</em>',
  items:[['Health tourism, calmly explained','How a trip to Cartagena is planned around your process: preparing before you travel, the stages during your stay and the support during recovery.'],['Personalized all-inclusive programs','What a program tailored to you in Colombia means and how the team coordinates each stage with you, so you can travel with peace of mind.'],['Your questions, in person','A space to ask your general questions about the trip and the process, in a friendly setting alongside other moms.']],
  noteTitle:'Please note',
  note:'This talk is health-tourism guidance, not a medical consultation. Any medical evaluation is done directly with the surgeon, individually.',
  hostLabel:'Host and strategic ally',
  hostTitle:'Hosted at<br><em>Aromas Med Spa, Doral.</em>',
  hostText:'Aromas Med Spa is the host and strategic ally of this talk and welcomes us at its Doral location. Aromas Med Spa does not perform the Mommy Makeover procedure; its role is to welcome you and help organize the event.',
  hostPhone:'Phone',hostSite:'Visit aromaslaser.com',hostMap:'Get directions',
  doctorsLabel:'Meet the doctors',
  doctorsTitle:'Meet<br><em>the doctors.</em>',
  fulvioRole:'Plastic surgeon in Cartagena, Colombia',
  fulvioBio:'Member of the Colombian Society of Plastic Surgery (SCCP). He works with international patients who plan their surgery in Cartagena.',
  fulvioSite:'fulviocorrea.com',fulvioIg:'Instagram @drfulviocorrea',
  fulvioAlt:'Dr. Fulvio Correa, plastic surgeon in Cartagena, Colombia, smiling in black scrubs',
  naderRole:'Founder and Clinical Director of Aromas Med Spa',
  naderBio:'Originally from Colombia, he earned his medical degree from Universidad del Norte in 1990 and founded Aromas Med Spa in Doral in 2008, where he leads its aesthetic and wellness medicine care.',
  naderSite:'aromaslaser.com',
  naderAlt:'Alberto Nader, founder and Clinical Director of Aromas Med Spa in Doral, Florida, smiling in black Aromas scrubs',
  logoAlt:'Aromas Med Spa logo',
  formLabel:'Sign up',
  formTitle:'Save<br><em>your spot.</em>',
  formText:'Leave your details and the Aromas Med Spa team will contact you on WhatsApp to confirm the date, time and your spot.',
  labels:{name:'Full name',whatsapp:'WhatsApp (with country code)',email:'Email',city:'City where you live',companion:'Are you bringing a companion?',yes:'Yes',no:'No'},
  phoneHint:'Example: +1 305 555 0123. Without a country code we assume +1 (US).',
  consent:'I agree to be contacted by the Aromas Med Spa team and Dr. Fulvio Correa’s team via WhatsApp and email about this talk and my interest in a health-tourism program. I can ask them to stop contacting me at any time.',
  privacy:'Privacy policy',
  submit:'Save my spot',
 }
};
export function eventSchema(lang,origin,paths){
 const c=copy[lang],route=(paths&&paths[lang])||(lang==='en'?'/'+EVENT_SLUG:'/es/conversatorio-belleza-estetica-doral/');
 return {'@context':'https://schema.org','@type':'Event','@id':origin+route+'#event',name:c.title,description:c.description,url:origin+route,inLanguage:lang,
  // Tentative window (27–29 Oct 2026); replace with the confirmed date and time before indexing.
  startDate:'2026-10-27',endDate:'2026-10-29',eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',
  image:[origin+'/assets/dr-fulvio-correa-plastic-surgeon-cartagena-1200.webp'],
  location:{'@type':'Place',name:'Aromas Med Spa Doral',telephone:HOST.tel,url:HOST.url,address:{'@type':'PostalAddress',streetAddress:HOST.street,addressLocality:HOST.city,addressRegion:HOST.region,postalCode:HOST.zip,addressCountry:HOST.country}},
  organizer:[{'@id':origin+'/#physician'},{'@type':'Organization',name:HOST.name,url:HOST.url,telephone:HOST.tel}],
  performer:[{'@type':'Person',name:'Dr. Fulvio Correa',url:origin+'/',sameAs:[INSTAGRAM]},{'@type':'Person',name:'Alberto Nader',jobTitle:lang==='en'?'Founder and Clinical Director, Aromas Med Spa':'Fundador y director clínico, Aromas Med Spa',url:HOST.url}],
  maximumAttendeeCapacity:30};
}
export function eventBody(lang,{image,esc,privacyUrl}){
 const c=copy[lang],L=c.labels,tag=t=>`<p class="eyebrow">${t}</p>`,ext=(href,text,id)=>`<a class="textlink" ${id?`id="${id}" data-cta="${id}" data-event="navigation_click" `:''}href="${href}" target="_blank" rel="noopener">${text}<span aria-hidden="true">↗</span></a>`;
 const site=lang==='en'?'https://fulviocorrea.com/':'https://fulviocorrea.com/es/';
 const fulvio=image('dr-fulvio-correa-plastic-surgeon-cartagena-768.webp',c.fulvioAlt,'',false,{width:1200,height:1500,lock:true,keep:true,sizes:'(max-width: 700px) 88vw, 420px',srcset:'/assets/dr-fulvio-correa-plastic-surgeon-cartagena-480.webp 480w, /assets/dr-fulvio-correa-plastic-surgeon-cartagena-768.webp 768w, /assets/dr-fulvio-correa-plastic-surgeon-cartagena-1200.webp 1200w',avif:'/assets/dr-fulvio-correa-plastic-surgeon-cartagena-480.avif 480w, /assets/dr-fulvio-correa-plastic-surgeon-cartagena-768.avif 768w, /assets/dr-fulvio-correa-plastic-surgeon-cartagena-1200.avif 1200w'});
 const nader=image('alberto-nader-aromas-med-spa-doral.webp',c.naderAlt,'',false,{width:720,height:900,lock:true,keep:true,sizes:'(max-width: 700px) 88vw, 420px',srcset:'/assets/alberto-nader-aromas-med-spa-doral-480.webp 480w, /assets/alberto-nader-aromas-med-spa-doral.webp 720w',avif:'/assets/alberto-nader-aromas-med-spa-doral-480.avif 480w, /assets/alberto-nader-aromas-med-spa-doral.avif 720w'});
 const logo=`<img class="event-logo" src="/assets/aromas-med-spa-doral-logo-white.webp" alt="${esc(c.logoAlt)}" width="600" height="186" data-fixed-srcset="1" data-keep-loading="1" loading="lazy" decoding="async">`;
 const map='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(`Aromas Med Spa ${HOST.street}, ${HOST.city}, ${HOST.region} ${HOST.zip}`);
 const facts=`<dl class="event-facts">${c.facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
 const hero=`<section class="event-hero wrap"><div class="crumb"><a href="/${lang}/">${lang==='en'?'Home':'Inicio'}</a><span>/</span>${lang==='en'?'Event':'Evento'}</div>${tag(c.eyebrow)}<h1>${c.h1}</h1><p class="lead">${c.lead}</p>${facts}<p class="event-spots">${c.spots}</p><a class="button" id="event-hero-signup" data-cta="event-hero-signup" data-event="navigation_click" href="#registro">${c.cta}<span aria-hidden="true">↓</span></a></section>`;
 const about=`<section class="section wrap no-top event-about"><div>${tag(c.aboutLabel)}<h2>${c.aboutTitle}</h2></div><div class="event-items">${c.items.map(([h,p],n)=>`<article><span class="number">0${n+1}</span><h3>${h}</h3><p>${p}</p></article>`).join('')}</div><aside class="note event-note" role="note"><strong>${c.noteTitle}.</strong> ${c.note}</aside></section>`;
 const host=`<section class="section wrap event-host"><div>${tag(c.hostLabel)}<h2>${c.hostTitle}</h2><p>${c.hostText}</p></div><div class="event-host-card">${logo}<p>${esc(HOST.name)}<br>${esc(HOST.street)}<br>${esc(`${HOST.city}, ${HOST.region} ${HOST.zip}`)}</p><p>${c.hostPhone}: <a href="tel:${HOST.tel}" id="event-host-phone" data-cta="event-host-phone" data-event="phone_click" data-location="event-host">${HOST.phone}</a></p><div class="event-links">${ext(map,c.hostMap,'event-host-map')}${ext(HOST.url,c.hostSite,'event-host-site')}</div></div></section>`;
 const person=(photo,name,role,bio,links)=>`<article class="event-doctor"><div class="doctor-photo">${photo}</div><div><h3>${name}</h3><p class="small-label">${role}</p><p>${bio}</p><div class="event-links">${links}</div></div></article>`;
 const doctors=`<section class="section wrap event-doctors" id="doctores"><div>${tag(c.doctorsLabel)}<h2>${c.doctorsTitle}</h2></div><div class="event-doctor-grid">${person(fulvio,'Dr. Fulvio Correa',c.fulvioRole,c.fulvioBio,ext(site,c.fulvioSite,'event-fulvio-site')+ext(INSTAGRAM,c.fulvioIg,'event-fulvio-instagram'))}${person(nader,'Alberto Nader',c.naderRole,c.naderBio,ext(HOST.url,c.naderSite,'event-nader-site'))}</div></section>`;
 const form=`<section class="section wrap consult-grid event-signup" id="registro"><div>${tag(c.formLabel)}<h2>${c.formTitle}</h2><p>${c.formText}</p><p class="event-spots">${c.spots}</p></div><form id="event-signup-form" data-form="event-signup" data-event-tag="${EVENT_TAG_V1}" novalidate><label>${L.name}<input name="name" autocomplete="name" maxlength="100" required></label><label>${L.whatsapp}<input name="whatsapp" type="tel" autocomplete="tel" inputmode="tel" maxlength="30" placeholder="+1 305 555 0123" aria-describedby="event-phone-hint" required><small id="event-phone-hint" class="event-hint">${c.phoneHint}</small></label><label>${L.email}<input name="email" type="email" autocomplete="email" maxlength="254" required></label><label>${L.city}<input name="city" autocomplete="address-level2" maxlength="100" required></label><fieldset class="event-companion"><legend>${L.companion}</legend><label><input type="radio" name="companion" value="yes" required> ${L.yes}</label><label><input type="radio" name="companion" value="no"> ${L.no}</label></fieldset><label class="consent"><input type="checkbox" name="contact_consent" required><span data-consent-version="${EVENT_CONSENT_VERSION}">${c.consent}</span> <a href="${privacyUrl}" target="_blank" rel="noopener">${c.privacy}</a>.</label><div class="event-hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><button class="button" id="event-signup-submit" type="submit">${c.submit}</button><p id="event-signup-status" class="form-status" role="status" aria-live="polite"></p></form></section>`;
 return hero+about+host+doctors+form;
}
export const EVENT_CSS=`.event-hero{padding-block:70px 90px}.event-hero h1{max-width:15em}.event-hero .lead{max-width:760px;font-size:18px}.event-facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin:40px 0 18px;padding:0}.event-facts div{border-top:1px solid var(--line,#55414e);padding-top:14px}.event-facts dt{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--gold,#d4b478)}.event-facts dd{margin:6px 0 0;color:var(--ivory,#faf3ec);font-size:15px;line-height:1.5}.event-spots{font-size:14px;margin:0 0 26px}.event-about{display:grid;grid-template-columns:1fr 2fr;gap:6%}.event-items{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}.event-items h3{font-size:21px;margin-top:12px}.event-items p{font-size:15px}.event-note{grid-column:1/-1;padding:22px 26px;border:1px solid;border-radius:10px;max-width:none;font-size:15px}.event-host,.event-doctors{display:grid;grid-template-columns:1fr 1.2fr;gap:8%;align-items:start}.event-host-card{border:1px solid var(--line,#55414e);border-radius:14px;padding:32px;background:#1a121e}.event-logo{width:220px;height:auto;margin-bottom:22px}.event-host-card a[href^="tel:"]{color:var(--gold-light,#ead3a0)}.event-links{display:flex;flex-wrap:wrap;gap:14px 26px;margin-top:10px}.event-doctors{grid-template-columns:1fr}.event-doctor-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px}.event-doctor{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:28px;align-items:start}.event-doctor .doctor-photo img{height:auto;aspect-ratio:4/5;border-radius:14px}.event-doctor h3{margin-bottom:6px}.event-doctor p{font-size:15px}#event-signup-form label{display:block;margin-bottom:18px}#event-signup-form input:not([type=radio]):not([type=checkbox]){display:block;width:100%;margin-top:6px;padding:13px 14px;border:1px solid #705b6d;border-radius:6px}.event-hint{display:block;margin-top:6px;text-transform:none;letter-spacing:0;font-size:12px;color:var(--muted,#cdbfc8)}.event-companion{border:0;padding:0;margin:0 0 18px;display:flex;flex-wrap:wrap;gap:8px 26px;align-items:center}.event-companion legend{font-size:12px;text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px;width:100%}#event-signup-form .event-companion label{display:inline-flex;gap:8px;align-items:center;margin:0;font-size:15px;text-transform:none;letter-spacing:0}.event-companion input{accent-color:var(--gold,#d4b478);width:18px;height:18px}#event-signup-form .consent{display:block;text-transform:none;letter-spacing:0;font-size:13px;line-height:1.6}#event-signup-form .consent input{margin-right:8px;accent-color:var(--gold,#d4b478)}#event-signup-form .consent a{text-decoration:underline}.event-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}#event-signup-form{position:relative;border-radius:14px}#event-signup-status{margin-top:16px;color:var(--ivory,#faf3ec)}#event-signup-status.ok{color:var(--gold-light,#ead3a0)}main .section.consult-grid.event-signup{padding-top:110px}@media(max-width:1000px){main .section.consult-grid.event-signup{padding-top:80px}.event-facts{grid-template-columns:1fr 1fr}.event-about,.event-host{grid-template-columns:1fr}.event-items{grid-template-columns:1fr}.event-doctor-grid{grid-template-columns:1fr}}@media(max-width:600px){.event-hero{padding-block:36px 60px}.event-facts{grid-template-columns:1fr}.event-doctor{grid-template-columns:1fr}.event-doctor .doctor-photo{max-width:340px}.event-host-card{padding:24px}}`;
