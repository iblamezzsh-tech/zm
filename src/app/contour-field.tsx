"use client";
import {useEffect,useRef} from "react";
import {heroFields} from "./liquid-field";

// Independent slow morphing silhouette field plus the existing cursor-fluid color.
export default function ContourField({paused}:{paused:boolean}){
 const root=useRef<HTMLDivElement>(null);
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const ambientRef=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const el=root.current,canvas=canvasRef.current;
  const stage=el?.closest<HTMLElement>(".hero-composition");
  if(!el||!canvas||!stage)return;
  const ctx=canvas.getContext("2d");
  const ambient=ambientRef.current, ink=ambient?.getContext("2d");
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let visible=false,raf=0,disposed=false,lastPaint=0,dirty=false;
  let pixels:ImageData|null=null;
  let lastAmbient=0,phase=0;
  const TAU=Math.PI*2;
  function ambientFrame(now:number){
   if(!ambient||!ink||now-lastAmbient<1000/30)return;
   phase+=lastAmbient?Math.min(.08,(now-lastAmbient)/1000):0;lastAmbient=now;
   const W=ambient.width,H=ambient.height;
   const t=phase*TAU/10;
   ink.clearRect(0,0,W,H);ink.save();ink.scale(W,H);
   // Broad soft-sage silhouettes, with independently changing cubic contours.
   // The portrait and text remain in front of this decorative layer.
   for(let i=0;i<3;i++){
    const a=t+i*TAU/3;
    const cx=[.06,.83,.48][i]+.19*Math.sin(a);
    const cy=[.29,.65,.05][i]+.16*Math.cos(a*1.0+i);
    const sx=[.48,.52,.36][i],sy=[.32,.35,.26][i];
    ink.save();ink.translate(cx,cy);ink.rotate(.20*Math.sin(a+.7));ink.scale(sx,sy);
    const wobble=.20*Math.sin(a*2+.6),bend=.25*Math.cos(a+.9);
    ink.beginPath();ink.moveTo(-1.23,-.23);
    ink.bezierCurveTo(-.84,-.88+bend,-.53,-.72-wobble,-.23,-.36);
    ink.bezierCurveTo(.08,-.01+wobble,.46,-.86+bend,1.17,-.42);
    ink.bezierCurveTo(1.34,.02,.73,.26+wobble,.48,.08);
    ink.bezierCurveTo(.10,-.23+bend,.06,.54-wobble,-.37,.63);
    ink.bezierCurveTo(-.78,.69,-1.21,.28,-1.23,-.23);
    ink.closePath();ink.fillStyle=i===1?"#a7ad95":"#969e83";ink.globalAlpha=i===2?.12:.19;ink.fill();ink.restore();
   }
   ink.restore();
  }
  const running=()=>visible&&!paused&&!reduced.matches&&!document.hidden;
  function clear(){
   if(dirty&&ctx){ctx.clearRect(0,0,canvas!.width,canvas!.height);dirty=false}
  }
  function draw(now:number){
   raf=0;if(disposed||!running())return;
   ambientFrame(now);
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
   if(active){if(!raf)raf=requestAnimationFrame(draw)}
   else{if(raf)cancelAnimationFrame(raf);raf=0;lastAmbient=0;clear();if(reduced.matches&&ambient&&ink)ink.clearRect(0,0,ambient.width,ambient.height)}
  }
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync()},{threshold:.01});
  observer.observe(el);
  reduced.addEventListener("change",sync);
  document.addEventListener("visibilitychange",sync);
  sync();
  return()=>{disposed=true;if(raf)cancelAnimationFrame(raf);clear();observer.disconnect();reduced.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync)};
 },[paused]);
 return <div ref={root} className="hero-editorial-background" data-running="false" aria-hidden="true">
  <div className="hero-editorial-light"/>
  <div className="hero-editorial-shadow"/>
  <canvas ref={ambientRef} className="hero-ambient-shapes" width={720} height={400} aria-hidden="true"/>
  <canvas ref={canvasRef} className="hero-fluid-color" aria-hidden="true"/>
  <img className="hero-editorial-lines" src="/hero-contours-static.svg" alt="" draggable={false}/>
 </div>;
}
