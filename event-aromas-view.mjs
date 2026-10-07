// Aromas Med Spa shell for the Doral Mommy Makeover talk.
// Public URLs: /mommy-makeover-talk-doral/ and /es/charla-mommy-makeover-doral/ (routes.mjs).
// Visual source: the approved standalone concept (Red Hat Display, Aromas palette, both portraits and the reserve CTA in the hero).
// The form is the live event-signup.js form (POST /api/lead), not the concept's local preview submit.
// The previous Fulvio-branded shell stays at the -v1 URLs (event-view.mjs).
import {eventSchema,EVENT_TAG,EVENT_CONSENT_VERSION} from './event-view.mjs';

const HOST_PHONE='(305) 591-3005';
const HOST_TEL='+13055913005';
const copy={
 es:{
  title:'Charla Mommy Makeover · Aromas Med Spa Doral',
  otherLabel:'EN',
  eyebrow:'Aromas Med Spa presenta · Charla presencial en Doral',
  h1:'Mommy Makeover en Colombia.<br><em>Una charla pensada para ti.</em>',
  lead:'Ser mamá transforma tu vida, y es natural querer volver a sentirte tú. Te invitamos a una charla cercana y tranquila sobre turismo de salud en Colombia y los programas personalizados todo incluido en Cartagena.',
  date:'27 al 29 de octubre',datesub:'Fecha exacta por confirmar',seats:'30 cupos',seatsub:'Luego, lista de espera',place:'Aromas Med Spa, Doral',placesub:'9831 NW 58th St #149',
  cta:'Reservar mi cupo',cta2:'Ver detalles',guest:'Invitado especial',host:'Anfitrión',
  fdesc:'Cirujano plástico en Cartagena, Colombia. +15 años de experiencia, +3.000 procedimientos, formado en la escuela del Prof. Ivo Pitanguy. Enfoque en cirugía de mamas.',
  fmeta:'Cirujano plástico · Cartagena',ameta:'Fundador · Aromas Med Spa',
  adesc:'Originario de Colombia, médico de la Universidad del Norte (1990). Fundó Aromas Med Spa en Doral en 2008, donde dirige la atención de medicina estética y bienestar.',
  fulvioAlt:'Dr. Fulvio Correa, cirujano plástico en Cartagena, Colombia, sonriendo con uniforme quirúrgico negro',
  naderAlt:'Alberto Nader, fundador y director clínico de Aromas Med Spa en Doral, Florida, sonriendo con uniforme negro de Aromas',
  about:'Sobre la charla',abouth:'Información clara, a tu ritmo.',
  items:[['Turismo de salud, explicado con calma','Cómo se organiza un viaje a Cartagena pensado para tu proceso: la preparación, tu estadía y el acompañamiento en la recuperación.'],['Programas personalizados todo incluido','Qué significa un programa hecho a tu medida y cómo el equipo coordina cada etapa contigo.'],['Tus preguntas, en persona','Un espacio para resolver tus dudas generales sobre el viaje y el proceso, junto a otras mamás.']],
  note:'<strong>Importante.</strong> Esta charla es una asesoría de turismo de salud, no una consulta médica. Cualquier valoración médica se realiza directamente con el cirujano, de forma individual.',
  formk:'Registro',formh:'Reserva tu cupo.',formp:'Déjanos tus datos y el equipo de Aromas Med Spa te contactará por WhatsApp para confirmar la fecha, la hora y tu cupo.',
  limit:'Cupos limitados: al completar los 30 lugares abriremos una lista de espera.',
  fn:'Nombre y apellido',fw:'WhatsApp (con código de país)',fwh:'Ejemplo: +1 305 555 0123. Sin código asumimos +1 (EE. UU.).',fe:'Correo electrónico',fc:'Ciudad donde vives',fcomp:'¿Vienes con acompañante?',yes:'Sí',no:'No',
  consent:'Acepto que el equipo de Aromas Med Spa y el equipo del Dr. Fulvio Correa me contacten por WhatsApp y correo electrónico sobre esta charla y mi interés en un programa de turismo de salud. Puedo pedir que dejen de contactarme en cualquier momento.',
  privacy:'Política de privacidad',
  hostk:'Anfitrión',hosth:'Te recibimos en Aromas Med Spa, Doral.',hostp:'Aromas Med Spa es el anfitrión y aliado estratégico de esta charla. Aromas Med Spa no realiza el procedimiento de Mommy Makeover; su papel es recibirte y acompañar la organización del encuentro.',
  phone:'Teléfono',
  foot:'Contenido informativo. Se requiere valoración médica individual.',
  cookie:'¿Permites la medición analítica y publicitaria? Las etiquetas opcionales permanecen desactivadas hasta que aceptes.',
  accept:'Permitir medición',reject:'Solo esenciales',preferences:'Preferencias de cookies',cookies:'Cookies',
 },
 en:{
  title:'Mommy Makeover Talk · Aromas Med Spa Doral',
  otherLabel:'ES',
  eyebrow:'Aromas Med Spa presents · In-person talk in Doral',
  h1:'Mommy Makeover in Colombia.<br><em>A talk made for you.</em>',
  lead:'Becoming a mom changes your life, and it is natural to want to feel like yourself again. Join us for a warm, relaxed talk about health tourism in Colombia and personalized all-inclusive programs in Cartagena.',
  date:'October 27–29',datesub:'Exact date to be confirmed',seats:'30 spots',seatsub:'Then a waitlist',place:'Aromas Med Spa, Doral',placesub:'9831 NW 58th St #149',
  cta:'Save my spot',cta2:'See details',guest:'Special guest',host:'Host',
  fdesc:'Plastic surgeon in Cartagena, Colombia. 15+ years of experience, 3,000+ procedures, trained in the school of Prof. Ivo Pitanguy. Focused on breast surgery.',
  fmeta:'Plastic surgeon · Cartagena',ameta:'Founder · Aromas Med Spa',
  adesc:'Originally from Colombia, he earned his medical degree from Universidad del Norte (1990) and founded Aromas Med Spa in Doral in 2008, where he leads its aesthetic and wellness care.',
  fulvioAlt:'Dr. Fulvio Correa, plastic surgeon in Cartagena, Colombia, smiling in black scrubs',
  naderAlt:'Alberto Nader, founder and Clinical Director of Aromas Med Spa in Doral, Florida, smiling in black Aromas scrubs',
  about:'About the talk',abouth:'Clear information, at your own pace.',
  items:[['Health tourism, calmly explained','How a trip to Cartagena is planned around your process: preparing, your stay and support during recovery.'],['Personalized all-inclusive programs','What a program tailored to you means and how the team coordinates each stage with you.'],['Your questions, in person','A space to ask your general questions about the trip and the process, alongside other moms.']],
  note:'<strong>Please note.</strong> This talk is health-tourism guidance, not a medical consultation. Any medical evaluation is done directly with the surgeon, individually.',
  formk:'Sign up',formh:'Save your spot.',formp:'Leave your details and the Aromas Med Spa team will contact you on WhatsApp to confirm the date, time and your spot.',
  limit:'Limited spots: once all 30 are taken, we will open a waitlist.',
  fn:'Full name',fw:'WhatsApp (with country code)',fwh:'Example: +1 305 555 0123. Without a code we assume +1 (US).',fe:'Email',fc:'City where you live',fcomp:'Are you bringing a companion?',yes:'Yes',no:'No',
  consent:'I agree to be contacted by the Aromas Med Spa team and Dr. Fulvio Correa’s team via WhatsApp and email about this talk and my interest in a health-tourism program. I can ask them to stop contacting me at any time.',
  privacy:'Privacy policy',
  hostk:'Host',hosth:'Hosted at Aromas Med Spa, Doral.',hostp:'Aromas Med Spa is the host and strategic ally of this talk. Aromas Med Spa does not perform the Mommy Makeover procedure; its role is to welcome you and help organize the event.',
  phone:'Phone',
  foot:'Informational content. Individual medical assessment is required.',
  cookie:'Allow analytics and advertising measurement? Optional tags remain off until you accept.',
  accept:'Accept measurement',reject:'Essential only',preferences:'Cookie preferences',cookies:'Cookies',
 }
};

