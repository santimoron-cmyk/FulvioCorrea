// How to verify a plastic surgeon in Colombia. Facts are limited to what the
// site already publishes (practice.json, doctor biography, CAPRI, cost and
// recovery pages, and the Google reviews copied on the cost page).
import {esc} from './editorial.mjs';
import {credentialsView, membershipView} from './practice-view.mjs';
import {googleReviewsHtml} from './cost-view.mjs';

const sccpDirectory = 'https://cirugiaplastica.org.co/buscar-cirujano/';
const sccpProfile = 'https://cirugiaplastica.org.co/author/correa-vitola-fulvio-alexander/';
const rethus = 'https://www.minsalud.gov.co/salud/PO/paginas/registro-unico-nacional-del-talento-humano-en-salud-rethus.aspx';
const repsManual = 'https://prestadores.minsalud.gov.co/habilitacion/ayudas/Manual_HABILITACION_prestadores_novedades.pdf';

function para(text) {
  return `<p>${esc(text)}</p>`;
}
function li(items) {
  return `<ul class="question-list">${items.map(x => `<li>${x}</li>`).join('')}</ul>`;
}
function faqs(items) {
  return items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
}

const copy = {
  en: {
    title: 'How to Choose a Surgeon in Colombia',
    description: 'How to check a plastic surgeon in Colombia: SCCP directory, ReTHUS registration and a clinic in REPS. Dr. Fulvio Correa’s published credentials in Cartagena.',
    h1: 'How to choose a plastic surgeon in Colombia',
    eyebrow: 'Cartagena, Colombia',
    lead: 'People searching for the best plastic surgeon in Colombia will not find an official ranking. “The best” without a record you can open is marketing. This page is the checklist: look up the surgeon, look up the clinic, then read what this practice has already published about Dr. Fulvio Correa.',
    checkTitle: 'Three checks you can do before you book',
    checks: [
      `<strong>ReTHUS.</strong> The Ministry of Health’s <a href="${rethus}">national registry of health professionals</a> is how a person is authorized to practice in Colombia. Confirm plastic surgery as the specialty, not only a medical degree. The registry ID is not published on this site.`,
      `<strong>SCCP.</strong> The Colombian Society of Plastic Surgery keeps a <a href="${sccpDirectory}">surgeon directory</a>. Membership can be confirmed on that site. It is not a promise of a result, and it is not a rank.`,
      `<strong>The clinic, in REPS.</strong> Ask where the operation will take place and whether that facility is enrolled in REPS with the surgical service currently authorized (habilitado). The Ministry’s <a href="${repsManual}">REPS manual</a> describes that registry. A photograph of a lobby is not the check.`,
    ],
    checksNote: 'A consultation and a written quote come after those three. A social-media following is not a credential. Volume of surgery in a country is not a quality ranking.',
    doctorTitle: 'What is already published about Dr. Fulvio Correa',
    doctor: [
      'Dr. Fulvio Correa is a plastic surgeon in Cartagena de Indias, Colombia. His full name, as published by the practice, is Fulvio Alexander Correa Vitola. He has more than 15 years of experience in aesthetic and reconstructive plastic surgery and has performed more than 3,000 procedures. Those figures come from the official biography. They are not a ranking.',
      'He is a Miembro de Número of the Sociedad Colombiana de Cirugía Plástica Estética y Reconstructiva (SCCP). The society profile is public. He is also a member of FILACP, the Ibero-Latin American Federation of Plastic Surgery. FILACP brings together plastic surgery specialists in Latin America. The SCCP is Colombia’s national society.',
      'Training published by the practice: a medical degree at the University of Cartagena, and postgraduate training at the Ivo Pitanguy Institute in Rio de Janeiro. The ReTHUS registration lists him as a physician (Médico), University of Cartagena, 2003, with a specialization in plastic, reconstructive and aesthetic surgery, registered since 2004. This site does not publish the registry ID or the card image.',
      'Consultations are at the office in Manzanillo del Mar: Vía Entrada a Manzanillo I-90A #10, CC Ramblas, local 23, Cartagena de Indias. Surgery is at CAPRI Clinic, Anillo Vial Km 12, Edificio Génesis, Puerta de las Américas / Pontezuela. Those are two addresses. The team confirms which one a visit uses.',
      'Office hours for the team are Monday to Friday, 8:00 a.m. to 5:00 p.m. Colombia time. Consultations with Dr. Correa are Tuesday and Thursday, 2:00 p.m. to 6:00 p.m. His special interest, as the biography states it, is breast surgery with tissue-preservation techniques and body contouring. Spanish and English are both used for patient care.',
    ],
    notTitle: 'What these facts do not say',
    not: [
      'They do not say he is the best plastic surgeon in Colombia, in Cartagena, or for any procedure.',
      'They do not predict the result of a case. An individual assessment is required.',
      'SCCP membership and ReTHUS registration are records you can check. They are not a U.S. medical-board credential, and this page does not present membership as a rank.',
      'A Google review is one person’s account. It is not a rate and it is not a package that is currently for sale.',
    ],
    quoteTitle: 'The quote is separate from the checklist',
    quote: 'Estimated ranges for surgery with this practice are on the plastic surgery cost page. Among operations listed on their own, eyelid surgery starts at USD 3,600. A consultation is USD 150 / COP 400,000. The real quote is the one written after a virtual or in-person consultation. A mommy makeover, a Brazilian butt lift with fat transfer, and liposuction that is not HD liposculpture are quoted per case. The recovery house in Cartagena — 24/7 nursing, transfers, and supplies — is arranged at the valuation and has no package price.',
    faqTitle: 'Questions about choosing a surgeon',
    faqs: [
      ['Who is the best plastic surgeon in Colombia?', 'There is no official ranking. A claim of “the best” without a record you can check is marketing. Verify ReTHUS, SCCP membership, and that the clinic’s surgical service is authorized in REPS. Then have a consultation and ask for a written quote.'],
      ['How do I verify a plastic surgeon in the SCCP?', 'Use the society’s own surgeon directory and, if a profile is claimed, open that profile. Dr. Fulvio Correa’s SCCP profile is public and lists him as Miembro de Número. Membership is something you can confirm. It does not promise a result.'],
      ['What is ReTHUS?', 'ReTHUS is the Colombian Ministry of Health registry of health professionals. Registration is how a person is authorized to practice. Dr. Correa has been registered since 2004, including a specialization in plastic, reconstructive and aesthetic surgery. The registry ID is not published here.'],
      ['Where does Dr. Fulvio Correa operate?', 'Surgery is at CAPRI Clinic in Cartagena. Consultations are at the office in CC Ramblas, Manzanillo del Mar. Confirm the address for each visit with the team. CAPRI’s phone is the clinic’s, not the office phone.'],
      ['Does a long list of procedures mean a better result?', 'No. The biography states more than 15 years and more than 3,000 procedures. That is experience, not a rank, and it does not predict your result. Suitability is decided at consultation.'],
      ['How do I ask for a consultation?', 'You can request a virtual or in-person valuation. The consultation fee published by the practice is USD 150 / COP 400,000. The surgical figure that applies to you is the one in the written quote after that visit.'],
    ],
    cta: 'Request a valuation',
    closingTitle: 'Start with the records, then the conversation',
    closing: 'Open the SCCP profile and the ReTHUS lookup, read the CAPRI page so you know it is not the consultation office, and then ask the team about your own case. The longer guide to trips, cities and what changes a quote is the plastic surgery in Colombia page. This page does not replace it, and it does not rank surgeons.',
  },
  es: {
    title: 'Elegir cirujano plástico en Colombia',
    description: 'Cómo verificar un cirujano plástico en Colombia: directorio de la SCCP, ReTHUS y clínica en el REPS. Credenciales publicadas del Dr. Fulvio Correa en Cartagena.',
    h1: 'Cómo elegir cirujano plástico en Colombia',
    eyebrow: 'Cartagena, Colombia',
    lead: 'Quien busca al mejor cirujano plástico de Colombia no va a encontrar un ranking oficial. Decir «el mejor» sin un registro que se pueda abrir es mercadeo. Esta página es la lista de verificación: el cirujano, la clínica, y lo que este consultorio ya publicó sobre el Dr. Fulvio Correa.',
    checkTitle: 'Tres verificaciones antes de reservar',
    checks: [
      `<strong>ReTHUS.</strong> El <a href="${rethus}">registro nacional del talento humano en salud</a> del Ministerio de Salud es la forma en que una persona queda autorizada para ejercer en Colombia. Confirma la especialización en cirugía plástica, no solo el título de médico. El número de registro no se publica en este sitio.`,
      `<strong>SCCP.</strong> La Sociedad Colombiana de Cirugía Plástica mantiene un <a href="${sccpDirectory}">directorio de cirujanos</a>. La membresía se confirma en ese sitio. No es una promesa de resultado ni un puesto en un ranking.`,
      `<strong>La clínica, en el REPS.</strong> Pregunta dónde será la cirugía y si esa institución está inscrita en el REPS con el servicio quirúrgico habilitado. El <a href="${repsManual}">manual de habilitación</a> del Ministerio describe ese registro. La foto de un lobby no reemplaza la verificación.`,
    ],
    checksNote: 'La valoración y la cotización por escrito vienen después de esas tres. Tener seguidores en redes no es una credencial. El volumen de cirugías de un país no es un ranking de calidad.',
    doctorTitle: 'Lo que ya está publicado sobre el Dr. Fulvio Correa',
    doctor: [
      'El Dr. Fulvio Correa es cirujano plástico en Cartagena de Indias, Colombia. El nombre completo que publica el consultorio es Fulvio Alexander Correa Vitola. Tiene más de 15 años de experiencia en cirugía plástica estética y reconstructiva y ha realizado más de 3.000 procedimientos. Esas cifras salen de la biografía oficial. No son un ranking.',
      'Es Miembro de Número de la Sociedad Colombiana de Cirugía Plástica Estética y Reconstructiva (SCCP). El perfil en la sociedad es público. También es miembro de la FILACP, la Federación Ibero Latinoamericana de Cirugía Plástica. La FILACP reúne especialistas de Latinoamérica. La SCCP es la sociedad nacional de Colombia.',
      'La formación que publica el consultorio: medicina en la Universidad de Cartagena y formación de posgrado en el Instituto Ivo Pitanguy de Río de Janeiro. La inscripción en el ReTHUS lo lista como médico de la Universidad de Cartagena (2003), con especialización en cirugía plástica, reconstructiva y estética, inscrito desde 2004. Este sitio no publica el número de registro ni la imagen de la tarjeta.',
      'La valoración es en el consultorio de Manzanillo del Mar: Vía Entrada a Manzanillo I-90A #10, CC Ramblas, local 23, Cartagena de Indias. La cirugía es en la Clínica CAPRI, Anillo Vial Km 12, Edificio Génesis, Puerta de las Américas / Pontezuela. Son dos direcciones. El equipo confirma cuál corresponde a cada cita.',
      'El horario del equipo es de lunes a viernes, de 8:00 a. m. a 5:00 p. m., hora de Colombia. Las consultas con el Dr. Correa son los martes y jueves, de 2:00 p. m. a 6:00 p. m. Su especial interés, como lo dice la biografía, es la cirugía mamaria con técnicas de preservación y el contorno corporal. La atención a pacientes se hace en español y en inglés.',
    ],
    notTitle: 'Lo que estos datos no dicen',
    not: [
      'No dicen que sea el mejor cirujano plástico de Colombia, de Cartagena o de un procedimiento.',
      'No predicen el resultado de un caso. Hace falta una valoración individual.',
      'La membresía en la SCCP y la inscripción en el ReTHUS son registros que se pueden comprobar. No son una credencial de un colegio médico de Estados Unidos, y esta página no presenta la membresía como un rango.',
      'Una reseña de Google es el relato de una persona. No es una tarifa ni un paquete que se esté vendiendo hoy.',
    ],
    quoteTitle: 'La cotización va aparte de la verificación',
    quote: 'Los rangos estimados de cirugía de este consultorio están en la página de precios. Entre las cirugías que tienen fila propia, la blefaroplastia empieza en USD 3.600. La valoración cuesta USD 150 / COP 400.000. La cotización real es la que queda por escrito después de la consulta virtual o presencial. El mommy makeover, el Brazilian butt lift con transferencia de grasa y la liposucción que no es lipoescultura HD se cotizan por caso. La casa de recuperación en Cartagena — enfermería 24/7, traslados e insumos — se organiza en la valoración y no tiene precio de paquete.',
    faqTitle: 'Preguntas para elegir cirujano',
    faqs: [
      ['¿Quién es el mejor cirujano plástico de Colombia?', 'No hay un ranking oficial. Decir «el mejor» sin un registro que se pueda revisar es mercadeo. Verifica el ReTHUS, la membresía en la SCCP y que el servicio quirúrgico de la clínica esté habilitado en el REPS. Después pide una valoración y una cotización por escrito.'],
      ['¿Cómo verifico a un cirujano plástico en la SCCP?', 'Usa el directorio de la sociedad y, si se afirma un perfil, ábrelo. El perfil del Dr. Fulvio Correa en la SCCP es público y lo lista como Miembro de Número. La membresía se puede confirmar. No promete un resultado.'],
      ['¿Qué es el ReTHUS?', 'Es el registro del Ministerio de Salud del talento humano en salud. La inscripción es la forma en que una persona queda autorizada para ejercer. El Dr. Correa está inscrito desde 2004, con especialización en cirugía plástica, reconstructiva y estética. El número de registro no se publica aquí.'],
      ['¿Dónde opera el Dr. Fulvio Correa?', 'La cirugía es en la Clínica CAPRI, en Cartagena. La valoración es en el consultorio del CC Ramblas, Manzanillo del Mar. Confirma la dirección de cada cita con el equipo. El teléfono de CAPRI es de la clínica, no del consultorio.'],
      ['¿Una lista larga de procedimientos significa un mejor resultado?', 'No. La biografía indica más de 15 años y más de 3.000 procedimientos. Eso es experiencia, no un puesto, y no predice tu resultado. La idoneidad se decide en la valoración.'],
      ['¿Cómo pido una valoración?', 'Puedes solicitar una valoración virtual o presencial. La tarifa de valoración que publica el consultorio es USD 150 / COP 400.000. La cifra quirúrgica que aplica a tu caso es la de la cotización escrita después de esa visita.'],
    ],
    cta: 'Pedir una valoración',
    closingTitle: 'Primero los registros, después la conversación',
    closing: 'Abre el perfil de la SCCP y la consulta del ReTHUS, lee la página de CAPRI para ver que no es el consultorio, y después pregunta al equipo por tu caso. La guía más larga sobre el viaje, las ciudades y qué mueve una cotización es la de cirugía plástica en Colombia. Esta página no la reemplaza y no ordena cirujanos.',
  },
};

