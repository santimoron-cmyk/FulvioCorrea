// Authorized procedure ranges (prices.md, 22 Sep 2026 list).
// COP = USD × TRM 3,156.32 (20 Oct 2026, datos.gov.co dataset 32sa-8pi3), rounded UP to the nearest 10,000.
// The consultation fee is the authorized pair USD 150 / COP 400,000 and is not converted.
import {esc, read} from './editorial.mjs';

export const TRM = 3156.32;
export const TRM_DATE = '2026-10-20';
const CONSULT_USD = 150;
const CONSULT_COP = 400000;

export function copFromUsd(usd) {
  return Math.ceil((usd * TRM) / 10000) * 10000;
}

const dots = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const commas = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export function usdRange(min, max) {
  return `USD ${commas(min)}–${commas(max)}`;
}
export function copRange(min, max) {
  return `COP ${dots(copFromUsd(min))}–${dots(copFromUsd(max))}`;
}

// COP figures already checked against the authorized TRM column in prices.md.
const expectedCop = {
  6300: 19890000, 7700: 24310000, 450: 1430000, 550: 1740000,
  9900: 31250000, 12100: 38200000, 675: 2140000, 825: 2610000,
  4950: 15630000, 6050: 19100000, 5400: 17050000, 6600: 20840000,
  7650: 24150000, 9350: 29520000, 6750: 21310000, 8250: 26040000,
  7200: 22730000, 8800: 27780000, 9000: 28410000, 11000: 34720000,
  3600: 11370000, 4400: 13890000, 4050: 12790000, 4950: 15630000,
};
for (const [usd, cop] of Object.entries(expectedCop)) {
  if (copFromUsd(Number(usd)) !== cop) throw new Error(`COP conversion drifted for USD ${usd}`);
}

const rows = [
  {id: 'hd-lipo', usd: [6300, 7700], page: 'liposuction', en: 'HD liposculpture (Liposurg)', es: 'Lipoescultura HD Liposurg'},
  {id: 'retraction', usd: [450, 550], en: 'Retraction technology, per zone', es: 'Tecnología de retracción, por zona'},
  {id: 'lipo-abdominoplasty', usd: [9900, 12100], page: 'tummy-tuck', en: 'Lipoabdominoplasty', es: 'Lipoabdominoplastia'},
  {id: 'arm-addon', usd: [675, 825], page: 'liposuction', en: 'Arm liposuction (add-on to liposuction)', es: 'Lipo de brazos (adicional a la lipo)'},
  {id: 'leg-addon', usd: [675, 825], page: 'liposuction', en: 'Leg liposuction (add-on to liposuction)', es: 'Lipo de piernas (adicional a la lipo)'},
  {id: 'brachioplasty', usd: [4950, 6050], en: 'Brachioplasty (arms)', es: 'Braquioplastia (brazos)'},
  {id: 'thighplasty', usd: [5400, 6600], en: 'Thighplasty', es: 'Cruroplastia'},
  {id: 'aug-preserve', usd: [7650, 9350], page: 'breast-augmentation', en: 'Breast augmentation with Preserve', es: 'Mamoplastia de aumento con Preserve'},
  {id: 'aug', usd: [6750, 8250], page: 'breast-augmentation', en: 'Breast augmentation', es: 'Mamoplastia de aumento'},
  {id: 'pexy-implants', usd: [7650, 9350], page: 'breast-lift-reduction', en: 'Breast lift with implants', es: 'Pexia mamaria con implantes'},
  {id: 'pexy', usd: [7200, 8800], page: 'breast-lift-reduction', en: 'Breast lift without implants', es: 'Pexia mamaria sin implantes'},
  {id: 'reduction', usd: [7650, 9350], page: 'breast-lift-reduction', en: 'Breast reduction / reconstruction', es: 'Reducción y reconstrucción mamaria'},
  {id: 'explant', usd: [7650, 9350], page: 'breast-lift-reduction', en: 'Implant removal and lift, without new implants', es: 'Explantación y pexia mamaria sin implantes'},
  {id: 'gluteal-implants', usd: [6750, 8250], en: 'Gluteal implants', es: 'Gluteoplastia con implantes'},
  {id: 'calf', usd: [6750, 8250], en: 'Calf implants', es: 'Implantes de pantorrillas'},
  {id: 'rhinoplasty', usd: [6750, 8250], page: 'rhinoplasty', en: 'Rhinoplasty', es: 'Rinoplastia'},
  {id: 'facelift', usd: [9000, 11000], page: 'facelift', en: 'Facelift (rhytidectomy)', es: 'Lifting facial (ritidoplastia)'},
  {id: 'bleph', usd: [3600, 4400], en: 'Blepharoplasty', es: 'Blefaroplastia'},
  {id: 'otoplasty', usd: [4050, 4950], en: 'Otoplasty', es: 'Otoplastia'},
];
const byId = Object.fromEntries(rows.map(r => [r.id, r]));

