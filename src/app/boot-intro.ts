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
  setTimeout(function(){delete root.dataset.zmBoot;delete root.dataset.zmStage;root.style.removeProperty("--zm-boot-count");root.style.removeProperty("--zm-boot-progress");},media.matches?0:760);
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
.zm-boot-screen{display:none}
html[data-zm-boot] .zm-boot-screen{display:grid;grid-template-rows:auto minmax(0,1fr) auto;position:fixed;inset:0;z-index:9999;background:#24291e;color:#f4f1e8;padding:clamp(20px,4vw,64px);overflow:hidden;isolation:isolate;visibility:visible;pointer-events:auto;touch-action:none;box-sizing:border-box;clip-path:inset(0);--boot-p:var(--zm-boot-progress,0)}
html[data-zm-boot=pending]{overflow:hidden;overscroll-behavior:none}
html[data-zm-boot=pending] .film-home{visibility:hidden}
html[data-zm-boot=pending] .film-home>.site-header,html[data-zm-boot=pending] .film-home .film-shot{visibility:hidden!important}
.zm-boot-top,.zm-boot-meta{display:flex;justify-content:space-between;align-items:center;gap:16px;font:650 clamp(9px,1vw,12px)/1.3 Arial,sans-serif;letter-spacing:.13em}
.zm-boot-top{padding-bottom:14px;border-bottom:1px solid #f4f1e835}
.zm-boot-top strong{letter-spacing:.035em;color:#ffda24}
.zm-boot-center{position:relative;align-self:center;display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);align-items:center;gap:3vw;max-width:1600px;width:100%;margin-inline:auto}
.zm-boot-editorial{min-width:0;position:relative;z-index:2}
.zm-boot-editorial>span{font:650 10px/1.4 Arial,sans-serif;letter-spacing:.16em;display:block;margin-bottom:18px;color:#c5c9b8}
.zm-boot-editorial>strong{display:block;font:700 clamp(30px,5.6vw,100px)/.93 "DM Sans Variable",Arial,sans-serif;letter-spacing:-.075em}
.zm-boot-editorial em{font:400 1.08em/.95 "Instrument Serif",Georgia,serif;letter-spacing:-.05em;color:#d1dbaa}
.zm-boot-number{position:relative;display:flex;justify-content:flex-end;align-items:baseline;white-space:nowrap;min-width:0;color:#ffda24;font:800 clamp(86px,min(27vw,43vh),420px)/.8 "DM Sans Variable",Arial,sans-serif;letter-spacing:-.105em;font-variant-numeric:tabular-nums}
.zm-boot-number>span::before{counter-reset:zm-loaded var(--zm-boot-count,0);content:counter(zm-loaded,decimal-leading-zero)}
.zm-boot-number b{font-size:.21em;letter-spacing:-.04em;font-weight:650;margin-left:.15em}
.zm-boot-ink{position:absolute;width:clamp(104px,20vw,280px);height:auto;right:5%;bottom:-12%;color:#f4f1e8;transform:rotate(-8deg);z-index:3}
.zm-boot-ink path{stroke-dasharray:1;stroke-dashoffset:calc(1 - clamp(0,calc(var(--boot-p)*4 - var(--pen-index,0)),1));transition:stroke-dashoffset .22s ease-out}
.zm-boot-ink path:nth-child(2){--pen-index:1}.zm-boot-ink path:nth-child(3){--pen-index:2}.zm-boot-ink path:nth-child(4){--pen-index:3}
.zm-boot-bottom{position:relative;display:grid;gap:12px;min-height:54px}
.zm-boot-track{height:2px;background:#f4f1e82b;overflow:hidden}
.zm-boot-track i{display:block;width:100%;height:100%;background:#ffda24;transform:scaleX(var(--boot-p));transform-origin:left;transition:transform .2s ease-out}
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
.zm-boot-skip{display:none;justify-self:start;background:transparent;color:#f4f1e8;border:1px solid #f4f1e866;border-radius:4px;padding:8px 12px;min-height:36px;font:500 12px/1.3 Arial,sans-serif;cursor:pointer}
html[data-zm-boot-slow=true][data-zm-boot=pending] .zm-boot-skip{display:inline-flex;gap:12px}
html[data-zm-boot=ready] .zm-boot-screen,html[data-zm-boot=fallback] .zm-boot-screen{pointer-events:none;animation:zm-boot-opening .72s cubic-bezier(.76,0,.24,1) both}
@keyframes zm-boot-opening{0%,14%{clip-path:inset(0);visibility:visible}100%{clip-path:inset(0 0 100% 0);visibility:hidden}}
@media(max-width:760px){html[data-zm-boot] .zm-boot-screen{padding:24px 20px max(24px,env(safe-area-inset-bottom))}.zm-boot-center{grid-template-columns:1fr;gap:36px;align-self:center}.zm-boot-editorial>strong{font-size:clamp(39px,11vw,65px)}.zm-boot-number{font-size:clamp(90px,min(42vw,30vh),230px);justify-content:flex-start}.zm-boot-ink{right:3%;bottom:-9%;width:40vw;max-width:180px}.zm-boot-meta{font-size:9px;letter-spacing:.04em}.zm-boot-meta>span:last-child{text-align:right}}
@media(max-height:460px) and (min-width:761px){.zm-boot-center{gap:12px}.zm-boot-ink{width:110px;bottom:-5%}.zm-boot-editorial>strong{font-size:clamp(24px,5vw,48px)}}
@media(prefers-reduced-motion:reduce){.zm-boot-screen *{transition:none!important}html[data-zm-boot=ready] .zm-boot-screen,html[data-zm-boot=fallback] .zm-boot-screen{display:none!important;animation:none!important}}
`;
