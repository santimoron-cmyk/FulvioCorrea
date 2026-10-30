// Procedure prices are not published. The only fee on the site is the consultation.
import {esc, read} from './editorial.mjs';

export const TRM_DATE = '2026-10-30';
const CONSULT = {en: 'USD 150 / COP 400,000', es: 'USD 150 / COP 400.000'};

const costNotes = {
  liposuction: {
    en: 'Liposuction that is not HD liposculpture, and HD liposculpture itself, are both quoted per case. Adding arms or legs, or using retraction technology, changes the plan.',
    es: 'La liposucción que no es lipoescultura HD, y la lipoescultura HD, se cotizan por caso. Sumar brazos o piernas, o usar tecnología de retracción, cambia el plan.',
  },
  'tummy-tuck': {
    en: 'A lipoabdominoplasty, a mini tummy tuck, and a tummy tuck without liposuction are different operations. Each one is quoted per case.',
    es: 'Una lipoabdominoplastia, una mini abdominoplastia y una abdominoplastia sin liposucción son cirugías distintas. Cada una se cotiza por caso.',
  },
  'breast-augmentation': {
    en: 'Implant choice, including a Preserve plan when that is what fits, is part of the consultation. The written quote follows that visit.',
    es: 'La elección del implante, incluido un plan con Preserve cuando corresponde, se define en la valoración. La cotización escrita viene después.',
  },
  'breast-lift-reduction': {
    en: 'A lift with implants, a lift without implants, a reduction, and implant removal with a lift are different operations. The quote names which one applies.',
    es: 'Una pexia con implantes, una pexia sin implantes, una reducción y una explantación con pexia son cirugías distintas. La cotización dice cuál aplica.',
  },
  rhinoplasty: {
    en: 'A cosmetic plan, a functional plan, or both, and whether this is a first operation or a revision, are decided at the consultation.',
    es: 'Un plan estético, uno funcional o ambos, y si es una primera cirugía o una revisión, se deciden en la valoración.',
  },
  facelift: {
    en: 'How much of the face and neck is included, and whether anything else is planned in the same session, is set at the consultation.',
    es: 'Cuánto del rostro y del cuello entra, y si se planea algo más en el mismo tiempo, se define en la valoración.',
  },
  blepharoplasty: {
    en: 'Upper lids, lower lids, or both, and whether another facial procedure is planned in the same trip, change the quote.',
    es: 'Párpados superiores, inferiores o ambos, y si se planea otro procedimiento facial en el mismo viaje, cambian la cotización.',
  },
  bbl: {
    en: 'A Brazilian butt lift combines liposuction to harvest fat with fat grafting to the buttocks and hips. It is quoted per case. Gluteal implants are a different operation and are also quoted after the consultation.',
    es: 'Un Brazilian butt lift combina la liposucción para obtener la grasa con el injerto en glúteos y caderas. Se cotiza por caso. Los implantes de glúteo son otra cirugía y también se cotizan después de la valoración.',
  },
  'mommy-makeover': {
    en: 'A mommy makeover is a combination and does not have its own price. The combination is what the written quote describes.',
    es: 'El mommy makeover es una combinación y no tiene un precio propio. La combinación es lo que describe la cotización escrita.',
  },
};

const drivers = {
  en: [
    'Technique. The operation that fits your anatomy is not the same work as a different technique with a similar name.',
    'Areas treated. One zone and several zones do not take the same time in the operating room.',
    'Anesthesia, and who provides it.',
    'The facility where the surgery takes place.',
    'The surgeon’s experience and how long the plan needs in the operating room.',
    'Recovery care in Cartagena: visits, garments, medication, and any nursing support that is arranged for you.',
    'Travel. Flights, lodging, a companion, and time away from work sit outside the surgical quote.',
  ],
  es: [
    'La técnica. La cirugía que corresponde a tu anatomía no es el mismo trabajo que otra técnica con un nombre parecido.',
    'Las zonas. Una zona y varias zonas no ocupan el mismo tiempo de quirófano.',
    'La anestesia, y quién la pone.',
    'La clínica donde se opera.',
    'La experiencia del cirujano y el tiempo que el plan necesita en quirófano.',
    'La recuperación en Cartagena: controles, faja, medicamentos y la enfermería que se organice para ti.',
    'El viaje. Los tiquetes, el alojamiento, un acompañante y los días sin trabajar quedan fuera de la cotización quirúrgica.',
  ],
};

