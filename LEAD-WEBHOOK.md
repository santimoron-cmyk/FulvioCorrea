# Webhook de leads → NinjaSuite (HighLevel)

Actualizado: 27 de septiembre de 2026. Código: `contact-widget.js` (navegador), `functions/api/lead.js` + `server/lead-handler.mjs` + `server/call-due.mjs` (servidor), pruebas `contact-test.mjs`, `call-due-test.mjs` y `lead-test.mjs`.

## Flujo

1. El visitante completa el widget de Sofía (nombre, teléfono con país, procedimiento, consentimiento) y pulsa **Elegir cómo contactar / Choose how to connect** → el navegador envía `POST /api/lead` con `event: "lead_created"` (sin esperar respuesta: los canales se muestran de inmediato).
2. Al elegir un canal (WhatsApp, SMS, Instagram, Facebook) se envía `event: "channel_selected"` con el mismo `lead_id` y teléfono. Se usa `fetch(..., {keepalive:true})` sin `await`: abrir WhatsApp nunca queda bloqueado.
3. **Quiero que me llamen / Call me**: no abre ningún chat. Muestra la franja horaria (Lo antes posible / Mañana 8–12 / Tarde 12–17 / Noche 17–20, hora local del visitante, con su zona horaria visible), envía `channel_selected` con `channel: "call"` y muestra la confirmación «Nuestro equipo te llamará…» solo si el servidor confirma (si falla, pide reintentar o escribir por WhatsApp). El servidor añade `call_due_at` (vencimiento en hora Colombia, listo para el Add Task), `call_due_at_iso` y `call_window_colombia`.
4. La Function valida y reenvía un JSON **plano** al Inbound Webhook (`LEAD_WEBHOOK_URL`, secreto de Cloudflare; nunca en el repositorio). Responde `accepted:true` solo si HighLevel devuelve 2xx.

Editar los datos crea un `lead_id` nuevo; reenviar los mismos datos no duplica. Cada canal se registra una vez por lead (`event_id = <lead_id>-<canal>`; en llamadas `<lead_id>-call-<franja>`). El webhook recibe la cabecera `Idempotency-Key = event_id`.

Protecciones: mismo origen, JSON ≤ 20 KB, honeypot `website`, teléfono E.164, consentimiento obligatorio, idioma/procedimiento/evento/canal/franja en listas permitidas, `Idempotency-Key` = `event_id`, 10 peticiones/min por IP (por instancia), 503 `not_configured` si `LEAD_CAPTURE_ENABLED` ≠ `true` o falta `LEAD_WEBHOOK_URL` (https). Las URLs se guardan sin query string (origen + ruta) para no reenviar datos personales accidentales; UTM y click IDs van en campos propios.

Recorrido (app.js, `localStorage` `fc_journey`, mismo criterio que el first touch: dato propio del sitio, sin datos personales): número de visitas (cada sesión de pestaña nueva cuenta como visita), primera visita y las últimas 30 páginas de los últimos 90 días como `[ruta, título corto, hora]` (ruta sin query string; título = parte antes de « | »). El widget lo envía como `journey` y la Function lo valida y lo convierte en `journey_*` (el JSON crudo no se reenvía).

Atribución (app.js): first touch en `localStorage` 90 días con fecha; last touch en la sesión (cambia solo con nuevos parámetros de campaña); `session.landing_page` = primera página de la sesión. Parámetros: utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, gbraid, wbraid, fbclid.

## Ejemplos exactos (lo que recibe el webhook)

### 1. `lead_created`

