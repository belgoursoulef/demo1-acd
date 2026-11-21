/* ================= THÈMES PAR JOUR ================= */
const themes={
  j1:{kicker:"$ ping acd-rt.bethune.fr — 64 bytes, ttl=62, time=2-4 juin 2027",
      title:"Tous les paquets<br>mènent à <em>Béthune</em>.",
      lead:"Jour 1 : on branche tout le monde. Accueil, ouverture officielle et lancement du grand jeu.",
      day:"Jour 1 · Connexion — déroulé",
      slots:[["12:00","Accueil & badges","Hall principal — kit participant","Accueil","a2"],["14:00","Ouverture officielle","Amphi — mot de la direction","Plénière","a1"],["16:30","Lancement du Cluedo","Premiers indices cachés dans l'IUT","Jeu","a3"],["19:30","Soirée de bienvenue","Centre-ville de Béthune","Soirée","a4"]]},
  j2:{kicker:"DOSSIER N°RT-2027 — CONFIDENTIEL",
      title:"Le switch a été<br><em>débranché</em>.",
      lead:"Jour 2 : l'assemblée travaille le jour, les enquêteurs sortent le soir. Les indices se resserrent.",
      day:"Jour 2 · L'Enquête — déroulé",
      slots:[["09:00","Assemblée générale — session 1","Amphi","Plénière","a1"],["14:00","Ateliers thématiques","Salles TP R&T","Atelier","a2"],["17:00","Interrogatoire des suspects","Hall — nouveaux indices","Jeu","a3"],["20:00","Dîner de gala","Lieu à confirmer","Soirée","a4"]]},
  j3:{kicker:"INSERT COIN ▸ PLAYER 1 READY",
      title:"GAME<br><em>OVER ?</em>",
      lead:"Jour 3 : dernière session, révélation du coupable, remise des prix et high-scores.",
      day:"Jour 3 · Game Over — déroulé",
      slots:[["09:00","Assemblée générale — session 2","Amphi","Plénière","a1"],["11:30","Révélation du coupable","Et remise des prix","Jeu","a3"],["12:30","Déjeuner de clôture","Restaurant","Repas","a4"]]}
};
function setTheme(t){
  document.body.dataset.theme=t;
  const th=themes[t];
  document.getElementById('h-kicker').textContent=th.kicker;
  document.getElementById('h-title').innerHTML=th.title;
  document.getElementById('h-lead').textContent=th.lead;
  document.getElementById('day-title').textContent=th.day;
  document.getElementById('timeline').innerHTML=th.slots.map(s=>
    `<div class="slot"><span class="t">${s[0]}</span><div><h4>${s[1]}</h4><p>${s[2]}</p></div><span class="pill ${s[4]}">${s[3]}</span></div>`).join('');
  document.querySelectorAll('.tbtn').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
  document.querySelectorAll('.day-card').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
}
document.querySelectorAll('.tbtn,.day-card').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.t)));
setTheme('j1');

