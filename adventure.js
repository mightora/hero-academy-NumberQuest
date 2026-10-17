import {hero,robot} from './art.js';
export const locations=[
{id:1,x:180,y:540,kind:'school',label:'Suit'},
{id:2,x:320,y:540,kind:'signal',label:'Signal'},
{id:3,x:460,y:520,kind:'workshop',label:'Kit'},
{id:4,x:690,y:530,kind:'bridge',label:'Bridge'},
{id:5,x:830,y:430,kind:'light',label:'Light'},
{id:6,x:690,y:340,kind:'robot',label:'Pip'},
{id:7,x:510,y:340,kind:'signal',label:'Fix'},
{id:8,x:340,y:310,kind:'garden',label:'Plant'},
{id:9,x:180,y:260,kind:'base',label:'Cape'},
{id:10,x:360,y:140,kind:'robot',label:'Dot'},
{id:11,x:570,y:150,kind:'book',label:'Story'},
{id:12,x:800,y:170,kind:'tower',label:'Save'}];
export const treasures=[{id:1,x:110,y:440},{id:2,x:545,y:575},{id:3,x:910,y:535},{id:4,x:600,y:255},{id:5,x:100,y:135},{id:6,x:890,y:95}];
export function ensureAdventure(profile){return profile.adventure??(profile.adventure={x:110,y:580,treasures:[]});}
export function clampPosition(x,y){return {x:Math.max(45,Math.min(955,x)),y:Math.max(65,Math.min(610,y))};}
export function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
export function collectNearby(profile){const a=ensureAdventure(profile);let gained=0;for(const t of treasures){if(!a.treasures.includes(t.id)&&distance(a,t)<55){a.treasures.push(t.id);gained++;}}return gained;}
export function landmark(kind,restored=false){const colour=restored?'#f0ca67':'#b4c4b4';const dark='#365f55';let body='';
if(kind==='school'||kind==='base'){body=`<path d="M9 52 65 12l56 40" fill="#de8963"/><rect x="18" y="48" width="94" height="61" rx="5" fill="#e9dba9"/><rect x="55" y="73" width="24" height="36" rx="3" fill="${dark}"/><g fill="${colour}"><rect x="29" y="62" width="14" height="17" rx="3"/><rect x="87" y="62" width="14" height="17" rx="3"/></g><path d="M65 13V0m0 0 22 7-22 7" fill="#15786d" stroke="#15786d" stroke-width="3"/>`;}
else if(kind==='tower'||kind==='signal'){body=`<path d="M52 103 65 15l13 88" fill="none" stroke="${dark}" stroke-width="9"/><path d="M44 104h42M53 72h25M58 49h14" stroke="${dark}" stroke-width="5"/><circle cx="65" cy="21" r="13" fill="${colour}"/><path d="M39 14q-13 15 0 30m52-30q13 15 0 30" fill="none" stroke="${restored?'#f0ca67':'#89a58d'}" stroke-width="5"/>`;}
else if(kind==='workshop'||kind==='light'){body=`<rect x="18" y="42" width="96" height="65" rx="7" fill="#90b6c1"/><path d="M18 43 18 22l25 21V22l27 21V22l44 21" fill="#5f8f96"/><rect x="60" y="63" width="28" height="44" rx="4" fill="${dark}"/><rect x="27" y="62" width="21" height="19" fill="${colour}"/><path d="m94 63 9 10-9 10-9-10z" fill="${colour}"/>`;}
else if(kind==='bridge'){body=`<path d="M5 107q61-53 122 0" stroke="#77a9b5" stroke-width="16" fill="none"/><path d="M9 83q55-70 111 0" stroke="${restored?'#bd9561':'#b2b7a3'}" stroke-width="14" fill="none"/><path d="M20 73V42m28 17V29m30 30V29m29 44V42" stroke="#795b3f" stroke-width="5"/><path d="M19 43q45-39 91 0" stroke="#795b3f" stroke-width="5" fill="none"/>`;}
else if(kind==='garden'){body=`<ellipse cx="65" cy="101" rx="60" ry="17" fill="#7aa983"/><path d="M32 95V40m66 55V27" stroke="${dark}" stroke-width="6"/><g fill="${restored?'#e9ba62':'#9eb39b'}"><circle cx="32" cy="40" r="17"/><circle cx="98" cy="27" r="19"/></g><path d="M32 71Q9 51 9 75q20 16 23-4m66-11q22-19 22 4-19 17-22-4" fill="#2f7c65"/>`;}
else if(kind==='robot'){body=`<rect x="7" y="84" width="116" height="25" rx="9" fill="#a1b6a4"/><g transform="translate(28 3) scale(.55)">${robot(kind==='robot'?'#edb15a':'#77b6af').replace(/<svg[^>]*>|<\/svg>/g,'')}</g>`;}
else{body=`<path d="M12 25q25-13 53 0 28-13 53 0v72q-28-13-53 0-28-13-53 0z" fill="#e4d7ad" stroke="#588779" stroke-width="4"/><path d="M65 25v72" stroke="#588779" stroke-width="3"/><path d="M22 45h30m-30 14h30m24-14h30m-30 14h30" stroke="${restored?'#558377':'#b7b79e'}" stroke-width="4"/>`;}
return `<svg viewBox="0 0 130 120" aria-hidden="true">${body}</svg>`;}
export function terrain(done=[]){const fixed=done.length;return `<svg class="terrain" viewBox="0 0 1000 660" preserveAspectRatio="none" aria-hidden="true"><rect width="1000" height="660" fill="#cbdcc0"/><path d="M0 0h1000v80q-230 68-390 0T0 89z" fill="#b0cbaa"/><path d="M0 395q90-73 192-20t120-40q91-12 103 18T540 440q79 44 128 132l-29 88H470q15-84-65-132T191 458Q88 430 0 490z" fill="#91bdc7"/><path d="M110 580 180 540 320 540 460 520 690 530 830 430 690 340 510 340 340 310 180 260 360 140 570 150 800 170" stroke="#e8dfb9" stroke-width="57" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 580 180 540 320 540 460 520 690 530 830 430 690 340 510 340 340 310 180 260 360 140 570 150 800 170" stroke="#b5ad8b" stroke-width="2" fill="none" stroke-dasharray="4 12"/><path d="M623 502h134v58H623z" fill="${done.includes(4)?'#b99b6d':'#aeac91'}"/><path d="M630 511h118m-118 17h118m-118 17h118" stroke="#755c41" stroke-width="4"/><g fill="#6a9277">${[[45,60],[95,45],[160,75],[925,270],[930,330],[730,55],[460,90],[38,290],[58,340],[220,165],[860,610],[795,610]].map(([x,y])=>`<path d="M${x} ${y+35}v25" stroke="#6b573e" stroke-width="5"/><circle cx="${x}" cy="${y+19}" r="23"/><circle cx="${x+12}" cy="${y+8}" r="20"/>`).join('')}</g><g fill="#f7edc5" opacity=".75">${[[100,230],[420,240],[860,335],[320,610]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4"/><circle cx="${x+14}" cy="${y+9}" r="4"/><circle cx="${x+8}" cy="${y-9}" r="4"/>`).join('')}</g><circle cx="926" cy="42" r="24" fill="#f1d788"/><g fill="${fixed>=12?'#f4cc68':'#adc0a4'}"><path d="m484 203 4 8 9 1-7 7 2 9-8-5-8 5 2-9-7-7 9-1z"/></g></svg>`;}
export function avatar(profile){return hero(profile.colour,profile.emblem,profile.done.length>=9);}

