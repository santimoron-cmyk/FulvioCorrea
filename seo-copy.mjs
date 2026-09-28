// Keyword headings and meta descriptions. Titles are the text before
// " | Dr. Fulvio Correa" (20 characters) and must stay within 40 so the
// suffix fits in 60. Descriptions are 120–155 characters.
const homeDescEn = 'Plastic surgery in Cartagena with Dr. Fulvio Correa, member of the Colombian Society of Plastic Surgery (SCCP). In-person or virtual consultation.';
const homeDescEs = 'Cirugía plástica en Cartagena con el Dr. Fulvio Correa, miembro de la Sociedad Colombiana de Cirugía Plástica (SCCP). Valoración presencial o virtual.';
const proceduresDescEn = 'Plastic surgery procedures in Cartagena with Dr. Fulvio Correa: face, breast and body. Each plan starts with an individual consultation.';
const proceduresDescEs = 'Procedimientos de cirugía plástica en Cartagena con el Dr. Fulvio Correa: rostro, mamas y cuerpo. El plan empieza en una valoración individual.';
const aboutDescEn = 'Plastic surgeon in Cartagena, Colombia with 15+ years of experience and 3,000+ procedures. SCCP member focused on breast surgery and body contouring.';
const aboutDescEs = 'Cirujano plástico en Cartagena: más de 15 años de experiencia y más de 3.000 procedimientos. Miembro de la SCCP. Cirugía mamaria y contorno corporal.';
const faqDescEn = 'Questions about plastic surgery in Cartagena: consultations, planning, recovery and travel. Answers from the practice of Dr. Fulvio Correa.';
const faqDescEs = 'Preguntas sobre cirugía plástica en Cartagena: valoración, planificación, recuperación y viaje. Respuestas del consultorio del Dr. Fulvio Correa.';
const resourcesDescEn = 'Patient resources for plastic surgery in Cartagena: consultation checklist, travel notes and questions to prepare before you meet Dr. Fulvio Correa.';
const resourcesDescEs = 'Recursos para pacientes de cirugía plástica en Cartagena: guía de valoración, notas de viaje y preguntas para preparar la cita con el Dr. Fulvio Correa.';
const consultDescEn = 'What to bring to your first plastic surgery consultation in Cartagena: goals, questions about the plan, risks, recovery and follow-up with the practice.';
const consultDescEs = 'Qué llevar a tu primera valoración de cirugía plástica en Cartagena: objetivos, preguntas sobre el plan, riesgos, recuperación y seguimiento.';
const intlDescEn = 'Plan plastic surgery in Cartagena from abroad with Dr. Fulvio Correa: virtual consultation, travel, recovery support and follow-up before you fly.';
const intlDescEs = 'Planifica tu cirugía plástica en Cartagena desde otro país con el Dr. Fulvio Correa: valoración virtual, viaje, recuperación y seguimiento.';

export const seo = {
  en: {
    homeH1: 'Plastic surgery in Cartagena, Colombia',
    homeTitle: 'Plastic Surgery in Cartagena, Colombia',
    homeDesc: homeDescEn,
    proceduresH1: 'Plastic surgery procedures in Cartagena',
    proceduresTitle: 'Surgery Procedures in Cartagena',
    proceduresDesc: proceduresDescEn,
    proceduresH2: 'Procedures offered in Cartagena',
    aboutH1: 'Dr. Fulvio Correa, plastic surgeon in Cartagena, Colombia',
    aboutTitle: 'Plastic Surgeon in Cartagena, Colombia',
    aboutDesc: aboutDescEn,
    faqH1: 'Plastic surgery questions in Cartagena',
    faqTitle: 'Plastic Surgery FAQ, Cartagena',
    faqDesc: faqDescEn,
    resourcesH1: 'Patient resources for surgery in Cartagena',
    resourcesTitle: 'Patient Resources, Cartagena',
    resourcesDesc: resourcesDescEn,
    resourcesH2: 'Guides for your consultation',
    consultH1: 'Preparing your consultation in Cartagena',
    consultTitle: 'Your Consultation in Cartagena',
    consultDesc: consultDescEn,
    intlH1: 'Plastic surgery in Cartagena for international patients',
    blogH2: 'Articles from the practice',
    testimonialsH1: 'Patient stories from Cartagena',
    testimonialsH2: 'Watch patient experiences',
  },
  es: {
    homeH1: 'Cirugía plástica en Cartagena, Colombia',
    homeTitle: 'Cirugía plástica en Cartagena, Colombia',
    homeDesc: homeDescEs,
    proceduresH1: 'Procedimientos de cirugía plástica en Cartagena',
    proceduresTitle: 'Procedimientos en Cartagena',
    proceduresDesc: proceduresDescEs,
    proceduresH2: 'Procedimientos en el consultorio',
    aboutH1: 'Dr. Fulvio Correa, cirujano plástico en Cartagena',
    aboutTitle: 'Cirujano plástico en Cartagena',
    aboutDesc: aboutDescEs,
    faqH1: 'Preguntas de cirugía plástica en Cartagena',
    faqTitle: 'Preguntas frecuentes, Cartagena',
    faqDesc: faqDescEs,
    resourcesH1: 'Recursos de cirugía plástica en Cartagena',
    resourcesTitle: 'Recursos para pacientes, Cartagena',
    resourcesDesc: resourcesDescEs,
    resourcesH2: 'Guías para tu valoración',
    consultH1: 'Prepara tu valoración en Cartagena',
    consultTitle: 'Tu valoración en Cartagena',
    consultDesc: consultDescEs,
    intlH1: 'Cirugía plástica en Cartagena para pacientes internacionales',
    blogH2: 'Artículos del consultorio',
    testimonialsH1: 'Experiencias de pacientes en Cartagena',
    testimonialsH2: 'Ver experiencias de pacientes',
  },
};

export function assertSeoCopy() {
  const bad = [];
  for (const [lang, pack] of Object.entries(seo)) {
    for (const [key, value] of Object.entries(pack)) {
      if (key.endsWith('Title') && value.length > 40) bad.push(`${lang} ${key} title ${value.length}>40`);
      if (key.endsWith('Desc') && (value.length < 120 || value.length > 155)) bad.push(`${lang} ${key} desc ${value.length}`);
    }
  }
  if (bad.length) throw Error('SEO copy length:\n' + bad.join('\n'));
}