```json
{
  "event": "lead_created",
  "event_id": "3f6c2a9e-8d41-4b7a-9c35-2e1f0a7b6d58-created",
  "lead_id": "3f6c2a9e-8d41-4b7a-9c35-2e1f0a7b6d58",
  "received_at": "2026-09-27T21:05:12.310Z",
  "client_timestamp": "2026-09-27T21:05:12.050Z",
  "name": "Jane Smith",
  "full_name": "Jane Smith",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+13055550123",
  "phone_country": "US",
  "phone_country_code": "+1",
  "email": "",
  "procedure": "mommy-makeover",
  "procedure_label": "Mommy Makeover",
  "language": "en",
  "contact_preference": "pending",
  "channel": "",
  "preferred_call_time": "",
  "preferred_call_time_label": "",
  "timezone": "America/New_York",
  "call_due_at": "",
  "call_due_at_iso": "",
  "call_window_colombia": "",
  "summary": "Nuevo lead web (canal pendiente) | Jane Smith | +13055550123 | Procedimiento: Mommy Makeover | Zona horaria: America/New_York | Idioma: EN | Fuente: google / cpc / mommy-makeover-us | Página: /en/procedures/mommy-makeover/ | Lead ID: 3f6c2a9e-8d41-4b7a-9c35-2e1f0a7b6d58",
  "page_url": "https://fulviocorrea.com.co/en/procedures/mommy-makeover/",
  "page_path": "/en/procedures/mommy-makeover/",
  "page_title": "Mommy Makeover in Cartagena | Dr. Fulvio Correa",
  "button_id": "contact-widget-open",
  "form_id": "contact-widget",
  "landing_page": "https://fulviocorrea.com.co/en/ads/mommy-makeover/",
  "referrer": "https://www.google.com/",
  "landing_url_first": "https://fulviocorrea.com.co/en/",
  "referrer_first": "https://l.facebook.com/",
  "attribution_timestamp": "2026-09-20T14:02:11.000Z",
  "utm_source": "google",
  "utm_source_first": "facebook",
  "utm_source_last": "google",
  "utm_medium": "cpc",
  "utm_medium_first": "paid_social",
  "utm_medium_last": "cpc",
  "utm_campaign": "mommy-makeover-us",
  "utm_campaign_first": "awareness-sept",
  "utm_campaign_last": "mommy-makeover-us",
  "utm_term": "mommy makeover colombia",
  "utm_term_first": "",
  "utm_term_last": "mommy makeover colombia",
  "utm_content": "ad-a",
  "utm_content_first": "video-1",
  "utm_content_last": "ad-a",
  "gclid": "EAIaIQobChMI-example",
  "gclid_first": "",
  "gclid_last": "EAIaIQobChMI-example",
  "gbraid": "",
  "gbraid_first": "",
  "gbraid_last": "",
  "wbraid": "",
  "wbraid_first": "",
  "wbraid_last": "",
  "fbclid": "",
  "fbclid_first": "IwAR-example",
  "fbclid_last": "",
  "ga_client_id": "1234567890.1758900000",
  "contact_consent": true,
  "sms_consent": true,
  "consent_version": "contact-consent-2026-09-27",
  "consent_text": "I agree to be contacted by Dr. Fulvio Correa’s team by phone call, SMS and WhatsApp about my inquiry. Message frequency varies; msg & data rates may apply. Consent is not a condition of purchase. Reply STOP to opt out. Privacy policy · SMS terms",
  "consent_timestamp": "2026-09-27T21:05:12.310Z",
  "measurement_consent": "granted",
  "lead_source": "website",
  "crm_operation": "upsert_contact",
  "deduplication_key": "+13055550123"
}
```

### 2. `channel_selected` — WhatsApp

