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

const updated = '2026-10-09';

// Body copy may include [label](/path) or [label](https://…) links. Everything else is escaped.
function rich(s) {
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0, html = '', m;
  const src = String(s);
  while ((m = re.exec(src))) {
    html += esc(src.slice(last, m.index));
    const href = m[2];
    if (/^\/(?!\/)/.test(href) || href.startsWith('https://')) {
      const external = href.startsWith('https://');
      html += `<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${esc(m[1])}</a>`;
    } else html += esc(m[0]);
    last = m.index + m[0].length;
  }
  return html + esc(src.slice(last));
}
const prose = list => `<div class="article-body">${list.map(p => `<p>${rich(p)}</p>`).join('')}</div>`;
const bullets = list => `<ul class="question-list">${list.map(x => `<li>${rich(x)}</li>`).join('')}</ul>`;

const copy = {
  en: {
    title: 'Plastic Surgery in Colombia: 2026 Guide',
    description: 'Plastic surgery in Colombia, 2026: what drives cost, how to verify a surgeon and clinic, and how to plan the stay in Cartagena.',
    eyebrow: 'Cartagena, Colombia',
    h1: 'Plastic surgery in Colombia in 2026',
    lead: 'People looking for plastic surgery in Colombia in 2026 usually want four answers: why patients travel here, what actually changes a quote, how to check a surgeon and a clinic, and how many days to plan. This page answers those from the practice in Cartagena. It is education, not a promise of a result, and it does not list prices.',
    cta: 'Request a virtual consultation',
    whyTitle: 'Why patients consider Colombia',
    why: [
      'Colombia is one of the busiest countries in the world for aesthetic surgery. The [Colombian Society of Plastic Surgery (SCCP)](https://cirugiaplastica.org.co/en-2024-aumentaron-10-los-procedimientos-esteticos-quirurgicos-y-no-quirurgicos-en-colombia/), summarizing the 2024 ISAPS global survey, reported 321,408 aesthetic surgical procedures in the country that year, within 490,944 aesthetic procedures in total. Surgeons in Colombia said that on average 30 percent of their patients came from somewhere else, most often the United States, Spain and Canada. [ISAPS](https://www.isaps.org/discover/about-isaps/global-statistics/global-survey-2024-full-report-and-press-releases/) lists Colombia among the countries with the highest share of foreign patients. Those figures are what surgeons reported. They are not a census, and volume is not a quality ranking.',
      'The operations people ask about most often in this office are [breast augmentation](/en/procedures/breast-augmentation/), [breast lift and reduction](/en/procedures/breast-lift-reduction/), [tummy tuck](/en/procedures/tummy-tuck/), [mommy makeover](/en/procedures/mommy-makeover/) and [rhinoplasty](/en/procedures/rhinoplasty/). Whether any of them belongs in your plan is decided in consultation. Cartagena adds a practical detail: an international airport and direct flights from several cities in the United States. A shorter travel day helps after surgery. It is not a reason to fly before your own surgeon clears you. Visitor counts and routes live in the [Cartagena data report](/en/blog/plastic-surgery-medical-tourism-cartagena-colombia/), so the numbers stay in one place.',
    ],
    chooseTitle: 'Safety, and how to verify a surgeon',
    chooseIntro: 'There is no official ranking of plastic surgeons in Colombia. A flattering phrase in a search result is a preference, not a registry. A safer way to choose is to check facts you can verify, then decide in consultation whether the surgeon and the plan fit you.',
    credTitle: 'Credentials you can look up',
    creds: [
      'Specialist training in plastic, reconstructive and aesthetic surgery, rather than a short course in a single operation. The [SCCP](https://cirugiaplastica.org.co/) describes itself as the scientific society of plastic surgeons trained in academic programs recognized by universities in Colombia or abroad.',
      'Membership you can look up. The SCCP publishes a [surgeon directory](https://cirugiaplastica.org.co/buscar-cirujano/). Dr. Correa’s [SCCP profile](https://cirugiaplastica.org.co/author/correa-vitola-fulvio-alexander/) is public. Membership is something you can confirm. It is not a promise of a particular result.',
      'Registration in [ReTHUS](https://www.minsalud.gov.co/salud/PO/paginas/registro-unico-nacional-del-talento-humano-en-salud-rethus.aspx), the national registry of health professionals kept by the Colombian Ministry of Health. The Ministry says that registration is how a person is understood to be authorized to practice a health profession under Law 1164 of 2007. A social-media following is not that registry.',
    ],
    clinicTitle: 'The clinic, not only the surgeon',
    clinic: 'Ask where the operation will take place, who provides the anesthesia, and which services are currently authorized at that address. In Colombia, health facilities are enrolled in REPS, the Ministry of Health’s special registry of health-care providers, and departmental or district health authorities handle habilitación, the authorization to offer a service. The Ministry’s [REPS manual](https://prestadores.minsalud.gov.co/habilitacion/ayudas/Manual_HABILITACION_prestadores_novedades.pdf) describes that registry. Ask to see the current authorization for the surgical service rather than judging a clinic by a photograph of the lobby. The [CDC](https://wwwnc.cdc.gov/travel/page/medical-tourism) also points travelers toward facility accreditation lists, and it says accreditation is not a promise of a good outcome. [ASPS](https://www.plasticsurgery.org/news/briefing-papers/briefing-paper-cosmetic-surgery-tourism), in its briefing on cosmetic surgery tourism, tells patients to verify the surgeon and the facility, and to agree on follow-up before they travel.',
    flagTitle: 'Red flags',
    flags: [
      'A promise that the result is certain, or that you will look like someone else’s photograph.',
      'Pressure to pay or to reserve a date before anyone has examined you.',
      'Reluctance to discuss risks, alternatives, or what happens if you need care after you fly home.',
      'No clear answer about who operates, who gives the anesthesia, and where you are seen the next day.',
    ],
    flagNote: '[ISAPS](https://www.isaps.org/discover/patients-home/considering-your-procedure-abroad/) asks you to plan carefully, because safety rules differ by country. The [CDC Yellow Book](https://www.cdc.gov/yellow-book/hcp/health-care-abroad/medical-tourism.html) treats the trip as a medical plan: know the surgeon, know the facility, and know how you will be followed after you leave. It also says infection is the most common complication seen in people who travel for medical care, and that flying and surgery each raise the risk of blood clots.',
    costTitle: 'What drives the cost',
    costIntro: 'A quote is not a country average, and this page does not publish prices or ranges. Two people asking about the same operation can receive different figures because the work is not the same. These are the pieces that usually move the number.',
    costItems: [
      'The operation itself. A single procedure and a combination do not take the same time in the operating room. A [mommy makeover](/en/procedures/mommy-makeover/) that pairs a [tummy tuck](/en/procedures/tummy-tuck/) with breast surgery is a longer anesthetic than either one alone.',
      'Who is in the room. The surgeon’s fee, the anesthesia and the facility are different services. A total with no labels is hard to compare with another office.',
      'Devices, when the plan uses them. [Breast augmentation](/en/procedures/breast-augmentation/) uses an implant. If one is part of the plan, the quote should say whether it is included.',
      'The care around the operation. Tests, the garment, medication, and how many visits you have while you are still in Cartagena are either in the quote or they are not.',
      'What is not surgery. Flights, lodging, a companion’s ticket and time away from work are travel costs. Care you might need after you land is also outside a surgical quote. The [CDC](https://wwwnc.cdc.gov/travel/page/medical-tourism) notes that follow-up for a complication can be costly and may not be covered by insurance at home.',
    ],
    quoteTitle: 'What a written quote should include',
    quote: [
      'Ask for the quote in writing, after someone has reviewed your history and photographs, and read it before you send a deposit. A useful quote names the surgeon, the facility and the anesthesia separately. It says which procedure or procedures it covers, and whether tests, garments, medication and any implant are included. It says how many postoperative visits in Cartagena are included, and who answers questions after you fly home. It states the currency and how long the figure stays valid.',
      'It should not ask you to pay, or to lock a surgery date, before you have been examined. A number given before that examination is not a plan. Nothing on this page is a quotation.',
    ],
    citiesTitle: 'Cartagena, Medellín and Bogotá',
    cities: [
      'These three cities come up together in searches. They are not a ranking. Each has hospitals, plastic surgeons and an international airport. The useful differences are climate, altitude and where this practice actually works.',
      'Cartagena is on the Caribbean coast: hot and humid, which matters in a compression garment and when you are told to stay out of the sun. [ASPS](https://www.plasticsurgery.org/news/briefing-papers/briefing-paper-cosmetic-surgery-tourism) advises against sunbathing, swimming, alcohol and long tours after surgery. This office consults in Manzanillo del Mar and operates at [CAPRI Clinic](/en/capri-clinic/). Direct flights from several U.S. cities are listed in the [data report](/en/blog/plastic-surgery-medical-tourism-cartagena-colombia/).',
      'Medellín is inland, and the weather is milder than the coast. That can make short recovery walks more comfortable. It has its own surgeons and clinics. This practice does not operate there. Choosing Medellín means a different surgeon and a different facility, and the same checks — SCCP, ReTHUS, REPS — still apply.',
      'Bogotá is the capital, on a high plateau. People who are not used to altitude sometimes notice headache or shortness of breath in the first days. Say so in your medical history if that is you. The [CDC Yellow Book](https://www.cdc.gov/yellow-book/hcp/health-care-abroad/medical-tourism.html) notes that aircraft cabins are pressurized to about the outside air at 6,000 to 8,000 feet. Starting already at altitude is a different fact from starting at sea level in Cartagena. It belongs in the consultation. It is not a score for or against a city.',
    ],
    tripTitle: 'A sample stay of 10 to 14 days',
    tripIntro: 'Ten to fourteen days is a planning sketch, not a clearance. The clock that matters for the airline starts at surgery, and you also need the days before it for the examination. The detail, procedure by procedure, is in the guide to [flying after plastic surgery](/en/blog/flying-after-plastic-surgery/). Avianca’s [published waiting periods](https://ayuda.avianca.com/hc/en-us/articles/13090597036315-Are-there-any-travel-restrictions-for-passengers-with-special-medical-conditions) were checked for this update. Your surgeon can ask you to wait longer. Keep the return ticket changeable.',
    steps: [
      ['Day 1 — Arrive', 'Land, go to your lodging and rest. Do not plan surgery for the travel day. Complete [Check-Mig](https://apps.migracioncolombia.gov.co/pre-registro/) before you fly, in the window described below.'],
      ['Day 2 — The examination', 'The in-person consultation, and any tests the team requests, happen before an operation is scheduled. A video call from home does not replace it. The [consultation guide](/en/resources/your-consultation/) lists what is useful to bring.'],
      ['Day 3 — Surgery, if you were cleared', 'Only if the examination the day before supports it. Plan for a companion that first night. Lodging and the rest of the logistics are on the [international patients](/en/international-patients/) page.'],
      ['Days 4–6 — Early recovery', 'Short walks, the first postoperative visit, and rest. This is not the week for the old city, a boat or the beach. ASPS tells patients to skip sun, swimming, alcohol and long tours after surgery.'],
      ['Days 7–10 — Still in Cartagena', 'The CDC Yellow Book says not to fly for 10 days after chest or abdominal surgery. For [rhinoplasty](/en/procedures/rhinoplasty/), Avianca lists 10 days after surgery, so a clearance visit can fall here if your surgeon agrees. Swelling and sun limits are covered in [rhinoplasty in Colombia](/en/blog/rhinoplasty-colombia/).'],
      ['Days 11–14 — When some people fly', 'For [breast augmentation](/en/blog/breast-augmentation-colombia/), a [breast lift](/en/blog/breast-lift-colombia/), liposuction and a [tummy tuck](/en/blog/tummy-tuck-colombia/), Avianca lists 14 days after the operation, plus a medical certificate issued no earlier than 10 days before the flight. If surgery was on day 3, day 14 of the trip is only about 11 days after surgery, so the flight is later. If the treating physician and the airport health authority disagree, Avianca says the health authority’s opinion prevails.'],
      ['Combined surgery', 'A [mommy makeover](/en/procedures/mommy-makeover/), or any plan that joins two or more body procedures, falls under Avianca’s 15-day line, depending on recovery. Read [how long to stay after a mommy makeover](/en/blog/how-long-to-stay-after-mommy-makeover/) before you lock a return date. Ask who answers once you are home, and which signs should not wait.'],
    ],
    visaTitle: 'Visa and travel basics',
    visa: [
      'Rules change, so confirm them on the official page before you buy a ticket. This is a sketch for a short tourist stay, not immigration advice.',
      'U.S. citizens: the [U.S. Department of State](https://travel.state.gov/en/international-travel/travel-advisories/colombia.html) says you do not need a Colombian visa for tourism or business if the stay is 90 days or less, and that the same applies to cumulative stays of 180 days or less in a calendar year. You need a valid U.S. passport. That page says Colombia may deny entry without a return ticket, and it asks you to complete the Check-Mig form between 1 and 72 hours before the flight. Read the current travel advice, including the security section, on the same page. If you also hold Colombian citizenship, that page explains the dual-passport rule.',
      'Canadian citizens: [Canada’s travel advice for Colombia](https://travel.gc.ca/destinations/colombia), updated 6 October 2026, says a tourist visa is not required for stays of up to 90 days and that the immigration officer sets the length of stay. The same page says you must complete Check-Mig from 72 hours to 1 hour before boarding, and that an entry fee is charged on arrival and updated annually. Confirm the current amount there. It is not part of a surgical quote. Customs may ask for a return ticket and proof of funds.',
      'Both nationalities appear on the short-stay exemption list in [Resolution 8558 of 2025](https://cancilleria.gov.co/normograma/compilacion/docs/resolucion_minrelaciones_8558_2025.htm). Recheck the U.S. and Canadian traveler pages before you fly.',
    ],
    expectTitle: 'What international patients can expect',
    expect: [
      'The sequence is ordinary, and slower than a sales page suggests. You start with a virtual conversation and photographs. Many of Dr. Correa’s patients travel from the United States. The in-person visit in Cartagena is where the plan is confirmed or changed. You will have two addresses: the consultation office in Manzanillo del Mar, at CC Ramblas, and surgery at CAPRI Clinic. Confirm which door you are going to before you leave the hotel.',
      'Bring a companion for the first nights, a list of your medications, and the name of a doctor at home who knows you had surgery. Message Sofía to coordinate dates. Medical decisions stay with the surgical team. The [CDC](https://wwwnc.cdc.gov/travel/page/medical-tourism) suggests a pre-travel conversation with your own clinician 4 to 6 weeks before departure, copies of your records, and a follow-up plan arranged before you fly.',
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
      ['Is plastic surgery in Colombia safe?', 'Safety depends on the surgeon, the facility and the plan for your own case, not on the country. ASPS, ISAPS and the CDC advise you to verify training, the clinic, anesthesia and follow-up before you travel. The CDC notes that accreditation is not a promise of a good outcome, and that infection is the most common complication among people who travel for medical care.'],
      ['How do I choose a plastic surgeon in Colombia?', 'Confirm specialist training in plastic surgery, look up membership in the Colombian Society of Plastic Surgery, and use the Ministry of Health ReTHUS registry. Then ask where the operation will take place and which services that facility currently has authorized in REPS. A social-media following is not a credential.'],
      ['Is there an official ranking of plastic surgeons in Colombia?', 'No. There is no official ranking. A flattering phrase in a search result is not a registry. Use the checks above, then decide after a consultation whether that surgeon is the right one for you.'],
      ['How long should I stay in Cartagena after surgery?', 'It depends on the procedure, on how you are healing, and on when your surgeon clears you to fly. Avianca lists 10 days after rhinoplasty, 14 days after breast surgery, liposuction and tummy tuck, and 15 days when two or more body procedures are combined. Those are airline minimums, not a personal clearance. Count the days before surgery as well.'],
      ['What drives the cost of plastic surgery in Colombia?', 'The procedure, whether procedures are combined, operating time, anesthesia, the facility, any implant, tests, garments, medication and the visits included while you are in Cartagena. Flights, lodging and care after you fly home are separate. This page does not publish prices.'],
      ['What should a quote include?', 'A written quote should separate the surgeon, the facility and the anesthesia, name the procedures, say what is included, state the currency and how long the figure is valid, and explain follow-up after you go home. It should come after your case has been reviewed, not before anyone has looked at you.'],
      ['How do Cartagena, Medellín and Bogotá differ?', 'Cartagena is hot, humid and at sea level, and it is where this practice operates. Medellín is inland and milder. Bogotá is the high-altitude capital, which some people feel in the first days. None of that is a ranking of surgeons. Use the same credential checks in any city.'],
      ['Do U.S. or Canadian citizens need a visa?', 'For a short tourist stay, both governments say a visa is not required for up to 90 days. You still need a valid passport, Check-Mig before the flight, and a return plan. Canada’s travel advice also describes an entry fee. Confirm the current rule on the official page before you travel.'],
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
    title: 'Cirugía plástica en Colombia, 2026',
    description: 'Cirugía plástica en Colombia, 2026: de qué depende el costo, cómo verificar cirujano y clínica, y cómo planear la estadía en Cartagena.',
    eyebrow: 'Cartagena, Colombia',
    h1: 'Cirugía plástica en Colombia en 2026',
    lead: 'Quien busca cirugía plástica en Colombia en 2026 suele querer cuatro respuestas: por qué viajan otros pacientes, qué mueve una cotización, cómo revisar al cirujano y a la clínica, y cuántos días reservar. Esta página lo responde desde el consultorio en Cartagena. Es información, no una promesa de resultado, y no publica precios.',
    cta: 'Solicitar valoración virtual',
    whyTitle: 'Por qué algunos pacientes miran a Colombia',
    why: [
      'Colombia está entre los países con más cirugías estéticas del mundo. La [Sociedad Colombiana de Cirugía Plástica (SCCP)](https://cirugiaplastica.org.co/en-2024-aumentaron-10-los-procedimientos-esteticos-quirurgicos-y-no-quirurgicos-en-colombia/), al resumir la encuesta global de ISAPS de 2024, reportó 321.408 cirugías estéticas en el país ese año, dentro de 490.944 procedimientos estéticos en total. Los cirujanos dijeron que, en promedio, el 30 por ciento de sus pacientes venía de otro lugar, sobre todo de Estados Unidos, España y Canadá. [ISAPS](https://www.isaps.org/discover/about-isaps/global-statistics/global-survey-2024-full-report-and-press-releases/) incluye a Colombia entre los países con mayor proporción de pacientes extranjeros. Son respuestas de una encuesta, no un censo, y el volumen no dice nada sobre la calidad de un cirujano.',
      'Las cirugías que más preguntan en este consultorio son el [aumento de senos](/es/procedures/breast-augmentation/), el [levantamiento y la reducción de senos](/es/procedures/breast-lift-reduction/), la [abdominoplastia](/es/procedures/tummy-tuck/), el [mommy makeover](/es/procedures/mommy-makeover/) y la [rinoplastia](/es/procedures/rhinoplasty/). Si alguna entra en tu plan se decide en la valoración. Cartagena suma un dato práctico: un aeropuerto internacional y vuelos directos desde varias ciudades de Estados Unidos. Un viaje más corto ayuda después de una cirugía. No es una razón para volar antes de que tu cirujano te autorice. Las cifras de visitantes y rutas están en el [informe de datos de Cartagena](/es/blog/cirugia-plastica-turismo-medico-cartagena-colombia/).',
    ],
    chooseTitle: 'Seguridad: cómo verificar al cirujano y a la clínica',
    chooseIntro: 'No existe un ranking oficial de cirujanos plásticos en Colombia. Una frase bonita en un buscador describe una preferencia, no un registro. Una forma más segura de elegir es revisar datos que se pueden comprobar y, después, decidir en la valoración si el cirujano y el plan te corresponden.',
    credTitle: 'Credenciales que se pueden verificar',
    creds: [
      'Formación de especialista en cirugía plástica, reconstructiva y estética, no un curso breve de una sola operación. La [SCCP](https://cirugiaplastica.org.co/) se describe como la sociedad científica que agrupa a cirujanos plásticos formados en programas académicos avalados por universidades en Colombia o en el exterior.',
      'Una membresía que se puede buscar. La SCCP publica un [directorio de cirujanos](https://cirugiaplastica.org.co/buscar-cirujano/). El [perfil del Dr. Correa](https://cirugiaplastica.org.co/author/correa-vitola-fulvio-alexander/) es público. La membresía se puede confirmar. No promete un resultado concreto.',
      'Inscripción en el [ReTHUS](https://www.minsalud.gov.co/salud/PO/paginas/registro-unico-nacional-del-talento-humano-en-salud-rethus.aspx), el registro nacional del talento humano en salud del Ministerio de Salud. El Ministerio explica que esa inscripción es la forma en que se entiende que una persona está autorizada para ejercer una profesión de la salud, según la Ley 1164 de 2007. Tener seguidores en redes no es ese registro.',
    ],
    clinicTitle: 'La clínica, no solo el cirujano',
    clinic: 'Pregunta dónde será la cirugía, quién pone la anestesia y qué servicios están habilitados hoy en esa dirección. En Colombia, los prestadores se inscriben en el REPS, el registro especial de prestadores del Ministerio de Salud, y la habilitación la tramitan las secretarías de salud departamentales o distritales. El [manual del REPS](https://prestadores.minsalud.gov.co/habilitacion/ayudas/Manual_HABILITACION_prestadores_novedades.pdf) describe ese registro. Pide ver la autorización vigente del servicio quirúrgico en lugar de juzgar una clínica por la foto del lobby. Los [CDC](https://wwwnc.cdc.gov/travel/page/medical-tourism) también orientan a listas de acreditación de centros, y aclaran que una acreditación no promete un buen resultado. La [ASPS](https://www.plasticsurgery.org/news/briefing-papers/briefing-paper-cosmetic-surgery-tourism), en su documento sobre turismo de cirugía estética, recomienda verificar al cirujano y al centro, y dejar acordado el seguimiento antes de viajar.',
    flagTitle: 'Señales de alerta',
    flags: [
      'La promesa de que el resultado es seguro, o de que vas a quedar como la fotografía de otra persona.',
      'Presión para pagar o para reservar una fecha antes de que alguien te examine.',
      'Poca disposición a hablar de riesgos, alternativas o de qué pasa si necesitas atención después de volar a casa.',
      'Ninguna respuesta clara sobre quién opera, quién anestesia y dónde te ven al día siguiente.',
    ],
    flagNote: '[ISAPS](https://www.isaps.org/discover/patients-home/considering-your-procedure-abroad/) pide planear con calma, porque las reglas de seguridad cambian de un país a otro. El [Libro Amarillo de los CDC](https://www.cdc.gov/yellow-book/hcp/health-care-abroad/medical-tourism.html) trata el viaje para operarse como un plan médico: saber quién es el cirujano, cuál es la clínica y cómo será el seguimiento cuando te vayas. También señala que la infección es la complicación más frecuente en quien viaja para recibir atención, y que el vuelo y la cirugía aumentan, cada uno por su lado, el riesgo de trombos.',
    costTitle: 'De qué depende el costo',
    costIntro: 'Una cotización no es un promedio del país, y esta página no publica precios ni rangos. Dos personas que preguntan por la misma cirugía pueden recibir cifras distintas porque el trabajo no es el mismo. Estas son las piezas que suelen mover el número.',
    costItems: [
      'La cirugía en sí. Un solo procedimiento y una combinación no ocupan el mismo tiempo de quirófano. Un [mommy makeover](/es/procedures/mommy-makeover/) que une una [abdominoplastia](/es/procedures/tummy-tuck/) con cirugía de senos es una anestesia más larga que cualquiera de las dos por separado.',
      'Quién está en el quirófano. El honorario del cirujano, la anestesia y la clínica son servicios distintos. Un total sin desglose es difícil de comparar con otro consultorio.',
      'Los dispositivos, cuando el plan los usa. El [aumento de senos](/es/procedures/breast-augmentation/) usa un implante. Si entra en el plan, la cotización debe decir si está incluido.',
      'Lo que rodea la cirugía. Los exámenes, la faja, los medicamentos y cuántos controles tienes mientras sigues en Cartagena están en la cotización o no están.',
      'Lo que no es la cirugía. Los tiquetes, el alojamiento, el pasaje de quien te acompaña y los días sin trabajar son costos del viaje. La atención que podrías necesitar al aterrizar también queda por fuera. Los [CDC](https://wwwnc.cdc.gov/travel/page/medical-tourism) advierten que el seguimiento de una complicación puede ser costoso y que el seguro de tu país puede no cubrirlo.',
    ],
    quoteTitle: 'Qué debe traer una cotización por escrito',
    quote: [
      'Pídela por escrito, después de que alguien haya revisado tu historia y tus fotografías, y léela antes de enviar un anticipo. Una cotización útil separa al cirujano, la clínica y la anestesia. Dice qué procedimientos cubre, y si los exámenes, la faja, los medicamentos y el implante, si lo hay, están incluidos. Dice cuántos controles en Cartagena entran y quién responde cuando ya volviste a casa. Indica la moneda y hasta cuándo vale la cifra.',
      'No debería pedirte que pagues, ni que dejes fija una fecha de cirugía, antes de que te examinen. Un número dado antes de ese examen no es un plan. Nada en esta página es una cotización.',
    ],
    citiesTitle: 'Cartagena, Medellín y Bogotá',
    cities: [
      'Estas tres ciudades aparecen juntas en las búsquedas. No son un ranking. Cada una tiene hospitales, cirujanos plásticos y un aeropuerto internacional. Las diferencias útiles son el clima, la altitud y el lugar donde trabaja este consultorio.',
      'Cartagena está en la costa del Caribe. Hace calor y hay humedad, y eso importa cuando llevas una faja y cuando te piden evitar el sol. La [ASPS](https://www.plasticsurgery.org/news/briefing-papers/briefing-paper-cosmetic-surgery-tourism) recomienda no tomar sol, no nadar, no beber alcohol y no hacer recorridos largos después de la cirugía, así que la ciudad amurallada y la playa quedan para otro viaje. Este consultorio valora en Manzanillo del Mar y opera en la [Clínica CAPRI](/es/capri-clinic/). El aeropuerto Rafael Núñez tiene vuelos directos desde varias ciudades de Estados Unidos. Las rutas están en el [informe de datos](/es/blog/cirugia-plastica-turismo-medico-cartagena-colombia/).',
      'Medellín está tierra adentro y el clima es más suave que en la costa. Eso puede hacer más cómodas las caminatas cortas de la recuperación. Tiene sus propios cirujanos y sus propias clínicas. Este consultorio no opera allá. Elegir Medellín es otro cirujano y otra clínica, y las mismas verificaciones — SCCP, ReTHUS, REPS — siguen aplicando.',
      'Bogotá es la capital, en un altiplano. Quien no está acostumbrado a la altura a veces nota dolor de cabeza o falta de aire los primeros días. Dícelo en tu historia clínica si te pasa. El [Libro Amarillo de los CDC](https://www.cdc.gov/yellow-book/hcp/health-care-abroad/medical-tourism.html) recuerda que la cabina de un avión se presuriza más o menos como el aire exterior entre 6.000 y 8.000 pies. Empezar ya en altura es un dato distinto de empezar a nivel del mar en Cartagena. Corresponde a la valoración. No es una nota a favor o en contra de una ciudad.',
    ],
    tripTitle: 'Una estadía de ejemplo, de 10 a 14 días',
    tripIntro: 'Diez a catorce días es un esquema para planear, no una autorización. El reloj que le importa a la aerolínea empieza en la cirugía, y además necesitas los días previos para el examen. El detalle, procedimiento por procedimiento, está en la guía de [viajar en avión después de una cirugía plástica](/es/blog/viajar-en-avion-despues-de-cirugia-plastica/). Los [plazos que publica Avianca](https://ayuda.avianca.com/hc/es-es/articles/13090597036315-Existen-restricciones-de-viaje-para-pasajeros-con-condiciones-m%C3%A9dicas-especiales) se revisaron para esta actualización. Tu cirujano puede pedirte que esperes más. Deja el tiquete de regreso flexible.',
    steps: [
      ['Día 1 — Llegas', 'Aterrizas, vas al alojamiento y descansas. No planees la cirugía para el día del viaje. Completa el [Check-Mig](https://apps.migracioncolombia.gov.co/pre-registro/) antes de volar, en la ventana que se describe más abajo.'],
      ['Día 2 — El examen', 'La valoración presencial, y los exámenes que pida el equipo, ocurren antes de agendar la operación. Una videollamada desde casa no la reemplaza. La [guía de valoración](/es/resources/your-consultation/) indica qué conviene llevar.'],
      ['Día 3 — La cirugía, si te autorizaron', 'Solo si el examen del día anterior lo sostiene. Planea que alguien te acompañe esa primera noche. El alojamiento y el resto de la logística están en la página de [pacientes internacionales](/es/international-patients/).'],
      ['Días 4 a 6 — Recuperación temprana', 'Caminatas cortas, el primer control y reposo. Esta no es la semana de la ciudad amurallada, de un bote o de la playa. La ASPS pide evitar el sol, la natación, el alcohol y los recorridos largos después de la cirugía.'],
      ['Días 7 a 10 — Sigues en Cartagena', 'El Libro Amarillo de los CDC dice no volar durante 10 días después de una cirugía de tórax o de abdomen. En una [rinoplastia](/es/procedures/rhinoplasty/), Avianca lista 10 días después de la cirugía, así que un control de alta para el vuelo puede caer aquí si tu cirujano está de acuerdo. La inflamación y el sol se explican en [rinoplastia en Colombia](/es/blog/rinoplastia-colombia/).'],
      ['Días 11 a 14 — Cuando algunas personas vuelan', 'Para un [aumento de senos](/es/blog/aumento-de-senos-colombia/), un [levantamiento de senos](/es/blog/levantamiento-de-senos-colombia/), una liposucción y una [abdominoplastia](/es/blog/abdominoplastia-colombia/), Avianca lista 14 días después de la operación, más un certificado médico expedido como máximo 10 días antes del vuelo. Si la cirugía fue el día 3, el día 14 del viaje son apenas unos 11 días después de operarte, así que el vuelo es más tarde. Si el médico tratante y la autoridad sanitaria del aeropuerto no coinciden, Avianca dice que prevalece la autoridad sanitaria.'],
      ['Cirugías combinadas', 'Un [mommy makeover](/es/procedures/mommy-makeover/), o cualquier plan que junte dos o más procedimientos del cuerpo, cae en la línea de 15 días de Avianca, según cómo evolucione la recuperación. Lee [cuántos días quedarse después de un mommy makeover](/es/blog/cuantos-dias-quedarse-despues-mommy-makeover/) y la [recuperación semana a semana](/es/blog/tiempo-recuperacion-mommy-makeover/) antes de dejar fijo el regreso. Antes de viajar, pregunta quién responde cuando ya estás en casa y qué signos no pueden esperar.'],
    ],
    visaTitle: 'Visa y datos de viaje',
    visa: [
      'Las reglas cambian, así que confírmalas en la página oficial antes de comprar el tiquete. Esto es un esquema para una estadía corta de turismo, no un consejo migratorio.',
      'Ciudadanos de Estados Unidos: el [Departamento de Estado](https://travel.state.gov/en/international-travel/travel-advisories/colombia.html) dice que no necesitas visa colombiana para turismo o negocios si la estadía es de 90 días o menos, y que lo mismo aplica a estadías acumuladas de 180 días o menos en un año calendario. Necesitas un pasaporte estadounidense vigente. Esa página indica que Colombia puede negar el ingreso si no tienes tiquete de regreso, y pide completar el Check-Mig entre 1 y 72 horas antes del vuelo. Lee ahí mismo la recomendación de viaje vigente, incluida la sección de seguridad. Si también tienes nacionalidad colombiana, esa página explica la regla de los dos pasaportes.',
      'Ciudadanos de Canadá: el [aviso de viaje de Canadá para Colombia](https://travel.gc.ca/destinations/colombia), actualizado el 6 de octubre de 2026, dice que no se requiere visa de turismo para estadías de hasta 90 días, que el pasaporte debe estar vigente durante toda la estadía y que el oficial de inmigración fija el plazo, hasta 90 días. La misma página dice que debes completar el Check-Mig desde 72 horas hasta 1 hora antes de abordar, y que al llegar se cobra una tasa de ingreso que se actualiza cada año. Esa tasa no forma parte de la cotización quirúrgica. Confirma el monto vigente, y cualquier exención, en esa página. La aduana puede pedir un tiquete de regreso o de continuación y prueba de fondos.',
      'Ambas nacionalidades están en la lista de exención de visa para corta estancia de la [Resolución 8558 de 2025](https://cancilleria.gov.co/normograma/compilacion/docs/resolucion_minrelaciones_8558_2025.htm) de la Cancillería. Los días prácticos de arriba salen de las páginas para viajeros de Estados Unidos y de Canadá, que son las que conviene volver a mirar.',
    ],
    expectTitle: 'Qué puede esperar quien viene de otro país',
    expect: [
      'La secuencia es ordinaria, y más lenta de lo que sugiere una página de ventas. Empiezas con una conversación virtual y con fotografías. Muchos pacientes del Dr. Correa viajan desde Estados Unidos. La visita presencial en Cartagena es donde el plan se confirma o se cambia. Vas a tener dos direcciones: el consultorio en Manzanillo del Mar, en el CC Ramblas, y la cirugía en la Clínica CAPRI. Confirma a cuál vas antes de salir del hotel.',
      'Lleva a alguien que te acompañe las primeras noches, la lista de tus medicamentos y el nombre de un médico en tu ciudad que sepa que te operaste. Escríbele a Sofía para coordinar fechas. Las decisiones médicas se quedan con el equipo quirúrgico. Los [CDC](https://wwwnc.cdc.gov/travel/page/medical-tourism) sugieren una conversación previa con tu propio médico entre 4 y 6 semanas antes de salir, copias de tu historia y un plan de seguimiento acordado antes de volar.',
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
      ['¿Es segura la cirugía plástica en Colombia?', 'La seguridad depende del cirujano, de la clínica y del plan de tu caso, no del país. La ASPS, ISAPS y los CDC recomiendan verificar la formación, el centro, la anestesia y el seguimiento antes de viajar. Los CDC aclaran que una acreditación no promete un buen resultado, y que la infección es la complicación más frecuente entre quienes viajan para recibir atención médica.'],
      ['¿Cómo elijo un cirujano plástico en Colombia?', 'Confirma la especialización en cirugía plástica, busca la membresía en la Sociedad Colombiana de Cirugía Plástica y consulta el ReTHUS del Ministerio de Salud. Después pregunta dónde será la cirugía y qué servicios tiene hoy habilitados ese centro en el REPS. Tener seguidores en redes no es una credencial.'],
      ['¿Hay un ranking oficial de cirujanos plásticos en Colombia?', 'No. No existe un ranking oficial. Una frase elogiosa en un buscador no es un registro. Usa las verificaciones de arriba y decide en la valoración si ese cirujano es el adecuado para ti.'],
      ['¿Cuántos días hay que quedarse en Cartagena?', 'Depende del procedimiento, de cómo evoluciona la recuperación y de cuándo tu cirujano autoriza el vuelo. Avianca lista 10 días después de una rinoplastia, 14 días después de cirugía de senos, liposucción y abdominoplastia, y 15 días cuando se combinan dos o más procedimientos del cuerpo. Son mínimos de la aerolínea, no una autorización personal. Cuenta también los días previos a la cirugía.'],
      ['¿De qué depende el costo de la cirugía plástica en Colombia?', 'Del procedimiento, de si se combinan cirugías, del tiempo de quirófano, de la anestesia, de la clínica, de un implante si lo hay, de los exámenes, de la faja, de los medicamentos y de los controles incluidos mientras estás en Cartagena. Los tiquetes, el alojamiento y la atención después de volar a casa van aparte. Esta página no publica precios.'],
      ['¿Qué debe incluir una cotización?', 'Una cotización por escrito debe separar al cirujano, la clínica y la anestesia, nombrar los procedimientos, decir qué está incluido, indicar la moneda y hasta cuándo vale la cifra, y explicar el seguimiento cuando regresas. Debe llegar después de revisar tu caso, no antes de que alguien te vea.'],
      ['¿En qué se diferencian Cartagena, Medellín y Bogotá?', 'Cartagena es calurosa, húmeda y está a nivel del mar, y es donde opera este consultorio. Medellín está tierra adentro y tiene un clima más suave. Bogotá es la capital en altura, y algunas personas lo sienten los primeros días. Nada de eso es un ranking de cirujanos. Usa las mismas verificaciones en cualquier ciudad.'],
      ['¿Los ciudadanos de Estados Unidos o de Canadá necesitan visa?', 'Para una estadía corta de turismo, ambos gobiernos dicen que no se requiere visa hasta por 90 días. Igual necesitas un pasaporte vigente, el Check-Mig antes del vuelo y un plan de regreso. El aviso de viaje de Canadá también describe una tasa de ingreso. Confirma la regla vigente en la página oficial antes de viajar.'],
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
  ['https://cirugiaplastica.org.co/en-2024-aumentaron-10-los-procedimientos-esteticos-quirurgicos-y-no-quirurgicos-en-colombia/','SCCP, sobre la encuesta ISAPS 2024 en Colombia'],
  ['https://www.isaps.org/discover/about-isaps/global-statistics/global-survey-2024-full-report-and-press-releases/','ISAPS Global Survey 2024'],
  ['https://www.isaps.org/discover/patients-home/considering-your-procedure-abroad/','ISAPS: considering a procedure abroad'],
  ['https://www.plasticsurgery.org/news/briefing-papers/briefing-paper-cosmetic-surgery-tourism','ASPS briefing paper: cosmetic surgery tourism'],
  ['https://www.cdc.gov/yellow-book/hcp/health-care-abroad/medical-tourism.html','CDC Yellow Book 2026: medical tourism'],
  ['https://wwwnc.cdc.gov/travel/page/medical-tourism','CDC: medical tourism'],
  ['https://cirugiaplastica.org.co/','Sociedad Colombiana de Cirugía Plástica (SCCP)'],
  ['https://cirugiaplastica.org.co/buscar-cirujano/','Directorio de cirujanos de la SCCP'],
  ['https://www.minsalud.gov.co/salud/PO/paginas/registro-unico-nacional-del-talento-humano-en-salud-rethus.aspx','Ministerio de Salud: ReTHUS'],
  ['https://prestadores.minsalud.gov.co/habilitacion/ayudas/Manual_HABILITACION_prestadores_novedades.pdf','Ministerio de Salud: manual REPS'],
  ['https://ayuda.avianca.com/hc/en-us/articles/13090597036315-Are-there-any-travel-restrictions-for-passengers-with-special-medical-conditions','Avianca: viaje tras una condición médica'],
  ['https://travel.state.gov/en/international-travel/travel-advisories/colombia.html','U.S. Department of State: Colombia'],
  ['https://travel.gc.ca/destinations/colombia','Gobierno de Canadá: consejos de viaje, Colombia'],
  ['https://cancilleria.gov.co/normograma/compilacion/docs/resolucion_minrelaciones_8558_2025.htm','Cancillería: Resolución 8558 de 2025'],
  ['https://apps.migracioncolombia.gov.co/pre-registro/','Migración Colombia: Check-Mig'],
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
  const byline = `<p class="post-dates">${es ? 'Actualizado el' : 'Last updated'} <time datetime="${updated}">${updated}</time></p><p class="reviewed">${es ? 'Revisado médicamente por' : 'Medically reviewed by'} Dr. Fulvio Correa · <time datetime="${updated}">${updated}</time></p>`;
  const days = `<div class="article-body">${c.steps.map(([title, text]) => `<h3>${esc(title)}</h3><p>${rich(text)}</p>`).join('')}</div>`;
  const body = `<section class="page-hero wrap" data-surface="charcoal"><p class="eyebrow">${esc(c.eyebrow)}</p><h1>${esc(c.h1)}</h1><p class="lead">${esc(c.lead)}</p>${byline}${cta('colombia-hero')}</section>
<section class="section wrap" data-surface="black" id="why-colombia"><h2>${esc(c.whyTitle)}</h2>${prose(c.why)}<figure>${picture(officeBase, c.officeAlt, 1400, 788)}</figure></section>
<section class="section wrap" data-surface="plum" id="cost"><h2>${esc(c.costTitle)}</h2><div class="article-body"><p>${rich(c.costIntro)}</p></div>${bullets(c.costItems)}<h3>${esc(c.quoteTitle)}</h3>${prose(c.quote)}</section>
<section class="section wrap" data-surface="charcoal" id="safety"><h2>${esc(c.chooseTitle)}</h2><div class="article-body"><p>${rich(c.chooseIntro)}</p></div><h3>${esc(c.credTitle)}</h3>${bullets(c.creds)}<h3>${esc(c.clinicTitle)}</h3>${prose([c.clinic])}<h3>${esc(c.flagTitle)}</h3>${bullets(c.flags)}${prose([c.flagNote])}</section>
<section class="section wrap" data-surface="black" id="cities"><h2>${esc(c.citiesTitle)}</h2>${prose(c.cities)}</section>
<section class="section wrap" data-surface="plum" id="itinerary"><h2>${esc(c.tripTitle)}</h2>${prose([c.tripIntro])}${days}<p><a class="textlink" href="${href('international-patients/')}">${esc(c.links.intl)}<span aria-hidden="true">↗</span></a></p></section>
<section class="section wrap" data-surface="charcoal" id="visa"><h2>${esc(c.visaTitle)}</h2>${prose(c.visa)}</section>
<section class="section wrap" data-surface="black" id="expect"><h2>${esc(c.expectTitle)}</h2>${prose(c.expect)}</section>
<section class="doctor-section wrap section" data-surface="plum"><div class="doctor-photo">${portrait(c.doctorAlt)}<span class="image-signature">Dr. Fulvio Correa</span></div><div class="doctor-copy"><p class="eyebrow">${esc(c.eyebrow)}</p><h2>${esc(c.doctorTitle)}</h2>${prose(c.doctor)}${membershipView(practice, lang)}<p><a class="textlink" href="${href('about/')}">${esc(c.links.about)}<span aria-hidden="true">↗</span></a></p><p><a class="textlink" href="${href('capri-clinic/')}">${esc(c.links.capri)}<span aria-hidden="true">↗</span></a></p></div></section>
<section class="section wrap" data-surface="charcoal"><h2>${esc(c.procTitle)}</h2>${prose([c.procIntro])}<ul class="cluster-links">${procs.map(p => `<li><a href="${href('procedures/' + p.slug + '/')}">${esc(p.name)}</a></li>`).join('')}</ul><h3>${esc(c.readTitle)}</h3><ul class="cluster-links">${guides.map(g => `<li><a href="${href('blog/' + g.slug + '/')}">${esc(g.label)}</a></li>`).join('')}</ul><p class="article-body"><a href="${href('procedures/')}">${es ? 'Ver todos los procedimientos' : 'See every procedure'}</a> · <a href="${href('resources/your-consultation/')}">${esc(c.links.consult)}</a> · <a href="${href('contact/')}">${esc(c.links.contact)}</a></p></section>
<section class="section wrap" data-surface="black" id="faq"><h2>${esc(c.faqTitle)}</h2><div class="article">${c.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>
<section class="section wrap sources" data-surface="plum"><h2>${esc(c.sourcesTitle)}</h2><ul>${sources.map(([url, name]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)}<span aria-hidden="true">↗</span></a></li>`).join('')}</ul></section>
<section class="section wrap" data-surface="charcoal"><h2>${esc(c.closingTitle)}</h2>${prose([c.closing])}${cta('colombia-closing')}</section>`;
  const schemas = [
    {'@context':'https://schema.org','@type':'MedicalWebPage','@id':origin + route + '#webpage',url:origin + route,name:c.h1,description:c.description,inLanguage:lang,dateModified:updated,lastReviewed:updated,reviewedBy:{'@type':'Physician','@id':origin + '/#physician',name:'Dr. Fulvio Correa'},about:{'@type':'MedicalSpecialty',name:es ? 'Cirugía plástica' : 'Plastic surgery'},mainEntity:{'@id':origin + '/#physician'}},
    {'@context':'https://schema.org','@type':'FAQPage',inLanguage:lang,mainEntity:c.faqs.map(([q, a]) => ({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},
  ];
  return {body, title:c.title, description:c.description, schemas, updated};
}
