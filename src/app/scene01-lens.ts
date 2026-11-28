// Scene 01: the two original registered portraits never move independently.
// The only animated quantities are the aperture position, stretch and opacity.
import {getNodeMotionTier,motionQualityEvent,sceneQualityEvent} from "./motion-quality-store";
import {mobilePortraitScale,mobileCreditFrame} from "./mobile-portrait-geometry";
export type LensState={x:number;y:number;alpha:number;stretch:number};
export const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
export function advanceLens(s:LensState,t:LensState,dt:number):{state:LensState;settled:boolean}{
 const ms=clamp(dt,0,50),follow=1-Math.exp(-ms/85),fade=1-Math.exp(-ms/(t.alpha>s.alpha?125:180));
 const state={x:s.x+(t.x-s.x)*follow,y:s.y+(t.y-s.y)*follow,alpha:s.alpha+(t.alpha-s.alpha)*fade,stretch:s.stretch+(t.stretch-s.stretch)*follow};
 const settled=Math.abs(state.x-t.x)+Math.abs(state.y-t.y)<.001&&Math.abs(state.alpha-t.alpha)<.004&&Math.abs(state.stretch-t.stretch)<.004;
 return {state:settled?{...t}:state,settled};
}
export function installScene01Lens(area:HTMLDivElement,original:HTMLImageElement,attire:HTMLImageElement,onReady:()=>void,ready:(ok:boolean)=>void){
 const plane=area.querySelector<HTMLElement>(".hero-portrait-plane"),layer=attire.parentElement,opening=area.closest<HTMLElement>("#film-present");
 if(!plane||!layer){ready(false);return}
 const reduced=matchMedia("(prefers-reduced-motion: reduce)");
 const fine=matchMedia("(min-width:900px) and (hover:hover) and (pointer:fine)");
 const controller=new AbortController(),opts={signal:controller.signal,passive:true};
 let disposed=false,loaded=false,visible=false,hover=false,dirty=true,raf=0,last=0,w=1,h=1;
 let rect=plane.getBoundingClientRect();
 let state:LensState={x:.5,y:.4,alpha:0,stretch:0},target={...state};
 const set=(name:string,value:string)=>{if(layer.style.getPropertyValue(name)!==value)layer.style.setProperty(name,value)};
 function write(){
  const diameter=Math.min(h*.68,w*.7),dw=diameter*(1+state.stretch*.14),dh=diameter*(1-state.stretch*.09);
  set("--zm-lens-width",dw.toFixed(1)+"px");set("--zm-lens-height",dh.toFixed(1)+"px");
  set("--zm-lens-x",(state.x*w-dw/2).toFixed(1)+"px");set("--zm-lens-y",(state.y*h-dh/2).toFixed(1)+"px");
  set("--zm-lens-alpha",state.alpha.toFixed(4));
 }
 function stop(){
  if(raf)cancelAnimationFrame(raf);raf=0;last=0;
  area.dataset.zmLensRunning="false";
 }
 function reset(){
  stop();target={...target,alpha:0,stretch:0};state={...target};write();
 }
 function active(){return loaded&&visible&&hover&&!document.hidden&&opening?.dataset.creditStage!=="true"&&area.dataset.mobileLook!=="future"}
 function frame(now:number){
  raf=0;if(disposed||!active()){reset();return}
  const result=advanceLens(state,target,last?now-last:16.67);last=now;state=result.state;write();
  if(result.settled){stop();return}
  raf=requestAnimationFrame(frame);
 }
 function wake(){
  if(!raf&&active()){area.dataset.zmLensRunning="true";raf=requestAnimationFrame(frame)}
 }
 function leave(){
  target={...target,alpha:0,stretch:0};
  if(active())wake();else reset();
 }
 function sync(){
  const tier=getNodeMotionTier(area);
  hover=fine.matches&&!reduced.matches&&tier!=="lite"&&tier!=="reduced"&&(CSS.supports("mask-image","linear-gradient(black,transparent)")||CSS.supports("-webkit-mask-image","linear-gradient(black,transparent)"));
  area.dataset.zmLensMode=hover?"hover":"toggle";
  area.dataset.zmLensVisible=String(visible&&!document.hidden);
  if(!active())reset();
 }
 function resize(){
  const width=area.clientWidth,height=area.clientHeight;if(!width||!height)return;
  const mobile=matchMedia("(max-width:899px)").matches;
  if(matchMedia("(max-width:599px) and (min-height:500px) and (orientation:portrait)").matches){
   const brand=area.querySelector<HTMLElement>(".zm-hero-brand");
   const titleBottom=brand?brand.offsetTop+brand.offsetHeight:0;
   area.style.setProperty("--portrait-scale",(mobilePortraitScale(width,height,titleBottom)*.74).toFixed(4));
  }else if(!mobile){
   const fit=Math.min(width/1070,height/850),maxScale=(height-12)/(830*fit);
   area.style.setProperty("--portrait-scale",Math.max(.35,Math.min(1.12,maxScale)).toFixed(4));
  }else area.style.removeProperty("--portrait-scale");
  if(opening){
   const props=["--credit-frame-top","--credit-frame-side","--credit-frame-bottom","--credit-frame-scale"];
   if(mobile){const f=mobileCreditFrame(width,height);const values=[f.top+"px",f.side+"px",f.bottom+"px",f.scale.toFixed(5)];props.forEach((key,i)=>opening.style.setProperty(key,values[i]));}
   else props.forEach(key=>opening.style.removeProperty(key));
  }
  w=plane.clientWidth||width;h=plane.clientHeight||height;dirty=true;write();sync();
 }
 function move(e:PointerEvent){
  if(e.pointerType!=="mouse"||!active())return;
  if(dirty){rect=plane.getBoundingClientRect();dirty=false}
  if(rect.width<=0||rect.height<=0)return;
  const x=(e.clientX-rect.left)/rect.width,y=(e.clientY-rect.top)/rect.height;
  const photoWidth=Math.min(rect.width,rect.height*(original.naturalWidth/original.naturalHeight||1070/850));
  const lane=.34*photoWidth/rect.width;
  if(Math.abs(x-.5)>lane||y<.035||y>1||e.target instanceof Element&&e.target.closest("button,a")){leave();return}
  if(target.alpha===0&&state.alpha<.01)state={x,y,alpha:0,stretch:0};
  const deltaX=Math.abs(x-state.x)*w,deltaY=Math.abs(y-state.y)*h;
  target={x,y,alpha:1,stretch:clamp((deltaX-deltaY)/130,-1,1)};
  // Stretch depends on the instantaneous target gap, and relaxes once settled.
  // The next frame decays it via a single target reset; no idle animation.
  target.stretch=0;
  state.stretch=clamp(state.stretch+(deltaX-deltaY)/400,-1,1);
  wake();
 }
 function scroll(){dirty=true;if(target.alpha||state.alpha)reset()}
 const ro=new ResizeObserver(resize);ro.observe(area);
 const brand=area.querySelector<HTMLElement>(".zm-hero-brand");if(brand)ro.observe(brand);
 const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync()},{threshold:.03});io.observe(area);
 const mo=new MutationObserver(sync);mo.observe(area,{attributes:true,attributeFilter:["data-mobile-look"]});if(opening)mo.observe(opening,{attributes:true,attributeFilter:["data-credit-stage"]});
 area.addEventListener("pointermove",move,opts);area.addEventListener("pointerleave",leave,opts);area.addEventListener("pointercancel",leave,opts);
 window.addEventListener("scroll",scroll,{...opts,capture:true});window.addEventListener("blur",reset,opts);
 window.addEventListener(motionQualityEvent,sync,opts);window.addEventListener(sceneQualityEvent,sync,opts);
 document.addEventListener("visibilitychange",sync,opts);fine.addEventListener("change",sync,opts);reduced.addEventListener("change",sync,opts);
 resize();
 Promise.all([original.decode(),attire.decode()]).then(()=>{
  if(disposed)return;loaded=true;area.dataset.zmLensReady="true";onReady();resize();ready(true);
 }).catch(()=>{if(!disposed)ready(false)});
 return()=>{disposed=true;stop();controller.abort();ro.disconnect();io.disconnect();mo.disconnect();delete area.dataset.zmLensReady;delete area.dataset.zmLensMode;delete area.dataset.zmLensVisible;delete area.dataset.zmLensRunning};
}