// Google reviews copied from the directory that syncs Google (reviews.md source).
// Sofia H. is excluded. Texts are verbatim; none of these four ended mid-sentence.
const reviews = [
  {
    name: 'Daniela M.',
    text: 'had chin liposuction with Dr. Fulvio Correa about a year ago, and it was such a great experience from start to finish. I actually traveled to Colombia for the procedure, and after having a few consultations with other places, his team stood out the most and truly for good reason. His recommendations were spot on and made me feel confident I was making the right choice. This was my first surgery, so my anxiety was definitely higher than usual, but Dr. Correa and his team were so kind, patient, and attentive that I felt calm and comfortable the entire time. They made sure I understood everything and created such a reassuring environment during the procedure. A year later, I’m still so happy with my results they look natural and exactly as this is something he prides himself in. I’m truly grateful for how caring and lovely everyone was throughout the entire process. If I ever consider another procedure, they would be the first ones I’d go to. Highly recommend!!!',
  },
  {
    name: 'Joanna K.',
    text: 'I recently had reconstructive abdominal surgery (tummy tuck), 360 lipo, fat transfer, and chin lipo, and I couldn’t be more impressed with the entire experience. After having many consultations locally in the U.S. and Colombia, I chose Dr. Fulvio Correa, and it was the best decision I made. His confidence in his work truly shines through, putting me at ease throughout the process. The travel arrangements were seamless, and the recovery house provided the perfect environment for healing, with 24/7 care and daily massages. The entire team was excellent, from the surgical staff to the nurses who ensured my recovery went smoothly. I’m beyond happy with the results and highly recommend Dr. Fulvio and his team for anyone considering these procedures.',
  },
  {
    name: 'Evie & Ollie',
    text: 'Dr. Fulvio Correa and his staff were fenomenal, my recovery went smooth because of their attention to detail and care, this was a home away from home experience and my results are very profesional and natural looking🤩',
  },
  {
    name: 'Diana T.',
    text: 'I can say that I have had a great Experience with the Doctor Fulvio Correa as well as with his team, starting from my consultant Vanessa, my massage girl Isabel, and the rest of the doctors. My experience is been great since day one, they have answered all my inquiries at any time, the process was very easy I traveled and my surgery was already scheduled, I got a package that included the surgery, pre-tests, drainage massages, and a few other stuff and it was the best decision I made to buy everything together. The surgery day I was very nervous and anxious like never in my life and everything came out better than I expected. My body is still inflamed and I am still recovering but I will definitely recommend anyone who wants to look better to try Dr. Fulvio and his team. They are Amazing !',
  },
];

const practice = read('data/practice.json');

