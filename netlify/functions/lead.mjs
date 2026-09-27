import fs from 'node:fs';
import {createLeadHandler} from '../../server/lead-handler.mjs';
const procedures=fs.readdirSync('content/procedures').filter(f=>f.endsWith('.en.json')).map(f=>JSON.parse(fs.readFileSync('content/procedures/'+f,'utf8'))).filter(p=>p.offeredConfirmed).map(p=>p.slug);
const handle=createLeadHandler({procedures});
export default (request,context)=>handle(request,{ip:context.ip});
export const config={path:'/api/lead'};