```json
{
  "event": "channel_selected",
  "event_id": "3f6c2a9e-8d41-4b7a-9c35-2e1f0a7b6d58-whatsapp",
  "lead_id": "3f6c2a9e-8d41-4b7a-9c35-2e1f0a7b6d58",
  "received_at": "2026-09-27T21:05:20.480Z",
  "client_timestamp": "2026-09-27T21:05:20.240Z",
  "name": "Jane Smith",
  "full_name": "Jane Smith",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+13055550123",
  "phone_country": "US",
  "phone_country_code": "+1",
  "email": "",
  "procedure": "mommy-makeover",
  "procedure_label": "Mommy Makeover",
  "language": "en",
  "contact_preference": "whatsapp",
  "channel": "whatsapp",
  "preferred_call_time": "",
  "preferred_call_time_label": "",
  "timezone": "America/New_York",
  "call_due_at": "",
  "call_due_at_iso": "",
  "call_window_colombia": "",
  "summary": "Eligió WhatsApp | Jane Smith | +13055550123 | Procedimiento: Mommy Makeover | Zona horaria: America/New_York | Idioma: EN | Fuente: google / cpc / mommy-makeover-us | Página: /en/procedures/mommy-makeover/ | Lead ID: 3f6c2a9e-8d41-4b7a-9c35-2e1f0a7b6d58",
  "page_url": "https://fulviocorrea.com.co/en/procedures/mommy-makeover/",
  "page_path": "/en/procedures/mommy-makeover/",
  "page_title": "Mommy Makeover in Cartagena | Dr. Fulvio Correa",
  "button_id": "contact-whatsapp",
  "form_id": "contact-widget",
  "landing_page": "https://fulviocorrea.com.co/en/ads/mommy-makeover/",
  "referrer": "https://www.google.com/",
  "landing_url_first": "https://fulviocorrea.com.co/en/",
  "referrer_first": "https://l.facebook.com/",
  "attribution_timestamp": "2026-09-20T14:02:11.000Z",
  "utm_source": "google",
  "utm_source_first": "facebook",
  "utm_source_last": "google",
  "utm_medium": "cpc",
  "utm_medium_first": "paid_social",
  "utm_medium_last": "cpc",
  "utm_campaign": "mommy-makeover-us",
  "utm_campaign_first": "awareness-sept",
  "utm_campaign_last": "mommy-makeover-us",
  "utm_term": "mommy makeover colombia",
  "utm_term_first": "",
  "utm_term_last": "mommy makeover colombia",
  "utm_content": "ad-a",
  "utm_content_first": "video-1",
  "utm_content_last": "ad-a",
  "gclid": "EAIaIQobChMI-example",
  "gclid_first": "",
  "gclid_last": "EAIaIQobChMI-example",
  "gbraid": "",
  "gbraid_first": "",
  "gbraid_last": "",
  "wbraid": "",
  "wbraid_first": "",
  "wbraid_last": "",
  "fbclid": "",
  "fbclid_first": "IwAR-example",
  "fbclid_last": "",
  "ga_client_id": "1234567890.1758900000",
  "contact_consent": true,
  "sms_consent": true,
  "consent_version": "contact-consent-2026-09-27",
  "consent_text": "I agree to be contacted by Dr. Fulvio Correa’s team by phone call, SMS and WhatsApp about my inquiry. Message frequency varies; msg & data rates may apply. Consent is not a condition of purchase. Reply STOP to opt out. Privacy policy · SMS terms",
  "consent_timestamp": "2026-09-27T21:05:20.480Z",
  "measurement_consent": "granted",
  "lead_source": "website",
  "crm_operation": "upsert_contact",
  "deduplication_key": "+13055550123"
}
```

### 3. `channel_selected` — Quiero que me llamen

```json
{
  "event": "channel_selected",
  "event_id": "3f6c2a9e-8d41-4b7a-9c35-2e1f0a7b6d58-call-morning",
  "lead_id": "3f6c2a9e-8d41-4b7a-9c35-2e1f0a7b6d58",
  "received_at": "2026-09-27T21:05:31.790Z",
  "client_timestamp": "2026-09-27T21:05:31.560Z",
  "name": "Jane Smith",
  "full_name": "Jane Smith",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+13055550123",
  "phone_country": "US",
  "phone_country_code": "+1",
  "email": "",
  "procedure": "mommy-makeover",
  "procedure_label": "Mommy Makeover",
  "language": "en",
  "contact_preference": "call",
  "channel": "call",
  "preferred_call_time": "morning",
  "preferred_call_time_label": "Mañana / Morning (8:00–12:00)",
  "timezone": "America/New_York",
  "call_due_at": "09-28-2026 07:00 AM",
  "call_due_at_iso": "2026-09-28T12:00:00.000Z",
  "call_window_colombia": "lun 28 sep, 7:00–11:00 a. m. (hora Colombia)",
  "summary": "Solicitud de llamada | Jane Smith | +13055550123 | Procedimiento: Mommy Makeover | Horario preferido: Mañana / Morning (8:00–12:00), hora local del paciente (America/New_York) | Idioma: EN | Fuente: google / cpc / mommy-makeover-us | Página: /en/procedures/mommy-makeover/ | Lead ID: 3f6c2a9e-8d41-4b7a-9c35-2e1f0a7b6d58 | Llamar: lun 28 sep, 7:00–11:00 a. m. (hora Colombia)",
  "page_url": "https://fulviocorrea.com.co/en/procedures/mommy-makeover/",
  "page_path": "/en/procedures/mommy-makeover/",
  "page_title": "Mommy Makeover in Cartagena | Dr. Fulvio Correa",
  "button_id": "contact-call",
  "form_id": "contact-widget",
  "landing_page": "https://fulviocorrea.com.co/en/ads/mommy-makeover/",
  "referrer": "https://www.google.com/",
  "landing_url_first": "https://fulviocorrea.com.co/en/",
  "referrer_first": "https://l.facebook.com/",
  "attribution_timestamp": "2026-09-20T14:02:11.000Z",
  "utm_source": "google",
  "utm_source_first": "facebook",
  "utm_source_last": "google",
  "utm_medium": "cpc",
  "utm_medium_first": "paid_social",
  "utm_medium_last": "cpc",
  "utm_campaign": "mommy-makeover-us",
  "utm_campaign_first": "awareness-sept",
  "utm_campaign_last": "mommy-makeover-us",
  "utm_term": "mommy makeover colombia",
  "utm_term_first": "",
  "utm_term_last": "mommy makeover colombia",
  "utm_content": "ad-a",
  "utm_content_first": "video-1",
  "utm_content_last": "ad-a",
  "gclid": "EAIaIQobChMI-example",
  "gclid_first": "",
  "gclid_last": "EAIaIQobChMI-example",
  "gbraid": "",
  "gbraid_first": "",
  "gbraid_last": "",
  "wbraid": "",
  "wbraid_first": "",
  "wbraid_last": "",
  "fbclid": "",
  "fbclid_first": "IwAR-example",
  "fbclid_last": "",
  "ga_client_id": "1234567890.1758900000",
  "contact_consent": true,
  "sms_consent": true,
  "consent_version": "contact-consent-2026-09-27",
  "consent_text": "I agree to be contacted by Dr. Fulvio Correa’s team by phone call, SMS and WhatsApp about my inquiry. Message frequency varies; msg & data rates may apply. Consent is not a condition of purchase. Reply STOP to opt out. Privacy policy · SMS terms",
  "consent_timestamp": "2026-09-27T21:05:31.790Z",
  "measurement_consent": "granted",
  "lead_source": "website",
  "crm_operation": "upsert_contact",
  "deduplication_key": "+13055550123"
}
```

