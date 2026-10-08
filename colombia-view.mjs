import {esc} from './editorial.mjs';
import {membershipView} from './practice-view.mjs';

const order = ['mommy-makeover','breast-augmentation','breast-lift-reduction','tummy-tuck','bbl','rhinoplasty','facelift','liposuction'];
const reading = {
  en: [
    ['how-long-to-stay-after-mommy-makeover','How long to stay after a mommy makeover'],
    ['mommy-makeover-recovery-time','Mommy makeover recovery time'],
    ['breast-augmentation-colombia','Breast augmentation in Colombia'],
    ['breast-lift-colombia','Breast lift in Colombia'],
    ['tummy-tuck-colombia','Tummy tuck in Colombia'],
    ['bbl-colombia','BBL in Colombia'],
    ['rhinoplasty-colombia','Rhinoplasty in Colombia'],
    ['liposuction-cartagena','Liposuction in Cartagena'],
    ['flying-after-plastic-surgery','Flying after plastic surgery'],
    ['plastic-surgery-medical-tourism-cartagena-colombia','Cartagena plastic surgery and medical tourism, 2026 data'],
  ],
  es: [
    ['cuantos-dias-quedarse-despues-mommy-makeover','Cuántos días quedarse después de un mommy makeover'],
    ['tiempo-recuperacion-mommy-makeover','Tiempo de recuperación del mommy makeover'],
    ['aumento-de-senos-colombia','Aumento de senos en Colombia'],
    ['levantamiento-de-senos-colombia','Levantamiento de senos en Colombia'],
    ['abdominoplastia-colombia','Abdominoplastia en Colombia'],
    ['bbl-colombia','BBL en Colombia'],
    ['rinoplastia-colombia','Rinoplastia en Colombia'],
    ['liposuccion-colombia','Liposucción en Colombia'],
    ['viajar-en-avion-despues-de-cirugia-plastica','Viajar en avión después de una cirugía plástica'],
    ['cirugia-plastica-turismo-medico-cartagena-colombia','Cirugía plástica y turismo médico en Cartagena: datos 2026'],
  ],
};

