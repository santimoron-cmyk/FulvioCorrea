// GET /api/leads.csv — private backup export. Not linked from any page.
// Auth: Authorization: Bearer <token>, header X-Leads-Export-Token, or ?token=
// The secret is LEADS_EXPORT_TOKEN (Preview first). Missing or wrong token is 401.
import {exportFilter,leadsCsv,sameSecret} from '../../server/leads-db.mjs';
const locked={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer'};
const json=(body,status)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json',...locked}});
export async function onRequest(context){
 const request=context.request;
 if(request.method!=='GET')return json({error:'method_not_allowed'},405);
 const expected=context.env?.LEADS_EXPORT_TOKEN;
 if(typeof expected!=='string'||!expected)return json({error:'unauthorized'},401);
 const url=new URL(request.url);
 const header=request.headers.get('x-leads-export-token')||'';
 const auth=request.headers.get('authorization')||'';
 const bearer=/^Bearer\s+(\S+)$/i.exec(auth)?.[1]||'';
 const presented=[header,bearer,url.searchParams.get('token')||''];
 let ok=false;for(const value of presented){if(value&&await sameSecret(value,expected))ok=true;}
 if(!ok)return json({error:'unauthorized'},401);
 const filter=exportFilter(url);
 if(filter.error)return json({error:'bad_filter'},400);
 const db=context.env?.LEADS_DB;
 if(!db)return json({error:'not_configured'},503);
 try{
  const csv=await leadsCsv(db,filter);
  const headers={'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="leads.csv"',...locked};
  if(csv.truncated)headers['X-Leads-Truncated']='true';
  return new Response(csv.body,{status:200,headers});
 }catch{return json({error:'not_configured'},503);}
}
