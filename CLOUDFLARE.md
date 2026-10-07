# Hosting: Cloudflare Pages

## Configuración del proyecto (Dashboard → Workers & Pages → Pages → Connect to Git)

| Ajuste | Valor |
| --- | --- |
| Repositorio / rama de producción | `santimoron-cmyk/FulvioCorrea` · `main` |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(vacío)* |
| Node | `.nvmrc` = 22 (o variable `NODE_VERSION=22`) |
| Package manager | pnpm (detectado por `pnpm-lock.yaml`; la imagen v3 trae pnpm 10). Opcional: `PNPM_VERSION=10.11.1` |

### Variables (Settings → Variables and Secrets)

| Variable | Entorno | Tipo | Valor |
| --- | --- | --- | --- |
| `LEAD_WEBHOOK_URL` | Production (y Preview solo si se quiere probar) | **Secret** | URL del *Inbound Webhook* de HighLevel/LeadConnector (https) |
| `LEAD_CAPTURE_ENABLED` | Production | Text | `true` para aceptar leads; si falta, `/api/lead` responde 503 `not_configured` |
| `SITE_ENV` | Production | Text | Vacío = automático (rama `main` → production indexable). Poner `preview` para mantener noindex hasta el lanzamiento. |
| `GTM_ID` / `GA4_ID` | Production | Text | Opcionales (se cargan solo tras consentimiento) |
| `NODE_VERSION` | Ambos | Text | `22` (redundante con `.nvmrc`) |

Las variables de build y de Functions son las mismas en Pages; `LEAD_*` solo se leen en tiempo de ejecución (Function), nunca se incrustan en el HTML/JS.

## Modo preview / production (site-env.mjs)

| Contexto | Modo |
| --- | --- |
| `npm run build` local (sin variables) | **preview** |
| `npm run build:production` o `SITE_ENV=production` | production |
| Cloudflare, rama `main` (`CF_PAGES_BRANCH=main`) sin `SITE_ENV` | **production** |
| Cloudflare, cualquier otra rama / PR | preview |
| `SITE_ENV=preview` en cualquier sitio | preview (tiene prioridad) |

- **preview**: todas las páginas `noindex, nofollow`, `robots.txt` = `Disallow: /`, cabecera `X-Robots-Tag: noindex, nofollow`. Las rutas y `_redirects` son los mismos que en production.
- **production**: páginas indexables (excepto `/ads/`, gracias, 404 y páginas marcadas `noindex`), `robots.txt` con `Allow: /`, grupos explícitos para GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended y `Sitemap:`. `_redirects` (301 de URLs antiguas, y de `/en/*` a la raíz) está activo en los dos modos.
- En ambos modos, las URLs `*.pages.dev` reciben `X-Robots-Tag: noindex` vía `_headers` y `functions/_middleware.js` (también los alias de rama, como `staging.fulviocorrea.pages.dev`) para no competir con `https://fulviocorrea.com`. El HTML de producción no lleva noindex global: el apex es indexable y pages.dev no. `www.fulviocorrea.com` responde 301 al apex (misma ruta y query) desde el middleware. `functions/robots.txt.js` permite el rastreo solo en el apex y apunta a `https://fulviocorrea.com/sitemap.xml`; en `*.pages.dev` responde `Disallow: /`.
- GTM `GTM-THZVNS9B` está en cada página (consentimiento denegado por defecto antes del snippet). `_headers` no define Content-Security-Policy, así que no hace falta ampliarla para `googletagmanager.com` ni `google-analytics.com`.
- Cloudflare → dominio → *Security / Bots*: revisar que "Block AI bots" / "Manage robots.txt (AI)" no contradiga el `robots.txt` si se quiere permitir crawlers de IA.

## Qué genera el adaptador (cloudflare.mjs)

