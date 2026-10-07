// Cloudflare Pages Function: POST /api/lead
// Port of the former netlify/functions/lead.mjs. Validates the consultation form server-side and
// forwards the lead to the HighLevel / LeadConnector inbound webhook configured in Cloudflare:
//   LEAD_WEBHOOK_URL      (secret)  https://services.leadconnectorhq.com/hooks/...  (HTTPS only)
//   LEAD_CAPTURE_ENABLED  (text)    "true" to accept leads; anything else answers 503 not_configured
//   LEADS_DB              (D1)      optional backup. Missing or failing storage still forwards the lead.
// The webhook URL is never sent to the browser (verify.mjs fails the build if it appears in client JS).
import {createLeadHandler} from '../../server/lead-handler.mjs';
import procedures from '../_shared/lead-procedures.js';

let handler, handlerEnv;
export async function onRequest(context) {
  // One handler per isolate (keeps the in-memory rate limit / idempotency cache), rebuilt if env changes.
  if (!handler || handlerEnv !== context.env) { handler = createLeadHandler({ env: context.env || {}, procedures }); handlerEnv = context.env; }
  const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
  const country = context.request.cf?.country || context.request.headers.get('CF-IPCountry') || '';
  return handler(context.request, { ip, country });
}