export function surgeonPage(lang, practice) {
  const c = copy[lang];
  const es = lang === 'es';
  const route = es ? '/es/mejor-cirujano-plastico-colombia/' : '/en/best-plastic-surgeon-colombia/';
  const about = es ? '/es/about/' : '/en/about/';
  const capri = es ? '/es/capri-clinic/' : '/en/capri-clinic/';
  const guide = es ? '/es/plastic-surgery-colombia/' : '/en/plastic-surgery-colombia/';
  const cost = es ? '/es/plastic-surgery-cost-cartagena/' : '/en/plastic-surgery-cost-cartagena/';
  const house = es ? '/es/recovery-house-cartagena/' : '/en/recovery-house-cartagena/';
  const procedures = es ? '/es/procedures/' : '/en/procedures/';
  const contact = es ? '/es/contact/' : '/en/contact/';
  const bleph = es ? '/es/procedures/blepharoplasty/' : '/en/procedures/blepharoplasty/';
  const cta = id => `<button type="button" class="button" data-cta="${id}" data-open-contact aria-haspopup="dialog" aria-controls="contact-dialog">${esc(c.cta)}</button>`;
  const body = `<section class="page-hero wrap" data-surface="charcoal"><p class="eyebrow">${esc(c.eyebrow)}</p><h1>${esc(c.h1)}</h1><p class="lead">${esc(c.lead)}</p><p class="post-dates">${es ? 'Actualizado el' : 'Updated'} <time datetime="${es ? '2026-10-27' : '2026-10-21'}">${es ? '2026-10-27' : '2026-10-21'}</time></p>${cta('surgeon-hero')}</section>
<section class="section wrap" data-surface="plum" id="verify"><h2>${esc(c.checkTitle)}</h2>${li(c.checks)}<div class="article-body">${para(c.checksNote)}</div></section>
<section class="section wrap" data-surface="charcoal" id="credentials"><h2>${esc(c.doctorTitle)}</h2><div class="article-body">${c.doctor.map(para).join('')}</div>${credentialsView(practice, lang)}${membershipView(practice, lang)}<p><a href="${sccpProfile}" target="_blank" rel="noopener">${es ? 'Perfil del Dr. Correa en la SCCP' : 'Dr. Correa’s SCCP profile'}</a></p><p><a href="${about}">${es ? 'Biografía del Dr. Fulvio Correa' : 'Biography of Dr. Fulvio Correa'}</a> · <a href="${capri}">${es ? 'Clínica CAPRI' : 'CAPRI Clinic'}</a> · <a href="${contact}">${es ? 'Contacto' : 'Contact'}</a></p>${es ? '<p>Si buscas el consultorio, entra por el <a href="/es/">cirujano plástico en Cartagena</a>. Esta página es la lista de verificación.</p>' : ''}</section>
<section class="section wrap" data-surface="black"><h2>${esc(c.notTitle)}</h2>${li(c.not)}</section>
<section class="section wrap" data-surface="plum" id="quote"><h2>${esc(c.quoteTitle)}</h2><div class="article-body">${para(c.quote)}<p><a href="${cost}">${es ? 'Precios de cirugía plástica en Cartagena' : 'Plastic surgery costs in Cartagena'}</a> · <a href="${bleph}">${es ? 'Blefaroplastia' : 'Blepharoplasty'}</a> · <a href="${house}">${es ? 'Casa de recuperación en Cartagena' : 'Recovery house in Cartagena'}</a> · <a href="${guide}">${es ? 'cirugía plástica en Colombia' : 'Plastic surgery in Colombia guide'}</a> · <a href="${procedures}">${es ? 'Procedimientos' : 'Procedures'}</a></p></div></section>
${googleReviewsHtml(lang)}
<section class="section wrap" data-surface="black" id="faq"><h2>${esc(c.faqTitle)}</h2>${faqs(c.faqs)}</section>
<section class="section wrap" data-surface="charcoal"><h2>${esc(c.closingTitle)}</h2><div class="article-body">${para(c.closing)}</div>${cta('surgeon-closing')}</section>`;
  const schemas = [
    {'@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: lang, mainEntity: c.faqs.map(([q, a]) => ({'@type': 'Question', name: q, acceptedAnswer: {'@type': 'Answer', text: a}}))},
  ];
  return {title: c.title, description: c.description, h1: c.h1, body, schemas, updated: es ? '2026-10-27' : '2026-10-21', route};
}
