// Optional game-only capability; no parent credentials enter NumberQuest.
const API='https://chorequest.heroacademy.app/api/games';
const PREFIX='hero-academy-cq-link:';
export function createChoreLink(getProfile,onChange=()=>{},hooks={}){
 const busy=new Map();let retry,debounce;
 const load=p=>{try{return p.choreLinkId?JSON.parse(localStorage.getItem(PREFIX+p.choreLinkId)||'null'):null;}catch{return null;}};
 const store=(p,c)=>{try{localStorage.setItem(PREFIX+p.choreLinkId,JSON.stringify(c));return true;}catch{onChange('Game sync could not be saved. Your local score is safe.');return false;}};
 const notify=message=>onChange(message||'');
 const snapshot=p=>hooks.snapshot?.(p)||null;
 const stamp=p=>JSON.stringify(snapshot(p));
 function merge(remote,local,points,localSettings=true){
  const records=new Map((remote.records||[]).map(r=>[r.id,r]));for(const r of local.records||[])if(!records.has(r.id))records.set(r.id,r);
  return {...(localSettings?local:remote),points,done:[...new Set([...(remote.done||[]),...(local.done||[])])].sort((a,b)=>a-b),treasures:[...new Set([...(remote.treasures||[]),...(local.treasures||[])])].sort((a,b)=>a-b),records:[...records.values()].slice(-10000)};
 }
 async function request(path,c,body){const response=await fetch(API+path,{method:body?'POST':'GET',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json',...(c?{Authorization:'Bearer '+c.token}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();if(!response.ok){const e=Error(data.error||'Game sync is unavailable.');e.status=response.status;throw e;}return data;}
 async function upload(p,c){
  const pending=c.savePending;if(!pending)return;
  let d;for(let attempt=0;attempt<3;attempt++){try{d=await request('/save',c,pending);break;}catch(e){if(e.status!==409||attempt===2)throw e;}}
  const current=load(p);if(!current||current.token!==c.token)return;
  const local=snapshot(p),extra=Math.max(0,local.points-pending.state.points);
  hooks.apply?.(p,merge(d.state,local,d.state.points+extra,JSON.stringify(local)!==JSON.stringify(pending.state)));
  current.ackPoints=d.state.points;current.lastLocal=JSON.stringify(d.state);current.lastSaved=d.updated_at;current.savePending=null;current.initialMerge=false;current.error='';store(p,current);notify();
 }
 async function syncSave(p){
  let c=load(p);if(!snapshot(p)||!c||c.blocked)return;
  if(c.savePending){await upload(p,c);c=load(p);if(!c||c.savePending)return;}
  const remote=await request('/save',c);if(load(p)?.token!==c.token)return;
  const local=snapshot(p),changed=JSON.stringify(local)!==c.lastLocal;
  if(remote.state){
   const delta=c.initialMerge?Math.max(0,local.points-remote.state.points):Math.max(0,local.points-(c.ackPoints||0));
   const hasProgress=local.points>0||local.done.length||local.records.length||local.treasures.length;hooks.apply?.(p,merge(remote.state,local,remote.state.points+delta,changed&&(!c.initialMerge||hasProgress)));
  }
  c=load(p);if(!c)return;c.ackPoints=remote.state?.points||0;c.initialMerge=false;c.lastSaved=remote.updated_at||c.lastSaved;
  const state=snapshot(p);if(JSON.stringify(state)===JSON.stringify(remote.state)){c.lastLocal=JSON.stringify(state);store(p,c);notify();return;}
  c.savePending={id:crypto.randomUUID(),points_delta:Math.max(0,state.points-c.ackPoints),state};
  if(!store(p,c))throw Error('Cannot queue this game save.');await upload(p,c);
 }
 async function run(p){
  const first=load(p);if(!first||first.blocked)return;
  try{
   // Recover a possibly acknowledged save before fetching/merging another device's state.
   if(first.savePending&&snapshot(p))await upload(p,first);
   let c=load(p);const d=await request('/profile',c);if(load(p)?.token!==c.token)return;
   c.child=d.child;c.gameXP=d.gameXP;c.error='';store(p,c);notify();
   while((c=load(p))&&c.queue.length){const event=c.queue[0],d=await request('/events',c,event);const current=load(p);if(!current||current.token!==c.token)break;current.queue=current.queue.filter(e=>e.id!==event.id);current.child=d.child;current.gameXP=d.gameXP;current.error='';store(p,current);notify();}
   await syncSave(p);
  }catch(e){const c=load(p);if(c){c.error=e.message;if(e.status===401||e.status===403)c.blocked=true;if(e.status===422&&c.queue.length)c.queue.shift();store(p,c);}notify(e.message);if(!c?.blocked){clearTimeout(retry);retry=setTimeout(()=>{void sync(p);},60000);}}
 }
 function sync(p=getProfile()){
  const id=p.choreLinkId;if(!id)return Promise.resolve();if(busy.has(id))return busy.get(id);
  const promise=run(p).finally(()=>{busy.delete(id);const c=load(p);if(c&&!c.blocked&&!c.error&&(c.queue.length||c.savePending||snapshot(p)&&stamp(p)!==c.lastLocal)){clearTimeout(debounce);debounce=setTimeout(()=>{void sync(p);},1500);}});busy.set(id,promise);return promise;
 }
 return {
  status(){const p=getProfile(),c=load(p);return c?{connected:true,name:c.child?.name||'Hero',xp:c.child?.xp||0,gameXP:c.gameXP||0,pending:c.queue.length+(c.savePending||snapshot(p)&&stamp(p)!==c.lastLocal?1:0),lastSaved:c.lastSaved,error:c.error||'',blocked:!!c.blocked}:{connected:false};},
  async connect(code,options={}){
   const d=await request('/connect',null,{code}),p=hooks.selectProfile?.(d,options)||getProfile(),previous=load(p);
   p.choreLinkId=p.choreLinkId||crypto.randomUUID();p.choreChildId=d.child.id;
   const reuse=previous&&previous.child?.id===d.child.id;
   const c={...(reuse?previous:{}),token:d.token,child:d.child,gameXP:d.gameXP,queue:reuse?previous.queue:[],blocked:false,error:'',initialMerge:reuse?previous.initialMerge:true,ackPoints:reuse?previous.ackPoints||0:0};
   if(!store(p,c))throw Error('Cannot save this connection in this browser.');hooks.linked?.(p);notify();await sync(p);return d.child;
  },
  async disconnect(){const p=getProfile(),c=load(p);if(c){await sync(p);try{await request('/disconnect',c,{});}catch(e){if(e.status!==401)throw e;}localStorage.removeItem(PREFIX+p.choreLinkId);}notify();},
  enqueue(kind,level){const p=getProfile(),c=load(p);if(!c||c.blocked)return;const id=kind==='challenge'?'first-challenge:'+level:kind==='treasure'?'treasure:'+level:crypto.randomUUID();if(!c.queue.some(e=>e.id===id))c.queue.push({id,kind,level});if(store(p,c)){notify();void sync(p);}},
  scheduleSave(p=getProfile()){clearTimeout(debounce);debounce=setTimeout(()=>{void sync(p);},1500);},
  sync,
  start(){window.addEventListener('online',()=>{void sync();});window.addEventListener('focus',()=>{void sync();});window.addEventListener('pagehide',()=>{void sync();});void sync();}
 };
}