/* ================= CARTE INTERACTIVE ================= */
const zones=[
  {x:160,y:150,t:"Bâtiment R&T",tag:"Zone 1 · Ateliers",c:"#ffd23f",d:"Salles TP : ateliers thématiques. Un indice du Cluedo se cache près d'une baie de brassage…"},
  {x:440,y:150,t:"Les Amphis",tag:"Zone 2 · Plénières",c:"#ff5d73",d:"Ouverture officielle et assemblées générales."},
  {x:160,y:330,t:"Hall & Accueil",tag:"Zone 3 · Accueil",c:"#fbf7ef",d:"Badges, kits participants, QR code photos et tableau des scores de Pac-Net."},
  {x:400,y:330,t:"Restaurant",tag:"Zone 4 · Pause",c:"#2de2e6",d:"Déjeuners et pauses café. Zone sans énigme… en théorie."},
  {x:300,y:210,t:"La Fontaine du Ping",tag:"Zone 5 · Rendez-vous",c:"#3ddc84",d:"Point de ralliement des équipes pour le grand jeu."}
];
const mg=document.getElementById('markers'),lg=document.getElementById('legend');
zones.forEach((z,i)=>{
  mg.insertAdjacentHTML('beforeend',`<g class="marker" data-i="${i}"><circle class="pulse" cx="${z.x}" cy="${z.y}" r="14" fill="#101935"/><circle cx="${z.x}" cy="${z.y}" r="14" fill="#101935" stroke="#fff" stroke-width="3"/><text x="${z.x}" y="${z.y+5}" fill="#ffd23f" font-weight="800" font-size="14" text-anchor="middle">${i+1}</text></g>`);
  const li=document.createElement('li');li.innerHTML=`<span class="dot" style="background:${z.c}">${i+1}</span>${z.t}`;li.onclick=()=>showZone(i);lg.appendChild(li);
});
function showZone(i){const z=zones[i];mi('mi-title',z.t);mi('mi-tag',z.tag);mi('mi-text',z.d);document.querySelectorAll('.marker').forEach(m=>m.classList.toggle('on',+m.dataset.i===i));}
function mi(id,v){document.getElementById(id).textContent=v}
document.querySelectorAll('.marker').forEach(m=>m.addEventListener('click',()=>showZone(+m.dataset.i)));

/* ================= FILTRE RÉGIMES RESTAURANTS ================= */
document.querySelectorAll('#diet-filter .moment').forEach(b=>b.addEventListener('click',()=>{
  const f=b.dataset.f;
  document.querySelectorAll('#diet-filter .moment').forEach(x=>x.classList.toggle('on',x===b));
  document.querySelectorAll('.resto-cat li').forEach(li=>li.classList.toggle('off',f!=='all'&&!(li.dataset.tags||'').split(' ').includes(f)));
}));

/* ================= GALERIE SOUVENIRS ================= */
function gallery(m){
  document.getElementById('gallery').innerHTML=[1,2,3,4].map(n=>`<div class="photo"><div><b>📸</b>${m} — photo ${n}</div></div>`).join('');
  document.querySelectorAll('.moment').forEach(b=>b.classList.toggle('on',b.dataset.m===m));
}
document.querySelectorAll('.moment').forEach(b=>b.addEventListener('click',()=>gallery(b.dataset.m)));
gallery('Matin');