export function procedureCostBlock(procedure) {
  const lang = procedure.lang;
  const es = lang === 'es';
  const note = costNotes[procedure.slug]?.[lang];
  if (!note) return '';
  const href = `/${lang}/book-consultation/?procedure=${procedure.slug}`;
  const headings = {
    'tummy-tuck': {en: 'Tummy tuck cost in Colombia', es: 'Precio de la abdominoplastia en Colombia'},
    'breast-augmentation': {en: 'Breast augmentation cost in Colombia'},
    'breast-lift-reduction': {es: 'Precio de la mastopexia en Colombia'},
    facelift: {es: 'Precio del lifting facial en Colombia'},
    blepharoplasty: {en: 'Eyelid surgery cost in Colombia', es: 'Precio de la blefaroplastia en Colombia'},
  };
  const heading = headings[procedure.slug]?.[lang] || (es ? 'De qué depende el costo' : 'What drives the cost');
  const lead = es
    ? 'Este consultorio no publica el precio de la cirugía. La cifra exacta se escribe después de la valoración, virtual o presencial.'
    : 'This practice does not publish a surgery price. The exact figure is written after a virtual or in-person consultation.';
  const fee = es
    ? `La valoración cuesta ${CONSULT.es}. Esa tarifa no es un precio de cirugía.`
    : `The consultation fee is ${CONSULT.en}. That fee is not a surgery price.`;
  const items = `<ul class="question-list">${drivers[lang].map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const cta = es ? 'Agendar la valoración' : 'Book the valuation';
  return `<section id="estimated-cost"><h2>${heading}</h2><p>${esc(lead)}</p><p>${esc(note)}</p>${items}<p>${esc(fee)}</p><p><a href="${href}">${cta}</a></p></section>`;
}

export function googleReviewsHtml(lang) {
  const es = lang === 'es';
  const items = reviews.map(r => `<article><p class="small-label">Google review</p><h3>${esc(r.name)}</h3><p class="review-stars"><span aria-hidden="true">★★★★★</span> ${es ? '5 estrellas' : '5 stars'}</p><p>${esc(r.text)}</p></article>`).join('');
  const intro = es
    ? 'Reseñas individuales de Google, copiadas tal como fueron escritas. Cada una describe la experiencia de una persona. No son una lista de precios ni la descripción de un paquete vigente.'
    : 'Individual Google reviews, copied as written. Each one describes one person’s experience. They are not a price list or a description of a current package.';
  return `<section class="section wrap google-reviews" id="google-reviews" data-surface="charcoal"><h2>${es ? 'Reseñas de Google' : 'Google reviews'}</h2><p>${esc(intro)}</p>${items}</section>`;
}

function cta(lang, id) {
  const es = lang === 'es';
  const wa = `https://wa.me/${practice.whatsapp}`;
  return `<div class="pcta"><button type="button" class="button" data-cta="${id}-consult" data-open-contact aria-haspopup="dialog" aria-controls="contact-dialog">${es ? 'Pedir una valoración' : 'Request a valuation'}</button><a class="button light" data-whatsapp="direct" data-event="whatsapp_click" data-location="${id}" data-cta="${id}-whatsapp" href="${wa}" target="_blank" rel="noopener">WhatsApp</a></div>`;
}

