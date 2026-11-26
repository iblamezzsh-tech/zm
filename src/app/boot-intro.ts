// Inline before hydration. Progress means completed readiness checks, not
// network bytes. There is no simulated timer or early 100%.
// A bounded fallback remains available for failed/blocked resources.
export const bootScript=`(function(){try{
 if(location.pathname!=="/")return;
 var root=document.documentElement,done=false,checking=false,failed=false,dom=false,assets=0,windowReady=false,fonts=false,camera=false,portrait=false,scroll=false,finalFrame=false;
 var slow=0,hard=0,media=matchMedia("(prefers-reduced-motion: reduce)");
 root.dataset.zmBoot="pending";root.dataset.zmStage="document";root.style.setProperty("--zm-boot-count","0");
 function write(){
  if(done)return;
  var n=(dom?10:0)+Math.floor(assets*35)+(windowReady?10:0)+(fonts?15:0)+(camera?15:0)+(portrait?5:0)+(scroll?5:0)+(finalFrame?5:0);
  root.style.setProperty("--zm-boot-count",String(Math.min(99,n)));
  root.style.setProperty("--zm-boot-progress",String(Math.min(.99,n/100)));
  root.dataset.zmStage=!dom?"document":assets<1||!windowReady?"images":!fonts?"fonts":!camera||!portrait||!scroll?"motion":"frame";
 }
 function finish(ok){
  if(done)return;done=true;clearTimeout(slow);clearTimeout(hard);
  document.removeEventListener("zm-film-ready",onCamera);document.removeEventListener("zm-portrait-ready",onPortrait);document.removeEventListener("zm-scroll-ready",onScroll);document.removeEventListener("DOMContentLoaded",onDOM);window.removeEventListener("load",onLoad);document.removeEventListener("click",skip,true);
  delete root.dataset.zmBootSlow;
  if(ok){root.style.setProperty("--zm-boot-count","100");root.style.setProperty("--zm-boot-progress","1");root.dataset.zmStage="ready";}
  else{root.dataset.zmStage="fallback";}
  root.dataset.zmBoot=ok?"ready":"fallback";
  // Remove the gate completely once its exit has finished.
  setTimeout(function(){delete root.dataset.zmBoot;delete root.dataset.zmStage;delete root.dataset.zmBootPhoto;root.style.removeProperty("--zm-boot-count");root.style.removeProperty("--zm-boot-progress");},media.matches?0:1180);
 }
 function check(){
  write();
  if(done||checking||!dom||assets<1||!windowReady||!fonts||!camera||!portrait||!scroll)return;
  checking=true;
  // Refit typography after fonts and images settle; measure final unlocked layout.
  document.dispatchEvent(new Event("zm-boot-prepare"));
  requestAnimationFrame(function(){requestAnimationFrame(function(){
   if(done)return;
   document.dispatchEvent(new Event("zm-boot-prepare"));finalFrame=true;
   if(!failed)finish(true);else finish(false);
  });});
 }
 function onCamera(e){camera=true;if(e.detail&&e.detail.ok===false)failed=true;check();}
 function onPortrait(e){portrait=true;if(e.detail&&e.detail.ok===false)failed=true;check();}
 function onScroll(){scroll=true;check();}
 function onLoad(){windowReady=true;check();}
 function skip(e){if(e.target&&e.target.closest&&e.target.closest("[data-boot-skip]")){e.preventDefault();finish(false);}}
 function onDOM(){
  if(dom||done)return;dom=true;
  var map=new Map();
  document.querySelectorAll("main.film-home img").forEach(function(img){var src=img.currentSrc||img.src;if(src&&!map.has(src))map.set(src,img);});
  var intro=document.querySelector(".zm-boot-portrait img");if(intro){intro.decode().then(function(){if(!done)root.dataset.zmBootPhoto="true";},function(){});}
  var tasks=Array.from(map.values()),settled=0;
  if(!tasks.length){assets=1;check();}
  tasks.forEach(function(img){
   function complete(ok){if(done)return;settled++;if(!ok)failed=true;assets=settled/tasks.length;check();}
   if(typeof img.decode==="function"){img.decode().then(function(){complete(img.naturalWidth>0);},function(){complete(false);});}
   else if(img.complete)complete(img.naturalWidth>0);
   else{img.addEventListener("load",function(){complete(true);},{once:true});img.addEventListener("error",function(){complete(false);},{once:true});}
  });
  if(document.fonts){
   Promise.allSettled([document.fonts.load('400 16px "DM Sans Variable"'),document.fonts.load('800 48px "DM Sans Variable"'),document.fonts.load('400 48px "Instrument Serif"'),document.fonts.load('italic 400 48px "Instrument Serif"')]).then(function(results){if(results.some(function(r){return r.status==="rejected";}))failed=true;return document.fonts.ready;}).then(function(){fonts=true;check();},function(){fonts=true;failed=true;check();});
  }else{fonts=true;check();}
  check();
 }
 document.addEventListener("zm-film-ready",onCamera);document.addEventListener("zm-portrait-ready",onPortrait);document.addEventListener("zm-scroll-ready",onScroll);document.addEventListener("click",skip,true);
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",onDOM,{once:true});else onDOM();
 if(document.readyState==="complete")onLoad();else window.addEventListener("load",onLoad,{once:true});
 slow=setTimeout(function(){if(!done)root.dataset.zmBootSlow="true";},15000);
 hard=setTimeout(function(){finish(false);},45000);
 }catch(e){delete document.documentElement.dataset.zmBoot;}})();`;

