"use client";
import {useEffect,useRef} from "react";
import gsap from "gsap";
import PaperFlow from "./scene01-paper-flow";
import {getNodeMotionTier,motionQualityEvent,sceneQualityEvent} from "./motion-quality-store";

// Art-directed movement, separate from the expensive liquid raster.
export default function Scene01Studio(){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const layer=root.current,stage=layer?.closest<HTMLElement>(".hero-composition"),section=layer?.closest<HTMLElement>("#film-present");
  if(!layer||!stage||!section)return;
  const plane=stage.querySelector<HTMLElement>(".hero-portrait-plane"),header=section.closest("main")?.querySelector<HTMLElement>(".site-header");
  if(!plane)return;
  const paper=layer.querySelector<HTMLElement>(".studio-paper-light"),shadow=layer.querySelector<HTMLElement>(".studio-paper-shadow"),word=layer.querySelector<HTMLElement>(".studio-type-strip");
  if(!paper||!shadow||!word)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)"),fine=matchMedia("(min-width:900px) and (hover:hover) and (pointer:fine)");
  let rect=stage.getBoundingClientRect(),visible=rect.bottom>0&&rect.top<innerHeight,disposed=false,running=false;
  const ac=new AbortController(),opts={signal:ac.signal,passive:true};
  const context=gsap.context(()=>{},section);
  
  const camera={x:0,y:0};
  const moveX=gsap.quickTo(camera,"x",{duration:.68,ease:"power3.out",onUpdate:draw});
  const moveY=gsap.quickTo(camera,"y",{duration:.68,ease:"power3.out",onUpdate:draw});
  function draw(){stage!.style.setProperty("--studio-pointer-x",camera.x.toFixed(2)+"px");stage!.style.setProperty("--studio-pointer-y",camera.y.toFixed(2)+"px");layer!.style.setProperty("--studio-light-x",(-camera.x*2.7).toFixed(2)+"px");layer!.style.setProperty("--studio-light-y",(-camera.y*2.7).toFixed(2)+"px")}
  function permitted(){const tier=getNodeMotionTier(stage);return !disposed&&visible&&!document.hidden&&!reduced.matches&&tier!=="lite"&&tier!=="reduced"&&section!.dataset.creditStage!=="true"}
  function stop(){
   moveX.tween.pause();moveY.tween.pause();running=false;
   layer!.dataset.running="false";stage!.dataset.studioPaused="true";delete stage!.dataset.studioFocus;
   // Neutralize the pointer offset without disturbing the autonomous phase.
   camera.x=camera.y=0;draw();
  }
  function sync(){
   if(!permitted()){stop();return}
   if(running)return;
   running=true;layer!.dataset.running="true";
   stage!.dataset.studioPaused="false";

  }
  function move(e:PointerEvent){if(!running||!fine.matches||e.pointerType!=="mouse")return;
   const x=Math.max(-1,Math.min(1,((e.clientX-rect.left)/rect.width-.5)*2)),y=Math.max(-1,Math.min(1,((e.clientY-rect.top)/rect.height-.5)*2));
   moveX(x*21);moveY(y*12);
   const photo=plane.getBoundingClientRect();const aspect=1070/850;const width=Math.min(photo.width,photo.height*aspect);const inPhoto=Math.abs(e.clientX-(photo.left+photo.width/2))<width*.235&&e.clientY>photo.top+photo.height*.12;
   stage!.dataset.studioFocus=e.target instanceof Element&&e.target.closest("a,button,.caption,.hero-note")?"copy":inPhoto?"portrait":"paper";
  }
  function leave(){delete stage!.dataset.studioFocus;if(running){moveX(0);moveY(0)}else{camera.x=camera.y=0;draw()}}
  const ro=new ResizeObserver(()=>{rect=stage.getBoundingClientRect()});ro.observe(stage);
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()},{threshold:.04});io.observe(stage);
  const mo=new MutationObserver(sync);mo.observe(section,{attributes:true,attributeFilter:["data-credit-stage","data-scene-tier"]});
  stage.addEventListener("pointermove",move,opts);stage.addEventListener("pointerleave",leave,opts);stage.addEventListener("pointerenter",()=>{rect=stage.getBoundingClientRect()},opts);
  document.addEventListener("visibilitychange",sync,opts);reduced.addEventListener("change",sync,opts);fine.addEventListener("change",sync,opts);
  window.addEventListener(motionQualityEvent,sync,opts);window.addEventListener(sceneQualityEvent,sync,opts);
  // Real hit targets stay stationary. Only the arrow and the icon artwork
  // react to the pointer, avoiding the inaccurate hit area of a magnetic button.
  const controls=Array.from(header?.querySelectorAll<HTMLElement>(".minimal-connect,.minimal-menu-trigger,.minimal-identity")??[]);
  const magnets:gsap.core.Tween[]=[];
  for(const control of controls){
   const art=control.querySelector<HTMLElement>(".minimal-arrow,.minimal-menu-glyph,img");if(!art)continue;
   const qx=gsap.quickTo(art,"x",{duration:.42,ease:"power3.out"}),qy=gsap.quickTo(art,"y",{duration:.42,ease:"power3.out"});
   magnets.push(qx.tween,qy.tween);
   control.addEventListener("pointermove",e=>{if(!fine.matches||reduced.matches||section.dataset.creditStage==="true")return;const r=control.getBoundingClientRect();qx(Math.max(-4,Math.min(4,(e.clientX-r.left-r.width/2)*.10)));qy(Math.max(-4,Math.min(4,(e.clientY-r.top-r.height/2)*.13)))},opts);
   control.addEventListener("pointerleave",()=>{qx(0);qy(0)},opts);
  }
  sync();
  return()=>{disposed=true;stop();ac.abort();ro.disconnect();io.disconnect();mo.disconnect();context.revert();moveX.tween.kill();moveY.tween.kill();magnets.forEach(t=>t.kill());stage.style.removeProperty("--studio-pointer-x");stage.style.removeProperty("--studio-pointer-y");stage.style.removeProperty("--studio-breathe-x");stage.style.removeProperty("--studio-breathe-y");delete stage.dataset.studioFocus;delete stage.dataset.studioPaused}
 },[]);
 return <div ref={root} className="studio-scene01" data-running="false" aria-hidden="true">
  <div className="studio-paper-shadow"/><div className="studio-paper-reflection"/>
  <div className="studio-paper-light"/>
  <PaperFlow/>
  <div className="studio-type-window"><div className="studio-type-plane"><div className="studio-type-strip">{[0,1].map(i=><span key={i}>STAY CURIOUS. KEEP BECOMING.</span>)}</div></div></div>
  <div className="studio-paper-grain"/>
 </div>;
}