const recoveryCopy = {
  en: {
    title: 'Recovery House in Cartagena',
    description: 'Equipped recovery house in Cartagena with 24/7 nursing, airport and clinic transfers, and supplies. The plan is set at your valuation. No package price.',
    h1: 'Recovery house in Cartagena',
    lead: 'For patients who want support after surgery in Cartagena, the practice can arrange an equipped recovery house. It includes 24/7 nursing, transfers between the airport, the clinic, and the house, and supplies. The plan is tailored to each patient and explained at the valuation.',
    whatTitle: 'What can be arranged',
    what: [
      'An equipped house used for recovery, rather than a hotel you have to organize on your own.',
      'Nursing available 24 hours a day, 7 days a week, while you are in that house.',
      'Transfers between the airport, the clinic, and the house.',
      'Supplies for the stay that is arranged for you.',
    ],
    notTitle: 'What this page does not promise',
    not: [
      'There is no published package price. Asking for a package rate will not produce one on this page.',
      'The practice does not promise a number of nights. How long you stay depends on the operation and on how you are recovering, and it is set at the valuation, not in advance.',
      'The practice does not promise a type of room.',
      'The practice does not promise massages, drainage sessions, or any other add-on. If something beyond nursing, transfers, and supplies is appropriate, it is discussed at the valuation. A sentence in an older review is not a current offer.',
      'The surgical quote does not include the house, the transfers, or the supplies. Logistics are arranged separately, at the valuation.',
    ],
    fitTitle: 'How it fits the trip',
    fit: [
      'International patients usually start with a virtual consultation, then an in-person evaluation in Cartagena before any operation. The recovery plan is part of that conversation, together with who will accompany you and when you might fly. Nothing here replaces the surgeon’s clearance to travel.',
      'Surgery is at CAPRI Clinic. Consultations are at the office in Manzanillo del Mar. The transfers in this arrangement connect the airport, the clinic, and the house. They are not a city tour.',
      'The consultation fee is USD 150 / COP 400,000. It is not a surgery price, and it does not include this house. The surgical figure is written after the valuation. You can book that visit from the consultation page.',
    ],
    faqTitle: 'Questions about the recovery house',
    faqs: [
      ['Is there a package price for the recovery house?', 'No. There is no published package price. The house, nursing, transfers, and supplies are arranged for the individual patient and detailed at the valuation.'],
      ['What does the recovery house include?', 'An equipped recovery house, nursing 24 hours a day and 7 days a week, transfers between the airport, the clinic, and the house, and supplies. The exact arrangement is explained at the valuation.'],
      ['How many nights are included?', 'None are promised. The number of nights is not fixed in advance. It is decided at the valuation, based on the procedure and on how you are recovering.'],
      ['Are massages included?', 'No. Massages are not promised. Any care beyond nursing, transfers, and supplies is discussed at the valuation and is not part of a published package.'],
      ['Does the surgical quote include the house?', 'No. Lodging, transfers, and supplies are separate from the surgical quote and are explained at the valuation. There is no package price. The consultation fee is USD 150 / COP 400,000 and is not a surgery price.'],
      ['When will I know the plan?', 'At the valuation, virtual or in person. That is when the team goes through what applies to your case. You can start on WhatsApp or with a valuation request.'],
    ],
  },
  es: {
    title: 'Casa de recuperación en Cartagena',
    description: 'Casa de recuperación en Cartagena: enfermería 24/7, traslados e insumos. El plan se define en la valoración. Sin precio de paquete.',
    h1: 'Casa de recuperación en Cartagena',
    lead: 'Para quien quiere apoyo después de operarse en Cartagena, el consultorio puede organizar una casa de recuperación equipada. Incluye enfermería 24/7, traslados entre el aeropuerto, la clínica y la casa, e insumos. El plan se arma a la medida de cada paciente y se explica en la valoración.',
    whatTitle: 'Qué se puede organizar',
    what: [
      'Una casa equipada para la recuperación, en lugar de un hotel que tengas que resolver por tu cuenta.',
      'Enfermería disponible 24 horas al día, los 7 días de la semana, mientras estás en esa casa.',
      'Traslados entre el aeropuerto, la clínica y la casa.',
      'Insumos para la estadía que se organice para ti.',
    ],
    notTitle: 'Lo que esta página no promete',
    not: [
      'No hay un precio de paquete publicado. Pedir una tarifa de paquete no va a producir una en esta página.',
      'El consultorio no promete un número de noches. Cuánto te quedas depende de la cirugía y de cómo evoluciona la recuperación, y se define en la valoración, no por adelantado.',
      'El consultorio no promete un tipo de habitación.',
      'El consultorio no promete masajes, drenajes ni ningún adicional. Si algo más allá de la enfermería, los traslados y los insumos corresponde, se conversa en la valoración. Una frase en una reseña antigua no es una oferta vigente.',
      'La cotización quirúrgica no incluye la casa, los traslados ni los insumos. La logística se organiza aparte, en la valoración.',
    ],
    fitTitle: 'Cómo encaja en el viaje',
    fit: [
      'Quien viene de otro país suele empezar con una valoración virtual y luego con la evaluación presencial en Cartagena, antes de cualquier cirugía. El plan de recuperación entra en esa conversación, junto con quién te acompaña y cuándo podrías volar. Nada aquí reemplaza el alta del cirujano para viajar.',
      'La cirugía es en la Clínica CAPRI. La valoración es en el consultorio de Manzanillo del Mar. Los traslados de este arreglo conectan el aeropuerto, la clínica y la casa. No son un recorrido turístico.',
      'La valoración cuesta USD 150 / COP 400.000. No es un precio de cirugía y no incluye esta casa. La cifra quirúrgica se escribe después de la valoración. Puedes pedir esa cita en la página de valoración.',
    ],
    faqTitle: 'Preguntas sobre la casa de recuperación',
    faqs: [
      ['¿Hay un precio de paquete para la casa de recuperación?', 'No. No hay un precio de paquete publicado. La casa, la enfermería, los traslados y los insumos se organizan para cada paciente y se detallan en la valoración.'],
      ['¿Qué incluye la casa de recuperación?', 'Una casa de recuperación equipada, enfermería 24 horas al día y 7 días a la semana, traslados entre el aeropuerto, la clínica y la casa, e insumos. El arreglo exacto se explica en la valoración.'],
      ['¿Cuántas noches incluye?', 'No se promete ninguna cifra. El número de noches no se fija por adelantado. Se decide en la valoración, según el procedimiento y según cómo evoluciona tu recuperación.'],
      ['¿Incluye masajes?', 'No. Los masajes no se prometen. Cualquier atención más allá de la enfermería, los traslados y los insumos se conversa en la valoración y no forma parte de un paquete publicado.'],
      ['¿La cotización quirúrgica incluye la casa?', 'No. El alojamiento, los traslados y los insumos van aparte de la cotización quirúrgica y se explican en la valoración. No hay precio de paquete. La valoración cuesta USD 150 / COP 400.000 y no es un precio de cirugía.'],
      ['¿Cuándo voy a conocer el plan?', 'En la valoración, virtual o presencial. Ahí el equipo revisa lo que aplica a tu caso. Puedes empezar por WhatsApp o con una solicitud de valoración.'],
    ],
  },
};

