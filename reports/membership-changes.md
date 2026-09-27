# Cambios de membresía y verificación — 26 septiembre 2026

- practice.json: reparados los caracteres dañados del nombre y rol ya registrados. Textos EN/ES de membresía centralizados. sameAs y authorApproved conservados; authorApproved sigue false.
- practice-view.mjs: único generador del nodo Physician, memberOf y bloques visibles. La URL de la sociedad se obtiene de su campo url o, si falta como en los datos actuales, del origen de source. OrganizationRole solo cuando hay rol; sin sociedades no se emite memberOf.
- render.mjs / enhance.mjs / audit.mjs: membresía visible en home, About, autor de posts y procedimientos, y orientación de pacientes internacionales. Sin logos adicionales. BlogPosting aprobado referencia /#physician; sin aprobación conserva la organización editorial.
- build.mjs: JS minificado por módulos. contact.js únicamente en documentos con diálogo; thank-you.js únicamente con confirmación. Retirado locale.js obsoleto y CSS del comparador y campañas antiguos. El widget existe en todas las páginas por petición del propietario.
- contact-widget.mjs / contact-widget.js: enlace de confirmación prerenderizado y guardia sin document; eliminado createElement para esa confirmación. Corregida inserción del widget para preservar los signos $ de las reglas telefónicas al generar HTML.
- verify.mjs: exige memberOf, perfil de verificación visible en About EN/ES, mismo sameAs, referencia correcta de autor y presupuesto sumando TODOS los módulos de JS y CSS.
- membership-test.mjs: estados con/sin sociedades, con/sin rol, ambos estados de autoría, carga condicional, guardias DOM y pruebas negativas del verificador. Comprueba que los scripts se insertan fuera de los atributos de campos.

Validación final:

PASS: 84 pages; metadata, links, clusters, publication, redirects, similarity, drafts and budgets. JS + CSS: 59136 bytes.
PASS: contact-test.mjs
PASS: results-test.mjs
PASS: membership-test.mjs

Sin errores técnicos en estas verificaciones. Se conservan 65 avisos editoriales de contenido pendiente; ver verification.json. Esto no equivale a aprobación clínica ni garantiza resultados de posicionamiento. No se desplegó producción ni se enviaron contactos reales.

El JSON-LD completo extraído de /en/about/ se entrega en physician-en-about.json.