/* ================= MINI-JEU : PAC-NET (Snake) ================= */
const cv=document.getElementById('snake'),ctx=cv.getContext('2d'),S=24,W=21,H=14;
// Murs = contours + blocs "bâtiments" (à remplacer par le vrai plan)
const walls=new Set();
for(let x=0;x<W;x++){walls.add(x+',0');walls.add(x+','+(H-1));}
for(let y=0;y<H;y++){walls.add('0,'+y);walls.add((W-1)+','+y);}
[[3,3,4,2],[13,3,4,2],[3,9,4,2],[13,9,4,2],[9,6,3,2]].forEach(([bx,by,bw,bh])=>{for(let x=bx;x<bx+bw;x++)for(let y=by;y<by+bh;y++)walls.add(x+','+y)});
const items=["📡","🖥️","🔌","📶"];
let snake,dir,next,food,score,timer,best=0;
try{best=+localStorage.getItem('pacnet-best')||0}catch(e){}
document.getElementById('best').textContent=best;
function freeCell(){let c;do{c={x:1+Math.floor(Math.random()*(W-2)),y:1+Math.floor(Math.random()*(H-2))}}while(walls.has(c.x+','+c.y)||snake.some(s=>s.x===c.x&&s.y===c.y));return c}
function reset(){snake=[{x:10,y:12},{x:9,y:12},{x:8,y:12}];dir={x:1,y:0};next=dir;score=0;food={...freeCell(),e:items[0]};document.getElementById('score').textContent=0}
function draw(){
  ctx.fillStyle='#0e1430';ctx.fillRect(0,0,cv.width,cv.height);
  ctx.fillStyle='#2b3566';walls.forEach(k=>{const[x,y]=k.split(',').map(Number);ctx.fillRect(x*S+1,y*S+1,S-2,S-2)});
  ctx.font=(S-4)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(food.e,food.x*S+S/2,food.y*S+S/2+1);
  snake.forEach((s,i)=>{ctx.fillStyle=i?'#2de2e6':'#ffd23f';ctx.fillRect(s.x*S+2,s.y*S+2,S-4,S-4)});
}
function step(){
  dir=next;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(walls.has(h.x+','+h.y)||snake.some(s=>s.x===h.x&&s.y===h.y)){return over()}
  snake.unshift(h);
  if(h.x===food.x&&h.y===food.y){score+=10;document.getElementById('score').textContent=score;if(score>=50)document.getElementById('pacnet-code').hidden=false;food={...freeCell(),e:items[Math.floor(Math.random()*items.length)]}}else snake.pop();
  draw();
}
function over(){clearInterval(timer);timer=null;
  if(score>best){best=score;try{localStorage.setItem('pacnet-best',best)}catch(e){}document.getElementById('best').textContent=best}
  ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(0,0,cv.width,cv.height);ctx.fillStyle='#ff5d73';ctx.font='bold 26px sans-serif';ctx.fillText('PAQUET PERDU !',cv.width/2,cv.height/2-10);ctx.fillStyle='#fff';ctx.font='16px sans-serif';ctx.fillText('Score : '+score+' — clique sur Jouer',cv.width/2,cv.height/2+22);
}
function turn(d){const m={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[d];if(m&&(m.x!==-dir.x||m.y!==-dir.y))next=m}
document.getElementById('start').onclick=()=>{reset();draw();clearInterval(timer);timer=setInterval(step,140)};
document.querySelectorAll('.pad button').forEach(b=>b.onclick=()=>turn(b.dataset.d));
document.addEventListener('keydown',e=>{const k={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[e.key];if(k&&timer){e.preventDefault();turn(k)}});
reset();draw();

/* ================= ÉNIGMES : CHASSE AUX INDICES =================
   Tout est vérifié dans le navigateur (site statique).
   Les réponses sont légèrement masquées en base64 pour ne pas être lisibles d'un coup d'œil. */
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
let solved=[];
try{solved=JSON.parse(localStorage.getItem('acd-enigmes')||'[]')}catch(e){solved=[]}
const cards=[...document.querySelectorAll('.eni[data-id]')];
const wrong=["Paquet rejeté 🚫","Timeout… essaie encore","Erreur 404 : bonne réponse introuvable","Mauvais masque, on recommence"];
function refresh(){
  cards.forEach(c=>c.classList.toggle('done',solved.includes(c.dataset.id)));
  const n=solved.length,t=cards.length;
  document.getElementById('eni-count').textContent=`${n} / ${t} résolues`;
  document.getElementById('fab-count').textContent=n;
  document.getElementById('eni-bar').style.width=(n/t*100)+'%';
  document.getElementById('eni-final').classList.toggle('won',n===t);
}
function save(){try{localStorage.setItem('acd-enigmes',JSON.stringify(solved))}catch(e){}}
cards.forEach(c=>{
  c.querySelector('form').addEventListener('submit',e=>{
    e.preventDefault();
    const inp=c.querySelector('input'),fb=c.querySelector('.fb');
    if(btoa(norm(inp.value))===c.dataset.a){
      if(!solved.includes(c.dataset.id))solved.push(c.dataset.id);
      fb.className='fb ok';fb.textContent='Connexion établie ✅';save();refresh();
    }else{
      fb.className='fb ko';fb.textContent=wrong[Math.floor(Math.random()*wrong.length)];
    }
  });
});
document.getElementById('eni-reset').onclick=()=>{solved=[];save();cards.forEach(c=>{c.querySelector('input').value='';c.querySelector('.fb').textContent=''});refresh()};
refresh();
