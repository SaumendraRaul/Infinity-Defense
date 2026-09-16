import test from 'node:test';
import assert from 'node:assert/strict';
import {ATTACK_DURATION,attackPose,drawAttackAnimation,drawAbilityAnimation} from '../src/animations.mjs';
import {Game} from '../src/engine.mjs';
test('attack poses return to rest and reduced motion removes displacement',()=>{
 for(const hero of Object.keys(ATTACK_DURATION)){
  for(const age of[-1,ATTACK_DURATION[hero],ATTACK_DURATION[hero]+1])assert.deepEqual(attackPose(hero,age),{x:0,y:0,tilt:0,squash:1,arm:0});
  assert.equal(attackPose(hero,ATTACK_DURATION[hero]/2,1,true).arm,0);
  for(let n=0;n<60;n++){const p=attackPose(hero,n/60*ATTACK_DURATION[hero],Math.PI);assert(Object.values(p).every(Number.isFinite));assert(p.squash>.7);assert(Math.abs(p.x)<40)}
 }
});
test('all visual timelines produce finite canvas geometry at every phase',()=>{
 const c=new Proxy({globalAlpha:1},{get(target,key){if(key in target)return target[key];return(...args)=>{for(const n of args)if(typeof n==='number')assert(Number.isFinite(n),String(key))}},set(target,key,value){target[key]=value;return true}});
 for(const hero of Object.keys(ATTACK_DURATION))for(const reduced of[false,true])for(let n=0;n<=30;n++){
  const e={hero,type:'attack',x:100,y:200,tx:300,ty:400,age:n/30,life:1,splash:60,color:'#b56cff'};
  drawAttackAnimation(c,e,{reduced});drawAbilityAnimation(c,e,reduced);drawAbilityAnimation(c,{...e,targetEffect:true,fromX:40,fromY:50},reduced);
 }
});
test('combat emits hero identity, source tower and per-enemy ability visuals',()=>{
 for(const hero of Object.keys(ATTACK_DURATION)){
  const g=new Game({mode:'sandbox'}),t=g.place(hero,150,265);g.status='wave';g.wave=1;g.spawn('brute',0,150);g.step(1/60);
  assert(g.events.some(e=>e.type==='attack'&&e.hero===hero&&e.towerId===t.id));
  for(let i=0;i<3;i++)g.upgrade(t.id,0);g.spawn('brute',0,160);g.ability(t.id);
  assert(g.events.some(e=>e.type==='ability'&&e.hero===hero));assert(g.events.some(e=>e.type==='ability-impact'&&e.hero===hero));
 }
});
