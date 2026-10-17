// Optional game-only capability. Parent credentials and chore permissions never enter this app.
const API='https://chorequest.heroacademy.app/api/games';
const PREFIX='hero-academy-cq-link:';
export function createChoreLink(getProfile,onChange=()=>{}){
 const busy=new Set();let retry;
 const load=p=>{try{return p.choreLinkId?JSON.parse(localStorage.getItem(PREFIX+p.choreLinkId)||'null'):null;}catch{return null;}};
 const store=(p,c)=>{try{localStorage.setItem(PREFIX+p.choreLinkId,JSON.stringify(c));return true;}catch{onChange('Game sync could not be saved. Your local score is safe.');return false;}};
 const notify=message=>onChange(message||'');
 async function request(path,c,body){const response=await fetch(API+path,{method:body?'POST':'GET',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json',...(c?{Authorization:'Bearer '+c.token}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();if(!response.ok){const e=Error(data.error||'Game sync is unavailable.');e.status=response.status;throw e;}return data;}
 async function sync(p=getProfile()){
  const id=p.choreLinkId;if(!id||busy.has(id))return;const first=load(p);if(!first||first.blocked)return;busy.add(id);
  try{let c=load(p);if(!c.queue.length){const d=await request('/profile',c);if(load(p)?.token!==c.token)return;c.child=d.child;c.gameXP=d.gameXP;c.error='';store(p,c);notify();}
   while((c=load(p))&&c.queue.length){const event=c.queue[0],d=await request('/events',c,event);let current=load(p);if(!current||current.token!==c.token)break;current.queue=current.queue.filter(e=>e.id!==event.id);current.child=d.child;current.gameXP=d.gameXP;current.error='';store(p,current);notify();}
  }catch(e){const c=load(p);if(c){c.error=e.message;if(e.status===401||e.status===403)c.blocked=true;if(e.status===422&&c.queue.length)c.queue.shift();store(p,c);}notify(e.message);if(!c?.blocked){clearTimeout(retry);retry=setTimeout(()=>{void sync(p);},60000);}}finally{busy.delete(id);}
 }
 return {
  status(){const c=load(getProfile());return c?{connected:true,name:c.child?.name||'Hero',xp:c.child?.xp||0,gameXP:c.gameXP||0,pending:c.queue.length,error:c.error||'',blocked:!!c.blocked}:{connected:false};},
  async connect(code){const p=getProfile(),d=await request('/connect',null,{code});p.choreLinkId=p.choreLinkId||crypto.randomUUID();if(!store(p,{token:d.token,child:d.child,gameXP:d.gameXP,queue:[]}))throw Error('Cannot save this connection in this browser.');notify();return d.child;},
  async disconnect(){const p=getProfile(),c=load(p);if(c){try{await request('/disconnect',c,{});}catch(e){if(e.status!==401)throw e;}localStorage.removeItem(PREFIX+p.choreLinkId);}notify();},
  enqueue(kind,level){const p=getProfile(),c=load(p);if(!c||c.blocked)return;const id=kind==='challenge'?'first-challenge:'+level:kind==='treasure'?'treasure:'+level:crypto.randomUUID();if(!c.queue.some(e=>e.id===id))c.queue.push({id,kind,level});if(store(p,c)){notify();void sync(p);}},
  sync,
  start(){window.addEventListener('online',()=>{void sync();});void sync();}
 };
}
