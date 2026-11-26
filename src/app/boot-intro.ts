// V87: single owner for intro cover, hero preparation, aperture, and release.
export const bootScript=`(function(){try{
 if(location.pathname!=="/"||location.hash)return;
 var root=document.documentElement,media=matchMedia("(prefers-reduced-motion: reduce)");
 var phase="pending",screen=null,main=null,visibleSince=0,dom=false,photo=false,fonts=false,photoOK=false;
 var hold=0,hard=0,slow=0,release=0,frame1=0,frame2=0;
 root.dataset.zmBoot="pending";root.dataset.zmStage="document";
 function setPhase(next){phase=next;root.dataset.zmBoot=next;if(screen)screen.dataset.bootPhase=next}
 function status(stage,message){
  if(phase!=="pending")return;root.dataset.zmStage=stage;
  var live=document.querySelector(".zm-boot-access");if(live&&live.textContent!==message)live.textContent=message;
 }
 function clean(){
  if(phase==="done")return;phase="done";
  clearTimeout(hold);clearTimeout(hard);clearTimeout(slow);clearTimeout(release);
  cancelAnimationFrame(frame1);cancelAnimationFrame(frame2);
  document.removeEventListener("DOMContentLoaded",onDOM);document.removeEventListener("click",skip,true);
  window.removeEventListener("pageshow",restore);
  media.removeEventListener&&media.removeEventListener("change",reduced);
  if(screen){screen.removeEventListener("animationend",ended);screen.dataset.bootPhase="done";screen.style.display="none"}
  if(main){main.removeAttribute("inert")}
  delete root.dataset.zmBoot;delete root.dataset.zmStage;delete root.dataset.zmBootSlow;
  document.dispatchEvent(new Event("zm-boot-prepare"));
 }
 function ended(e){
  if(phase==="revealing"&&e.target.classList.contains("zm-boot-shutter-bottom")&&e.animationName==="boot85-bottom")clean();
 }
 function reveal(){
  if(phase!=="pending")return;
  clearTimeout(hold);clearTimeout(hard);clearTimeout(slow);
  if(media.matches||!screen){clean();return}
  // First paint the actual page UNDER a completely opaque cover.
  // Only after two frames can the aperture start. Never remove the cover
  // on a readiness event or a timer intended for the intro.
  delete root.dataset.zmBootSlow;root.dataset.zmStage="ready";
  setPhase("covered");
  document.dispatchEvent(new Event("zm-boot-prepare"));
  screen.addEventListener("animationend",ended);
  frame1=requestAnimationFrame(function(){frame2=requestAnimationFrame(function(){
   if(phase!=="covered")return;
   setPhase("revealing");
   clearTimeout(release);release=setTimeout(clean,1900);
  })});
  // Escape even if a background tab suppresses animation frames.
  release=setTimeout(clean,2500);
 }
 function check(){
  if(phase!=="pending"||!dom)return;
  if(!photo){status("images","Preparing the first portrait.");return}
  if(!fonts){status("fonts","Preparing the typography.");return}
  status("motion","Opening the first frame.");
  if(media.matches){clean();return}
  if(!visibleSince||hold)return;
  hold=setTimeout(reveal,Math.max(0,2700-(performance.now()-visibleSince)));
 }
 function skip(e){if(e.target&&e.target.closest&&e.target.closest("[data-boot-skip]")){e.preventDefault();reveal()}}
 function restore(e){if(e.persisted)clean()}
 function reduced(){if(media.matches)clean()}
 function onDOM(){
  if(dom||phase!=="pending")return;dom=true;
  screen=document.querySelector(".zm-boot-screen");main=document.querySelector("main.film-home");
  if(!screen||!main){clean();return}
  screen.dataset.bootPhase="pending";main.setAttribute("inert","");
  frame1=requestAnimationFrame(function(){frame2=requestAnimationFrame(function(){
   if(phase!=="pending")return;visibleSince=performance.now();
   slow=setTimeout(function(){if(phase==="pending")root.dataset.zmBootSlow="true"},1600);
   clearTimeout(hard);hard=setTimeout(reveal,5000);check()
  })});
  var img=document.querySelector(".ed-opening .hero-portrait-plane > img.photo");
  function imageDone(ok){if(photo||phase!=="pending")return;photo=true;photoOK=ok;check()}
  if(!img)imageDone(false);
  else if(typeof img.decode==="function")img.decode().then(function(){imageDone(img.naturalWidth>0)},function(){imageDone(img.complete&&img.naturalWidth>0)});
  else if(img.complete)imageDone(img.naturalWidth>0);
  else{img.addEventListener("load",function(){imageDone(true)},{once:true});img.addEventListener("error",function(){imageDone(false)},{once:true})}
  if(document.fonts&&document.fonts.load){
   Promise.allSettled([document.fonts.load('400 16px "DM Sans Variable"'),document.fonts.load('800 48px "DM Sans Variable"'),document.fonts.load('400 48px "Instrument Serif"'),document.fonts.load('italic 400 48px "Instrument Serif"')]).then(function(){fonts=true;check()});
  }else{fonts=true;check()}
  // DOM-level fail-safe, cancelled once the visible clock starts.
  hard=setTimeout(reveal,7500);
  check();
 }
 document.addEventListener("click",skip,true);window.addEventListener("pageshow",restore);
 media.addEventListener&&media.addEventListener("change",reduced);
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",onDOM,{once:true});else onDOM();
 }catch(e){var r=document.documentElement;delete r.dataset.zmBoot;delete r.dataset.zmStage;delete r.dataset.zmBootSlow;var m=document.querySelector("main.film-home");if(m)m.removeAttribute("inert");var s=document.querySelector(".zm-boot-screen");if(s)s.style.display="none"}})();`;
