# Dr. Fulvio Correa — primera versión

Sitio editorial original en inglés, orientado a pacientes internacionales, siguiendo el idioma de la web fuente. HTML estático por ruta; sin framework cliente, fuentes remotas, video automático ni plugins pesados.

## Abrir y editar

Requiere Node 20.11+ (Cloudflare usa 22, ver `.nvmrc`). Instalar dependencias con `pnpm install` (o `npm install`), generar con `npm run build` y validar con `npm test`; vista local con `npm start` → http://127.0.0.1:4173. `dist/` es un artefacto generado (no versionado): se borra y se reconstruye en cada build a partir de las fuentes (`content/`, `data/`, `assets/`, `*.mjs`, `style.css`, `theme-luxury.css`, `app.js`…). No editar archivos dentro de `dist/`.

## Build, activos y hosting

- `assets/`: fuente versionada de todas las imágenes, vídeos, fuentes y licencias. El build la copia a `dist/assets/` (misma ruta que la URL `/assets/...`). Los subtítulos `.vtt` se generan desde `content/videos/*.json`.
- El build falla (`BUILD FAILED Missing local assets`) si cualquier referencia `/assets/...` (HTML, CSS `url()`, JSON, Markdown, JSON-LD, OG) no existe en `assets/` con las mismas mayúsculas/minúsculas, o si un archivo supera 25 MiB.
- Modo preview/production y despliegue en Cloudflare Pages: [CLOUDFLARE.md](CLOUDFLARE.md). Publicación de artículos: [PUBLISHING.md](PUBLISHING.md).
- `start-preview.ps1` es solo una comodidad local en Windows; no forma parte del build.

## Arquitectura

- `/`: marca y descubrimiento.
- `/about/`: presentación del doctor.
- `/procedures/` y cinco páginas individuales: liposuction, mommy-makeover, breast-lift-reduction (antes mammoplasty), rhinoplasty y facelift.
- `/ads/{procedure}/`: cinco landing pages independientes, excluidas del sitemap y noindex.
- `/international-patients/`, `/before-after/`, `/resources/`, `/resources/your-consultation/`, `/faq/`, `/book-consultation/`.
- Página 404 independiente.

Before/after no muestra fotografías clínicas ni testimonios. La estructura permite incorporarlos cuando el consultorio confirme autorización, contexto clínico y derechos de uso. Los textos de procedimientos son introductorios; ampliar con contenido revisado por el doctor antes de una campaña SEO extensa.

## Conectar NinjaSuite / HighLevel

`config.json` contiene `leadEndpoint` y `gtmId`, vacíos deliberadamente. No hay acceso a la cuenta CRM ni credenciales. El formulario valida y comunica claramente que esta vista previa NO envía solicitudes. WhatsApp utiliza el enlace verificado en la web oficial. Un clic no constituye una reserva confirmada.

Configurar `leadEndpoint` como endpoint HTTPS propio, nunca un webhook secreto ni token privado en el navegador. El endpoint debe validar entradas, verificar consentimiento, limitar frecuencia, aceptar `Idempotency-Key`, guardar el lead en HighLevel y devolver `{ "accepted": true, "lead_id": "id-real" }` solo tras aceptación durable. Errores deben devolver 4xx/5xx. Mantener secretos de HighLevel en el servidor. Si se utiliza otro origen, configurar CORS para el dominio final.

Campos enviados: name, email, phone, procedure, contact_consent, consent_timestamp, measurement_consent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, gbraid, wbraid, landing_page, referrer, first_touch, last_touch, conversion_page y lead_id. Crear campos personalizados equivalentes en NinjaSuite. Mapear name/email/phone a campos nativos y el resto a campos de atribución; conservar los objetos first_touch y last_touch o desglosarlos en campos adicionales.

La atribución persiste durante la sesión y navegación en esta pestaña; la última campaña cambia solo al llegar nuevos parámetros de campaña. Conserva origen y ruta de landing/referrer y los parámetros permitidos, excluyendo query arbitraria que pueda contener datos personales. No promete atribución entre dispositivos, pestañas ni visitas posteriores. El navegador puede bloquear almacenamiento; en ese caso se mantiene para la página actual. No se guardan nombre/email/teléfono en almacenamiento web.

El widget de Sofía crea leads vía `/api/lead` (eventos `lead_created` y `channel_selected`, opción «Quiero que me llamen»): ver [LEAD-WEBHOOK.md](LEAD-WEBHOOK.md). Eventos dataLayer: consultation_click, whatsapp_click, form_start, form_preview_valid, form_error, generate_lead y contact_channel_selected. generate_lead solo se dispara tras confirmación real del servidor y consentimiento de medición. IDs/data-cta identifican ubicación. No se envían datos de contacto al dataLayer. No hay teléfono verificado ni agenda integrada; eventos phone_click y booking_complete deben añadirse únicamente cuando esas acciones existan. El clic de WhatsApp no permite recuperar atribución completa dentro del CRM: para ello se requiere un canal WhatsApp integrado y un identificador correlacionable del lado servidor.

GTM carga solo tras aceptar medición. Configurar consentimiento dentro de GTM a partir de consent_update; personalización publicitaria permanece denegada. No hay GA4 ni Google Ads activos. Revisar el tratamiento de datos y la política real del consultorio antes de habilitar recepción. Medición de conversiones offline requiere estado real del lead en CRM y una integración posterior con Google Ads.