## Campos

| Campo | Significado |
| --- | --- |
| `event` | `lead_created` (pulsa «Elegir cómo contactar») o `channel_selected` (elige canal). |
| `event_id` | Id único del evento (idempotencia). |
| `lead_id` | Id generado en el navegador; igual en todos los eventos del mismo visitante/datos. |
| `received_at` / `client_timestamp` | Hora del servidor / del navegador (ISO 8601 UTC). |
| `name`, `full_name`, `first_name`, `last_name` | Nombre escrito (first = primera palabra). |
| `phone` | E.164 (`+573001234567`). Clave de deduplicación (`deduplication_key`). |
| `phone_country`, `phone_country_code` | ISO del país elegido y prefijo (`CO`, `+57`). |
| `email` | Vacío en el widget (solo formulario antiguo). |
| `procedure` / `procedure_label` | Slug (`liposuction`, `mommy-makeover`, …, `other`) / nombre visible en el idioma del visitante. |
| `language` | `en` / `es`. |
| `contact_preference`, `channel` | `pending` (lead_created) · `whatsapp` · `call` · `sms` · `instagram` · `facebook`. `channel` vacío en lead_created. |
| `preferred_call_time` | Solo llamada: `asap`, `morning`, `afternoon`, `evening`. |
| `preferred_call_time_label` | Texto bilingüe, p. ej. `Mañana / Morning (8:00–12:00)` (hora local del visitante). |
| `timezone` | Zona horaria IANA del navegador (`America/New_York`). |
| `call_due_at` | Solo llamada. Vencimiento de la tarea en hora Colombia, formato exacto de NinjaSuite Add Task: `MM-DD-YYYY hh:mm AM/PM` (12 h con cero a la izquierda, `AM`/`PM` en mayúsculas). Lo calcula el servidor con su reloj, no con `client_timestamp`. Vacío si no es llamada. |
| `call_due_at_iso` | El mismo instante que `call_due_at`, en ISO 8601 UTC. No usarlo como vencimiento de la tarea. Vacío si no es llamada. |
| `call_window_colombia` | Franja ya convertida a hora Colombia, p. ej. `lun 28 sep, 7:00–11:00 a. m. (hora Colombia)`. `asap`: `Lo antes posible`. Vacío si no es llamada. |
| `summary` | Resumen legible para la tarea/nota (tipo, nombre, teléfono, procedimiento, horario, idioma, fuente, página, lead ID). En llamadas termina con `\| Llamar: ` + `call_window_colombia`. |
| `page_url`, `page_path`, `page_title` | Página donde se envió. |
| `button_id` | Botón: `contact-widget-open`, CTA de la página que abrió el chat, `contact-whatsapp`, `contact-call`… |
| `form_id` | `contact-widget` (o `consultation` en el formulario antiguo). |
| `landing_page`, `referrer` | Primera página y referrer de la sesión actual. |
| `landing_url_first`, `referrer_first`, `attribution_timestamp` | Primer contacto (hasta 90 días). |
| `utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid` | Valores del último contacto con campaña (last touch). |
| `*_first` / `*_last` | Primer / último contacto para cada parámetro. |
| `ga_client_id` | Client ID de GA4 (cookie `_ga`), solo si existe (tras consentimiento de medición). |
| `contact_consent`, `sms_consent` | Siempre `true` (checkbox obligatorio que cubre llamada, SMS y WhatsApp). |
| `consent_version`, `consent_text`, `consent_timestamp` | Versión y texto exacto mostrado; hora del servidor. |
| `measurement_consent` | `granted` / `denied` (banner de cookies). |
| `lead_source`, `crm_operation`, `deduplication_key` | `website`, `upsert_contact`, teléfono. |
| `journey_visits`, `journey_first_visit` | Visitas al sitio y primera visita (`DD/MM/AAAA HH:MM`, hora Colombia). Vacíos si el navegador no guardó recorrido. |
| `journey_pages_count`, `journey_pages` | Páginas registradas (máx. 30) y rutas en orden (`/es/ > /es/procedimientos/bbl/ > …`). |
| `journey_note` | Nota lista para el contacto (varias líneas, hora Colombia), p. ej.:<br>`Recorrido en el sitio (hora Colombia) — visitas: 3, primera visita: 25/09/2026 10:12, páginas vistas: 3`<br>`• 25/09 10:12 · Cirugía plástica en Cartagena (ES) · /es/`<br>`• 28/09 17:30 · Aumento glúteo con grasa (ES) · /es/procedimientos/bbl/`<br>`• 28/09 17:35 · Brazilian Butt Lift in Cartagena (EN) · /en/procedures/bbl/` |

