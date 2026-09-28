# Contacto con Sofía

Sofía es la asistente virtual del chat, no una persona del equipo. El botón se mantiene corto («Habla con Sofía» / «Talk to Sofía»); la etiqueta del diálogo es «Sofía, nuestra asistente virtual» / «Sofía, our virtual assistant».

El widget valida nombre, teléfono con selector de país, procedimiento y consentimiento (llamada, SMS y WhatsApp; versión `contact-consent-2026-09-27`, enlaza privacidad y términos SMS). Al pulsar «Elegir cómo contactar» crea el lead (`POST /api/lead`, evento `lead_created`) sin esperar la respuesta y muestra los canales. Al elegir WhatsApp, SMS, Instagram o Facebook envía `channel_selected` con el mismo `lead_id` y teléfono (keepalive, sin bloquear la apertura de la app).

«Quiero que me llamen / Call me» no abre chats: pide la franja horaria (lo antes posible, mañana, tarde, noche; hora local del visitante, con la zona horaria visible), envía `channel_selected` con `channel: call` y muestra la confirmación «Nuestro equipo te llamará…» cuando el servidor la confirma.

WhatsApp y SMS reciben un mensaje preparado con nombre, teléfono y procedimiento. Instagram y Facebook abren el perfil configurado. Facebook sigue pendiente de validar en NinjaSuite.

Datos personales solo en memoria (no en almacenamiento web). La atribución first/last touch (UTM, gclid, gbraid, wbraid, fbclid, landing, referrer) se captura en app.js y viaja en el payload. dataLayer (solo con consentimiento de medición y sin datos personales): `form_start`, `generate_lead` (tras confirmación del servidor; procedure, language), `contact_channel_selected` (channel) y `whatsapp_click`.

Payload, campos y configuración de NinjaSuite: [LEAD-WEBHOOK.md](LEAD-WEBHOOK.md). Verificación: `node contact-test.mjs` y `node lead-test.mjs`.
