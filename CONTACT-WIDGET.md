# Contacto con Sofía

Sofía es la asistente virtual del chat, no una persona del equipo. El botón se mantiene corto («Habla con Sofía» / «Talk to Sofía»); la etiqueta del diálogo es «Sofía, nuestra asistente virtual» / «Sofía, our virtual assistant».

El widget valida nombre, teléfono con selector de país, procedimiento y consentimiento (llamada, SMS y WhatsApp; versión `contact-consent-2026-09-27`, enlaza privacidad y términos SMS). Al pulsar «Elegir cómo contactar» crea el lead (`POST /api/lead`, evento `lead_created`) sin esperar la respuesta y muestra los canales. Al elegir WhatsApp, SMS, Instagram o Facebook envía `channel_selected` con el mismo `lead_id` y teléfono (keepalive, sin bloquear la apertura de la app).

«Quiero que me llamen / Call me» no abre chats: pide la franja horaria (lo antes posible, mañana, tarde, noche; hora local del visitante, con la zona horaria visible), envía `channel_selected` con `channel: call` y muestra la confirmación «Nuestro equipo te llamará…» cuando el servidor la confirma.

WhatsApp y SMS reciben un mensaje preparado con nombre, teléfono y procedimiento. Instagram y Facebook abren el perfil configurado. Facebook sigue pendiente de validar en NinjaSuite.

Datos personales solo en memoria (no en almacenamiento web). La atribución first/last touch (UTM, gclid, gbraid, wbraid, fbclid, landing, referrer) se captura en app.js y viaja en el payload. dataLayer (solo con consentimiento de medición y sin datos personales): `form_start`, `generate_lead` (tras confirmación del servidor; procedure, language), `contact_channel_selected` (channel) y `whatsapp_click`.

Payload, campos y configuración de NinjaSuite: [LEAD-WEBHOOK.md](LEAD-WEBHOOK.md). Verificación: `node contact-test.mjs` y `node lead-test.mjs`.

## Prueba: chat de GoHighLevel (LeadConnector)

`data/chat.json` elige el proveedor del botón flotante «Habla con Sofía / Talk to Sofía». `"provider": "ghl"` activa la prueba; **revertir = `"provider": "native"`** (vuelve el widget de Sofía de arriba, sin más cambios).

- Con `ghl` la página solo lleva el botón (sin el diálogo de Sofía) y `contact.js` se compila desde `ghl-chat.js` (~2 KB). Nada de GHL se descarga al cargar la página: el primer clic en el botón (o en cualquier botón `data-open-contact`) inyecta `loader.js` con el `widget-id` y abre el chat. Siguientes clics abren/cierran.
- El botón dorado del sitio es el único lanzador: la burbuja propia de GHL y su mensaje emergente se ocultan dentro de su shadow root (abierto). Los colores se sobrescriben en código con las variables `--chat-widget-*` de GHL.
- Idioma: el widget no sigue el idioma de la página por sí solo. En páginas ES el código cambia sus etiquetas integradas a `es` (botones «Chatear vía…», formulario). Los textos escritos en el panel de GHL (título, mensajes) son únicos para todos los idiomas; hoy están en formato «EN / ES».
- Colores a configurar también en GHL (Sites › Chat Widget › Style), para que coincidan antes de que corra nuestro código y en cualquier otra inserción: burbuja/botón/color primario `#D4B478`, encabezado `#211320`, texto del encabezado `#FAF3EC`, fondo `#FAF3EC`, borde del avatar `#D4B478`, fondo del avatar `#211320`, mensaje enviado `#321C30` con texto `#FAF3EC`, mensaje recibido `#EFE4D6` con texto `#211320`, textos de bienvenida/sistema `#321C30`. Un fondo oscuro no funciona: las tarjetas de opciones del widget son blancas fijas y el texto quedaría ilegible.
- Dominios que usa el widget (observados en Chromium, para una futura Content-Security-Policy; hoy `_headers` no define CSP): `widgets.leadconnectorhq.com`, `services.leadconnectorhq.com`, `stcdn.leadconnectorhq.com` (scripts/estilos/API), `services.msgsndr.com` (sesión), `assets.cdn.filesafe.space` (avatar), `challenges.cloudflare.com` (Turnstile), `fonts.bunny.net` (fuente Roboto).