const FULVIO={file:'dr-fulvio-correa-plastic-surgeon-cartagena-768.webp',width:768,height:960,
 webp:'/assets/dr-fulvio-correa-plastic-surgeon-cartagena-480.webp 480w, /assets/dr-fulvio-correa-plastic-surgeon-cartagena-768.webp 768w, /assets/dr-fulvio-correa-plastic-surgeon-cartagena-1200.webp 1200w',
 avif:'/assets/dr-fulvio-correa-plastic-surgeon-cartagena-480.avif 480w, /assets/dr-fulvio-correa-plastic-surgeon-cartagena-768.avif 768w, /assets/dr-fulvio-correa-plastic-surgeon-cartagena-1200.avif 1200w'};
const NADER={file:'alberto-nader-aromas-med-spa-doral.webp',width:720,height:900,
 webp:'/assets/alberto-nader-aromas-med-spa-doral-480.webp 480w, /assets/alberto-nader-aromas-med-spa-doral.webp 720w',
 avif:'/assets/alberto-nader-aromas-med-spa-doral-480.avif 480w, /assets/alberto-nader-aromas-med-spa-doral.avif 720w'};

const CSS=`:root{--teal:#577C8E;--navy:#2F4157;--sky:#C7D9E5;--beige:#F4EFEB;--white:#fff}
@font-face{font-family:'Red Hat Display';src:url('/assets/fonts/red-hat-display-latin.woff2') format('woff2');font-weight:300 900;font-style:normal;font-display:swap}
@font-face{font-family:'Red Hat Display';src:url('/assets/fonts/red-hat-display-latin-italic.woff2') format('woff2');font-weight:300 900;font-style:italic;font-display:swap}
*{box-sizing:border-box}body{margin:0;font-family:'Red Hat Display',Arial,sans-serif;color:var(--navy);background:var(--beige);font-weight:400;line-height:1.55}
.wrap{max-width:1200px;margin:0 auto;padding:0 28px}img{max-width:100%;display:block}
h1,h2,h3{font-weight:300;letter-spacing:-.01em;margin:0 0 .4em}h1 em,h2 em{font-style:italic;color:var(--teal)}
.eyebrow{text-transform:uppercase;letter-spacing:.22em;font-size:.72rem;color:var(--teal);font-weight:500;margin:0 0 12px}
.bar{background:var(--white);border-bottom:1px solid var(--sky)}.bar-in{display:flex;align-items:center;gap:14px;height:72px}
.logo{height:40px;width:auto}.x{color:var(--teal);font-weight:300}.guestname{letter-spacing:.12em;text-transform:uppercase;font-size:.78rem}
.lang{margin-left:auto;color:var(--navy);text-decoration:none;border:1px solid var(--sky);padding:6px 12px;border-radius:30px;font-size:.8rem}
.hero{background:linear-gradient(180deg,var(--white) 0%,var(--beige) 100%);padding:40px 0 48px}
.hero-in{display:grid;grid-template-columns:1.05fr 1fr;gap:48px;align-items:center}
h1{font-size:clamp(2.1rem,3.6vw,3.3rem);line-height:1.08}.lead{font-size:1.05rem;max-width:34em;margin:0 0 22px}
.facts{list-style:none;padding:0;margin:0 0 26px;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--sky);border-bottom:1px solid var(--sky)}
.facts li{padding:12px 10px 12px 0}.facts b{display:block;font-weight:500;font-size:.95rem}.facts small{color:var(--teal);font-size:.78rem}
.ctas{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-block;background:var(--navy);color:var(--white);text-decoration:none;padding:15px 30px;border-radius:40px;letter-spacing:.12em;text-transform:uppercase;font-size:.8rem;font-weight:500;border:1px solid var(--navy);cursor:pointer;font-family:inherit}
.btn:hover{background:var(--teal);border-color:var(--teal)}.btn.ghost{background:transparent;color:var(--navy)}.btn.ghost.light{color:var(--white);border-color:var(--sky)}
.docs{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.doc{margin:0;background:var(--white);border-radius:180px 180px 14px 14px;overflow:hidden;box-shadow:0 18px 40px rgba(47,65,87,.12)}
.doc img{width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;object-position:top;background:var(--sky)}
.doc figcaption{padding:14px 16px 18px;text-align:center}.doc b{display:block;font-weight:500}.doc small{color:var(--teal);font-size:.8rem}
.tag{display:inline-block;font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:var(--teal);margin-bottom:4px}
.reg{background:var(--navy);color:var(--white);padding:64px 0}.reg .eyebrow{color:var(--sky)}.reg h2{font-size:2.4rem}
.reg-in{display:grid;grid-template-columns:1fr 1.2fr;gap:48px}.limit{color:var(--sky);font-size:.9rem}
#event-signup-form{position:relative;background:var(--white);color:var(--navy);padding:28px;border-radius:14px;display:grid;gap:14px}
#event-signup-form label{display:grid;gap:6px;font-size:.85rem;font-weight:500}#event-signup-form small{font-weight:400;color:var(--teal)}
#event-signup-form input:not([type]),#event-signup-form input[type=tel],#event-signup-form input[type=email]{border:1px solid var(--sky);border-radius:8px;padding:12px;font:inherit;background:var(--beige);width:100%}
#event-signup-form fieldset{border:0;padding:0;margin:0;display:flex;gap:18px;align-items:center;flex-wrap:wrap}#event-signup-form legend{font-size:.85rem;font-weight:500;margin-bottom:6px;width:100%}
#event-signup-form .r{display:flex;gap:6px;align-items:center;font-weight:400}#event-signup-form .c{display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:.78rem;line-height:1.45}
#event-signup-form .c a{color:var(--teal)}#event-signup-form .r input,#event-signup-form .c input{accent-color:var(--navy);margin-top:2px}
#event-signup-status{margin:0}#event-signup-status:not(:empty){background:var(--sky);padding:12px;border-radius:8px}
.event-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.about{padding:72px 0}.about h2,.host h2{font-size:2.2rem}.items{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin:28px 0}
.item{background:var(--white);padding:26px;border-radius:14px;border-top:3px solid var(--teal)}.item span{color:var(--teal);font-size:.8rem;letter-spacing:.2em}.item h3{font-size:1.2rem;font-weight:500;margin-top:8px}
.note{font-size:.88rem;background:var(--sky);padding:16px 20px;border-radius:10px}
.bios{background:var(--white);padding:64px 0}.bios-in{display:grid;grid-template-columns:1fr 1fr;gap:32px}
.bio{display:flex;gap:20px;align-items:center}.bio img{width:130px;height:130px;border-radius:50%;object-fit:cover;object-position:top;flex:none}.bio h3{font-size:1.4rem;font-weight:500}
.host{background:var(--teal);color:var(--white);padding:64px 0}.host .eyebrow{color:var(--sky)}.host a{color:inherit}.addr{font-size:.9rem;color:var(--sky)}
footer{background:var(--navy);color:var(--sky);padding:32px 0;font-size:.8rem}.flogo{height:44px;width:auto;margin-bottom:10px}
.privacy-button{background:none;border:0;padding:0;margin-top:8px;color:inherit;font:inherit;text-decoration:underline;cursor:pointer}
.sticky{display:none}
.contact-launcher{display:none!important}
.menu-toggle[hidden],.nav[hidden]{display:none!important}
.consent-banner{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:space-between;padding:10px 18px;background:var(--navy);color:var(--beige);font-size:.82rem}
.consent-banner[hidden]{display:none!important}
.consent-banner p{margin:0;flex:1 1 280px;max-width:none;color:var(--sky)}
.consent-banner div{display:flex;gap:8px;flex-wrap:wrap}
.consent-banner button{background:var(--white);color:var(--navy);border:0;border-radius:30px;padding:8px 14px;font:inherit;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
@media(max-width:820px){.wrap{padding:0 18px}.bar-in{height:58px;gap:8px}.logo{height:30px}.guestname{font-size:.62rem;letter-spacing:.06em}
.hero{padding:18px 0 28px}.hero-in{grid-template-columns:1fr;gap:18px}.docs{order:-1;gap:10px}
.doc{border-radius:120px 120px 10px 10px}.doc img{aspect-ratio:1/1;height:auto}.doc figcaption{padding:8px 6px 10px}.doc b{font-size:.88rem}.doc small{font-size:.7rem}
.eyebrow{font-size:.62rem;letter-spacing:.16em}h1{font-size:1.8rem}.lead{font-size:.95rem;margin-bottom:14px}.facts{grid-template-columns:1fr 1fr 1fr;margin-bottom:16px}.facts b{font-size:.8rem}.facts small{font-size:.66rem}.facts li{padding:8px 8px 8px 0}
.btn{padding:14px 22px}.ctas .btn{flex:1;text-align:center}.reg-in,.bios-in,.items{grid-template-columns:1fr}.bio img{width:96px;height:96px}
.sticky{display:block;position:fixed;left:14px;right:14px;bottom:14px;background:var(--navy);color:#fff;text-align:center;padding:15px;border-radius:40px;text-decoration:none;text-transform:uppercase;letter-spacing:.12em;font-size:.8rem;font-weight:500;box-shadow:0 10px 30px rgba(0,0,0,.25);z-index:9}
footer{padding-bottom:90px}}
@media(max-width:820px) and (max-height:760px){.doc figcaption small{display:none}.hero{padding-bottom:18px}}`;