export const bootCSS=`
/* V48 — an opening credit sequence made out of the existing identity and portrait.
   No separate graphics engine, external art, or artificial progress. */
.zm-boot-screen{display:none}
html[data-zm-boot] .zm-boot-screen{display:block;position:fixed;inset:0;z-index:9999;background:#24291e;color:#f4f1e8;overflow:hidden;isolation:isolate;visibility:visible;pointer-events:auto;touch-action:none;box-sizing:border-box;--boot-p:var(--zm-boot-progress,0);--opening:clamp(0,calc((var(--boot-p) - .10)*1.12),1)}
html[data-zm-boot=pending]{overflow:hidden;overscroll-behavior:none}
html[data-zm-boot=pending] .film-home{visibility:hidden}
html[data-zm-boot=pending] .film-home>.site-header,html[data-zm-boot=pending] .film-home .film-shot{visibility:hidden!important}
.zm-boot-atlas,.zm-boot-light{position:absolute;inset:0;pointer-events:none}
.zm-boot-atlas{background:url("/hero-contours-static.svg") center/cover no-repeat;filter:invert(1);opacity:calc(.09 + var(--boot-p)*.19);z-index:0}
.zm-boot-light{z-index:0;background:radial-gradient(ellipse at 50% 80%,#c6cc9e30,transparent 66%);opacity:var(--boot-p)}
.zm-boot-top,.zm-boot-bottom{position:absolute;left:clamp(20px,3.3vw,60px);right:clamp(20px,3.3vw,60px);z-index:6}
.zm-boot-top{top:max(20px,env(safe-area-inset-top));display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;border-bottom:1px solid #f4f1e835;padding-bottom:14px}
.zm-boot-top strong{font:900 clamp(24px,3vw,42px)/1 Arial,sans-serif;letter-spacing:-.1em}
.zm-boot-top strong span{color:#ffda24}
.zm-boot-top>span,.zm-boot-meta{font:650 clamp(9px,.85vw,12px)/1.3 Arial,sans-serif;letter-spacing:.11em}
.zm-boot-top>span:nth-child(2){text-align:center}.zm-boot-top>span:last-child{text-align:right}
.zm-boot-stagecraft{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.zm-boot-wordmark{position:absolute;inset:12.5% 5.5% auto;opacity:calc(.23 + var(--boot-p)*.77);color:#f4f1e8;z-index:1;transform:translateY(calc((1 - var(--boot-p))*-2vh));clip-path:inset(0 calc((1 - var(--boot-p))*100%) 0 0);transition:clip-path .32s cubic-bezier(.2,.75,.25,1),transform .32s,opacity .32s}
.zm-boot-wordmark svg{width:100%;height:auto;display:block;overflow:visible;fill:currentColor;font-family:Georgia,serif;font-weight:700}
.zm-boot-portrait{position:absolute;inset:0;z-index:2;transform-origin:50% 100%;transform:translateY(calc((1 - var(--opening))*9vh)) scale(calc(1.23 - var(--opening)*.11));opacity:0;clip-path:inset(calc((1 - var(--opening))*100%) 0 0);transition:clip-path .4s cubic-bezier(.2,.75,.25,1),transform .4s,opacity .24s}
html[data-zm-boot-photo=true] .zm-boot-portrait,html[data-zm-boot=ready] .zm-boot-portrait{opacity:1}
.zm-boot-portrait img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:bottom center;display:block;filter:grayscale(calc(1 - var(--boot-p))) brightness(calc(.65 + var(--boot-p)*.35));transition:filter .35s}
.zm-boot-title{position:absolute;bottom:25%;left:3.3%;z-index:4;width:min(30%,520px)}
.zm-boot-title small{font:650 clamp(9px,.9vw,12px)/1.4 Arial,sans-serif;letter-spacing:.15em;color:#ffda24;display:block;margin-bottom:15px}
.zm-boot-title strong{font:750 clamp(30px,min(4.35vw,8vh),76px)/.95 "DM Sans Variable",Arial,sans-serif;letter-spacing:-.075em;display:block}
.zm-boot-title em{font:400 1.05em/.95 "Instrument Serif",Georgia,serif;letter-spacing:-.04em;color:#d1dbaa}
.zm-boot-number{position:absolute;right:3.3%;bottom:24%;z-index:5;display:flex;flex-wrap:wrap;align-items:baseline;justify-content:flex-end;color:#ffda24;font:800 clamp(68px,min(13vw,23vh),220px)/.82 "DM Sans Variable",Arial,sans-serif;letter-spacing:-.095em;font-variant-numeric:tabular-nums;max-width:36%}
.zm-boot-number>span::before{counter-reset:zm-loaded var(--zm-boot-count,0);content:counter(zm-loaded,decimal-leading-zero)}
.zm-boot-number b{font-size:.29em;font-weight:650;letter-spacing:-.045em;margin-left:.09em}
.zm-boot-number small{flex-basis:100%;text-align:right;font:600 9px/1.3 Arial,sans-serif;letter-spacing:.1em;margin-top:16px;color:#c8cfb9}
.zm-boot-ink{position:absolute;width:clamp(105px,17.5vw,260px);height:auto;bottom:12%;right:3.3%;color:#ffda24;z-index:5}
.zm-boot-ink path{stroke-dasharray:1;stroke-dashoffset:calc(1 - clamp(0,calc(var(--boot-p)*4 - var(--pen-index,0)),1));transition:stroke-dashoffset .25s ease-out}
.zm-boot-ink path:nth-child(2){--pen-index:1}.zm-boot-ink path:nth-child(3){--pen-index:2}.zm-boot-ink path:nth-child(4){--pen-index:3}
.zm-boot-bottom{bottom:max(19px,env(safe-area-inset-bottom));display:grid;gap:12px}
.zm-boot-track{display:grid;grid-template-columns:repeat(20,minmax(0,1fr));gap:4px;height:3px}
.zm-boot-track i{position:relative;background:#f4f1e82b;overflow:hidden}
.zm-boot-track i::before{content:"";position:absolute;inset:0;background:#ffda24;transform:scaleX(clamp(0,calc(var(--boot-p)*20 - var(--boot-i)),1));transform-origin:left;transition:transform .2s ease-out}
.zm-boot-meta{display:flex;justify-content:space-between;gap:16px}
.zm-boot-stage{color:#ffda24}
.zm-boot-stage::before{content:"PREPARING THE EXPERIENCE"}
html[data-zm-stage=document] .zm-boot-stage::before{content:"01 / OPENING THE JOURNAL"}
html[data-zm-stage=images] .zm-boot-stage::before{content:"02 / LOADING THE PORTRAITS & RECORDS"}
html[data-zm-stage=fonts] .zm-boot-stage::before{content:"03 / SETTING THE TYPE"}
html[data-zm-stage=motion] .zm-boot-stage::before{content:"04 / CHOREOGRAPHING MOTION"}
html[data-zm-stage=frame] .zm-boot-stage::before{content:"05 / THE FIRST FRAME"}
html[data-zm-stage=ready] .zm-boot-stage::before{content:"READY / THE JOURNEY BEGINS"}
html[data-zm-stage=fallback] .zm-boot-stage::before{content:"CONTINUING WITH AVAILABLE ASSETS"}
.zm-boot-access{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.zm-boot-skip{display:none;justify-self:start;background:#24291e;color:#f4f1e8;border:1px solid #f4f1e866;border-radius:4px;padding:8px 12px;min-height:36px;font:500 12px/1.3 Arial,sans-serif;cursor:pointer}
html[data-zm-boot-slow=true][data-zm-boot=pending] .zm-boot-skip{display:inline-flex;gap:12px}
/* A match dissolve: the existing portrait and name are already in hero positions
   as the dark negative turns into the real warm ivory opening. */
html[data-zm-boot=ready] .zm-boot-screen{pointer-events:none;animation:zm-boot-match 1.1s cubic-bezier(.22,1,.36,1) both}
html[data-zm-boot=ready] .zm-boot-wordmark{animation:zm-boot-name .85s both}
html[data-zm-boot=ready] .zm-boot-atlas{animation:zm-boot-atlas .85s both}
html[data-zm-boot=ready] .zm-boot-portrait{animation:zm-boot-photo .9s both}
html[data-zm-boot=ready] .zm-boot-title,html[data-zm-boot=ready] .zm-boot-number,html[data-zm-boot=ready] .zm-boot-top,html[data-zm-boot=ready] .zm-boot-bottom{animation:zm-boot-credit-out .48s .12s both}
html[data-zm-boot=fallback] .zm-boot-screen{pointer-events:none;animation:zm-boot-fallback .65s both}
@keyframes zm-boot-match{0%,12%{background:#24291e;opacity:1}70%{background:#eeece3;opacity:1}100%{background:#eeece3;opacity:0;visibility:hidden}}
@keyframes zm-boot-name{0%,12%{color:#f4f1e8;clip-path:inset(0)}100%{color:#24291e;clip-path:inset(0)}}
@keyframes zm-boot-atlas{from{filter:invert(1);opacity:.28}to{filter:none;opacity:1}}
@keyframes zm-boot-photo{0%,12%{clip-path:inset(0);filter:none;transform:scale(1.12)}100%{clip-path:inset(0);filter:none;transform:scale(1.12)}}
@keyframes zm-boot-credit-out{from{opacity:1;translate:0 0}to{opacity:0;translate:0 -14px}}
@keyframes zm-boot-fallback{to{opacity:0;visibility:hidden}}
@media(min-width:851px) and (max-height:700px){.zm-boot-wordmark{inset:10% 5.5% auto}}
@media(max-width:850px){.zm-boot-wordmark{inset:15% 3% auto}.zm-boot-portrait{transform:translateY(calc((1 - var(--opening))*9vh)) scale(calc(1.16 - var(--opening)*.11))}.zm-boot-title{bottom:24%;width:40%}.zm-boot-title strong{font-size:clamp(25px,5vw,50px)}.zm-boot-number{bottom:29%;font-size:clamp(66px,14vw,130px)}.zm-boot-ink{width:clamp(100px,18vw,175px)}@keyframes zm-boot-photo{from{clip-path:inset(0);transform:scale(1.05)}to{clip-path:inset(0);transform:scale(1.05)}}}
@media(max-width:600px){.zm-boot-top{grid-template-columns:1fr 1fr}.zm-boot-top>span:nth-child(2){display:none}.zm-boot-top>span:last-child{font-size:9px}.zm-boot-wordmark{inset:14% 2% auto}.zm-boot-portrait{transform:translateY(calc((1 - var(--opening))*9vh)) scale(calc(1.1 - var(--opening)*.1))}.zm-boot-title{left:4%;bottom:15%;width:56%;padding:10px;background:#24291ede}.zm-boot-title strong{font-size:clamp(24px,7vw,36px)}.zm-boot-title small{font-size:8px;margin-bottom:8px}.zm-boot-number{right:4%;top:29%;bottom:auto;max-width:55%;font-size:clamp(53px,18vw,96px);text-shadow:0 1px 14px #24291e99}.zm-boot-number small{font-size:7px;margin-top:9px}.zm-boot-ink{bottom:11%;right:4%;width:88px}.zm-boot-bottom{gap:8px;left:4%;right:4%;bottom:max(12px,env(safe-area-inset-bottom))}.zm-boot-meta{font-size:8px;letter-spacing:.015em}.zm-boot-meta>span:last-child{text-align:right}@keyframes zm-boot-photo{from{clip-path:inset(0);transform:scale(1)}to{clip-path:inset(0);transform:scale(1)}}}
@media(max-height:460px){.zm-boot-title{bottom:22%}.zm-boot-title strong{font-size:clamp(20px,6vh,34px)}.zm-boot-number{font-size:clamp(48px,19vh,96px)}.zm-boot-ink{width:90px}}
@media(prefers-reduced-motion:reduce){.zm-boot-screen *{transition:none!important}html[data-zm-boot=ready] .zm-boot-screen,html[data-zm-boot=fallback] .zm-boot-screen{display:none!important;animation:none!important}}
`;