export const bootCSS=`
/* V85 — the opening is a camera aperture, not a separate slide.
   The same original contour artwork and wordmark connect to the actual hero. */
.zm-boot-screen{display:none}
html[data-zm-boot] .zm-boot-screen{
 display:block;position:fixed;inset:0;z-index:9999;color:#f4f1e8;overflow:hidden;
 isolation:isolate;pointer-events:auto;touch-action:none;box-sizing:border-box;
 --boot-pad:clamp(20px,4vw,64px);--boot-ink:#24291e;
}
html[data-zm-boot]{overflow:hidden!important;overscroll-behavior:none}
html[data-zm-boot=pending] .film-home{visibility:hidden}
html[data-zm-boot=pending] .film-home>.site-header,html[data-zm-boot=pending] .film-home .film-shot{visibility:hidden!important}
.zm-boot-shutter{position:absolute;inset:0;background:#24291e;pointer-events:none;overflow:hidden;z-index:0}
.zm-boot-shutter::before{content:"";position:absolute;inset:-100px;background:#b7c1a4;opacity:.30;mask:url("/atmosphere/home-contours-v80.svg") center top/clamp(950px,115vw,1850px) auto repeat;-webkit-mask:url("/atmosphere/home-contours-v80.svg") center top/clamp(950px,115vw,1850px) auto repeat;animation:boot85-map 8s ease-in-out infinite alternate}
.zm-boot-shutter::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,#35443166,transparent 72%)}
.zm-boot-shutter-top{clip-path:polygon(0 0,100% 0,100% 51%,72% 51%,50% 51%,28% 51%,0 51%)}
.zm-boot-shutter-bottom{clip-path:polygon(0 49%,28% 49%,50% 49%,72% 49%,100% 49%,100% 100%,0 100%)}
.zm-boot-top,.zm-boot-bottom{position:absolute;left:var(--boot-pad);right:var(--boot-pad);z-index:4}
.zm-boot-top{top:max(20px,env(safe-area-inset-top));display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;gap:12px;border-bottom:1px solid #f4f1e838;padding-bottom:16px}
.zm-boot-top img{width:clamp(40px,4vw,50px);height:auto;display:block}
.zm-boot-top>span,.zm-boot-meta{font:650 clamp(9px,.85vw,12px)/1.4 "DM Sans Variable",Arial,sans-serif;letter-spacing:.12em}
.zm-boot-top>span:nth-child(2){text-align:center}.zm-boot-top>span:last-child{text-align:right}
.zm-boot-stagecraft{position:absolute;inset:0;display:grid;place-items:center;z-index:2;pointer-events:none}
.zm-boot-wordmark{position:relative;width:min(88%,1150px);color:#f4f1e8;text-align:center;z-index:2}
.zm-boot-wordmark>span{display:block;color:#ffda24;font:650 clamp(10px,1.1vw,14px)/1.4 "DM Sans Variable",Arial,sans-serif;letter-spacing:.23em;margin-bottom:clamp(10px,2vh,24px)}
.zm-boot-wordmark svg{width:100%;height:auto;display:block;overflow:visible;fill:currentColor;font-family:Georgia,"Times New Roman",serif;font-weight:700;font-size:132px;letter-spacing:-4px}
.zm-boot-subtitle{font:650 clamp(19px,3vw,46px)/1.12 "DM Sans Variable",Arial,sans-serif;letter-spacing:-.04em;margin-top:clamp(4px,1vh,14px)}
.zm-boot-subtitle em{font:400 1.15em/1.08 "Instrument Serif",Georgia,serif;color:#dce0d2;letter-spacing:-.025em}
.zm-boot-orbit{position:absolute;left:50%;top:50%;width:min(56vw,72vh);aspect-ratio:1;transform:translate(-50%,-50%);pointer-events:none;opacity:.68}
.zm-boot-orbit i{position:absolute;inset:0;border:1px solid #dce0d222;border-radius:50%;animation:boot85-orbit 7s linear infinite}
.zm-boot-orbit i:nth-child(2){inset:11%;animation-duration:6s;animation-direction:reverse}
.zm-boot-orbit i:nth-child(3){inset:23%;animation-duration:9s}
.zm-boot-orbit i:nth-child(4){inset:35%;animation-duration:5s;animation-direction:reverse}
.zm-boot-orbit i::after{content:"";position:absolute;left:50%;top:-2px;width:4px;height:4px;border-radius:50%;background:#ffda24;box-shadow:0 0 12px #ffda2470}
.zm-boot-ink{position:absolute;right:var(--boot-pad);bottom:clamp(100px,17vh,180px);width:clamp(120px,20vw,290px);height:auto;color:#ffda24;z-index:3}
.zm-boot-ink path{stroke-dasharray:1;stroke-dashoffset:0;animation:boot85-ink 1.45s cubic-bezier(.25,.75,.25,1) both}
.zm-boot-ink path:nth-child(2){animation-delay:.32s}.zm-boot-ink path:nth-child(3){animation-delay:.4s}.zm-boot-ink path:nth-child(4){animation-delay:.65s}
.zm-boot-bottom{bottom:max(20px,env(safe-area-inset-bottom));display:grid;gap:12px}
.zm-boot-meta{display:flex;justify-content:space-between;gap:16px}
.zm-boot-stage{color:#ffda24}
.zm-boot-stage::before{content:"01 / OPENING THE JOURNAL"}
html[data-zm-stage=images] .zm-boot-stage::before{content:"02 / THE FIRST PORTRAIT"}
html[data-zm-stage=fonts] .zm-boot-stage::before{content:"03 / SETTING THE TYPE"}
html[data-zm-stage=motion] .zm-boot-stage::before,html[data-zm-stage=ready] .zm-boot-stage::before{content:"THE FIRST FRAME"}
html[data-zm-stage=fallback] .zm-boot-stage::before{content:"CONTINUING"}
.zm-boot-track{height:3px;position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:5px;overflow:hidden}
.zm-boot-track i{background:#f4f1e830;transition:background .25s}
html:is([data-zm-stage=images],[data-zm-stage=fonts],[data-zm-stage=motion],[data-zm-stage=ready]) .zm-boot-track i:first-child,
html:is([data-zm-stage=fonts],[data-zm-stage=motion],[data-zm-stage=ready]) .zm-boot-track i:nth-child(2),
html:is([data-zm-stage=motion],[data-zm-stage=ready]) .zm-boot-track i:nth-child(3){background:#ffda24}
.zm-boot-track b{position:absolute;inset:0 auto 0 0;width:26%;background:linear-gradient(90deg,transparent,#f4f1e8,transparent);animation:boot85-scan 1.55s linear infinite}
.zm-boot-access{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.zm-boot-skip{display:none;justify-self:start;background:#24291e;color:#f4f1e8;border:1px solid #f4f1e866;border-radius:4px;padding:8px 12px;min-height:36px;font:500 12px/1.3 "DM Sans Variable",Arial,sans-serif;cursor:pointer}
html[data-zm-boot-slow=true][data-zm-boot=pending] .zm-boot-skip{display:inline-flex;gap:12px}
.zm-boot-aperture{position:absolute;left:0;right:0;top:50%;height:2px;z-index:1;pointer-events:none;background:#ffda24;opacity:0;transform:scaleX(0)}
@keyframes boot85-map{from{transform:translate3d(-52px,35px,0)}to{transform:translate3d(52px,-35px,0)}}
@keyframes boot85-orbit{to{transform:rotate(360deg)}}
@keyframes boot85-ink{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes boot85-scan{from{transform:translateX(-110%)}to{transform:translateX(500%)}}
@keyframes boot85-top{
 0%,12%{clip-path:polygon(0 0,100% 0,100% 51%,72% 51%,50% 51%,28% 51%,0 51%)}
 38%{clip-path:polygon(0 0,100% 0,100% 43%,72% 39%,50% 32%,28% 39%,0 43%)}
 100%{clip-path:polygon(0 0,100% 0,100% 0,72% 0,50% 0,28% 0,0 0)}
}
@keyframes boot85-bottom{
 0%,12%{clip-path:polygon(0 49%,28% 49%,50% 49%,72% 49%,100% 49%,100% 100%,0 100%)}
 38%{clip-path:polygon(0 57%,28% 61%,50% 68%,72% 61%,100% 57%,100% 100%,0 100%)}
 100%{clip-path:polygon(0 100%,28% 100%,50% 100%,72% 100%,100% 100%,100% 100%,0 100%)}
}
@keyframes boot85-type-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.08) translateY(-18px)}}
@keyframes boot85-top-out{to{opacity:0;transform:translateY(-24px)}}
@keyframes boot85-bottom-out{to{opacity:0;transform:translateY(24px)}}
@keyframes boot85-flash{0%{opacity:0;transform:scaleX(0)}26%{opacity:.95;transform:scaleX(1)}55%,100%{opacity:0;transform:scaleX(1)}}
@keyframes boot85-fallback{to{opacity:0;visibility:hidden}}
html[data-zm-boot=revealing] .zm-boot-screen{pointer-events:auto}
body>.zm-boot-screen[data-boot-phase=revealing] .zm-boot-shutter-top{animation:boot85-top 1.4s cubic-bezier(.65,.03,.22,1) both}
body>.zm-boot-screen[data-boot-phase=revealing] .zm-boot-shutter-bottom{animation:boot85-bottom 1.4s cubic-bezier(.65,.03,.22,1) both}
body>.zm-boot-screen[data-boot-phase=revealing] .zm-boot-stagecraft{animation:boot85-type-out .58s cubic-bezier(.5,0,.3,1) both}
body>.zm-boot-screen[data-boot-phase=revealing] .zm-boot-top{animation:boot85-top-out .6s both}
body>.zm-boot-screen[data-boot-phase=revealing] .zm-boot-bottom{animation:boot85-bottom-out .6s both}
body>.zm-boot-screen[data-boot-phase=revealing] .zm-boot-aperture{animation:boot85-flash 1s ease both}
html[data-zm-boot=fallback] .zm-boot-screen{pointer-events:none;animation:boot85-fallback .35s both}
@media(max-width:600px){
 .zm-boot-top{grid-template-columns:1fr 1fr}.zm-boot-top>span:nth-child(2){display:none}
 .zm-boot-wordmark{width:94%}.zm-boot-subtitle{font-size:clamp(22px,6vw,34px)}
 .zm-boot-orbit{width:82vw}.zm-boot-ink{bottom:18%;width:130px}
 .zm-boot-meta{font-size:8px;letter-spacing:.06em}
}
@media(max-height:460px){.zm-boot-ink{bottom:21%;width:110px}.zm-boot-wordmark{width:min(76%,800px)}}
@media(prefers-reduced-motion:reduce){
 .zm-boot-screen *,.zm-boot-screen *::before,.zm-boot-screen *::after{animation:none!important;transition:none!important}
 html[data-zm-boot=revealing] .zm-boot-screen,html[data-zm-boot=fallback] .zm-boot-screen{display:none!important}
}

/* V86 — readable first impression: the intro itself has a beginning,
   a signature-drawing beat and a short still hold before opening. */
@media(prefers-reduced-motion:no-preference){
 html[data-zm-boot] .zm-boot-wordmark>span{animation:boot86-credit-in .65s .08s cubic-bezier(.22,1,.36,1) both}
 html[data-zm-boot] .zm-boot-wordmark svg{animation:boot86-name-in 1.05s .16s cubic-bezier(.22,1,.36,1) both}
 html[data-zm-boot] .zm-boot-subtitle{animation:boot86-credit-in .85s .58s cubic-bezier(.22,1,.36,1) both}
 html[data-zm-boot] .zm-boot-ink path{animation-duration:1.45s}
}
@keyframes boot86-credit-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes boot86-name-in{0%{opacity:0;clip-path:inset(0 100% 0 0);transform:translateY(14px) scale(.97)}100%{opacity:1;clip-path:inset(0);transform:none}}

/* V87: a single continuously mounted overlay; solid backstop while loading
   and while the real hero is being prepared underneath it. */
html:is([data-zm-boot=pending],[data-zm-boot=covered]) body>.zm-boot-screen,
body>.zm-boot-screen:is([data-boot-phase=pending],[data-boot-phase=covered]){
 display:block!important;visibility:visible!important;opacity:1!important;
 background:#24291e!important;pointer-events:auto!important;
 z-index:2147483000!important;
}
html[data-zm-boot=revealing] body>.zm-boot-screen,
body>.zm-boot-screen[data-boot-phase=revealing]{
 display:block!important;visibility:visible!important;opacity:1!important;
 background:transparent!important;pointer-events:auto!important;
 z-index:2147483000!important;
}
html[data-zm-boot] .zm-route-curtain{display:none!important}
html[data-zm-boot=pending] main.film-home{visibility:hidden!important}
html[data-zm-boot=covered] .zm-boot-shutter-top,
html[data-zm-boot=revealing] .zm-boot-shutter-top{
 clip-path:polygon(0 0,100% 0,100% 51%,72% 51%,50% 51%,28% 51%,0 51%);
}
html[data-zm-boot=covered] .zm-boot-shutter-bottom,
html[data-zm-boot=revealing] .zm-boot-shutter-bottom{
 clip-path:polygon(0 49%,28% 49%,50% 49%,72% 49%,100% 49%,100% 100%,0 100%);
}
body>.zm-boot-screen[data-boot-phase=done]{display:none!important}
@media(prefers-reduced-motion:reduce){html[data-zm-boot=revealing] body>.zm-boot-screen{display:none!important}}
`;
