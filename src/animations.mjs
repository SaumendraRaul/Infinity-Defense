// Cosmetic timelines are independent of damage. They use the battle clock,
// so pause, slow motion and fast-forward keep poses and effects synchronized.
export const ATTACK_DURATION={ironman:.32,captain:.66,thor:.56,spiderman:.38,strange:.62,wanda:.58,panther:.34,hulk:.68};
export function attackPose(hero,age,angle=0,reduced=false){
 const p=Math.max(0,Math.min(1,age/(ATTACK_DURATION[hero]||.4)));
 if(reduced||age<0||p>=1)return{x:0,y:0,tilt:0,squash:1,arm:0};
 const strike=Math.sin(Math.PI*p),snap=Math.sin(Math.PI*Math.min(1,p*2));
 const travel=hero==='panther'?32:hero==='spiderman'?12:hero==='captain'?7:hero==='hulk'?8:hero==='ironman'?-5:3;
 return{x:Math.cos(angle)*travel*strike,y:Math.sin(angle)*travel*strike-(hero==='hulk'?22:hero==='spiderman'?9:0)*snap,tilt:(hero==='panther'?.28:hero==='hulk'?-.1:.07)*strike*(Math.cos(angle)<0?-1:1),squash:hero==='hulk'?1-.16*Math.sin(p*Math.PI*2):1,arm:strike};
}
function animRing(c,x,y,r,color,width=2){c.beginPath();c.arc(x,y,Math.max(.1,r),0,Math.PI*2);c.strokeStyle=color;c.lineWidth=width;c.stroke()}
function animLine(c,points,color,width=2){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke()}
function animStar(c,x,y,r,color,rotation=0){c.beginPath();for(let i=0;i<10;i++){const a=rotation+i*Math.PI/5-Math.PI/2,d=i%2?r*.42:r;c.lineTo(x+Math.cos(a)*d,y+Math.sin(a)*d)}c.closePath();c.fillStyle=color;c.fill()}
function animWeb(c,x,y,r,alpha=1){c.save();c.globalAlpha*=alpha;for(let j=0;j<6;j++){const a=j*Math.PI/3;animLine(c,[[x,y],[x+Math.cos(a)*r,y+Math.sin(a)*r]],'#e3f6ff',1.5)}for(let ring=1;ring<4;ring++){c.beginPath();for(let j=0;j<=6;j++){const a=j*Math.PI/3;c.lineTo(x+Math.cos(a)*r*ring/3,y+Math.sin(a)*r*ring/3)}c.strokeStyle='#e3f6ff';c.lineWidth=1;c.stroke()}c.restore()}
function animRune(c,x,y,r,rotation,color){c.save();c.translate(x,y);c.rotate(rotation);animRing(c,0,0,r,color,2);animRing(c,0,0,r*.77,color,1);for(let i=0;i<8;i++){c.rotate(Math.PI/4);animLine(c,[[r*.83,-2],[r*.96,0],[r*.83,3]],color,1.5)}for(let i=0;i<2;i++){c.rotate(Math.PI/4);c.strokeStyle=color;c.lineWidth=1.5;c.strokeRect(-r*.49,-r*.49,r*.98,r*.98)}c.restore()}
export function drawAttackAnimation(c,e,{reduced=false,detail=true}={}){
 const p=Math.min(1,e.age/e.life),hero=e.hero||({bolt:'ironman',shield:'captain',lightning:'thor',web:'spiderman',magic:'strange',chaos:'wanda',claw:'panther',smash:'hulk'}[e.style]),x=e.x,y=e.y-18,tx=e.tx,ty=e.ty-12,dx=tx-x,dy=ty-y,a=Math.atan2(dy,dx),fade=Math.min(1,(1-p)*4),travel=Math.min(1,p*2.8),px=x+dx*travel,py=y+dy*travel;
 c.save();c.globalAlpha=fade;c.shadowColor=e.color;c.shadowBlur=detail&&!reduced?8:0;
 if(reduced){animRing(c,tx,ty,10,e.color,3);c.restore();return}
 if(hero==='ironman'){
  const power=Math.sin(Math.PI*p);animLine(c,[[x,y],[tx,ty]],'#57cfff88',12*power);animLine(c,[[x,y],[tx,ty]],'#a8f4ff',5*power);animLine(c,[[x,y],[tx,ty]],'#ffffff',2.2*power);animRing(c,x,y,7+power*7,'#c5faff',2);animStar(c,tx,ty,9+power*10,'#fff0bc',p*2);
  if(e.splash)for(let i=0;i<3;i++){const q=Math.min(1,p*2),bx=x+dx*q+Math.sin(q*Math.PI)*(i-1)*40,by=y+dy*q-35*Math.sin(q*Math.PI);animLine(c,[[bx-Math.cos(a)*15,by-Math.sin(a)*15],[bx,by]],'#ffbc6e',4);}
 }else if(hero==='captain'){
  const q=p<.5?p*2:(1-p)*2,arc=Math.sin(p*Math.PI*2)*26,sx=x+dx*q-Math.sin(a)*arc,sy=y+dy*q+Math.cos(a)*arc;
  animLine(c,[[sx-Math.cos(a)*22,sy-Math.sin(a)*22],[sx,sy]],'#b6e1ff88',7);c.save();c.translate(sx,sy);c.rotate(p*18);for(const [r,col]of[[15,'#d94858'],[11,'#f6efde'],[8,'#387bc2']]){c.fillStyle=col;c.beginPath();c.arc(0,0,r,0,7);c.fill()}animStar(c,0,0,7,'#fff9dd');c.restore();
 }else if(hero==='thor'){
  const flash=Math.floor(p*14)%2?1:.6;c.globalAlpha*=flash;const points=[[x,y]];for(let i=1;i<9;i++)points.push([x+dx*i/9+Math.sin(i*13+Math.floor(p*12))*13,y+dy*i/9+Math.cos(i*7+Math.floor(p*12))*11]);points.push([tx,ty]);animLine(c,points,'#50a9ff66',10);animLine(c,points,'#a3e8ff',4);animLine(c,points,'#fff',1.5);animRing(c,tx,ty,9+p*22,'#b9efff',2);
  if(!e.chain){c.save();c.translate(px,py-12*Math.sin(travel*Math.PI));c.rotate(p*15);c.fillStyle='#976b43';c.fillRect(-3,0,6,21);c.fillStyle='#c9e2ed';c.strokeStyle='#577082';c.lineWidth=2;c.fillRect(-13,-9,26,17);c.strokeRect(-13,-9,26,17);c.restore()}
 }else if(hero==='spiderman'){
  animLine(c,[[x,y],[px,py]],'#f1f6ff',2.5);if(p<.4){animWeb(c,px,py,7+travel*8)}else animWeb(c,tx,ty,12+(p-.4)*35,1-(p-.4)*.6);
 }else if(hero==='strange'){
  animRune(c,x,y,18+Math.sin(p*Math.PI)*8,p*3,'#ffc779');animRune(c,tx,ty,10+p*31,-p*4,'#ffb56d');const q=Math.min(1,p*3);animLine(c,[[x,y],[x+dx*q,y+dy*q]],'#ffd99588',3);animStar(c,px,py,9,'#fff0b3',p*7);
 }else if(hero==='wanda'){
  for(let side=-1;side<=1;side+=2){const points=[];for(let i=0;i<14;i++){const q=i/13*travel,offset=Math.sin(q*Math.PI*5-p*10)*12*side;points.push([x+dx*q-Math.sin(a)*offset,y+dy*q+Math.cos(a)*offset])}animLine(c,points,side===1?'#ff5f96':'#ffabc9',3)}
  c.fillStyle='#ff5f9699';c.beginPath();c.arc(px,py,7+Math.sin(p*Math.PI)*7,0,7);c.fill();animRing(c,tx,ty,Math.max(5,(e.splash||36)*p),'#ff82b2',3);animStar(c,px,py,8,'#ffe1ef',p*5);
 }else if(hero==='panther'){
  if(p<.3)animLine(c,[[x,y],[tx,ty]],'#b56cff55',10*(1-p));c.save();c.translate(tx,ty);c.rotate(a-.8);for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(-24+i*7,-19);c.quadraticCurveTo(18+i*6,-5,9+i*7,22);c.strokeStyle=i===0?'#faf0ff':'#cd91ff';c.lineWidth=3*(1-p)+1;c.stroke()}c.restore();
 }else if(hero==='hulk'){
  const r=(e.splash||65)*Math.sqrt(p);c.save();c.translate(tx,ty);c.scale(1,.58);animRing(c,0,0,r,'#c6ed94',5*(1-p)+1);animRing(c,0,0,r*.65,'#f2efbc',2);c.restore();
  for(let i=0;i<(detail?9:4);i++){const a=i*2.399,dist=p*75,bx=tx+Math.cos(a)*dist,by=ty+Math.sin(a)*dist*.55-Math.sin(p*Math.PI)*30;animLine(c,[[tx+Math.cos(a)*12,ty+Math.sin(a)*7],[tx+Math.cos(a)*r*.8,ty+Math.sin(a)*r*.5]],'#665339aa',2);c.fillStyle=i%2?'#8b7955':'#b9a77b';c.fillRect(bx,by,5*(1-p)+2,4*(1-p)+2)}
 }
 if(e.splash&&hero!=='hulk'&&hero!=='wanda')animRing(c,tx,ty,e.splash*Math.sqrt(p),e.color+'88',2);
 c.restore();
}
export function drawAbilityAnimation(c,e,reduced=false){
 const p=Math.min(1,e.age/e.life),r=(e.radius||230)*Math.sqrt(p),color=e.color||'#b56cff';c.save();c.globalAlpha=(1-p)*.85;
 if(reduced){animRing(c,e.x,e.y,35,color,3);c.restore();return}
 if(e.targetEffect){
  if(e.hero==='thor')drawAttackAnimation(c,{...e,x:e.x-25,y:e.y-240,tx:e.x,ty:e.y,hero:'thor',chain:true,age:e.age,life:e.life},{detail:true});
  else if(e.hero==='spiderman')animWeb(c,e.x,e.y-12,30+p*16);
  else if(e.hero==='strange'){animRune(c,e.x,e.y-12,30+p*20,p*4,'#88ffd1');if(e.fromX!==undefined)animLine(c,[[e.fromX,e.fromY],[e.x,e.y]],'#b5ffe877',4)}
  else if(e.hero==='wanda'){animRune(c,e.x,e.y-12,22+p*35,-p*3,'#ff749f');animStar(c,e.x,e.y-12,16*(1-p),'#ffd0e4',p*4)}
  else animStar(c,e.x,e.y-24,16+p*15,color,p*3);
 }else{
  if(e.hero==='strange')animRune(c,e.x,e.y,r,p*2,'#96ffd3');
  else if(e.hero==='spiderman')animWeb(c,e.x,e.y,r);
  else if(e.hero==='captain'){animRing(c,e.x,e.y,r,'#f6e4c5',7);animRing(c,e.x,e.y,r*.86,'#df5966',5);animStar(c,e.x,e.y,35*(1-p),'#e2f5ff',p)}
  else if(e.hero==='hulk'){for(let i=0;i<3;i++){c.save();c.translate(e.x,e.y);c.scale(1,.65);animRing(c,0,0,Math.max(2,r-i*30),'#c6ed91',6-i);c.restore()}}
  else if(e.hero==='panther'){animRing(c,e.x,e.y,r,'#bc72ff',7);for(let i=0;i<12;i++){const a=i*Math.PI/6;animLine(c,[[e.x+Math.cos(a)*r*.7,e.y+Math.sin(a)*r*.7],[e.x+Math.cos(a)*r,e.y+Math.sin(a)*r]],'#efcfff',3)}}
  else{animRing(c,e.x,e.y,r,color,5);animRing(c,e.x,e.y,r*.75,color,2);for(let i=0;i<8;i++){const a=i*Math.PI/4+p;animStar(c,e.x+Math.cos(a)*r,e.y+Math.sin(a)*r,8*(1-p),'#fff2dd',a)}}
 }
 c.restore();
}