- `dist/_headers`: seguridad (nosniff, referrer, permissions, X-Frame-Options), caché `/assets/*` 7 días, noindex en pages.dev.
- `dist/_redirects` (preview y production): reglas `origen destino 301` desde `audit.mjs` (formato Cloudflare, sin `!`). El inglés vive en la raíz; `/en/` y `/en/*` redirigen ahí, nunca al revés. Se valida: ≤ 2.000 estáticas, ≤ 100 dinámicas, ≤ 1.000 caracteres. Las rutas exactas van antes que cualquier splat (`*`) o placeholder (`:nombre`): Cloudflare cuenta como dinámica toda regla que sigue a la primera de ese tipo y descarta en silencio el resto del archivo al pasar de 100 (workers-sdk #14694).
- `functions/_shared/lead-procedures.js`: lista de procedimientos permitidos para `/api/lead` (regenerada en cada build; se versiona).
- 404: `dist/404.html` y `dist/es/404.html` (Cloudflare sirve el 404.html más cercano, así `/es/...` inexistente muestra el 404 en español).

## Function `/api/lead` (functions/api/lead.js)

Porte de `netlify/functions/lead.mjs`. Reutiliza `server/lead-handler.mjs` (también usado por `server.mjs` en local): valida origen, JSON ≤ 20 KB, honeypot, teléfono E.164, consentimiento, idioma, procedimiento, evento (`lead_created`/`channel_selected`), canal y franja de llamada, `Idempotency-Key` (= `event_id`); limita 10 envíos/min por IP (por instancia) y reenvía un JSON plano a `LEAD_WEBHOOK_URL` con `Idempotency-Key`. Payload y mapeo en NinjaSuite: [LEAD-WEBHOOK.md](LEAD-WEBHOOK.md). Responde `{accepted:true}` solo si HighLevel devuelve 2xx.

Prueba local: `node lead-test.mjs` y `node leads-db-test.mjs` (webhook y D1 simulados). Prueba con runtime real: `npx wrangler pages dev dist` (requiere Node ≥ 22).

## Copia de respaldo en D1

El código está preparado y **no está activado**. No crear la base, el binding ni el secreto hasta querer usarlo. Sin `LEADS_DB`, `/api/lead` sigue reenviando a NinjaSuite y no guarda copia.

Tras validar, y antes de llamar a NinjaSuite, `/api/lead` guarda el lead en D1 si el binding existe. Si D1 falla o no está, el webhook se envía igual. Si NinjaSuite no confirma, la fila queda con `webhook_status=webhook_failed`. No se escribe la IP; solo el país (`CF-IPCountry` / `request.cf.country`) cuando Cloudflare lo envía. No se registra PII en consola.

La tabla también se crea sola en el primer uso. El SQL de referencia es `d1/leads.sql` (igual al que ejecuta la función).

Exportación privada, sin enlace en el sitio: `GET /api/leads.csv`. Filtros opcionales `?event=doral` y `?from=YYYY-MM-DD`. CSV UTF-8 con BOM. Secreto `LEADS_EXPORT_TOKEN` en `Authorization: Bearer`, en el header `X-Leads-Export-Token`, o en `?token=`. Sin el secreto, 401. Respuesta `noindex` y `no-store`. El header es preferible: `?token=` puede quedar en logs de acceso.

### Activar en Preview (staging) — no tocar Production

Proyecto Pages: `fulviocorrea`. Hace falta `wrangler login` o `CLOUDFLARE_API_TOKEN` con permiso de D1 y de Pages en la cuenta. Wrangler 4.148 no ofrece un flag Preview en `pages secret put`; el secreto y el binding de Preview se crean en el dashboard para no escribir Production.

1. Crear la base (anotar el `database_id` que imprime):

   ```
   npx wrangler d1 create fulvio-leads
   ```

2. Aplicar el esquema en esa base remota:

   ```
   npx wrangler d1 execute fulvio-leads --remote --file=d1/leads.sql
   ```

3. Binding, **solo Preview**: Dashboard → Workers & Pages → `fulviocorrea` → Settings → Bindings → entorno **Preview** → Add → D1 database. Variable name: `LEADS_DB`. Database: `fulvio-leads`. No añadir el binding en Production.

4. Secreto, **solo Preview**: el mismo proyecto → Settings → Variables and Secrets → entorno **Preview** → Add → Secret. Name: `LEADS_EXPORT_TOKEN`. Value: un token largo que guardes fuera de Cloudflare (el dashboard no lo vuelve a mostrar). No usar `npx wrangler pages secret put` mientras no se confirme que escribe solo en Preview. No definir el secreto en Production.

5. Volver a desplegar la rama `staging` (Retry deployment). Los bindings entran en el siguiente deploy, no en el que ya está publicado.

6. Probar con un lead de prueba en `https://staging.fulviocorrea.pages.dev/es/charla-mommy-makeover-doral/` y descargar:

   ```
   curl -H "Authorization: Bearer <LEADS_EXPORT_TOKEN>" "https://staging.fulviocorrea.pages.dev/api/leads.csv?event=doral"
   ```

### Activar en Production — más adelante, no ahora

Repetir el binding `LEADS_DB` y el secreto `LEADS_EXPORT_TOKEN` en el entorno **Production** del mismo proyecto, luego desplegar `main`. Hasta entonces un deploy a producción reenvía a NinjaSuite y no escribe en D1. Se puede usar la misma base `fulvio-leads` o una base distinta. La URL de exportación en producción sería `https://fulviocorrea.com/api/leads.csv` (sigue siendo privada: 401 sin el token de Production).
