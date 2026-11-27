"use client";
import {useEffect,useRef} from "react";
import {heroFields} from "./liquid-field";
import {getMotionTier,motionQualityEvent} from "./motion-quality-store";

// Continuous contour backdrop plus the existing cursor-fluid color.
export default function ContourField({paused}:{paused:boolean}){
 const root=useRef<HTMLDivElement>(null);
 const canvasRef=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const el=root.current,canvas=canvasRef.current;
  const stage=el?.closest<HTMLElement>(".hero-composition");
  if(!el||!canvas||!stage)return;
  const ctx=canvas.getContext("2d");
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const phone=matchMedia("(max-width:899px)");
  let visible=false,raf=0,disposed=false,lastPaint=0,dirty=false;
  let pixels:ImageData|null=null;
  const running=()=>visible&&!paused&&!reduced.matches&&!document.hidden;
  function clear(){
   if(dirty&&ctx){ctx.clearRect(0,0,canvas!.width,canvas!.height);dirty=false}
  }
  function draw(now:number){
   raf=0;if(disposed||!running())return;
   // Reuse the small simulation grid for pointer interaction.
   if(ctx&&now-lastPaint>=1000/40){
    lastPaint=now;
    const field=heroFields.get(stage!);
    if(field?.hasInk){
     if(!pixels||pixels.width!==field.width||pixels.height!==field.height){
      canvas!.width=field.width;canvas!.height=field.height;
      pixels=ctx.createImageData(field.width,field.height);
     }
     field.writeMask(pixels.data);
     const data=pixels.data,W=field.width,H=field.height;
     for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      // The alternate palette is warm lime and sage, not blue water or neon.
      const t=.5+.5*Math.sin(x/W*2.9+y/H*2.2);
      data[i]=Math.round(162+35*t);
      data[i+1]=Math.round(180+29*t);
      data[i+2]=Math.round(112+18*t);
      data[i+3]=Math.round(data[i+3]*.74);
     }
     ctx.putImageData(pixels,0,0);dirty=true;
    }else clear();
   }
   raf=requestAnimationFrame(draw);
  }
  function sync(){
   const active=running();el!.dataset.running=String(active);
   if(active&&!phone.matches&&getMotionTier()==="cinematic"){if(!raf)raf=requestAnimationFrame(draw)}
   else{if(raf)cancelAnimationFrame(raf);raf=0;clear()}
  }
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync()},{threshold:.01});
  observer.observe(el);
  reduced.addEventListener("change",sync);phone.addEventListener("change",sync);window.addEventListener(motionQualityEvent,sync);
  document.addEventListener("visibilitychange",sync);
  sync();
  return()=>{disposed=true;if(raf)cancelAnimationFrame(raf);clear();observer.disconnect();reduced.removeEventListener("change",sync);phone.removeEventListener("change",sync);window.removeEventListener(motionQualityEvent,sync);document.removeEventListener("visibilitychange",sync)};
 },[paused]);
 return <div ref={root} className="hero-editorial-background" data-running="false" aria-hidden="true">
  <div className="hero-editorial-light"/>
  <div className="hero-editorial-shadow"/>
  <canvas ref={canvasRef} className="hero-fluid-color" aria-hidden="true"/>
  <div className="hero-editorial-lines" aria-hidden="true"/>
 </div>;
}
