// Aromas Med Spa shell for the Doral conversatorio on beauty and aesthetics trends 2026.
// Public URLs: /beauty-aesthetics-talk-doral/ and /es/conversatorio-belleza-estetica-doral/ (routes.mjs).
// The November 6, 2026 date is postponed (logistics and the doctor's schedule). The page keeps the
// Aromas address and phone, shows the approved notice, and does not offer registration or a calendar.
// JSON-LD stays an Event with eventStatus EventPostponed and the original startDate: Google requires
// that startDate until a new date is known, and eventStatus is what keeps it from being an active event.
// The previous Fulvio-branded shell stays at the -v1 URLs (event-view.mjs) and is not reframed here.
import {eventSchema,EVENT_SLUG} from './event-view.mjs';
import {DORAL_LOCATION,DORAL_MAPS_URL,DORAL_PHONE_DISPLAY,DORAL_PHONE_TEL,DORAL_SITE_URL,DORAL_SITE_NAME} from './event-calendar.mjs';
const copy={
 es:{
  title:'Conversatorio de belleza 2026 · Aromas Med Spa Doral',
  otherLabel:'EN',
  meta:'El conversatorio de belleza y estética del viernes 6 de noviembre de 2026 en Aromas Med Spa Doral no se realizará en esa fecha. Lo vamos a reprogramar. La nueva fecha se publicará aquí.',
  noticeTitle:'Aviso importante: el conversatorio del 6 de noviembre no se realizará',
  notice:[
   'Por motivos de logística y de agenda del Dr. Fulvio Correa, el conversatorio de belleza y estética del viernes 6 de noviembre de 2026 en Aromas Med Spa Doral no se realizará en esa fecha. Lo vamos a reprogramar.',
   'Te pedimos disculpas por el cambio. Apenas tengamos la nueva fecha y las condiciones del encuentro, las publicaremos aquí. Si ya te registraste, te escribiremos por correo electrónico.',
   '¿Tienes preguntas? Llámanos a Aromas Med Spa: (305) 591-3005.',
  ],
  eyebrow:'Para nuestras clientas preferidas',
  h1:'Belleza y estética 2026.<br><em>Un conversatorio para ti.</em>',
  lead:'En Aromas Med Spa te elegimos para este encuentro exclusivo por la relación cercana que tenemos contigo. Es una orientación educativa y gratuita, con vino y picadas, sobre las tendencias de belleza y estética en 2026. Vienes a aprender y a decidir con información, sin presión.',
  dateStatus:'Nueva fecha por confirmar',
  cta2:'Ver detalles',guest:'Invitado especial',host:'Anfitrión',
  fdesc:'Cirujano plástico en Cartagena, Colombia. +15 años de experiencia, +3.000 procedimientos, formado en la escuela del Prof. Ivo Pitanguy. Enfoque en cirugía de mamas. Invitado especial de este conversatorio.',
  fmeta:'Cirujano plástico · invitado especial',ameta:'Fundador · Aromas Med Spa',
  adesc:'Originario de Colombia, médico de la Universidad del Norte (1990). Fundó Aromas Med Spa en Doral en 2008, donde dirige la atención de medicina estética y bienestar. En el conversatorio puedes hablar con él del spa y de los tratamientos no quirúrgicos de belleza y estética.',
  fulvioAlt:'Dr. Fulvio Correa, cirujano plástico en Cartagena, Colombia, sonriendo con uniforme quirúrgico negro',
  naderAlt:'Alberto Nader, fundador y director clínico de Aromas Med Spa en Doral, Florida, sonriendo con uniforme negro de Aromas',
  mmk:'De qué hablamos',mmh:'Aprender y decidir, con calma.',
  mmp:'Este conversatorio es una orientación educativa y gratuita. No es una consulta médica. Recorremos qué está marcando la belleza y la estética en 2026, qué suele funcionar y qué conviene mirar con más calma, cuándo un tratamiento no quirúrgico de belleza y estética puede ser suficiente y cuándo una cirugía puede tener sentido. Hablamos de cómo hacerlo con seguridad y con expectativas realistas. No prometemos un resultado. Cualquier valoración médica se realiza directamente con el cirujano, de forma individual.',
  about:'En el encuentro',abouth:'Ideas claras, a tu ritmo.',
  items:[['Tendencias 2026','Qué se está viendo en belleza y estética, qué suele funcionar y qué conviene mirar con más calma antes de decidir.'],['No quirúrgico y cirugía','Cuándo un tratamiento no quirúrgico de belleza y estética puede ser suficiente y cuándo una cirugía puede tener sentido, con seguridad y expectativas realistas.'],['Acceso directo','Puedes hacerle preguntas al Dr. Fulvio Correa, invitado especial, y conversar tus inquietudes. Con Alberto, de Aromas, hablas del spa y de los tratamientos no quirúrgicos de belleza y estética.']],
  note:'<strong>Importante.</strong> Este conversatorio es una orientación educativa y gratuita. No es una consulta médica. Vienes a aprender y a decidir con información, sin presión. Cualquier valoración médica se realiza directamente con el cirujano, de forma individual.',
  othk:'Un tema de la conversación',othh:'Operarte en Cartagena.',
  othp:'Si quieres, también hablamos de cómo es operarte en Cartagena a través de la asesoría de turismo médico: la planificación, la seguridad del proceso y el acompañamiento. Es un tema dentro del conversatorio, no el motivo del encuentro. Muchos pacientes del Dr. Correa viajan desde Estados Unidos.',
  hostk:'Anfitrión',hosth:'Te recibimos en Aromas Med Spa, Doral.',hostp:'Te recibimos en Doral, con vino y picadas, y acompañamos este conversatorio educativo. En Aromas no realizamos los procedimientos de cirugía plástica de esta orientación. Para el spa y los tratamientos no quirúrgicos de belleza y estética, conversas con Alberto.',
  phone:'Teléfono',
  foot:'Contenido informativo. Se requiere valoración médica individual.',
  cookie:'¿Permites la medición analítica y publicitaria? Las etiquetas opcionales permanecen desactivadas hasta que aceptes.',
  accept:'Permitir medición',reject:'Solo esenciales',preferences:'Preferencias de cookies',cookies:'Cookies',
 },
 en:{
  title:'Beauty and aesthetics talk 2026 · Aromas Med Spa Doral',
  otherLabel:'ES',
  meta:'The beauty and aesthetics talk at Aromas Med Spa Doral on Friday, November 6, 2026 will not take place on that date. We are rescheduling it. The new date will be posted here.',
  noticeTitle:'Important update: the November 6 talk will not take place',
  notice:[
   'Due to logistics and Dr. Fulvio Correa\'s schedule, the beauty and aesthetics talk on Friday, November 6, 2026, at Aromas Med Spa Doral will not take place on that date. We are rescheduling it.',
   'We apologize for the change. As soon as we have the new date and details, we will post them here. If you already signed up, we will email you.',
   'Questions? Call Aromas Med Spa at (305) 591-3005.',
  ],
  eyebrow:'For our preferred clients',
  h1:'Beauty and aesthetics<br>trends for 2026.<br><em>A talk for you.</em>',
  lead:'At Aromas Med Spa we chose you for this exclusive gathering because of the close relationship we share. It is a free educational orientation, with wine and light bites, about beauty and aesthetics trends for 2026. You come to learn and decide with information, without pressure.',
  dateStatus:'New date to be confirmed',
  cta2:'See details',guest:'Special guest',host:'Host',
  fdesc:'Plastic surgeon in Cartagena, Colombia. 15+ years of experience, 3,000+ procedures, trained in the school of Prof. Ivo Pitanguy. Focused on breast surgery. Special guest of this talk.',
  fmeta:'Plastic surgeon · special guest',ameta:'Founder · Aromas Med Spa',
  adesc:'Originally from Colombia, he earned his medical degree from Universidad del Norte (1990) and founded Aromas Med Spa in Doral in 2008, where he leads its aesthetic and wellness care. At the talk you can speak with him about the spa and non-surgical beauty and aesthetics treatments.',
  fulvioAlt:'Dr. Fulvio Correa, plastic surgeon in Cartagena, Colombia, smiling in black scrubs',
  naderAlt:'Alberto Nader, founder and Clinical Director of Aromas Med Spa in Doral, Florida, smiling in black Aromas scrubs',
  mmk:'What we talk about',mmh:'Learn and decide, calmly.',
  mmp:'This talk is a free educational orientation. It is not a medical consultation. We look at what is shaping beauty and aesthetics in 2026, what tends to work and what is worth a calmer look, when a non-surgical beauty and aesthetics treatment can be enough and when surgery may make sense. We talk about how to approach that safely and with realistic expectations. This talk makes no promise of a result. Any medical evaluation is done directly with the surgeon, individually.',
  about:'At the gathering',abouth:'Clear ideas, at your own pace.',
  items:[['Trends for 2026','What is being seen in beauty and aesthetics, what tends to work and what is worth a calmer look before you decide.'],['Non-surgical and surgery','When a non-surgical beauty and aesthetics treatment can be enough and when surgery may make sense, with safety and realistic expectations.'],['Direct access','You can ask Dr. Fulvio Correa, special guest, your questions and talk through your concerns. With Alberto, from Aromas, you can talk about the spa and non-surgical beauty and aesthetics treatments.']],
  note:'<strong>Please note.</strong> This talk is a free educational orientation. It is not a medical consultation. You come to learn and decide with information, without pressure. Any medical evaluation is done directly with the surgeon, individually.',
  othk:'One topic in the conversation',othh:'Surgery in Cartagena.',
  othp:'If you want, we also talk about having surgery in Cartagena through the medical tourism consultancy: planning, how safety is considered and accompaniment. It is one topic inside the talk, not the reason for the gathering. Many of Dr. Correa’s patients travel from the United States.',
  hostk:'Host',hosth:'We welcome you at Aromas Med Spa, Doral.',hostp:'We welcome you in Doral, with wine and light bites, and we host this educational talk. At Aromas we do not perform the plastic surgery procedures in this orientation. For the spa and non-surgical beauty and aesthetics treatments, you talk with Alberto.',
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
.postpone{background:var(--navy);color:var(--white);padding:28px 0 32px}
.postpone h2{color:var(--white);font-size:clamp(1.45rem,2.6vw,2rem);font-weight:500;letter-spacing:-.01em;margin:0 0 14px;max-width:22em}
.postpone p{margin:0 0 12px;max-width:44em;color:var(--beige);font-size:1.02rem}
.postpone p:last-child{margin-bottom:0}
.postpone a{color:var(--white);font-weight:500}
.hero{background:linear-gradient(180deg,var(--white) 0%,var(--beige) 100%);padding:40px 0 48px}
.hero-in{display:grid;grid-template-columns:1.05fr 1fr;gap:48px;align-items:center}
h1{font-size:clamp(2.1rem,3.6vw,3.3rem);line-height:1.08}.lead{font-size:1.05rem;max-width:34em;margin:0 0 22px}
.facts{list-style:none;padding:0;margin:0 0 26px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);border-top:1px solid var(--sky);border-bottom:1px solid var(--sky)}
.facts li{padding:12px 10px 12px 0}.facts b{display:block;font-weight:500;font-size:.95rem;line-height:1.3}.facts small{color:var(--teal);font-size:.78rem}
.facts li.status b{color:var(--teal);font-size:1.08rem}
.ctas{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-block;background:var(--navy);color:var(--white);text-decoration:none;padding:15px 30px;border-radius:40px;letter-spacing:.12em;text-transform:uppercase;font-size:.8rem;font-weight:500;border:1px solid var(--navy);cursor:pointer;font-family:inherit}
.btn:hover{background:var(--teal);border-color:var(--teal)}.btn.ghost{background:transparent;color:var(--navy)}.btn.ghost.light{color:var(--white);border-color:var(--sky)}
.docs{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.doc{margin:0;background:var(--white);border-radius:180px 180px 14px 14px;overflow:hidden;box-shadow:0 18px 40px rgba(47,65,87,.12)}
.doc img{width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;object-position:top;background:var(--sky)}
.doc figcaption{padding:14px 16px 18px;text-align:center}.doc b{display:block;font-weight:500}.doc small{color:var(--teal);font-size:.8rem}
.tag{display:inline-block;font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:var(--teal);margin-bottom:4px}
.facts a,.host .addr a{color:inherit;text-decoration:underline;text-underline-offset:.18em}
.explain{background:var(--white);padding:72px 0 28px}.explain h2,.about h2,.host h2,.also h2{font-size:2.2rem}.explain p{max-width:38em}
.also{background:var(--white);padding:0 0 72px}.also-card{background:var(--beige);border-radius:14px;border-top:3px solid var(--teal);padding:28px 32px}.also-lead{max-width:40em;margin:0 0 4px}
.also ul{list-style:none;padding:0;margin:16px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:4px 32px}.also li{position:relative;padding:8px 0 8px 16px}.also li::before{content:'';position:absolute;left:0;top:16px;width:6px;height:6px;border-radius:50%;background:var(--teal)}
.about{padding:72px 0}.items{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin:28px 0}
.item{background:var(--white);padding:26px;border-radius:14px;border-top:3px solid var(--teal)}.item span{color:var(--teal);font-size:.8rem;letter-spacing:.2em}.item h3{font-size:1.2rem;font-weight:500;margin-top:8px}
.note{font-size:.88rem;background:var(--sky);padding:16px 20px;border-radius:10px}
.bios{background:var(--white);padding:64px 0}.bios-in{display:grid;grid-template-columns:1fr 1fr;gap:32px}
.bio{display:flex;gap:20px;align-items:center}.bio h3{font-size:1.4rem;font-weight:500}
.bio-photo{display:block;flex:0 0 120px;width:120px;height:120px;aspect-ratio:1/1;border-radius:50%;overflow:hidden}
.bio-photo img{width:100%;height:100%;max-width:none;object-fit:cover;display:block}
.bio-fulvio img{object-position:center 8%}.bio-nader img{object-position:center 4%}
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
.postpone{padding:22px 0 24px}.postpone h2{font-size:1.35rem}
.hero{padding:18px 0 28px}.hero-in{grid-template-columns:1fr;gap:18px}.docs{order:-1;gap:10px}
.doc{border-radius:120px 120px 10px 10px}.doc img{aspect-ratio:1/1;height:auto}.doc figcaption{padding:8px 6px 10px}.doc b{font-size:.88rem}.doc small{font-size:.7rem}
.eyebrow{font-size:.62rem;letter-spacing:.16em}h1{font-size:1.8rem}.lead{font-size:.95rem;margin-bottom:14px}.facts{grid-template-columns:1fr;margin-bottom:16px}.facts b{font-size:.92rem}.facts small{font-size:.75rem}.facts li{padding:8px 0}
.btn{padding:14px 22px}.ctas .btn{flex:1;text-align:center}.bios-in,.items,.also ul{grid-template-columns:1fr}}
@media(max-width:820px) and (max-height:760px){.doc figcaption small{display:none}.hero{padding-bottom:18px}}`;

const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function photo(person,alt,sizes,eager,cls=''){
 const load=eager?'decoding="async"'+(eager==='high'?' fetchpriority="high"':''):'loading="lazy" decoding="async"';
 return `<picture${cls?` class="${cls}"`:''}><source type="image/avif" srcset="${person.avif}" sizes="${sizes}"><img src="/assets/${person.file}" alt="${esc(alt)}" width="${person.width}" height="${person.height}" srcset="${person.webp}" sizes="${sizes}" data-fixed-srcset="1" data-keep-loading="1" ${load}></picture>`;
}

export function aromasEventHtml({lang,origin,consent,ghlGuard,gtm}){
 const t=copy[lang],other=lang==='en'?'es':'en',slug=EVENT_SLUG;
 const otherHref=other==='es'?'/es/'+slug:'/en/'+slug;
 const paths={en:'/en/'+slug,es:'/es/'+slug};
 const ev=eventSchema(lang,origin,paths);ev.name=t.title;ev.description=t.meta;ev.startDate='2026-11-06T18:00:00-05:00';delete ev.endDate;ev.eventStatus='https://schema.org/EventPostponed';delete ev.maximumAttendeeCapacity;
 const route=paths[lang];
 const canonical=origin+route;
 const heroSizes='(max-width: 820px) 44vw, 280px';
 const bioSizes='120px';
 const portrait=(person,alt,eager)=>`<figure class="doc">${photo(person,alt,heroSizes,eager)}<figcaption><span class="tag">${person===FULVIO?t.guest:t.host}</span><b>${person===FULVIO?'Dr. Fulvio Correa':'Alberto Nader'}</b><small>${person===FULVIO?t.fmeta:t.ameta}</small></figcaption></figure>`;
 const items=t.items.map(([h,p],i)=>`<div class="item"><span>0${i+1}</span><h3>${h}</h3><p>${p}</p></div>`).join('');
 const cta=(id,href,label,extra='')=>`<a class="btn${extra}" id="${id}" data-cta="${id}" data-event="navigation_click" href="${href}">${label}</a>`;
 const venue=`<a href="${DORAL_MAPS_URL}" target="_blank" rel="noopener">${esc(DORAL_LOCATION)}</a>`;
 const phone=`<a href="${DORAL_PHONE_TEL}">${esc(DORAL_PHONE_DISPLAY)}</a>`;
 const notice=t.notice.map(paragraph=>{const at=paragraph.indexOf(DORAL_PHONE_DISPLAY);const body=at<0?esc(paragraph):esc(paragraph.slice(0,at))+`<a href="${DORAL_PHONE_TEL}">${esc(DORAL_PHONE_DISPLAY)}</a>`+esc(paragraph.slice(at+DORAL_PHONE_DISPLAY.length));return `<p>${body}</p>`;}).join('');
 return `<!doctype html><html lang="${lang}"><head>${consent}${ghlGuard}${gtm}<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(t.title)}</title><meta name="description" content="${esc(ev.description)}"><meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#2F4157"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="en" href="${origin}${paths.en}"><link rel="alternate" hreflang="es" href="${origin}${paths.es}"><link rel="alternate" hreflang="x-default" href="${origin}${paths.en}"><meta property="og:title" content="${esc(t.title)}"><meta property="og:description" content="${esc(ev.description)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="website"><meta property="og:locale" content="${lang==='en'?'en_US':'es_CO'}"><meta property="og:image" content="${origin}/assets/dr-fulvio-correa-plastic-surgeon-cartagena-1200.webp"><meta name="twitter:card" content="summary_large_image"><link rel="preload" href="/assets/fonts/red-hat-display-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><style>${CSS}</style><script type="application/ld+json">${JSON.stringify([ev]).replaceAll('<','\\u003c')}</script><script src="/config.js" defer></script><script src="/app.js" defer></script></head><body class="aromas" data-language="${lang}" data-event-shell="aromas"><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-THZVNS9B" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><button class="menu-toggle" type="button" hidden aria-expanded="false" aria-controls="navigation"></button><nav class="nav" id="navigation" hidden></nav><aside class="consent-banner" id="cookie-banner" aria-label="${esc(t.cookies)}" hidden><p>${t.cookie}</p><div><button type="button" id="accept-analytics">${t.accept}</button><button type="button" id="reject-analytics">${t.reject}</button></div></aside><header class="bar"><div class="wrap bar-in"><img class="logo" src="/assets/aromas-logo-original.svg" alt="Aromas Med Spa" width="300" height="93" data-keep-loading="1" decoding="async"><span class="x" aria-hidden="true">×</span><span class="guestname">Dr. Fulvio Correa</span><a class="lang" href="${otherHref}" data-language="${other}" lang="${other}">${t.otherLabel}</a></div></header><main id="main"><section class="postpone" aria-labelledby="event-postpone-title"><div class="wrap"><h2 id="event-postpone-title">${esc(t.noticeTitle)}</h2>${notice}</div></section><section class="hero"><div class="wrap hero-in"><div class="copy"><p class="eyebrow">${t.eyebrow}</p><h1>${t.h1}</h1><p class="lead">${t.lead}</p><ul class="facts"><li class="status"><b>${esc(t.dateStatus)}</b></li><li><b>${venue}</b><small>${phone}</small></li></ul><div class="ctas">${cta('event-hero-details','#que-es',t.cta2,' ghost')}</div></div><div class="docs">${portrait(FULVIO,t.fulvioAlt,'high')}${portrait(NADER,t.naderAlt,true)}</div></div></section><section id="que-es" class="explain"><div class="wrap"><p class="eyebrow">${t.mmk}</p><h2>${t.mmh}</h2><p>${t.mmp}</p></div></section><section id="otros" class="also"><div class="wrap"><div class="also-card"><p class="eyebrow">${t.othk}</p><h2>${t.othh}</h2><p class="also-lead">${t.othp}</p></div></div></section><section id="charla" class="about"><div class="wrap"><p class="eyebrow">${t.about}</p><h2>${t.abouth}</h2><div class="items">${items}</div><p class="note">${t.note}</p></div></section><section class="bios"><div class="wrap bios-in"><div class="bio">${photo(FULVIO,t.fulvioAlt,bioSizes,false,'bio-photo bio-fulvio')}<div><span class="tag">${t.guest}</span><h3>Dr. Fulvio Correa</h3><p>${t.fdesc}</p></div></div><div class="bio">${photo(NADER,t.naderAlt,bioSizes,false,'bio-photo bio-nader')}<div><span class="tag">${t.host}</span><h3>Alberto Nader</h3><p>${t.adesc}</p></div></div></div></section><section class="host"><div class="wrap"><p class="eyebrow">${t.hostk}</p><h2>${t.hosth}</h2><p>${t.hostp}</p><p class="addr">${venue} · ${t.phone}: <a href="${DORAL_PHONE_TEL}" id="event-host-phone" data-cta="event-host-phone" data-event="phone_click" data-location="event-host">${esc(DORAL_PHONE_DISPLAY)}</a></p><p class="addr"><a href="${DORAL_SITE_URL}" target="_blank" rel="noopener">${esc(DORAL_SITE_NAME)}</a></p></div></section></main><footer><div class="wrap"><img class="flogo" src="/assets/aromas-logo-white.svg" alt="Aromas Med Spa" width="300" height="93" data-keep-loading="1" loading="lazy" decoding="async"><p>Aromas Med Spa × Dr. Fulvio Correa · ${t.foot}</p><button type="button" id="privacy-settings" class="privacy-button">${t.preferences}</button></div></footer></body></html>`;
}
