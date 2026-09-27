# Contacto con Sofía

El widget valida nombre, teléfono con selector de país y procedimiento, y muestra los canales. Nunca llama al endpoint de leads, aunque esté configurado. No crea contactos ni oportunidades. Los datos permanecen en memoria.

WhatsApp y SMS reciben un mensaje preparado con nombre, teléfono y procedimiento. El visitante debe enviarlo. Instagram y Facebook abren el perfil configurado; no se transmite el formulario ni se ofrece copiar/pegar. Sofía puede solicitar los datos dentro de la conversación. La conexión y creación del contacto dependen de los canales en NinjaSuite; Facebook sigue pendiente de validar por el propietario.

La atribución first/last touch sigue capturándose en el sitio, pero no se envía al CRM desde el widget. Los mensajes llevan una referencia de procedimiento e idioma, no atribución completa de campaña. Los clics se miden solo con consentimiento y sin datos personales. Un clic no confirma el envío de un mensaje ni un lead.

El formulario antiguo noindex conserva su endpoint independiente. Los países se sugieren según la región del navegador; no se geolocaliza al visitante.

Verificación: node contact-test.mjs.