function prose(list) {
  return `<div class="article-body">${list.map(p => `<p>${p}</p>`).join('')}</div>`;
}
function bullets(list) {
  return `<ul class="question-list">${list.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
}
function faqsHtml(items) {
  return items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
}
function faqSchema(items, lang) {
  return {'@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: lang, mainEntity: items.map(([q, a]) => ({'@type': 'Question', name: q, acceptedAnswer: {'@type': 'Answer', text: a}}))};
}

function assertMeta(page, label) {
  if (page.title.length > 40) throw new Error(`${label} title ${page.title.length}>40`);
  if (page.description.length < 110 || page.description.length > 170) throw new Error(`${label} description ${page.description.length}`);
}

export function recoveryPage(lang) {
  const c = recoveryCopy[lang];
  const es = lang === 'es';
  const origin = 'https://fulviocorrea.com';
  const publicPath = es ? '/es/casa-de-recuperacion-cartagena/' : '/recovery-house-cartagena/';
  const body = `<section class="page-hero wrap" data-surface="charcoal"><p class="eyebrow">Cartagena, Colombia</p><h1>${esc(c.h1)}</h1><p class="lead">${esc(c.lead)}</p>${cta(lang, 'recovery-hero')}</section>
<section class="section wrap" data-surface="plum"><h2>${esc(c.whatTitle)}</h2>${bullets(c.what)}</section>
<section class="section wrap" data-surface="black"><h2>${esc(c.notTitle)}</h2>${bullets(c.not)}<div class="article-body"><p><a href="/${lang}/book-consultation/">${es ? 'Agendar una valoración' : 'Book a valuation'}</a> · <a href="/${lang}/international-patients/">${es ? 'Pacientes internacionales' : 'International patients'}</a> · <a href="/${lang}/plastic-surgery-colombia/">${es ? 'Guía de cirugía plástica en Colombia' : 'Guide to plastic surgery in Colombia'}</a></p></div></section>
<section class="section wrap" data-surface="plum"><h2>${esc(c.fitTitle)}</h2>${prose(c.fit.map(esc))}</section>
${googleReviewsHtml(lang)}
<section class="section wrap" data-surface="black" id="faq"><h2>${esc(c.faqTitle)}</h2>${faqsHtml(c.faqs)}</section>
<section class="section wrap" data-surface="charcoal"><h2>${es ? 'Cuéntale al equipo qué necesitas' : 'Tell the team what you need'}</h2><p>${es ? 'El detalle de la casa se arma en la valoración. No hay un paquete con precio cerrado.' : 'The detail of the house is set at the valuation. There is no package with a fixed price.'}</p>${cta(lang, 'recovery-closing')}</section>`;
  const page = {title: c.title, description: c.description, body, updated: TRM_DATE, schemas: [
    {'@context': 'https://schema.org', '@type': 'MedicalWebPage', url: origin + publicPath, name: c.h1, description: c.description, inLanguage: lang, dateModified: TRM_DATE},
    faqSchema(c.faqs, lang),
  ]};
  assertMeta(page, 'recovery ' + lang);
  return page;
}