## Mapeo a campos personalizados existentes en NinjaSuite

Consultados (solo lectura) el 27-09-2026 en la ubicación `Dsw5TTvdJGEKvFmjzgDD`: 46 campos.

| Payload | Campo NinjaSuite |
| --- | --- |
| `first_name`, `last_name`, `phone`, `email` | Nativos First Name, Last Name, Phone, Email |
| `procedure_label` | Procedure of interest (`contact.procedure_of_interest`, texto) |
| `page_url` | page_url (`contact.page_url`) |
| `page_title` | page_name (`contact.page_name`) |
| `button_id` | button_id (`contact.button_id`) |
| `utm_source`, `utm_medium`, `utm_campaign` | utm_source, utm_medium, utm_campaign |
| `utm_source_first`, `utm_medium_first`, `utm_campaign_first`, `utm_term_first`, `utm_content_first` | utm_source_first, utm_medium_first, utm_campaign_first, utm_term_first, utm_content_first |
| `utm_source_last`, `utm_medium_last`, `utm_campaign_last`, `utm_term_last`, `utm_content_last` | utm_source_last, utm_medium_last, utm_campaign_last, utm_term_last, utm_content_last |
| `gclid` | utm_gclid |
| `gclid_first` / `gclid_last` | gclid_first / gclid_last |
| `gbraid_first`, `wbraid_first` | gbraid_first, wbraid_first (no existen versiones _last) |
| `fbclid_first` / `fbclid_last` | fbclid_first / fbclid_last |
| `landing_url_first`, `referrer_first`, `attribution_timestamp` | landing_url_first, referrer_first, attribution_timestamp |
| `ga_client_id` | ga_client_id |

Opcional (listas desplegables existentes): «Which procedure are you interested in?» / «Procedimiento de interés» tienen opciones distintas a los slugs; si se quieren llenar, usar ramas If/Else por `procedure`: liposuction → Liposuction / Liposucción · mommy-makeover → Mommy Makeover / Mommy Makeover (Combinación de procedimientos) · breast-augmentation → Breast Surgery / Aumento de senos · breast-lift-reduction → Breast Surgery / Levantamiento de senos · facelift → Facelift / Estiramiento Facial · rhinoplasty → Rhinoplasty / Rinoplastia · tummy-tuck → Other / Lipectomia (Tummy Tuck) · bbl, other → Other.

Campos que **no existen** y conviene crear (texto): `contact_preference`, `preferred_call_time` (guardar `preferred_call_time_label`), `visitor_timezone` (`timezone`), `website_lead_id` (`lead_id`), `preferred_language` (`language`), `lead_summary` (texto largo, `summary`), `call_window_colombia` (la franja en hora Colombia; el vencimiento de la tarea no necesita campo, va directo de `{{inboundWebhookRequest.call_due_at}}`), `consent_version`, `utm_term`, `utm_content`, `session_landing_page` (`landing_page`), `session_referrer` (`referrer`). Sin equivalente en el sitio: fbp, fbc_first/fbc_last, session_source_*, medium_*, medium_id_*, campaign_id_first, ad_id_first, ad_group_id_first, utm_matchtype_first, utm_keyword_first (se puede usar `utm_term_first`).