## Publicación y SEO

El modo de indexación lo decide `site-env.mjs` (no `config.json`): `npm run build` local = preview (noindex en todas las páginas, robots bloqueado); Cloudflare Pages en la rama `main` = production (indexable) salvo que se defina `SITE_ENV=preview`. Detalles en [CLOUDFLARE.md](CLOUDFLARE.md). `origin` en `config.json` es el dominio canónico (https://fulviocorrea.com.co). Ads permanece noindex. No se modificó fulviocorrea.com.co ni su DNS.

Metadatos y contenido presentes en HTML, breadcrumbs y Physician JSON-LD, FAQ JSON-LD solo donde las preguntas son visibles. La estructura favorece lectura por buscadores y sistemas de IA, pero no garantiza rankings ni inclusión en respuestas de IA.

## Performance y aceptación

CSS/JS pequeños; imágenes locales con dimensiones reservadas; hero prioritario; imagen inferior lazy; fuentes del sistema; sin trackers por defecto; movimiento reducido respetado. Esto es una base de performance, no una certificación Core Web Vitals. Medir en el dominio final con PageSpeed/Lighthouse móvil y CrUX cuando haya tráfico. Objetivos p75: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1. Repetir medición al activar GTM y CRM.

Antes de campañas: probar envío real con una cuenta autorizada, comprobar un único lead por solicitud y deduplicación de reintentos, campos first/last touch, consentimiento, fallos y conversiones; revisar copy clínico, activos y política de privacidad con el consultorio.

## Fuentes

Consultadas 25 septiembre 2026: https://fulviocorrea.com.co/ y https://fulviocorrea.com.co/plastic-surgery-colombia-cartagena-liposuction. Se verificaron nombres de procedimientos, ubicación, consultas virtuales/presenciales y orientación internacional. Se omitieron cifras de experiencia inconsistentes, acreditaciones no contrastadas, promesas clínicas, resultados y testimonios. La referencia https://rejuvita.cmsmasters.studio/main/ se utilizó solo para orientación editorial; no se copiaron assets ni código.

## Verificación realizada

20 páginas generadas; 377 referencias locales comprobadas; un H1 por página; IDs únicos; JSON-LD válido; sintaxis JS válida. Prueba de atribución con captura, persistencia entre páginas, primer/último contacto y cambio de campaña: correcta (`node tracking-test.mjs`). Revisión visual de home en escritorio y 390 px. Formulario completado con datos ficticios: mensaje de vista previa sin envío confirmado. No se ha medido Lighthouse/CrUX ni probado un CRM real.

## Activos

- dr-fulvio-correa-plastic-surgeon-cartagena-1200.webp (66.9 KB, with 480 and 768 variants): studio portrait of Dr. Fulvio Correa in black scrubs. Replaces the earlier staff-page portrait from https://fulviocorrea.com.co/plastic-surgery-colombia-cartagena-staff.
- woman-side-profile-portrait.webp (17.2 KB): imagen editorial de perfil femenino del bloque Rhinoplasty en la home oficial. Original: https://assets.cdn.filesafe.space/Dsw5TTvdJGEKvFmjzgDD/media/66e056b2e4a0ae38ebafd4ec.jpeg

Se utilizaron versiones WebP del CDN existente. No se encontró licencia de reutilización explícita; confirmar derechos para la publicación definitiva. No representan resultados clínicos.

## Estado de publicación

La publicación privada no pudo completarse: los scripts site-workflow.mjs y set-project-id.mjs indicados por Sites no están disponibles en esta instalación. Hay una inscripción de Site sin versión publicada; su ID se conserva en .openai/hosting.json. No hay URL pública desplegada. La vista local está en http://127.0.0.1:4173 mientras el servidor esté activo; para reabrir, ejecutar npm start.


## Globo de contacto de Sofía

Sofía es la asistente virtual del chat, no una integrante del equipo. No aparece en la sección de equipo ni en el schema de personas.

Disponible en todas las páginas EN/ES: nombre, teléfono internacional, procedimiento y «Otro»; después WhatsApp, Instagram, SMS y Facebook. Configuración, límites de captura y pruebas en [CONTACT-WIDGET.md](CONTACT-WIDGET.md). Facebook usa el perfil facilitado por el propietario, pero la recepción de conversaciones en NinjaSuite sigue pendiente de revisar en el CRM.


## Antes y después

La home y About incorporan un bloque de filosofía de dos columnas; `/en/before-after/` y `/es/before-after/` son las páginas de galería. Los comparadores se activan desde `data/results.json` únicamente con autorización general y por caso. El archivo contiene `_itemSchema` como referencia de edición, nunca se publica como caso. Añadir imágenes a `assets/` (las dimensiones se leen del archivo; `data/images.json` puede fijarlas explícitamente); usar fotografías alineadas de la misma persona con encuadre y dimensiones compatibles. Completar textos EN/ES, procedimiento y tiempo transcurrido solo con datos confirmados. Sin pares autorizados se muestra el retrato real del doctor en filosofía, y la página de galería ofrece orientación sin inventar resultados; permanece noindex. El deslizador funciona con ratón, tacto y flechas del teclado.