const disclaimer = {
  en: 'This is an approximate estimate based on previous cases; sometimes the fee has been lower and sometimes higher, depending on the case. The real quote always comes after the virtual or in-person consultation. It does not commit the doctor to charge that amount or to operate.',
  es: 'Estimación orientativa basada en experiencias previas; a veces se ha cobrado menos y a veces más según cada caso. La cotización real va siempre después de la consulta virtual o presencial. No compromete al Dr. a cobrar ese monto ni a operar.',
};

const procedureBlocks = {
  liposuction: {
    lines: ['hd-lipo', 'arm-addon', 'leg-addon'],
    note: {
      en: 'Liposuction that is not HD liposculpture is not in this table. It is quoted per case.',
      es: 'La liposucción que no es lipoescultura HD no está en esta tabla. Se cotiza por caso.',
    },
  },
  'tummy-tuck': {
    lines: ['lipo-abdominoplasty'],
    note: {
      en: 'This range is for lipoabdominoplasty only. A mini tummy tuck, or a tummy tuck without liposuction, is quoted per case.',
      es: 'Este rango es solo para lipoabdominoplastia. Una mini abdominoplastia, o una abdominoplastia sin liposucción, se cotiza por caso.',
    },
  },
  'breast-augmentation': {lines: ['aug', 'aug-preserve']},
  'breast-lift-reduction': {lines: ['pexy-implants', 'pexy', 'reduction', 'explant']},
  rhinoplasty: {lines: ['rhinoplasty']},
  facelift: {lines: ['facelift']},
  bbl: {
    quoted: {
      en: 'A Brazilian butt lift (fat transfer to the buttocks) is not in the price table. It is quoted per case. Gluteal implants are a different operation and are listed on the cost page.',
      es: 'El Brazilian butt lift (transferencia de grasa a los glúteos) no está en la tabla de precios. Se cotiza por caso. Los implantes de glúteo son otra cirugía y aparecen en la página de precios.',
    },
  },
  'mommy-makeover': {
    quoted: {
      en: 'A mommy makeover is a combination of procedures and does not have its own range. It is quoted per case. Ranges for procedures that may be combined are on the cost page.',
      es: 'El mommy makeover es una combinación de procedimientos y no tiene un rango propio. Se cotiza por caso. Los rangos de las cirugías que se pueden combinar están en la página de precios.',
    },
  },
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

const aspsUrl = 'https://www.plasticsurgery.org/documents/news/statistics/2024/plastic-surgery-statistics-report-2024.pdf';
const practice = read('data/practice.json');

function lineHtml(id, lang) {
  const row = byId[id];
  const [min, max] = row.usd;
  return `<li><strong>${esc(row[lang])}:</strong> ${usdRange(min, max)} (${copRange(min, max)})</li>`;
}

export function procedureCostBlock(procedure) {
  const spec = procedureBlocks[procedure.slug];
  if (!spec) return '';
  const lang = procedure.lang;
  const es = lang === 'es';
  const href = `/${lang}/plastic-surgery-cost-cartagena/`;
  const lines = spec.lines ? `<ul class="question-list">${spec.lines.map(id => lineHtml(id, lang)).join('')}</ul>` : '';
  const extra = spec.note ? `<p>${esc(spec.note[lang])}</p>` : '';
  const quoted = spec.quoted ? `<p>${esc(spec.quoted[lang])}</p>` : '';
  return `<section id="estimated-cost"><h2>${es ? 'Costo estimado' : 'Estimated cost'}</h2>${lines}${extra}${quoted}<p class="note">${esc(disclaimer[lang])}</p><p><a href="${href}">${es ? 'Ver todos los precios de cirugía plástica en Cartagena' : 'See all plastic surgery costs in Cartagena'}</a></p></section>`;
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

function priceTable(lang) {
  const es = lang === 'es';
  const head = es
    ? '<tr><th scope="col">Procedimiento</th><th scope="col">USD (desde–hasta)</th><th scope="col">COP (desde–hasta)</th></tr>'
    : '<tr><th scope="col">Procedure</th><th scope="col">USD (from–to)</th><th scope="col">COP (from–to)</th></tr>';
  const body = rows.map(row => {
    const [min, max] = row.usd;
    const label = row.page ? `<a href="/${lang}/procedures/${row.page}/#estimated-cost">${esc(row[lang])}</a>` : esc(row[lang]);
    return `<tr><th scope="row">${label}</th><td>${usdRange(min, max)}</td><td>${copRange(min, max)}</td></tr>`;
  }).join('');
  const caption = es
    ? 'Rangos estimados, desde–hasta, en dólares y en pesos colombianos.'
    : 'Estimated ranges, from–to, in US dollars and Colombian pesos.';
  return `<div class="table-scroll" tabindex="0"><table class="price-table"><caption>${esc(caption)}</caption><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
}

const costCopy = {
  en: {
    title: 'Plastic Surgery Colombia Cost',
    description: 'Plastic surgery Colombia cost and Colombia plastic surgery prices in Cartagena. Estimates from USD 3,600. The real quote comes after consultation.',
    h1: 'Plastic surgery in Colombia: cost and prices',
    lead: 'These are estimated from–to ranges for surgery with Dr. Fulvio Correa in Cartagena. They are a planning aid for people comparing plastic surgery Colombia cost and Colombia plastic surgery prices. They are not a quote.',
    readTitle: 'How to read this table',
    read: [
      'Each row is a from–to range in US dollars and in Colombian pesos. The dollar figures are the authorized ranges. Pesos use the official TRM of 20 October 2026, COP 3,156.32 per US dollar (datos.gov.co, dataset 32sa-8pi3), rounded up to the nearest 10,000 pesos. A later TRM changes the peso figure. The dollar range is the one to compare until the office issues a new table.',
      `A consultation is USD ${commas(CONSULT_USD)} / COP ${dots(CONSULT_COP)}. That pair is the authorized fee. It is not converted at the TRM, and it is not a surgery price.`,
      'The lowest figure in the table, USD 450–550, is retraction technology per zone. It is not the starting price of a full operation. Among the operations listed on their own, eyelid surgery starts at USD 3,600.',
    ],
    caseTitle: 'Quoted per case, with no range in this table',
    case: [
      'Three requests do not have a row, so this page does not invent a price for them. A mommy makeover is a combination, and the combination is what sets the fee. A Brazilian butt lift (liposuction with fat transfer to the buttocks) is quoted per case. Liposuction that is not HD liposculpture is also quoted per case. Gluteal implants are a different operation and do have a row above.',
      'If your plan is one of those three, the number you can use is the one written after your consultation. The ranges for procedures that might be part of a combination are in the table so you can see the pieces. Adding the pieces together is not the price of the combination.',
    ],
    factorTitle: 'What usually changes the price',
    factors: [
      'The operation itself. A single procedure and a combination do not take the same time in the operating room.',
      'Who is in the room. The surgeon’s fee, the anesthesia, and the facility are different services. This table does not say that any of them is included. The written quote is where they are named.',
      'Devices, when the plan uses them. Breast augmentation uses an implant. The quote should say whether that implant is included. This table does not.',
      'Tests, the garment, medication, and how many visits you have while you are still in Cartagena. Each one is either in the quote or it is not. Nothing here asserts that they are included.',
      'Your own case. Previous patients have sometimes been charged less than these ranges and sometimes more.',
      'What is not surgery. Flights, lodging, a companion’s ticket, transfers, supplies, and time away from work sit outside these ranges. Care you might need after you fly home is also outside them.',
    ],
    usTitle: 'A note on prices in the United States',
    us: [
      `People often ask whether surgery in Cartagena costs less than at home. The honest answer is that these two numbers are not the same kind of bill. The American Society of Plastic Surgeons, in its <a href="${aspsUrl}">2024 plastic surgery statistics report</a>, publishes surgeon/physician fee ranges for ASPS member surgeons in the United States. Examples from that report: abdominoplasty USD 8,000–13,500, rhinoplasty USD 7,500–12,500, facelift USD 12,000–19,000, and breast augmentation USD 4,575–8,000. The report presents those figures as a projected range of surgeon fees, and it discusses anesthesia costs and operating-room fees separately.`,
      'Some of those U.S. surgeon-fee ranges overlap the estimates on this page. Breast augmentation is one example: the Cartagena estimate of USD 6,750–8,250 sits inside a U.S. surgeon-fee range that starts lower. A lipoabdominoplasty here is not the same operation as the ASPS abdominoplasty line. This page does not claim a percentage saving, and it does not publish a U.S. total cost. Compare a written quote with a written quote.',
    ],
    houseTitle: 'Recovery in Cartagena is arranged separately',
    house: 'Procedure ranges on this page do not include lodging, transfers, or supplies. Patients who want that support can have an equipped recovery house arranged, with 24/7 nursing, transfers between the airport, the clinic, and the house, and supplies. The plan is tailored at the valuation. There is no package price, and the practice does not promise a number of nights, a type of room, or massages.',
    faqTitle: 'Questions about cost',
    faqs: [
      ['Are these plastic surgery prices in Colombia final?', disclaimer.en],
      ['Why are prices shown in dollars and in pesos?', 'The authorized ranges are in US dollars. Pesos on this page use the official TRM of 20 October 2026, COP 3,156.32 per dollar, rounded up to the nearest 10,000 pesos. The consultation fee stays USD 150 / COP 400,000 and is not converted at that rate.'],
      ['What usually changes the price?', 'The procedure, whether operations are combined, anesthesia, the facility, any implant or device, tests, garments, medication, and the visits while you are in Cartagena. The written quote says which of those are included. Flights, lodging, and transfers are separate. The individual case can also come in below or above the range.'],
      ['How do these compare with prices in the United States?', 'ASPS publishes 2024 surgeon/physician fee ranges for its members, for example abdominoplasty USD 8,000–13,500 and rhinoplasty USD 7,500–12,500. Those are surgeon fees, not a total bill, and some of them overlap the estimates here. This page does not state a savings percentage.'],
      ['Why is there no mommy makeover, BBL, or non-HD liposuction price?', 'They are not in the authorized table. A mommy makeover, a fat-graft Brazilian butt lift, and liposuction that is not HD liposculpture are quoted per case. Gluteal implants are listed separately because they are a different operation.'],
      ['Does the estimate include the recovery house or the flights?', 'No. These ranges do not include lodging, transfers, supplies, or flights. A recovery house can be arranged separately and is explained at the valuation. There is no package price.'],
      ['How do I get a real quote?', 'After a virtual or in-person consultation. The consultation fee is USD 150 / COP 400,000. You can request it on WhatsApp or through the valuation form. The figure in that written quote is the one that applies to you.'],
    ],
  },
  es: {
    title: 'Precios cirugía plástica Colombia',
    description: 'Precios de cirugía plástica en Cartagena, Colombia, con rangos estimados desde USD 3.600. La cotización real se entrega después de la valoración.',
    h1: 'Precios de cirugía plástica en Cartagena',
    lead: 'Estos son rangos estimados, desde–hasta, para cirugía con el Dr. Fulvio Correa en Cartagena. Sirven para orientarse sobre los precios de la cirugía plástica en Colombia. No son una cotización.',
    readTitle: 'Cómo leer esta tabla',
    read: [
      'Cada fila es un rango desde–hasta en dólares y en pesos colombianos. Las cifras en dólares son los rangos autorizados. Los pesos usan la TRM oficial del 20 de octubre de 2026, COP 3.156,32 por dólar (datos.gov.co, conjunto 32sa-8pi3), redondeados hacia arriba al siguiente múltiplo de 10.000 pesos. Si la TRM cambia, cambia el peso. El rango en dólares es el que conviene comparar hasta que el consultorio publique otra tabla.',
      `La valoración cuesta USD ${commas(CONSULT_USD)} / COP ${dots(CONSULT_COP)}. Ese par es la tarifa autorizada. No se convierte con la TRM y no es el precio de una cirugía.`,
      'La cifra más baja de la tabla, USD 450–550, es la tecnología de retracción por zona. No es el precio de entrada de una cirugía completa. Entre las cirugías que tienen fila propia, la blefaroplastia empieza en USD 3.600.',
    ],
    caseTitle: 'Se cotizan por caso: no tienen fila en esta tabla',
    case: [
      'Tres solicitudes no tienen fila, y esta página no les inventa un precio. El mommy makeover es una combinación, y la combinación es lo que define el valor. El Brazilian butt lift (liposucción con transferencia de grasa a los glúteos) se cotiza por caso. La liposucción que no es lipoescultura HD también se cotiza por caso. Los implantes de glúteo son otra cirugía y sí tienen fila arriba.',
      'Si tu plan es uno de esos tres, el número que sirve es el que queda por escrito después de la valoración. Los rangos de las cirugías que a veces se combinan están en la tabla para que se vean las piezas. Sumar las piezas no es el precio de la combinación.',
    ],
    factorTitle: 'Qué suele cambiar el precio',
    factors: [
      'La cirugía en sí. Un solo procedimiento y una combinación no ocupan el mismo tiempo de quirófano.',
      'Quién está en la sala. El honorario del cirujano, la anestesia y la clínica son servicios distintos. Esta tabla no dice que alguno esté incluido. La cotización escrita es donde se nombran.',
      'Los dispositivos, cuando el plan los usa. El aumento de senos usa un implante. La cotización debe decir si ese implante está incluido. Esta tabla no lo dice.',
      'Exámenes, faja, medicamentos y cuántos controles tienes mientras sigues en Cartagena. Cada uno está en la cotización o no está. Nada aquí afirma que estén incluidos.',
      'Tu propio caso. A pacientes anteriores a veces se les ha cobrado menos que estos rangos y a veces más.',
      'Lo que no es cirugía. Tiquetes, alojamiento, el pasaje de un acompañante, traslados, insumos y los días sin trabajar quedan fuera de estos rangos. La atención que pudieras necesitar después de volar a casa también queda fuera.',
    ],
    usTitle: 'Una nota sobre los precios en Estados Unidos',
    us: [
      `Es frecuente preguntar si operarse en Cartagena cuesta menos que en casa. La respuesta honesta es que estos dos números no son el mismo tipo de cuenta. La Sociedad Americana de Cirujanos Plásticos, en su <a href="${aspsUrl}">informe de estadísticas de cirugía plástica 2024</a>, publica rangos de honorarios del cirujano para sus miembros en Estados Unidos. Ejemplos de ese informe: abdominoplastia USD 8.000–13.500, rinoplastia USD 7.500–12.500, lifting facial USD 12.000–19.000 y aumento de senos USD 4.575–8.000. El informe presenta esas cifras como un rango proyectado de honorarios del cirujano, y habla de la anestesia y de los costos de quirófano por separado.`,
      'Algunos de esos rangos de honorarios en Estados Unidos se cruzan con las estimaciones de esta página. El aumento de senos es un ejemplo: la estimación en Cartagena, USD 6.750–8.250, cae dentro de un rango estadounidense que empieza más abajo. Una lipoabdominoplastia aquí no es la misma cirugía que la línea de abdominoplastia de la ASPS. Esta página no afirma un porcentaje de ahorro y no publica un costo total en Estados Unidos. Lo que se compara es una cotización escrita con otra cotización escrita.',
    ],
    houseTitle: 'La recuperación en Cartagena se organiza aparte',
    house: 'Los rangos de esta página no incluyen alojamiento, traslados ni insumos. Quien quiere ese apoyo puede tener una casa de recuperación equipada, con enfermería 24/7, traslados entre el aeropuerto, la clínica y la casa, e insumos. El plan se arma a la medida en la valoración. No hay precio de paquete, y el consultorio no promete un número de noches, un tipo de habitación ni masajes.',
    faqTitle: 'Preguntas sobre el precio',
    faqs: [
      ['¿Estos precios de cirugía plástica en Colombia son definitivos?', disclaimer.es],
      ['¿Por qué hay dólares y pesos?', 'Los rangos autorizados están en dólares. Los pesos de esta página usan la TRM oficial del 20 de octubre de 2026, COP 3.156,32 por dólar, redondeados hacia arriba a 10.000 pesos. La valoración se mantiene en USD 150 / COP 400.000 y no se convierte con esa tasa.'],
      ['¿Qué suele cambiar el precio?', 'El procedimiento, si se combinan cirugías, la anestesia, la clínica, un implante o dispositivo, los exámenes, la faja, los medicamentos y los controles mientras estás en Cartagena. La cotización escrita dice cuáles de esos están incluidos. Los tiquetes, el alojamiento y los traslados van aparte. El caso individual también puede quedar por debajo o por encima del rango.'],
      ['¿Cómo se comparan con los precios en Estados Unidos?', 'La ASPS publica rangos de honorarios de cirujano de 2024 para sus miembros, por ejemplo abdominoplastia USD 8.000–13.500 y rinoplastia USD 7.500–12.500. Son honorarios del cirujano, no una cuenta total, y algunos se cruzan con las estimaciones de aquí. Esta página no afirma un porcentaje de ahorro.'],
      ['¿Por qué no hay precio de mommy makeover, BBL ni liposucción que no sea HD?', 'No están en la tabla autorizada. El mommy makeover, el Brazilian butt lift con grasa y la liposucción que no es lipoescultura HD se cotizan por caso. Los implantes de glúteo sí aparecen, porque son otra cirugía.'],
      ['¿La estimación incluye la casa de recuperación o los tiquetes?', 'No. Estos rangos no incluyen alojamiento, traslados, insumos ni tiquetes. La casa de recuperación se puede organizar aparte y se explica en la valoración. No hay precio de paquete.'],
      ['¿Cómo obtengo una cotización real?', 'Después de una valoración virtual o presencial. La valoración cuesta USD 150 / COP 400.000. Puedes pedirla por WhatsApp o en el formulario. La cifra de esa cotización escrita es la que aplica a tu caso.'],
    ],
  },
};

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
      'The procedure ranges on the cost page do not include the house, the transfers, or the supplies. Logistics are arranged separately from the surgical estimate.',
    ],
    fitTitle: 'How it fits the trip',
    fit: [
      'International patients usually start with a virtual consultation, then an in-person evaluation in Cartagena before any operation. The recovery plan is part of that conversation, together with who will accompany you and when you might fly. Nothing here replaces the surgeon’s clearance to travel.',
      'Surgery is at CAPRI Clinic. Consultations are at the office in Manzanillo del Mar. The transfers in this arrangement connect the airport, the clinic, and the house. They are not a city tour.',
      'Estimated surgery ranges, and the consultation fee of USD 150 / COP 400,000, are on the cost page. Those figures and this house are different decisions.',
    ],
    faqTitle: 'Questions about the recovery house',
    faqs: [
      ['Is there a package price for the recovery house?', 'No. There is no published package price. The house, nursing, transfers, and supplies are arranged for the individual patient and detailed at the valuation.'],
      ['What does the recovery house include?', 'An equipped recovery house, nursing 24 hours a day and 7 days a week, transfers between the airport, the clinic, and the house, and supplies. The exact arrangement is explained at the valuation.'],
      ['How many nights are included?', 'None are promised. The number of nights is not fixed in advance. It is decided at the valuation, based on the procedure and on how you are recovering.'],
      ['Are massages included?', 'No. Massages are not promised. Any care beyond nursing, transfers, and supplies is discussed at the valuation and is not part of a published package.'],
      ['Do surgery price ranges include the house?', 'No. The ranges on the cost page are procedure estimates. Lodging, transfers, and supplies are separate and are not included in those figures.'],
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
      'Los rangos de la página de precios no incluyen la casa, los traslados ni los insumos. La logística se organiza aparte de la estimación quirúrgica.',
    ],
    fitTitle: 'Cómo encaja en el viaje',
    fit: [
      'Quien viene de otro país suele empezar con una valoración virtual y luego con la evaluación presencial en Cartagena, antes de cualquier cirugía. El plan de recuperación entra en esa conversación, junto con quién te acompaña y cuándo podrías volar. Nada aquí reemplaza el alta del cirujano para viajar.',
      'La cirugía es en la Clínica CAPRI. La valoración es en el consultorio de Manzanillo del Mar. Los traslados de este arreglo conectan el aeropuerto, la clínica y la casa. No son un recorrido turístico.',
      'Los rangos estimados de cirugía, y la valoración de USD 150 / COP 400.000, están en la página de precios. Esas cifras y esta casa son decisiones distintas.',
    ],
    faqTitle: 'Preguntas sobre la casa de recuperación',
    faqs: [
      ['¿Hay un precio de paquete para la casa de recuperación?', 'No. No hay un precio de paquete publicado. La casa, la enfermería, los traslados y los insumos se organizan para cada paciente y se detallan en la valoración.'],
      ['¿Qué incluye la casa de recuperación?', 'Una casa de recuperación equipada, enfermería 24 horas al día y 7 días a la semana, traslados entre el aeropuerto, la clínica y la casa, e insumos. El arreglo exacto se explica en la valoración.'],
      ['¿Cuántas noches incluye?', 'No se promete ninguna cifra. El número de noches no se fija por adelantado. Se decide en la valoración, según el procedimiento y según cómo evoluciona tu recuperación.'],
      ['¿Incluye masajes?', 'No. Los masajes no se prometen. Cualquier atención más allá de la enfermería, los traslados y los insumos se conversa en la valoración y no forma parte de un paquete publicado.'],
      ['¿Los rangos de cirugía incluyen la casa?', 'No. Los rangos de la página de precios son estimaciones del procedimiento. El alojamiento, los traslados y los insumos van aparte y no están incluidos en esas cifras.'],
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

export function costPage(lang) {
  const c = costCopy[lang];
  const es = lang === 'es';
  const costHref = `/${lang}/plastic-surgery-cost-cartagena/`;
  const houseHref = `/${lang}/recovery-house-cartagena/`;
  const guideHref = `/${lang}/plastic-surgery-colombia/`;
  const intlHref = `/${lang}/international-patients/`;
  const body = `<section class="page-hero wrap" data-surface="charcoal"><p class="eyebrow">Cartagena, Colombia</p><h1>${esc(c.h1)}</h1><p class="lead">${esc(c.lead)}</p><p class="note">${esc(disclaimer[lang])}</p>${cta(lang, 'cost-hero')}</section>
<section class="section wrap" data-surface="plum" id="ranges"><h2>${esc(c.readTitle)}</h2>${prose(c.read.map(esc))}${priceTable(lang)}<p class="note">${esc(disclaimer[lang])}</p><p>${es ? 'Valoración' : 'Consultation'}: USD ${commas(CONSULT_USD)} / COP ${dots(CONSULT_COP)}.</p></section>
<section class="section wrap" data-surface="black" id="per-case"><h2>${esc(c.caseTitle)}</h2>${prose(c.case.map(esc))}</section>
<section class="section wrap" data-surface="charcoal" id="what-changes-price"><h2>${esc(c.factorTitle)}</h2>${bullets(c.factors)}</section>
<section class="section wrap" data-surface="plum" id="united-states"><h2>${esc(c.usTitle)}</h2>${prose(c.us)}</section>
<section class="section wrap" data-surface="black"><h2>${esc(c.houseTitle)}</h2><div class="article-body"><p>${esc(c.house)}</p><p><a href="${houseHref}">${es ? 'Casa de recuperación en Cartagena' : 'Recovery house in Cartagena'}</a> · <a href="${intlHref}">${es ? 'Pacientes internacionales' : 'International patients'}</a> · <a href="${guideHref}">${es ? 'Guía de cirugía plástica en Colombia' : 'Guide to plastic surgery in Colombia'}</a></p></div></section>
${googleReviewsHtml(lang)}
<section class="section wrap" data-surface="plum" id="faq"><h2>${esc(c.faqTitle)}</h2>${faqsHtml(c.faqs)}</section>
<section class="section wrap" data-surface="charcoal"><h2>${es ? 'Pide la cotización real' : 'Ask for the real quote'}</h2><p>${es ? 'La tabla de arriba es una estimación. La cifra que vale es la que queda por escrito después de la valoración.' : 'The table above is an estimate. The figure that applies is the one written down after your consultation.'}</p>${cta(lang, 'cost-closing')}</section>`;
  const page = {title: c.title, description: c.description, body, updated: TRM_DATE, schemas: [
    {'@context': 'https://schema.org', '@type': 'MedicalWebPage', url: 'https://fulviocorrea.com' + (es ? '/es/precios-cirugia-plastica-cartagena/' : '/plastic-surgery-cost-cartagena/'), name: c.h1, description: c.description, inLanguage: lang, dateModified: TRM_DATE},
    faqSchema(c.faqs, lang),
  ]};
  // MedicalWebPage url above is the public URL. The build route is still /en/ or /es/ plus the English slug;
  // audit rewrites /en/ to the root and the Spanish slug via routes.mjs. Keep schema on the public URL.
  assertMeta(page, 'cost ' + lang);
  void costHref;
  return page;
}

export function recoveryPage(lang) {
  const c = recoveryCopy[lang];
  const es = lang === 'es';
  const origin = 'https://fulviocorrea.com';
  const publicPath = es ? '/es/casa-de-recuperacion-cartagena/' : '/recovery-house-cartagena/';
  const body = `<section class="page-hero wrap" data-surface="charcoal"><p class="eyebrow">Cartagena, Colombia</p><h1>${esc(c.h1)}</h1><p class="lead">${esc(c.lead)}</p>${cta(lang, 'recovery-hero')}</section>
<section class="section wrap" data-surface="plum"><h2>${esc(c.whatTitle)}</h2>${bullets(c.what)}</section>
<section class="section wrap" data-surface="black"><h2>${esc(c.notTitle)}</h2>${bullets(c.not)}<div class="article-body"><p><a href="/${lang}/plastic-surgery-cost-cartagena/">${es ? 'Precios de cirugía plástica en Cartagena' : 'Plastic surgery costs in Cartagena'}</a> · <a href="/${lang}/international-patients/">${es ? 'Pacientes internacionales' : 'International patients'}</a> · <a href="/${lang}/plastic-surgery-colombia/">${es ? 'Guía de cirugía plástica en Colombia' : 'Guide to plastic surgery in Colombia'}</a></p></div></section>
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
