# Galería de casos y contacto con Sofía

Actualización: 26 de septiembre de 2026.

## Galería

Rutas: /en/before-after/ y /es/before-after/.
Cada caso admite fotografías de antes y después, un deslizador táctil/ratón/teclado, título del procedimiento, explicación, detalles adicionales y tiempo transcurrido hasta la fotografía posterior.

Editar data/results.json. El esquema _itemSchema describe los campos. Copiar el esquema dentro de items para cada caso, completar los textos EN/ES y los nombres de archivos before/after. Guardar imágenes WebP en assets/ y registrar sus dimensiones en data/images.json. Las fotos deben corresponder al mismo caso, tener proporciones comparables y contar con autorización de publicación. Activar authorized tanto para el conjunto como para el caso una vez confirmada la autorización.

No hay casos reales cargados actualmente. En preview se muestra un comparador de paneles sin imágenes, identificado como demostración del diseño. En production ese comparador de demostración desaparece; nunca se convierte en un resultado de paciente. La galería permanece noindex mientras no haya casos autorizados. El primer caso autorizado también alimenta el comparador del bloque de filosofía de Home/About.

## Contacto

Los CTA de valoración y los antiguos accesos directos a WhatsApp abren el diálogo de Sofía. Las páginas de procedimientos y Ads transmiten el procedimiento al selector del chat. Los enlaces informativos a procedimientos, artículos y galería mantienen su navegación normal. Los enlaces a WhatsApp, SMS, Instagram y Facebook se conservan dentro del chat tras recoger los datos.

El formulario antiguo se conserva en /en/book-consultation/ y /es/book-consultation/, sin enlaces desde la web, fuera del sitemap y con noindex en ambos modos. Noindex no es una protección de acceso: la URL puede abrirse si se conoce.

## Comprobación

node build.mjs
node contact-test.mjs
node results-test.mjs

La construcción comprueba 84 páginas, enlaces, metadatos, presupuesto de recursos y estructura SEO. Los avisos editoriales pendientes están en reports/verification.json. Las pruebas de contacto usan datos simulados y no envían leads reales al CRM.