## Pasos en NinjaSuite

1. **Disparador**: Workflow con trigger *Inbound Webhook* (ya creado). Enviar una muestra (uno de los JSON de arriba) para mapear campos. La URL va solo en Cloudflare → Settings → Variables and Secrets → `LEAD_WEBHOOK_URL` (Secret), junto con `LEAD_CAPTURE_ENABLED=true`.
2. **Crear/actualizar contacto** por teléfono (`phone`; el flujo de deduplicación existente por teléfono se mantiene). Mapear campos según la tabla. Recomendación: no sobrescribir los campos `*_first` si ya tienen valor.
3. **If/Else `event`**:
   - `lead_created` → etiqueta `web-lead` (+ `web-lead-en`/`web-lead-es` según `language`); crear/actualizar oportunidad en el pipeline (etapa «Nuevo lead web»), sin permitir duplicados.
   - `channel_selected` → actualizar `contact_preference`; etiqueta `canal-<channel>`.
   - **Recorrido en el sitio**: en la rama `lead_created`, acción *Add To Notes* con el cuerpo `{{inboundWebhookRequest.journey_note}}` (opcional: If/Else «journey_note no está vacío»). HighLevel no ofrece una API pública para escribir actividades propias en la línea de tiempo del contacto; la nota del contacto es lo que corresponde (con API sería `POST /contacts/{contactId}/notes`, que exige un token con `contacts.write`; este sitio solo usa el Inbound Webhook y no guarda tokens). Si se prefiere una sola nota, se puede escribir `{{inboundWebhookRequest.summary}}` y debajo `{{inboundWebhookRequest.journey_note}}` en la misma acción.
4. **Si `contact_preference` = `call`** → *Add Task* asignada a Eileen:
   - Título: «Llamar a {{inboundWebhookRequest.first_name}} – {{inboundWebhookRequest.preferred_call_time_label}}».
   - Descripción: `{{inboundWebhookRequest.summary}}` (incluye la franja ya en hora Colombia). En acciones posteriores a «Crear contacto» también sirven los campos del contacto.
   - **Vencimiento**: valor dinámico `{{inboundWebhookRequest.call_due_at}}`. NinjaSuite lee esa cadena como `MM-DD-YYYY hh:mm AM` (p. ej. `09-28-2026 07:00 AM`) en la zona de la ubicación, America/Bogota. No hace falta convertirla y no hay que usar `call_due_at_iso` en ese campo (es UTC). La ubicación del workflow tiene que estar en hora Colombia; si no, la tarea queda a otra hora.
   - Cómo se arma `call_due_at` (reloj del servidor, no el del navegador): `asap` = ahora + 15 minutos. Mañana 8:00–12:00, tarde 12:00–17:00 y noche 17:00–20:00 son la hora local del paciente (`timezone`). Si esa franja todavía no empieza hoy, el vencimiento es el inicio de hoy; si el paciente ya está dentro, es ahora redondeado al siguiente cuarto de hora (un instante exacto en :00, :15, :30 o :45 se queda); si ya pasó, es el inicio de mañana. Ese instante se convierte a America/Bogota. Zona vacía o IANA inválida: la franja se interpreta como America/Bogota. No se recorta a horario del equipo ni se saltan fines de semana.
   - Ejemplo del JSON de arriba: el `received_at` es domingo 27 sep 2026, 17:05 en Nueva York, así que «mañana» ya pasó. La próxima es el lunes 8:00–12:00 hora Nueva York = 7:00–11:00 hora Colombia, y `call_due_at` es `09-28-2026 07:00 AM`.
   - Opcional: notificación interna a Eileen. Mover la oportunidad a «Llamada solicitada».
5. Opcional: tras `lead_created`, esperar p. ej. 15 min y, si `contact_preference` sigue `pending`, iniciar seguimiento por WhatsApp/SMS (el consentimiento lo cubre; respetar STOP).

Nota: HighLevel no deduplica por `event_id`; la Function evita reenvíos del mismo evento por instancia, y la deduplicación duradera queda en el flujo por teléfono.

Pruebas: `npm run build` y `npm test` (`lead-test.mjs` usa un webhook simulado; nunca se envían peticiones reales).
