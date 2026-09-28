# Publicación automática del blog (Orión)

Flujo completo, sin subir nada a mano:

1. Crear `content/blog/<lang>-<slug>.md` (frontmatter abajo).
2. Guardar la portada en `assets/blog/<slug>.webp` (y opcionalmente `assets/blog/<slug>-600.webp`).
3. Registrar el slug en `content/clusters.json` bajo `<lang>` → `<procedure>`.
4. (Recomendado) ejecutar `npm run build && npm test` en local.
5. `git add content/blog assets/blog content/clusters.json` → `git commit` → `git push origin main`.
6. Cloudflare Pages clona `main`, ejecuta `npm run build` y publica `dist/`. Si falta algo, el build **falla** y el sitio anterior sigue publicado.

## Frontmatter obligatorio

El bloque va entre `---`. **Cada valor es JSON** (cadenas entre comillas dobles, listas `[...]`, booleanos `true/false`). Una clave por línea.

```markdown
---
title: "BBL Recovery Checklist: What to Plan Before Flying Home"
description: "Una o dos frases (≈140–160 caracteres) para meta description y tarjetas."
slug: "bbl-recovery-checklist"
lang: "en"
category: "Body Contouring"
tags: ["bbl-colombia"]
cover: "/assets/blog/bbl-recovery-checklist.webp"
coverAlt: "Descripción literal de la imagen"
date: "2026-10-01"
updated: "2026-10-01"
author: "fulvio-correa"
translationOf: ""
sources: ["https://www.plasticsurgery.org/..."]
draft: false
procedure: "bbl"
twin: ""
related: ["bbl-colombia"]
reviewed_by: ""
review_date: ""
---

Cuerpo en Markdown. Usar `##` para secciones (un `#` se convierte en `##`; el H1 lo genera la plantilla).
```

| Campo | Regla |
| --- | --- |
| `slug` | `a-z`, `0-9` y `-`. Define la URL `/<lang>/blog/<slug>/`. Único por idioma. |
| `lang` | `"en"` o `"es"`. |
| `title` | ≤ 60 caracteres (`verify.mjs` falla si el `<title>` final supera 60). |
| `category` | Debe coincidir con un valor `en` de `data/categories.json`: Mommy Makeover, Breast Surgery, Body Contouring, Recovery, Medical Tourism, Plastic Surgery in Colombia. |
| `cover` | Ruta pública `/assets/...` de un archivo que **exista** en `assets/` con las mismas mayúsculas/minúsculas. Recomendado WebP 1200×800 (< 200 KB). Si existe `<nombre>-600.webp`, se usa como `srcset` en tarjetas. Las dimensiones se leen del archivo automáticamente (no hace falta tocar `data/images.json`). |
| `procedure` | Slug de un procedimiento con página pilar en ese idioma (`content/procedures/<procedure>.<lang>.json`): bbl, breast-augmentation, breast-lift-reduction, facelift, liposuction, mommy-makeover, rhinoplasty, tummy-tuck. |
| `related` | 0–4 slugs publicados del **mismo idioma** (pueden ser de otro procedimiento). |
| `translationOf` / `twin` | Slug del artículo equivalente en el otro idioma (activa el enlace de idioma y hreflang). `""` si no existe. |
| `sources` | Lista de URLs citadas (se muestran como Fuentes). |
| `draft` | `true` = no se publica ni entra en el sitemap (sus imágenes pueden faltar todavía). `false` o ausente = se publica. |
| `reviewed_by` / `review_date` | Solo con revisión médica real; si están vacíos no se muestra "Revisado médicamente". |
| `author` | `"fulvio-correa"`. |

Campos extra (p. ej. `originalUrl`) se permiten y se ignoran.

## `content/clusters.json`

```json
{ "en": { "bbl": ["bbl-colombia", "bbl-recovery-checklist"] }, "es": { ... } }
```

Controla los enlaces desde la página del procedimiento al artículo. Si falta, el build falla con `... cluster map missing`.

## Qué valida el build (falla con mensaje claro)

- Portada o cualquier `/assets/...` inexistente o con mayúsculas distintas → `BUILD FAILED Missing local assets` con la lista de archivos y dónde se referencian.
- Frontmatter inválido o sin campos obligatorios → `Invalid frontmatter` / `missing <campo>`.
- Artículo sin pilar, sin registro en clusters, `related` inválidos, H1 duplicado, canonical/hreflang/OG ausentes, archivos > 25 MiB.

Advertencias no bloqueantes: artículos con < 600 palabras o con < 2 artículos relacionados (ver `reports/verification.json`).

## Reglas editoriales

No inventar estadísticas, acreditaciones ni afirmaciones del tipo "board-certified". Las imágenes de stock deben tener licencia verificada (registrar en `data/blog-image-sources.json` y `BLOG-IMAGE-SOURCES.md`). No usar fotos de pacientes sin autorización.