const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function photo(person,alt,sizes,eager){
 const load=eager?'decoding="async"'+(eager==='high'?' fetchpriority="high"':''):'loading="lazy" decoding="async"';
 return `<picture><source type="image/avif" srcset="${person.avif}" sizes="${sizes}"><img src="/assets/${person.file}" alt="${esc(alt)}" width="${person.width}" height="${person.height}" srcset="${person.webp}" sizes="${sizes}" data-fixed-srcset="1" data-keep-loading="1" ${load}></picture>`;
}

export function aromasEventHtml({lang,origin,consent,ghlGuard,gtm,privacyUrl}){
 const t=copy[lang],other=lang==='en'?'es':'en';
 const otherHref=other==='es'?'/es/mommy-makeover-talk-doral/':'/en/mommy-makeover-talk-doral/';
 const ev=eventSchema(lang,origin);
 const route=lang==='en'?'/en/mommy-makeover-talk-doral/':'/es/mommy-makeover-talk-doral/';
 const canonical=origin+route;
 const heroSizes='(max-width: 820px) 44vw, 280px';
 const bioSizes='96px';
 const portrait=(person,alt,eager)=>`<figure class="doc">${photo(person,alt,heroSizes,eager)}<figcaption><span class="tag">${person===FULVIO?t.guest:t.host}</span><b>${person===FULVIO?'Dr. Fulvio Correa':'Alberto Nader'}</b><small>${person===FULVIO?t.fmeta:t.ameta}</small></figcaption></figure>`;
 const items=t.items.map(([h,p],i)=>`<div class="item"><span>0${i+1}</span><h3>${h}</h3><p>${p}</p></div>`).join('');
 const cta=(id,href,label,extra='')=>`<a class="btn${extra}" id="${id}" data-cta="${id}" data-event="navigation_click" href="${href}">${label}</a>`;
 const form=`<form id="event-signup-form" data-form="event-signup" data-event-tag="${EVENT_TAG}" novalidate><label>${t.fn}<input name="name" autocomplete="name" maxlength="100" required></label><label>${t.fw}<input name="whatsapp" type="tel" autocomplete="tel" inputmode="tel" maxlength="30" placeholder="+1 305 555 0123" aria-describedby="event-phone-hint" required><small id="event-phone-hint">${t.fwh}</small></label><label>${t.fe}<input name="email" type="email" autocomplete="email" maxlength="254" required></label><label>${t.fc}<input name="city" autocomplete="address-level2" maxlength="100" required></label><fieldset><legend>${t.fcomp}</legend><label class="r"><input type="radio" name="companion" value="yes" required> ${t.yes}</label><label class="r"><input type="radio" name="companion" value="no"> ${t.no}</label></fieldset><label class="c"><input type="checkbox" name="contact_consent" required> <span data-consent-version="${EVENT_CONSENT_VERSION}">${t.consent}</span> <a href="${privacyUrl}" target="_blank" rel="noopener">${t.privacy}</a>.</label><div class="event-hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><button class="btn" id="event-signup-submit" type="submit">${t.cta}</button><p id="event-signup-status" class="form-status" role="status" aria-live="polite"></p></form>`;
 return `<!doctype html><html lang="${lang}"><head>${consent}${ghlGuard}${gtm}<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(t.title)}</title><meta name="description" content="${esc(ev.description)}"><meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#2F4157"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="en" href="${origin}/en/mommy-makeover-talk-doral/"><link rel="alternate" hreflang="es" href="${origin}/es/mommy-makeover-talk-doral/"><link rel="alternate" hreflang="x-default" href="${origin}/en/mommy-makeover-talk-doral/"><meta property="og:title" content="${esc(t.title)}"><meta property="og:description" content="${esc(ev.description)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="website"><meta property="og:locale" content="${lang==='en'?'en_US':'es_CO'}"><meta property="og:image" content="${origin}/assets/dr-fulvio-correa-plastic-surgeon-cartagena-1200.webp"><meta name="twitter:card" content="summary_large_image"><link rel="preload" href="/assets/fonts/red-hat-display-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><style>${CSS}</style><script type="application/ld+json">${JSON.stringify([ev]).replaceAll('<','\\u003c')}</script><script src="/config.js" defer></script><script src="/app.js" defer></script></head><body class="aromas" data-language="${lang}" data-event-shell="aromas"><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-THZVNS9B" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><button class="menu-toggle" type="button" hidden aria-expanded="false" aria-controls="navigation"></button><nav class="nav" id="navigation" hidden></nav><aside class="consent-banner" id="cookie-banner" aria-label="${esc(t.cookies)}" hidden><p>${t.cookie}</p><div><button type="button" id="accept-analytics">${t.accept}</button><button type="button" id="reject-analytics">${t.reject}</button></div></aside><header class="bar"><div class="wrap bar-in"><img class="logo" src="/assets/aromas-logo-original.svg" alt="Aromas Med Spa" width="300" height="93" data-keep-loading="1" decoding="async"><span class="x" aria-hidden="true">×</span><span class="guestname">Dr. Fulvio Correa</span><a class="lang" href="${otherHref}" data-language="${other}" lang="${other}">${t.otherLabel}</a></div></header><main id="main"><section class="hero"><div class="wrap hero-in"><div class="copy"><p class="eyebrow">${t.eyebrow}</p><h1>${t.h1}</h1><p class="lead">${t.lead}</p><ul class="facts"><li><b>${t.date}</b><small>${t.datesub}</small></li><li><b>${t.seats}</b><small>${t.seatsub}</small></li><li><b>${t.place}</b><small>${t.placesub}</small></li></ul><div class="ctas">${cta('event-hero-signup','#registro',t.cta)}${cta('event-hero-details','#charla',t.cta2,' ghost')}</div></div><div class="docs">${portrait(FULVIO,t.fulvioAlt,'high')}${portrait(NADER,t.naderAlt,true)}</div></div></section><section id="registro" class="reg"><div class="wrap reg-in"><div><p class="eyebrow">${t.formk}</p><h2>${t.formh}</h2><p>${t.formp}</p><p class="limit">${t.limit}</p></div>${form}</div></section><section id="charla" class="about"><div class="wrap"><p class="eyebrow">${t.about}</p><h2>${t.abouth}</h2><div class="items">${items}</div><p class="note">${t.note}</p></div></section><section class="bios"><div class="wrap bios-in"><div class="bio">${photo(FULVIO,t.fulvioAlt,bioSizes,false)}<div><span class="tag">${t.guest}</span><h3>Dr. Fulvio Correa</h3><p>${t.fdesc}</p></div></div><div class="bio">${photo(NADER,t.naderAlt,bioSizes,false)}<div><span class="tag">${t.host}</span><h3>Alberto Nader</h3><p>${t.adesc}</p></div></div></div></section><section class="host"><div class="wrap"><p class="eyebrow">${t.hostk}</p><h2>${t.hosth}</h2><p>${t.hostp}</p><p class="addr">Aromas Med Spa · 9831 NW 58th St #149, Doral, FL 33178 · ${t.phone}: <a href="tel:${HOST_TEL}" id="event-host-phone" data-cta="event-host-phone" data-event="phone_click" data-location="event-host">${HOST_PHONE}</a></p>${cta('event-host-signup','#registro',t.cta,' ghost light')}</div></section></main><footer><div class="wrap"><img class="flogo" src="/assets/aromas-logo-white.svg" alt="Aromas Med Spa" width="300" height="93" data-keep-loading="1" loading="lazy" decoding="async"><p>Aromas Med Spa × Dr. Fulvio Correa · ${t.foot}</p><button type="button" id="privacy-settings" class="privacy-button">${t.preferences}</button></div></footer><a class="sticky" id="event-sticky-signup" data-cta="event-sticky-signup" data-event="navigation_click" href="#registro">${t.cta}</a></body></html>`;
}
