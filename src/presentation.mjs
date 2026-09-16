// V3.1 presentation layer: keeps gameplay untouched while pushing the UI and
// battlefield toward a bolder comic-book / action-figure look.
const basePortraitSvg=portraitSvg;
portraitSvg=function(id){
 const h=HEROES.find(hero=>hero.id===id),svg=basePortraitSvg(id);
 if(!h)return svg;
 const overlay=`<defs><pattern id="comicDots" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.15" fill="#fff" opacity=".13"/></pattern><filter id="comicInk" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="0" flood-color="#15101e" flood-opacity=".95"/></filter></defs><path d="M0 0h160v160H0z" fill="url(#comicDots)"/><path d="M-8 132L168 0M-8 159L168 27" stroke="${h.color}" stroke-width="4" opacity=".2"/>`;
 return svg.replace(/(<svg[^>]*>)/,`$1${overlay}<g filter="url(#comicInk)">`).replace('</svg>',`</g><path d="M5 5h150v150H5z" fill="none" stroke="${h.color}" stroke-width="3" opacity=".55"/><path d="M10 145h52" stroke="#fff0b2" stroke-width="4" opacity=".85"/></svg>`);
};

const baseHeroDraw=Renderer.prototype.hero;
Renderer.prototype.hero=function(c,t,now,selected){
 const h=HEROES.find(hero=>hero.id===t.hero),tier=Math.max(...t.upgrades);
 c.save();c.translate(t.x,t.y);
 c.fillStyle='#09071288';c.strokeStyle=selected?'#f1d4ff':h.color+'99';c.lineWidth=selected?3:2;
 c.beginPath();c.ellipse(0,20,39,16,0,0,Math.PI*2);c.fill();c.stroke();
 c.strokeStyle='#ffffff18';c.lineWidth=2;c.beginPath();c.ellipse(0,17,31,10,0,0,Math.PI*2);c.stroke();
 if(tier>=3){
  c.save();c.globalAlpha=.42;c.strokeStyle=tier>=4?'#ffe8a6':h.color;c.lineWidth=tier>=4?3:2;
  const spin=this.reduced?0:now*.00035;c.rotate(spin);
  for(let i=0;i<8;i++){c.rotate(Math.PI/4);c.beginPath();c.moveTo(43,0);c.lineTo(tier>=4?57:52,0);c.stroke()}
  c.restore();
 }
 c.restore();
 baseHeroDraw.call(this,c,t,now,selected);
 if(selected||tier>=4){c.save();c.translate(t.x,t.y);c.strokeStyle=selected?'#fff1c1':h.color;c.globalAlpha=selected?.62:.38;c.lineWidth=2;for(let i=0;i<4;i++){const a=-.7+i*.47;c.beginPath();c.moveTo(Math.cos(a)*44,Math.sin(a)*28-13);c.lineTo(Math.cos(a)*54,Math.sin(a)*35-13);c.stroke()}c.restore()}
};

