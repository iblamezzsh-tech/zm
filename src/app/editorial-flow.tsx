"use client";
import {useLayoutEffect,useRef,type ReactNode} from "react";
import {subscribeMotion,requestMotionFrame,scrollToFilm} from "./motion-clock";
import {advanceMotion,kineticEnvelope,mobileTextEnvelope} from "./motion-pacing";
import {getNodeMotionTier,setActiveMotionScene,applySceneTiers,sceneQualityEvent,motionQualityEvent} from "./motion-quality-store";
import {readingEmphasis} from "./reading-emphasis";
import type {SceneKey} from "./scene-motion-policy";
const clamp=(x:number)=>Math.min(1,Math.max(0,x));
const ease=(a:number,b:number,x:number)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const write=(el:HTMLElement,key:string,value:number)=>{const next=value.toFixed(4);if(el.style.getPropertyValue(key)!==next)el.style.setProperty(key,next)};
// Smooth acceleration at both ends, almost linear in the reading interval.
// The inverse uses this exact curve, including keyboard navigation.
function railProgress(x:number){
 const t=clamp(x),r=.12;
 if(t<r)return t*t/(2*r*(1-r));
 if(t>1-r)return 1-(1-t)*(1-t)/(2*r*(1-r));
 return (t-r/2)/(1-r);
}
export default function EditorialFlow({children}:{children:ReactNode}){
 const root=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const el=root.current,main=el?.closest<HTMLElement>("main");
  if(!el||!main){document.dispatchEvent(new CustomEvent("zm-film-ready",{detail:{ok:false}}));return;}
  const scenes=Array.from(el.querySelectorAll<HTMLElement>("[data-ed-scene]"));
  const reveals=Array.from(el.querySelectorAll<HTMLElement>("[data-ed-reveal],[data-ed-line]"));
  const archiveNodes=Array.from(el.querySelectorAll<HTMLElement>(".ed-archive-item"));
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const desktop=matchMedia("(min-width: 900px) and (min-height: 500px) and (pointer: fine)");
  const mobile=matchMedia("(max-width: 899px) and (min-height: 500px)");
  const openingWindow=el.querySelector<HTMLElement>(".ed-opening-sticky");
  const futureWindow=el.querySelector<HTMLElement>(".zm-future-stage");
  const lookButton=el.querySelector<HTMLButtonElement>(".zm-mobile-look");
  const finaleInner=el.querySelector<HTMLElement>(".finale-inner");
  const finaleHeading=el.querySelector<HTMLElement>(".finale-heading");
  const finalePortrait=el.querySelector<HTMLElement>(".finale-portrait");
  const finalePages=el.querySelector<HTMLElement>(".finale-pages");
  const finaleSignature=el.querySelector<HTMLElement>(".finale-signature");
  const finaleCta=el.querySelector<HTMLElement>(".finale-cta");
  const collage=el.querySelector<HTMLElement>(".ed-collage"),rail=el.querySelector<HTMLElement>(".ed-collage-grid");
  const collageWindow=el.querySelector<HTMLElement>(".ed-collage-sticky");
  const fan=el.querySelector<HTMLElement>(".ed-fan");
  const documents=Array.from(el.querySelectorAll<HTMLElement>(".ed-document"));
  const kinetic=Array.from(el.querySelectorAll<HTMLElement>("[data-kinetic]")).map(node=>({node,horizontal:Boolean(node.closest(".ed-collage-grid")),compact:node.dataset.kinetic==="stamp"||node.dataset.kinetic==="caption"}));
  let manual=false,enabled=false,cinema=false,mobileCinema=false,railDistance=0,railX=0,alive=true;
  const owners=new Map<HTMLElement,HTMLElement|null>();
  [...reveals,...archiveNodes,...documents,...kinetic.map(k=>k.node)].forEach(node=>owners.set(node,node.closest<HTMLElement>("[data-ed-scene]")));
  let previousNear=new Set<HTMLElement>();
  const sceneMetrics=new Map<HTMLElement,{top:number;height:number}>();
  let metricsDirty=true,metricsWidth=0,metricsHeight=0,openingHeightCache=0,galleryHeightCache=0,futureHeightCache=0,documentHeightCache=0;
  const finaleOffsets=new Map<HTMLElement,number>();
  let previousWorkVisible=false;
  const belt=el.querySelector<HTMLElement>(".ed-work-banner");
  const railActive=()=>cinema||mobileCinema;
  type Channel={node:HTMLElement;key:string;value:number;target:number;duration:number};
  const channels=new Map<HTMLElement,Map<string,Channel>>();
  const moving=new Set<Channel>();
  let pacingRaf=0,lastPace=0,initializing=true;
  function paced(node:HTMLElement,key:string,target:number,duration=1000,snap=false){
   let byKey=channels.get(node);
   if(!byKey){byKey=new Map();channels.set(node,byKey)}
   let c=byKey.get(key);
   if(!c){c={node,key,value:target,target,duration};byKey.set(key,c);write(node,key,target);return}
   c.target=target;c.duration=duration;
   if(snap||initializing||mobileCinema||window.innerWidth<=899){c.value=target;moving.delete(c);write(node,key,target);return}
   if(Math.abs(c.value-target)>.0005){moving.add(c);if(!pacingRaf){lastPace=performance.now();pacingRaf=requestAnimationFrame(tickPacing)}}
  }
  function tickPacing(now:number){
   pacingRaf=0;if(!alive||!enabled)return;
   const dt=Math.max(0,Math.min(50,now-lastPace));lastPace=now;
   for(const c of moving){
    c.value=advanceMotion(c.value,c.target,dt,c.duration);
    write(c.node,c.key,c.value);
    if(c.value===c.target)moving.delete(c)
   }
   if(moving.size)pacingRaf=requestAnimationFrame(tickPacing)
  }
  function stopPacing(){if(pacingRaf)cancelAnimationFrame(pacingRaf);pacingRaf=0;moving.clear();for(const list of channels.values())for(const c of list.values()){c.value=c.target;write(c.node,c.key,c.value)}}

  function layout(){
   metricsDirty=true;
   if(!alive||!collage||!rail||!collageWindow)return;
   railDistance=railActive()?Math.max(0,rail.scrollWidth-collageWindow.clientWidth):0;
   collage.style.setProperty("--rail-distance",railDistance+"px");
  }
  function render(){
   if(!alive)return;
   const h=window.innerHeight,w=window.innerWidth,anchor=Math.min(70,h*.12);
   const y=window.scrollY;
   const phone=w<=899;
   if(metricsDirty||metricsWidth!==w||metricsHeight!==h){
    metricsDirty=false;metricsWidth=w;metricsHeight=h;
    openingHeightCache=openingWindow?.clientHeight||h;galleryHeightCache=collageWindow?.clientHeight||h;futureHeightCache=futureWindow?.clientHeight||h;
    documentHeightCache=document.documentElement.scrollHeight;
    for(const s of scenes){const r=s.getBoundingClientRect();sceneMetrics.set(s,{top:r.top+y,height:r.height})}
    for(const node of [finaleHeading,finalePortrait,finalePages,finaleSignature,finaleCta])if(node)finaleOffsets.set(node,node.offsetTop);
   }
   const openingHeight=mobileCinema?openingHeightCache:h;
   const galleryHeight=mobileCinema?galleryHeightCache:h;
   const finaleScene=scenes.find(s=>s.id==="next-chapter");
   const finaleMetric=finaleScene?sceneMetrics.get(finaleScene):undefined;
   const finaleNear=!phone||!finaleMetric||finaleMetric.top-y<=h*1.35;
   const finaleTop=finaleNear?(finaleInner?.getBoundingClientRect().top??0):0;
   // A short final panel may reach the bottom of the document before
   // every element crosses the usual reveal threshold. Settle the last
   // beats as native scrolling approaches the actual bottom.
   const remaining=Math.max(0,(phone?documentHeightCache:document.documentElement.scrollHeight)-y-h);
   const mobileFinale=w<=899;
   const finaleEnd=mobileFinale?1-ease(0,h*.24,remaining):0;
   const finaleEdge=(node:HTMLElement|null,fallback:number)=>mobileFinale&&node?Math.max(finaleEnd,clamp((h-finaleTop-(phone?(finaleOffsets.get(node)??0):node.offsetTop))/h)):fallback;
   // The outer scene wrappers are stationary on mobile. Read their layout
   // once per resize/content change; scroll progress comes from scrollY.
   const bounds=scenes.map(s=>{const metric=sceneMetrics.get(s);if(phone&&metric){const top=metric.top-y;return {s,r:{top,bottom:top+metric.height,height:metric.height}}}return {s,r:s.getBoundingClientRect()}});
   const at=bounds.filter(({r})=>r.top<=anchor&&r.bottom>anchor).at(-1);
   const dark=at?.s.dataset.edTheme==="dark"||Boolean(at?.s.id==="film-present"&&-at.r.top>h*.13);
   const finale=at?.s.id==="next-chapter";
   // Prefer the dominant visible chapter for frame attribution; nested
   // project articles belong to their parent Projects chapter.
   const dominant=bounds.filter(({s})=>s.hasAttribute("data-motion-scene")).map(({s,r})=>({s,visible:Math.max(0,Math.min(h,r.bottom)-Math.max(0,r.top))})).sort((a,b)=>b.visible-a.visible)[0];
   const activeKey=dominant&&dominant.visible>0?dominant.s.dataset.motionScene as SceneKey:null;
   setActiveMotionScene(activeKey);
   const near=new Set(bounds.filter(({r})=>r.bottom>=-h*.35&&r.top<=h*1.35).map(({s})=>s));
   const eligible=(node:HTMLElement)=>{const owner=owners.get(node);return !phone||initializing||!owner||near.has(owner)||previousNear.has(owner)};
   const activeBounds=phone&&!initializing?bounds.filter(({s})=>near.has(s)||previousNear.has(s)):bounds;
   const header=()=>{main!.classList.toggle("ed-dark-header",dark);main!.classList.toggle("film-at-finale",finale)};
   if(!enabled){header();return}
   // All geometry reads precede style writes. Horizontal reveals are projected
   // into the new rail position, not one frame behind the artwork.
   const revealBounds=reveals.filter(node=>eligible(node)&&!(getNodeMotionTier(node)==="lite"&&node.matches(".ed-document-image,.ed-archive-item"))).map(node=>({node,r:node.getBoundingClientRect()}));
   const archives=archiveNodes.filter(node=>eligible(node)&&getNodeMotionTier(node)!=="lite").map(node=>({node,r:node.getBoundingClientRect()}));
   const socialScene=scenes.find(s=>s.classList.contains("ed-social"));
   const fanRect=(!phone||initializing||!socialScene||near.has(socialScene)||previousNear.has(socialScene))?fan?.getBoundingClientRect():undefined;
   const fanEdge=fanRect?clamp((h-fanRect.top)/h):1;
   const docBounds=documents.filter(node=>eligible(node)&&getNodeMotionTier(node)!=="lite").map(node=>({node,r:node.getBoundingClientRect()}));
   const kineticBounds=kinetic.filter(item=>eligible(item.node)&&getNodeMotionTier(item.node)!=="lite").map(item=>({...item,r:item.node.getBoundingClientRect()}));
   const gallery=bounds.find(({s})=>s===collage);
   const railLocal=gallery?clamp(-gallery.r.top/Math.max(1,gallery.r.height-galleryHeight)):0;
   const nextRailX=railActive()?-railDistance*railProgress(railLocal):0;
   const railDelta=nextRailX-railX;
   const beltRect=belt?.getBoundingClientRect();
   const workVisible=Boolean(beltRect&&beltRect.bottom>=0&&beltRect.top<=h);
   header();
   if(belt&&workVisible!==previousWorkVisible){belt.dataset.running=String(workVisible);previousWorkVisible=workVisible}
   for(const {s,r} of activeBounds){
    const pass=clamp((h-r.top)/(h+r.height));
    const local=clamp(-r.top/Math.max(1,r.height-(s.id==="film-present"?openingHeight:s.id==="film-future"&&mobileCinema&&futureWindow?futureHeightCache:h)));
    const edge=clamp((h-r.top)/h);
    const enter=ease(.04,.53,edge);
    write(s,"--ed-pass",pass);write(s,"--ed-enter",enter);write(s,"--ed-travel",(pass-.5)*2);
    write(s,"--ed-local",local);write(s,"--ed-edge",edge);
    paced(s,"--seam-open",ease(.04,.78,edge),950,r.bottom<0||r.top>h);
    if(w<=899){write(s,"--m-scene-enter",ease(0,.72,edge));write(s,"--m-scene-exit",ease(.62,1,pass));}
    if(s.id==="film-present"){
     if(mobileCinema){
      // A single reversible scroll score: identity, portrait, signature,
      // hold, then a handoff into the next chapter. No timer or scroll lock.
      write(s,"--ed-hero-exit",ease(.04,.43,local));
      write(s,"--ed-brand-away",ease(.03,.25,local));
      write(s,"--ed-portrait-tone",ease(.16,.45,local));
      write(s,"--ed-credit",ease(.30,.70,local));
      write(s,"--ed-credit-in",ease(.23,.40,local));
      write(s,"--ed-hero-depart",ease(.83,1,local));
      write(s,"--ed-credit-away",ease(.90,1,local));
      const creditStage=String(local>.25);if(s.dataset.creditStage!==creditStage)s.dataset.creditStage=creditStage;
      if(lookButton&&lookButton.inert!==(creditStage==="true")){if(creditStage==="true"&&document.activeElement===lookButton)el!.focus({preventScroll:true});lookButton.inert=creditStage==="true";}
     }else{
      write(s,"--ed-hero-exit",ease(.08,.65,local));
      write(s,"--ed-credit",ease(.22,.66,local));
      write(s,"--ed-hero-depart",ease(.78,1,local));
      write(s,"--ed-credit-away",ease(.88,1,local));
      delete s.dataset.creditStage;if(lookButton)lookButton.inert=false;
     }
    }
    if(s===collage&&railActive()){
     const railValue=nextRailX.toFixed(2)+"px";if(s.style.getPropertyValue("--rail-x")!==railValue)s.style.setProperty("--rail-x",railValue);
     write(s,"--rail-p",railProgress(railLocal));
    }
    if(s.classList.contains("ed-manifesto"))write(s,"--ed-manifesto-pass",clamp((h-r.top)/(r.height+h*.5)));
    if(s.classList.contains("ed-future")){
     // Sequential reading emphasis, driven by reversible scene progress.
     // Keep all three words visible; only their short accent rules change.
     const beat=(cinema||mobileCinema&&h>=650)?local:pass;
     const [think,learn,build]=readingEmphasis(beat);
     write(s,"--zm-think-emphasis",think);
     write(s,"--zm-learn-emphasis",learn);
     write(s,"--zm-build-emphasis",build);
     if(cinema){
      // A single native pinned act, with a real reading hold and an exit.
      write(s,"--zm-cine-think",ease(0,.25,local));
      write(s,"--zm-cine-learn",ease(.16,.49,local));
      write(s,"--zm-cine-build",ease(.36,.70,local));
      write(s,"--zm-cine-exit",ease(.86,1,local));
     }
     if(mobileCinema&&h>=650){
      // A short native sticky typographic act: each word occupies a separate
      // phase, then all three lock into the final composition before release.
      write(s,"--m-future-act",local);
      write(s,"--m-think",ease(0,.27,local));
      write(s,"--m-learn",ease(.22,.56,local));
      write(s,"--m-build",ease(.51,.85,local));
     }
     paced(s,"--future-think",ease(.12,.68,edge),1100,r.bottom<0||r.top>h);
     paced(s,"--future-learn",ease(.20,.80,edge),1200,r.bottom<0||r.top>h);
     paced(s,"--future-build",ease(.28,.92,edge),1250,r.bottom<0||r.top>h);
    }
    if(s.classList.contains("ed-work-item")){
     write(s,"--project-copy",ease(.05,.45,edge));write(s,"--project-body",ease(.10,.53,edge));
     write(s,"--project-float",(pass-.5)*2);
     paced(s,"--v84-art",ease(.08,.65,edge),1150,r.bottom<0||r.top>h);
     if(w<=899){
      // Measure the stable article box, not the transformed poster.
      // Each artifact has its own stagger, but uses the same reversible clock.
      paced(s,"--m-project-art",ease(.025,.70,edge),1250,r.bottom<0||r.top>h);
      paced(s,"--m-project-detail",ease(.12,.86,edge),1450,r.bottom<0||r.top>h);
     }
    }
    if(s.classList.contains("ed-social")){
     // Native scrolling already moves this scene; do not add a second time-based
     // smoothing clock. The spread resolves during entry and reverses on scroll.
     write(s,"--fan-open",ease(.025,.68,fanEdge));
     if(w<=899){
      // The untransformed fan box is the clock; card transforms cannot feed back into it.
      paced(s,"--m-social-spread",ease(.025,.68,fanEdge),1600,r.bottom<0||r.top>h);
      const leave=clamp((h-r.bottom)/h);
      paced(s,"--m-social-handoff",ease(.02,.74,leave),950,r.bottom<0||r.top>h);
     }
     write(s,"--fan-away",0);
     write(s,"--social-links",ease(.10,.58,edge));
     write(s,"--social-glow",ease(.32,.95,edge));
    }
    if(s.id==="next-chapter"){
     paced(s,"--finale-portrait-in",ease(.04,.64,finaleEdge(finalePortrait,edge)),1150,r.bottom<0||r.top>h);
     paced(s,"--finale-title-in",ease(.12,.80,finaleEdge(finaleHeading,edge)),1400,r.bottom<0||r.top>h);
     paced(s,"--finale-nav-in",ease(mobileCinema ? .08 : .25,mobileCinema ? .65 : .92,finaleEdge(finalePages,edge)),1000,r.bottom<0||r.top>h);
     if(mobileFinale){
      // Signature and contact are their own beats. On the last scroll pixel
      // the scene settles instead of leaving a partly drawn signature.
      const off=r.bottom<0||r.top>h;
      const settled=remaining<=2;
      paced(s,"--m-finale-frame",ease(.02,.52,Math.max(edge,finaleEnd)),1100,off||settled);
      paced(s,"--m-finale-sign",ease(.04,.56,finaleEdge(finaleSignature,edge)),1550,off||settled);
      paced(s,"--m-finale-contact",ease(.02,.48,finaleEdge(finaleCta,edge)),900,off||settled);
     }
    }
   }
   for(const {node,r} of revealBounds){
    const horizontal=railActive()&&node.closest(".ed-collage-grid");
    const vertical=clamp((h-r.top)/h);
    let p:number;
    if(horizontal){
     const left=r.left+railDelta;
     p=ease(.015,.29,clamp((w-left)/w));
    }else if(node.classList.contains("ed-statement-line")){
     p=ease(.015,.32,vertical);
    }else if(node.classList.contains("ed-work-image")||node.classList.contains("ed-archive-item")){
     p=ease(.03,.50,vertical);
    }else{
     p=ease(.02,.39,vertical);
    }
    write(node,"--ed-reveal",p);
   }
   for(const {node,r} of archives){
    write(node,"--record-pass",clamp((h-r.top)/(h+r.height)));
    paced(node,"--v84-record",ease(.02,.56,(h-r.top)/h),1050,r.bottom<0||r.top>h)
   }
   for(const {node,r} of docBounds){
    const center=railActive()?r.left+r.width*.5+railDelta:r.top+r.height*.5;const extent=railActive()?w:h;
    write(node,"--doc-pass",clamp((extent-center)/extent));
    const edge=railActive()?(w-r.left-railDelta)/w:(h-r.top)/h;
    paced(node,"--v84-document",ease(.02,.60,edge),1150,r.bottom<0||r.top>h||(railActive()&&(r.right+railDelta<0||r.left+railDelta>w)));
   }
   // Geometry is the target, not the animation clock. A bounded, damped
   // timeline catches up after a flick and reverses from its current value.
   for(const {node,r,horizontal,compact} of kineticBounds){
    const x=railActive()&&horizontal?railDelta:0;
    const left=r.left+x,right=r.right+x;
    const mobileType=w<=899;
    let p=mobileType?mobileTextEnvelope(r.top,r.bottom,h,compact):kineticEnvelope(r.top,r.bottom,h,compact);
    if(railActive()&&horizontal){
     const horizontalProgress=mobileType?mobileTextEnvelope(left,right,w,compact):kineticEnvelope(left,right,w,compact);
     // Captions in the pinned rail do not enter from below: avoid masking
     // their text simply because the record sits in the lower row.
     p=mobileType||compact?horizontalProgress:Math.min(p,horizontalProgress);
    }
    const outside=r.bottom<0||r.top>h||(railActive()&&horizontal&&(right<0||left>w));
    paced(node,"--kt-progress",p,mobileType?(compact?560:1050):(compact?780:1280),outside);
   }
   initializing=false;previousNear=near;
   railX=nextRailX;
  }
  function quality(){applySceneTiers(el!);requestMotionFrame()}
  function preferenceQuality(){if(enabled!==(!manual&&!reduced.matches))mode();else quality()}
  function mode(){
   applySceneTiers(el!);
   enabled=!manual&&!reduced.matches;cinema=enabled&&desktop.matches;mobileCinema=enabled&&mobile.matches;
   el!.dataset.edMotion=String(enabled);el!.dataset.edCinema=String(cinema);el!.dataset.edMobileCinema=String(mobileCinema);
   stopPacing();initializing=true;previousNear.clear();if(lookButton)lookButton.inert=false;if(!mobileCinema){const opening=scenes.find(s=>s.id==="film-present");if(opening)delete opening.dataset.creditStage;}
   if(!railActive()){railX=0;collage?.style.setProperty("--rail-x","0px")}layout();render();requestMotionFrame();
  }
  function change(){manual=!manual;mode()}
  function resize(){layout();requestMotionFrame()}
  // Keyboard focus in the rail must move the native scroll position to the visible item.
  function focus(e:FocusEvent){
   if(!railActive()||!collage||!rail||!(e.target instanceof HTMLElement)||!rail.contains(e.target))return;
   const r=e.target.getBoundingClientRect();if(r.left>=0&&r.right<=innerWidth)return;
   const delta=Math.max(0,Math.min(railDistance,mobileCinema?r.left-railX+r.width*.5-innerWidth*.5:r.left-railX-innerWidth*.2));
   const top=window.scrollY+collage.getBoundingClientRect().top;
   const target=railDistance?delta/railDistance:0;
   // Invert the eased rail trajectory to align a keyboard-selected link.
   let lo=0,hi=1;for(let i=0;i<16;i++){const m=(lo+hi)/2;if(railProgress(m)<target)lo=m;else hi=m}
   scrollToFilm(top+(collage.offsetHeight-(mobileCinema?(collageWindow?.clientHeight||innerHeight):innerHeight))*(lo+hi)/2,true);
  }
  const unsub=subscribeMotion(render),ro=new ResizeObserver(resize);ro.observe(el);if(rail)ro.observe(rail);for(const scene of scenes)ro.observe(scene);window.addEventListener("resize",resize,{passive:true});
  reduced.addEventListener("change",mode);desktop.addEventListener("change",mode);mobile.addEventListener("change",mode);window.addEventListener("zm-film-mode",change);window.addEventListener(motionQualityEvent,preferenceQuality);window.addEventListener(sceneQualityEvent,quality);el.addEventListener("focusin",focus);
  document.addEventListener("zm-boot-prepare",resize);
  mode();document.fonts.ready.then(()=>{if(alive)resize()});
  document.dispatchEvent(new CustomEvent("zm-film-ready",{detail:{ok:true}}));
  return()=>{alive=false;stopPacing();for(const list of channels.values())for(const c of list.values())c.node.style.removeProperty(c.key);channels.clear();unsub();ro.disconnect();window.removeEventListener("resize",resize);reduced.removeEventListener("change",mode);desktop.removeEventListener("change",mode);mobile.removeEventListener("change",mode);window.removeEventListener("zm-film-mode",change);window.removeEventListener(motionQualityEvent,preferenceQuality);window.removeEventListener(sceneQualityEvent,quality);setActiveMotionScene(null);el.removeEventListener("focusin",focus);document.removeEventListener("zm-boot-prepare",resize);main.classList.remove("ed-dark-header","film-at-finale");delete el.dataset.edMotion;delete el.dataset.edCinema;delete el.dataset.edMobileCinema};
 },[]);
 return <div ref={root} className="editorial-flow" id="main-content" tabIndex={-1}>{children}</div>
}