function picture(base, alt, width, height) {
  const widths = [480, 768, 1200, 1400];
  const set = ext => widths.map(w => `/assets/${base}${w === 1400 ? '' : '-' + w}.${ext} ${w}w`).join(', ');
  const sizes = '(max-width: 700px) 88vw, 840px';
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><img src="/assets/${base}.webp" alt="${esc(alt)}" width="${width}" height="${height}" srcset="${set('webp')}" sizes="${sizes}" data-fixed-srcset="1" data-keep-loading="1" loading="lazy" decoding="async"></picture>`;
}
function portrait(alt) {
  const webp = '/assets/dr-fulvio-correa-plastic-surgeon-cartagena-480.webp 480w, /assets/dr-fulvio-correa-plastic-surgeon-cartagena-768.webp 768w, /assets/dr-fulvio-correa-plastic-surgeon-cartagena-1200.webp 1200w';
  const avif = webp.replaceAll('.webp', '.avif');
  const sizes = '(max-width: 700px) 88vw, 560px';
  return `<picture><source type="image/avif" srcset="${avif}" sizes="${sizes}"><img src="/assets/dr-fulvio-correa-plastic-surgeon-cartagena-1200.webp" alt="${esc(alt)}" width="1200" height="1500" srcset="${webp}" sizes="${sizes}" data-fixed-srcset="1" data-keep-loading="1" loading="lazy" decoding="async"></picture>`;
}

const copy = {
  en: {
    title: 'A Guide to Plastic Surgery in Colombia',
    description: 'How to choose a plastic surgeon in Colombia: credentials, the clinic and the recovery stay in Cartagena. A guide from Dr. Fulvio Correa, SCCP member.',
    eyebrow: 'Cartagena, Colombia',
    h1: 'Plastic surgery in Colombia',
    lead: 'People looking for a plastic surgeon in Colombia are usually asking three things: why this country, how to choose safely, and what the trip involves. This page answers those questions. It is education from the practice, not a promise of a result, and it does not list prices.',
    cta: 'Request a virtual consultation',
    whyTitle: 'Why patients consider Colombia',
    why: [
      'Colombia is one of the busiest countries in the world for aesthetic surgery. In the 2024 ISAPS global survey, surgeons in Colombia reported 321,408 aesthetic surgical procedures, which placed the country 10th worldwide by surgical volume. Volume is not a quality ranking. It does mean the specialty is widely practiced, and that many teams are used to caring for people who travel. In that same survey, surgeons in Colombia said that on average 30 percent of their patients came from somewhere else, most often the United States, Spain and Canada. Those figures are what surgeons reported. They are not a census of every patient who entered the country.',
      'Cartagena adds a practical detail: an international airport and direct flights from several cities in the United States. A shorter travel day is useful after surgery. It is not a reason to fly before your own surgeon clears you. Visitor counts, routes and procedure trends are gathered in the practice’s data report, separate from this guide so the numbers stay in one place.',
    ],
    chooseTitle: 'How to choose a surgeon',
    chooseIntro: 'There is no official list of the best plastic surgeons in Colombia. A phrase like that describes a preference, not a registry. A safer way to choose is to check facts you can verify, then decide in consultation whether the surgeon and the plan fit you.',
    credTitle: 'Credentials you can look up',
    creds: [
      'Specialist training in plastic, reconstructive and aesthetic surgery, rather than a short course in a single operation.',
      'Membership in the Colombian Society of Plastic Surgery (SCCP), the national society. The SCCP publishes a directory. Membership is something you can confirm. It is not a guarantee of a particular result.',
      'Registration in ReTHUS, the national registry of health professionals kept by the Colombian Ministry of Health.',
    ],
    clinicTitle: 'The clinic, not only the surgeon',
    clinic: 'Ask where the operation will take place, who provides the anesthesia, and what the facility’s current authorization is. In Colombia, health facilities are registered through the REPS system. Ask to see that authorization rather than judging a clinic by a photograph of the lobby. The American Society of Plastic Surgeons, in its briefing on cosmetic surgery tourism, tells patients to verify the surgeon and the facility, and to agree on follow-up before they travel.',
    flagTitle: 'Red flags',
    flags: [
      'A guaranteed result, or a promise that you will look like someone else’s photograph.',
      'Pressure to pay or to reserve a date before anyone has examined you.',
      'Reluctance to discuss risks, alternatives, or what happens if you need care after you fly home.',
      'No clear answer about who operates, who gives the anesthesia, and where you are seen the next day.',
    ],
    flagNote: 'ISAPS and the U.S. Centers for Disease Control and Prevention both treat travel for surgery as a medical plan: know the surgeon, know the facility, and know how you will be followed after you leave.',
    tripTitle: 'The trip, step by step',
    tripIntro: 'The international page of this site goes into lodging and logistics. The sequence itself is short, and the dates are individual.',
    steps: [
      ['A virtual valuation', 'You share your history and photographs. The team can say whether an in-person consultation in Cartagena is a sensible next step. A video call does not replace the examination before surgery. The consultation guide lists what is useful to prepare.'],
      ['Surgery and the days you stay', 'An operation is scheduled only after you have been seen in person. How many days you should remain in Cartagena depends on the procedure and on how you are healing. There is no single number for every operation. Read the guides on staying, on recovery, and on flying, and keep the return ticket flexible until your surgeon clears the flight.'],
      ['Follow-up after you land', 'Before you travel, ask who answers questions once you are home, what needs a doctor near you, and which signs should not wait. ASPS treats that plan as part of appropriate care for patients who travel for surgery, not as an optional extra.'],
    ],
    doctorTitle: 'Dr. Fulvio Correa',
    doctor: [
      'Dr. Fulvio Correa is a plastic surgeon in Cartagena. He has more than 15 years of experience and has performed more than 3,000 procedures. He earned his medical degree at the University of Cartagena and continued his postgraduate training at the Ivo Pitanguy Institute in Rio de Janeiro. He is a member of the SCCP. His focus is breast surgery, together with body contouring.',
      'The consultation office is in Manzanillo del Mar, at CC Ramblas. Surgery is at CAPRI Clinic, which is a different address in Cartagena. Confirm which door you are going to before you leave the hotel. The office photographs on this page are the consultation rooms, not the operating clinic.',
    ],
    doctorAlt: 'Dr. Fulvio Correa, plastic surgeon in Cartagena, Colombia, smiling in black scrubs',
    officeAlt: 'Reception of Dr. Fulvio Correa’s consultation office in Cartagena, with a marble desk and a wall lettered FULVIO CORREA',
    procTitle: 'Procedures in Cartagena',
    procIntro: 'These are the operations the practice offers. Whether any of them belongs in your plan is decided in consultation, not from a list.',
    readTitle: 'Guides that go further',
    faqTitle: 'Questions patients ask',
    faqs: [
      ['Is plastic surgery in Colombia safe?', 'Safety depends on the surgeon, the facility and the plan for your own case, not on the country. ASPS and ISAPS advise you to verify training, the clinic, anesthesia and follow-up before you travel. Those are the right questions for a consultation.'],
      ['How do I check a plastic surgeon in Colombia?', 'Confirm specialist training in plastic surgery, look up membership in the Colombian Society of Plastic Surgery, and use the Ministry of Health ReTHUS registry. A social-media following is not a credential.'],
      ['Is there a list of the best plastic surgeons in Colombia?', 'No. There is no official ranking. “Best” in a search result is not a registry. Use the checks above, then decide after a consultation whether that surgeon is the right one for you.'],
      ['How long should I stay in Cartagena after surgery?', 'It depends on the procedure, on how you are healing, and on when your surgeon clears you to fly. The practice publishes separate guides for stay length, recovery by week, and flying. None of them is a personal clearance.'],
      ['Can I start with a virtual consultation?', 'Yes. The practice offers a virtual valuation and an in-person consultation in Cartagena. The virtual conversation is a first step. It does not replace the examination before surgery.'],
      ['Where does Dr. Correa operate?', 'Consultations are at the office in Manzanillo del Mar. Surgery is at CAPRI Clinic, a different address. The team confirms the location for each visit.'],
    ],
    sourcesTitle: 'Sources',
    closingTitle: 'A first conversation',
    closing: 'If you want to know whether a trip to Cartagena makes sense for you, start with a virtual valuation. Bring your questions about credentials, the clinic, the stay and follow-up. The team can tell you what the next step is. Nothing on this page is a quotation or a promise.',
    links: {
      report: 'Read the Cartagena data report',
      intl: 'Planning the trip from abroad',
      about: 'Meet Dr. Fulvio Correa',
      capri: 'CAPRI Clinic, the surgical setting',
      consult: 'What to prepare for your consultation',
      contact: 'Contact the office in Cartagena',
      sccp: 'SCCP, the Colombian Society of Plastic Surgery',
      member: 'Dr. Correa’s SCCP profile',
      rethus: 'ReTHUS at the Ministry of Health',
    },
  },
  es: {
    title: 'Cirujano plástico en Cartagena, Colombia',
    description: 'Cirujano plástico en Cartagena: cómo revisar credenciales, la clínica y la estadía. Guía de cirugía plástica en Colombia del Dr. Fulvio Correa, SCCP.',
    eyebrow: 'Cartagena, Colombia',
    h1: 'Cirugía plástica en Colombia',
    lead: 'Quien busca un cirujano plástico en Cartagena, o cirugía plástica en Colombia, suele tener tres preguntas: por qué este país, cómo elegir con cuidado y cómo es el viaje. Esta página responde eso. Es información del consultorio, no una promesa de resultado, y no publica precios.',
    cta: 'Solicitar valoración virtual',
    whyTitle: 'Por qué algunos pacientes miran a Colombia',
    why: [
      'Colombia está entre los países con más cirugías estéticas del mundo. En la encuesta global de ISAPS de 2024, los cirujanos en Colombia reportaron 321.408 procedimientos estéticos quirúrgicos, lo que ubicó al país en el puesto 10 por volumen. El volumen no es un ranking de calidad. Sí indica que la especialidad se practica mucho y que muchos equipos atienden a personas que viajan. En esa misma encuesta, los cirujanos en Colombia dijeron que, en promedio, el 30 por ciento de sus pacientes venía de otro lugar, sobre todo de Estados Unidos, España y Canadá. Son respuestas de una encuesta a cirujanos, no un censo de cada persona que entró al país.',
      'Cartagena suma un dato práctico: un aeropuerto internacional y vuelos directos desde varias ciudades de Estados Unidos. Un viaje más corto ayuda después de una cirugía. No es una razón para volar antes de que tu cirujano te autorice. Las cifras de visitantes, rutas y procedimientos están en el informe de datos del consultorio, aparte de esta guía, para que los números vivan en un solo lugar.',
    ],
    chooseTitle: 'Cómo elegir un cirujano plástico',
    chooseIntro: 'No existe una lista oficial de los mejores cirujanos plásticos de Colombia. Esa frase describe una preferencia, no un registro. Una forma más segura de elegir es revisar datos que se pueden comprobar y, después, decidir en la valoración si el cirujano y el plan te corresponden.',
    credTitle: 'Credenciales que se pueden verificar',
    creds: [
      'Formación de especialista en cirugía plástica, reconstructiva y estética, no un curso breve de una sola operación.',
      'Membresía en la Sociedad Colombiana de Cirugía Plástica (SCCP). La SCCP publica un directorio. La membresía se puede confirmar. No es una garantía de un resultado concreto.',
      'Inscripción en el ReTHUS, el registro nacional del talento humano en salud del Ministerio de Salud.',
    ],
    clinicTitle: 'La clínica, no solo el cirujano',
    clinic: 'Pregunta dónde será la cirugía, quién pone la anestesia y cuál es la habilitación vigente del lugar. En Colombia, los prestadores de salud se registran en el REPS. Pide ver esa autorización en lugar de juzgar una clínica por la foto del lobby. La Sociedad Estadounidense de Cirujanos Plásticos, en su documento sobre turismo de cirugía estética, recomienda verificar al cirujano y al centro, y dejar acordado el seguimiento antes de viajar.',
    flagTitle: 'Señales de alerta',
    flags: [
      'Un resultado garantizado, o la promesa de que vas a quedar como la fotografía de otra persona.',
      'Presión para pagar o para reservar una fecha antes de que alguien te examine.',
      'Poca disposición a hablar de riesgos, alternativas o de qué pasa si necesitas atención después de volar a casa.',
      'Ninguna respuesta clara sobre quién opera, quién anestesia y dónde te ven al día siguiente.',
    ],
    flagNote: 'ISAPS y los Centros para el Control y la Prevención de Enfermedades de Estados Unidos plantean el viaje para operarse como un plan médico: saber quién es el cirujano, cuál es la clínica y cómo será el seguimiento cuando te vayas.',
    tripTitle: 'El viaje, paso a paso',
    tripIntro: 'La página de pacientes internacionales entra en alojamiento y logística. La secuencia es corta, y las fechas son individuales.',
    steps: [
      ['Valoración virtual', 'Compartes tu historia y tus fotografías. El equipo puede decirte si una valoración presencial en Cartagena es un siguiente paso razonable. Una videollamada no reemplaza el examen antes de la cirugía. La guía de valoración indica qué conviene preparar.'],
      ['La cirugía y los días de estadía', 'La operación se agenda solo después de verte en persona. Cuántos días quedarte en Cartagena depende del procedimiento y de cómo evoluciona tu recuperación. No hay un número único para todas las cirugías. Lee las guías de estadía, de recuperación y de vuelo, y deja el tiquete de regreso flexible hasta que tu cirujano autorice el vuelo.'],
      ['Seguimiento al volver a casa', 'Antes de viajar, pregunta quién responde cuando ya estás en casa, qué requiere un médico cerca de ti y qué signos no pueden esperar. La ASPS trata ese plan como parte del cuidado de quien viaja para operarse, no como un extra opcional.'],
    ],
    doctorTitle: 'Dr. Fulvio Correa',
    doctor: [
      'El Dr. Fulvio Correa es cirujano plástico en Cartagena. Tiene más de 15 años de experiencia y ha realizado más de 3.000 procedimientos. Estudió medicina en la Universidad de Cartagena y continuó su formación de posgrado en el Instituto Ivo Pitanguy, en Río de Janeiro. Es miembro de la SCCP. Su enfoque es la cirugía mamaria, junto con el contorno corporal.',
      'El consultorio está en Manzanillo del Mar, en el CC Ramblas. La cirugía es en la Clínica CAPRI, otra dirección de Cartagena. Confirma a cuál vas antes de salir del hotel. Las fotos de esta página son del consultorio, no del quirófano.',
    ],
    doctorAlt: 'Dr. Fulvio Correa, cirujano plástico en Cartagena, Colombia, sonriendo con uniforme quirúrgico negro',
    officeAlt: 'Recepción del consultorio del Dr. Fulvio Correa en Cartagena, con un mostrador de mármol y un muro con las letras FULVIO CORREA',
    procTitle: 'Procedimientos en Cartagena',
    procIntro: 'Estas son las cirugías que ofrece el consultorio. Si alguna entra en tu plan se decide en la valoración, no en una lista.',
    readTitle: 'Guías que profundizan',
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      ['¿Es segura la cirugía plástica en Colombia?', 'La seguridad depende del cirujano, de la clínica y del plan de tu caso, no del país. La ASPS e ISAPS recomiendan verificar la formación, el centro, la anestesia y el seguimiento antes de viajar. Esas son las preguntas de una valoración.'],
      ['¿Cómo verifico a un cirujano plástico en Cartagena?', 'Confirma la especialización en cirugía plástica, busca la membresía en la Sociedad Colombiana de Cirugía Plástica y consulta el ReTHUS del Ministerio de Salud. Tener seguidores en redes no es una credencial.'],
      ['¿Hay una lista de los mejores cirujanos plásticos de Colombia?', 'No. No existe un ranking oficial. La palabra “mejores” en una búsqueda no es un registro. Usa las verificaciones de arriba y decide en la valoración si ese cirujano es el adecuado para ti.'],
      ['¿Cuántos días hay que quedarse en Cartagena?', 'Depende del procedimiento, de cómo evoluciona la recuperación y de cuándo tu cirujano autoriza el vuelo. El consultorio publica guías aparte sobre días de estadía, recuperación por semanas y viaje en avión. Ninguna es una autorización personal.'],
      ['¿Puedo empezar con una valoración virtual?', 'Sí. El consultorio ofrece valoración virtual y valoración presencial en Cartagena. La conversación virtual es un primer paso. No reemplaza el examen antes de la cirugía.'],
      ['¿Dónde opera el Dr. Correa?', 'La valoración es en el consultorio de Manzanillo del Mar. La cirugía es en la Clínica CAPRI, otra dirección. El equipo confirma el lugar de cada cita.'],
    ],
    sourcesTitle: 'Fuentes',
    closingTitle: 'Una primera conversación',
    closing: 'Si quieres saber si un viaje a Cartagena tiene sentido en tu caso, empieza por una valoración virtual. Lleva tus preguntas sobre credenciales, la clínica, la estadía y el seguimiento. El equipo te dirá cuál es el siguiente paso. Nada en esta página es una cotización ni una promesa.',
    links: {
      report: 'Leer el informe de datos de Cartagena',
      intl: 'Planear el viaje desde otro país',
      about: 'Conoce al Dr. Fulvio Correa',
      capri: 'Clínica CAPRI, el lugar de la cirugía',
      consult: 'Qué preparar para tu valoración',
      contact: 'Contactar al consultorio en Cartagena',
      sccp: 'SCCP, Sociedad Colombiana de Cirugía Plástica',
      member: 'Perfil del Dr. Correa en la SCCP',
      rethus: 'ReTHUS en el Ministerio de Salud',
    },
  },
};

const sources = [
  ['https://www.isaps.org/media/30xldsyf/isaps-global-survey-2024.pdf','ISAPS Global Survey 2024'],
  ['https://www.plasticsurgery.org/news/briefing-papers/briefing-paper-cosmetic-surgery-tourism','ASPS briefing paper: cosmetic surgery tourism'],
  ['https://www.isaps.org/discover/patients-home/considering-your-procedure-abroad/','ISAPS: considering a procedure abroad'],
  ['https://cirugiaplastica.org.co/','Sociedad Colombiana de Cirugía Plástica (SCCP)'],
  ['https://www.minsalud.gov.co/salud/PO/paginas/registro-unico-nacional-del-talento-humano-en-salud-rethus.aspx','Ministerio de Salud: ReTHUS'],
  ['https://wwwnc.cdc.gov/travel/page/medical-tourism','CDC: medical tourism'],
];

export function colombiaGuide(lang, practice, procedures, posts, origin) {
  const c = copy[lang];
  const es = lang === 'es';
  const route = `/${lang}/plastic-surgery-colombia/`;
  const cta = id => `<button type="button" class="button" data-cta="${id}" data-open-contact aria-haspopup="dialog" aria-controls="contact-dialog">${esc(c.cta)}</button>`;
  const href = slug => `/${lang}/${slug}`;
  const procs = order.map(slug => procedures.find(p => p.lang === lang && p.slug === slug && p.offeredConfirmed)).filter(Boolean);
  const guides = reading[lang].map(([slug, label]) => ({slug, label, post: posts.find(p => p.lang === lang && p.slug === slug)})).filter(x => x.post);
  const officeBase = es ? 'consultorio-cirugia-plastica-recepcion-cartagena' : 'plastic-surgery-office-reception-cartagena';
  const body = `<section class="page-hero wrap" data-surface="charcoal"><p class="eyebrow">${esc(c.eyebrow)}</p><h1>${esc(c.h1)}</h1><p class="lead">${esc(c.lead)}</p>${cta('colombia-hero')}</section>
<section class="section wrap" data-surface="black"><h2>${esc(c.whyTitle)}</h2>${c.why.map(p => `<p>${esc(p)}</p>`).join('')}<p><a class="textlink" href="/${lang}/blog/${reading[lang].at(-1)[0]}/">${esc(c.links.report)}<span aria-hidden="true">↗</span></a></p><figure>${picture(officeBase, c.officeAlt, 1400, 788)}</figure></section>
<section class="section wrap" data-surface="plum"><h2>${esc(c.chooseTitle)}</h2><p>${esc(c.chooseIntro)}</p><h3>${esc(c.credTitle)}</h3><ul class="question-list">${c.creds.map(x => `<li>${esc(x)}</li>`).join('')}</ul><p><a href="https://cirugiaplastica.org.co/" target="_blank" rel="noopener">${esc(c.links.sccp)}<span aria-hidden="true">↗</span></a><br><a href="https://cirugiaplastica.org.co/author/correa-vitola-fulvio-alexander/" target="_blank" rel="noopener">${esc(c.links.member)}<span aria-hidden="true">↗</span></a><br><a href="https://www.minsalud.gov.co/salud/PO/paginas/registro-unico-nacional-del-talento-humano-en-salud-rethus.aspx" target="_blank" rel="noopener">${esc(c.links.rethus)}<span aria-hidden="true">↗</span></a></p><h3>${esc(c.clinicTitle)}</h3><p>${esc(c.clinic)}</p><h3>${esc(c.flagTitle)}</h3><ul class="question-list">${c.flags.map(x => `<li>${esc(x)}</li>`).join('')}</ul><p>${esc(c.flagNote)}</p></section>
<section class="section" data-surface="charcoal"><div class="wrap"><h2>${esc(c.tripTitle)}</h2><p>${esc(c.tripIntro)}</p><div class="travel-grid">${c.steps.map(([title, text], i) => `<article><span class="number">0${i + 1}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div><p><a class="textlink" href="${href('international-patients/')}">${esc(c.links.intl)}<span aria-hidden="true">↗</span></a></p></div></section>
<section class="doctor-section wrap section" data-surface="black"><div class="doctor-photo">${portrait(c.doctorAlt)}<span class="image-signature">Dr. Fulvio Correa</span></div><div class="doctor-copy"><p class="eyebrow">${esc(c.eyebrow)}</p><h2>${esc(c.doctorTitle)}</h2>${c.doctor.map(p => `<p>${esc(p)}</p>`).join('')}${membershipView(practice, lang)}<p><a class="textlink" href="${href('about/')}">${esc(c.links.about)}<span aria-hidden="true">↗</span></a></p><p><a class="textlink" href="${href('capri-clinic/')}">${esc(c.links.capri)}<span aria-hidden="true">↗</span></a></p></div></section>
<section class="section wrap" data-surface="plum"><h2>${esc(c.procTitle)}</h2><p>${esc(c.procIntro)}</p><ul class="cluster-links">${procs.map(p => `<li><a href="${href('procedures/' + p.slug + '/')}">${esc(p.name)}</a></li>`).join('')}</ul><h3>${esc(c.readTitle)}</h3><ul class="cluster-links">${guides.map(g => `<li><a href="${href('blog/' + g.slug + '/')}">${esc(g.label)}</a></li>`).join('')}</ul><p class="article-body"><a href="${href('procedures/')}">${es ? 'Ver todos los procedimientos' : 'See every procedure'}</a> · <a href="${href('resources/your-consultation/')}">${esc(c.links.consult)}</a> · <a href="${href('contact/')}">${esc(c.links.contact)}</a></p></section>
<section class="section wrap" data-surface="charcoal" id="faq"><h2>${esc(c.faqTitle)}</h2><div class="article">${c.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>
<section class="section wrap sources" data-surface="black"><h2>${esc(c.sourcesTitle)}</h2><ul>${sources.map(([url, name]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)}<span aria-hidden="true">↗</span></a></li>`).join('')}</ul></section>
<section class="section wrap" data-surface="plum"><h2>${esc(c.closingTitle)}</h2><p>${esc(c.closing)}</p>${cta('colombia-closing')}</section>`;
  const schemas = [
    {'@context':'https://schema.org','@type':'MedicalWebPage','@id':origin + route + '#webpage',url:origin + route,name:c.h1,description:c.description,inLanguage:lang,lastReviewed:'2026-10-08',reviewedBy:{'@id':origin + '/#physician'},about:{'@type':'MedicalSpecialty',name:es ? 'Cirugía plástica' : 'Plastic surgery'},mainEntity:{'@id':origin + '/#physician'}},
    {'@context':'https://schema.org','@type':'FAQPage',inLanguage:lang,mainEntity:c.faqs.map(([q, a]) => ({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},
  ];
  return {body, title:c.title, description:c.description, schemas};
}