if(typeof document!=='undefined'){
 const style=document.createElement('style');style.dataset.infinityPresentation='v3.1';style.textContent=`
 body:before{content:'';position:fixed;inset:0;pointer-events:none;z-index:20;opacity:.075;background-image:radial-gradient(circle,#fff 1px,transparent 1.3px);background-size:8px 8px;mix-blend-mode:soft-light}
 .app-header{box-shadow:inset 0 2px #efd4ff55,0 5px 0 #1a0d28,0 9px 18px #10071855}
 .brand-mark{transform:skew(-5deg);box-shadow:0 4px 0 #23102f,0 0 0 2px #ffffff14 inset}
 .battlefield{isolation:isolate;border-color:#21142d;box-shadow:0 5px 0 #12091d,0 16px 30px #09050f55,inset 0 0 0 2px #d9b9ef55}
 .battlefield:before{content:'';position:absolute;inset:0;z-index:3;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.06),transparent 22%,transparent 76%,rgba(30,9,42,.20)),radial-gradient(circle at 20% 18%,transparent 0 48%,rgba(21,6,29,.20) 100%);mix-blend-mode:overlay}
 .battlefield:after{content:'';position:absolute;inset:0;z-index:3;pointer-events:none;opacity:.09;background-image:radial-gradient(circle,#100c16 1px,transparent 1.3px);background-size:7px 7px}
 .mission-heading>div:first-child,.resources>div,.map-chip{backdrop-filter:blur(10px) saturate(1.15)}
 .mission-heading>div:first-child{transform:skew(-2deg);border-left:5px solid #d79bff}
 .mission-heading h1{letter-spacing:.4px;text-transform:uppercase;text-shadow:2px 3px 0 #182017,4px 5px 12px #0008}
 .command-panel{border-color:#2b1538;box-shadow:inset 0 2px #f0d5ff6b,0 5px 0 #160b20,0 14px 25px #0b061155}
 .panel-heading{position:relative;overflow:hidden}.panel-heading:after{content:'';position:absolute;width:140px;height:220%;right:-55px;top:-60%;background:#ffffff12;transform:rotate(18deg);pointer-events:none}
 .hero-card{clip-path:polygon(0 0,92% 0,100% 11%,100% 100%,8% 100%,0 89%);border-width:2px;box-shadow:0 3px 0 #251430;transition:transform .14s ease,filter .14s ease,box-shadow .14s ease,border-color .14s ease}
 .hero-card:hover:not(:disabled){transform:translateY(-3px) rotate(-.35deg);box-shadow:0 6px 0 #24122f,0 10px 18px #10071855}.hero-card.chosen{transform:translateY(-2px);box-shadow:0 5px 0 #6f3a96,0 0 0 2px #f0caff44,0 0 20px #b56cff44}
 .hero-art{overflow:hidden}.hero-art:before{content:'';position:absolute;inset:0;z-index:2;pointer-events:none;background-image:radial-gradient(circle,#fff 1px,transparent 1.2px);background-size:7px 7px;opacity:.12;mix-blend-mode:screen}.hero-art img{filter:saturate(1.12) contrast(1.08);transform:scale(1.04);transition:transform .18s ease,filter .18s ease}.hero-card:hover .hero-art img{transform:scale(1.095) translateY(-1px);filter:saturate(1.2) contrast(1.12)}
 .roster-count{transform:skew(-5deg);border:1px solid #d9aeef44;padding-inline:8px;border-radius:5px;background:#3f2453aa}
 .primary-button{clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px);box-shadow:0 4px 0 #3b1950;font-weight:900;letter-spacing:.3px}.primary-button:hover:not(:disabled){filter:brightness(1.1) saturate(1.12);transform:translateY(-1px)}
 .small-button,.secondary-button,.command-tabs button{box-shadow:0 3px 0 #2b1739}.upgrade-card{position:relative;overflow:hidden;border-width:2px;box-shadow:0 3px 0 #1d1228}.upgrade-card:before{content:'';position:absolute;right:-22px;top:-22px;width:78px;height:78px;border:2px solid #ffffff10;transform:rotate(45deg);pointer-events:none}.upgrade-card button:not(:disabled){box-shadow:0 3px 0 #30133f}
 .round-banner{font-style:italic;letter-spacing:1px;text-shadow:3px 4px 0 #3f244f,6px 7px 18px #0009;transform:translate(-50%,-50%) skew(-5deg)}.boss-bar{border-width:2px;box-shadow:0 4px 0 #2b142d,0 8px 22px #0005}.toast{border-width:2px;box-shadow:0 4px 0 #23112f,0 8px 18px #0005}
 @media(prefers-reduced-motion:reduce){.hero-card,.hero-art img,.primary-button{transition:none!important}.hero-card:hover:not(:disabled),.hero-card.chosen{transform:none}}
 `;document.head.append(style);
 document.documentElement.dataset.presentation='comic-v3-1';
}
