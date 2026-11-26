"use client";
import {useEffect,useRef} from "react";

const TAU=Math.PI*2;
const families=[
 {x:-.025,y:.63,stretch:1.16,tilt:-.23,phase:.3,rings:12,side:0},
 {x:1.045,y:.34,stretch:1.08,tilt:.32,phase:2.4,rings:12,side:1},
 {x:.49,y:-.57,stretch:1.65,tilt:-.12,phase:4.1,rings:8,side:2}
];
type Point={x:number;y:number};
export default function ContourField({paused}:{paused:boolean}){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const pausedRef=useRef(paused);
 const syncRef=useRef<(()=>void)|null>(null);
 useEffect(()=>{pausedRef.current=paused;syncRef.current?.()},[paused]);
 useEffect(()=>{
  const canvas=canvasRef.current;
  const stage=canvas?.closest<HTMLElement>(".hero-composition");
  if(!canvas||!stage)return;
  const context=canvas.getContext("2d",{alpha:false});
  if(!context)return;
  const ctx:CanvasRenderingContext2D=context;
  let w=0,h=0,dpr=1,raf=0,last=0,time=0,visible=true,disposed=false;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)");
  const target={x:0,y:0,weight:0};
  const cursor={x:0,y:0,weight:0};
  let bounds=stage.getBoundingClientRect();
  const motionEnabled=()=>!pausedRef.current&&!reduce.matches&&!document.hidden&&visible;
  const smooth=(a:number,b:number,t:number)=>a+(b-a)*t;
  const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
  function stroke(points:Point[],color:string|CanvasGradient,width:number,close=true){
   ctx.beginPath();
   ctx.moveTo(points[0].x,points[0].y);
   for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);
   if(close)ctx.closePath();
   ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  }
  function ring(f:typeof families[number],j:number,t:number,unit:number,samples:number){
   const points:Point[]=[];
   const phase=f.phase;
   const size=unit*(.11+j*.071);
   const cx=w*f.x+unit*.047*Math.sin(t*.42+phase);
   const cy=h*f.y+unit*.037*Math.cos(t*.35+phase);
   const cr=Math.cos(f.tilt),sr=Math.sin(f.tilt);
   for(let k=0;k<samples;k++){
    const a=k/samples*TAU;
    // All contours share one smooth field: they breathe together instead of sliding as a texture.
    const shape=1+.17*Math.sin(a*2+phase+t*.34)+.105*Math.cos(a*3-phase+t*.46)+.045*Math.sin(a*5+t*.6+phase);
    const x0=Math.cos(a)*size*shape*f.stretch;
    const y0=Math.sin(a)*size*shape*.84;
    let x=cx+x0*cr-y0*sr, y=cy+x0*sr+y0*cr;
    x+=unit*.035*Math.sin(y/unit*4.3+t*.57+phase);
    y+=unit*.025*Math.cos(x/unit*3.7-t*.45+phase);
    // Elastic local displacement, with a soft wake and no discontinuous cursor cutout.
    const dx=x-cursor.x,dy=y-cursor.y;
    const distance=Math.hypot(dx,dy);
    const radius=unit*.34;
    const influence=Math.exp(-(distance*distance)/(radius*radius))*cursor.weight;
    const wave=unit*.085*influence*Math.sin(distance/unit*10.5-t*2.2);
    const push=unit*.068*influence+wave;
    x+=dx/Math.max(distance,24)*push-cursor.weight*influence*14;
    y+=dy/Math.max(distance,24)*push;
    points.push({x,y});
   }
   return points;
  }
  function render(){
   if(!w||!h)return;
   const t=time;
   const unit=Math.min(w*.76,h*1.18);
   ctx.setTransform(dpr,0,0,dpr,0,0);
   ctx.fillStyle="#eeece3";ctx.fillRect(0,0,w,h);
   const light=ctx.createRadialGradient(w*(.45+.16*Math.sin(t*.21)),h*(.37+.13*Math.cos(t*.24)),0,w*.5,h*.45,Math.max(w,h)*.68);
   light.addColorStop(0,"#f8f7ef");light.addColorStop(.56,"#eeece3");light.addColorStop(1,"#e0e2d2");
   ctx.fillStyle=light;ctx.fillRect(0,0,w,h);
   ctx.lineJoin="round";ctx.lineCap="round";
   const count=w<650?80:116;
   for(const f of families){
    const g=ctx.createLinearGradient(0,0,w,0);
    if(f.side===0){g.addColorStop(0,"rgba(108,119,83,.49)");g.addColorStop(.37,"rgba(108,119,83,.31)");g.addColorStop(.72,"rgba(108,119,83,0)");g.addColorStop(1,"rgba(108,119,83,0)")}
    else if(f.side===1){g.addColorStop(0,"rgba(108,119,83,0)");g.addColorStop(.28,"rgba(108,119,83,0)");g.addColorStop(.63,"rgba(108,119,83,.32)");g.addColorStop(1,"rgba(108,119,83,.49)")}
    else{g.addColorStop(0,"rgba(108,119,83,.03)");g.addColorStop(.5,"rgba(108,119,83,.22)");g.addColorStop(1,"rgba(108,119,83,.03)")}
    for(let j=0;j<f.rings;j++){
     const pts=ring(f,j,t,unit,count);
     // Wide transparent contour ribbons provide depth, like translucent paper layers.
     if(j===3||j===8){
      ctx.globalAlpha=.22;stroke(pts,g,unit*.033);ctx.globalAlpha=1;
     }
     stroke(pts,g,j%4===0?1.55:.9);
     // A travelling segment of ink draws its way around select contours.
     if(j===5||j===10){
      const start=Math.floor((t*.061+f.phase*.14+j*.071)%1*count);
      const n=Math.max(8,Math.floor(count*.17));
      for(let k=0;k<n-1;k++){
       const a=pts[(start+k)%count],b=pts[(start+k+1)%count];
       const strength=Math.sin(k/(n-1)*Math.PI);
       if(f.side===0&&a.x>w*.62||f.side===1&&a.x<w*.38)continue;
       ctx.globalAlpha=strength*.75;stroke([a,b],"#71834a",2.5,false);
      }
      ctx.globalAlpha=1;
     }
    }
   }
   // A long, low-contrast ribbon flows independently from the topographic contours.
   const path:Point[]=[];
   for(let i=0;i<=100;i++){
    const x=w*(i/100*1.3-.15);
    const y=h*(.18+.13*Math.sin(x/w*4.2+t*.42)+.055*Math.sin(x/w*9-t*.29));
    path.push({x,y});
   }
   ctx.globalAlpha=.11;stroke(path,"#a6b48a",unit*.064,false);
   ctx.globalAlpha=.25;stroke(path,"#7b8c5f",.85,false);ctx.globalAlpha=1;
   // Fine accents are intentionally restrained; the portrait remains the focal point.
   const focus=ctx.createRadialGradient(w*.5,h*.37,0,w*.5,h*.37,unit*.56);
   focus.addColorStop(0,"rgba(244,241,232,.30)");focus.addColorStop(.65,"rgba(244,241,232,.09)");focus.addColorStop(1,"rgba(244,241,232,0)");
   ctx.fillStyle=focus;ctx.fillRect(0,0,w,h);
  }
  function frame(now:number){
   raf=0;if(disposed||!motionEnabled()){last=0;return}
   const dt=last?Math.min(.05,(now-last)/1000):.016;
   last=now;time+=dt;
   const ease=1-Math.exp(-dt*7);
   cursor.x=smooth(cursor.x,target.x,ease);
   cursor.y=smooth(cursor.y,target.y,ease);
   cursor.weight=smooth(cursor.weight,target.weight,1-Math.exp(-dt*3.5));
   render();raf=requestAnimationFrame(frame);
  }
  function sync(){
   if(disposed)return;
   if(motionEnabled()){if(!raf){last=0;raf=requestAnimationFrame(frame)}}
   else{if(raf)cancelAnimationFrame(raf);raf=0;last=0;target.weight=0;cursor.weight=0;render()}
  }
  function resize(){
   bounds=stage!.getBoundingClientRect();w=bounds.width;h=bounds.height;
   if(!w||!h)return;
   dpr=Math.min(devicePixelRatio||1,w<700?1.5:1.65);
   canvas!.width=Math.round(w*dpr);canvas!.height=Math.round(h*dpr);
   render();canvas!.dataset.ready="true";sync();
  }
  function move(e:PointerEvent){
   if(e.pointerType!=="mouse"||!motionEnabled())return;
   target.x=clamp(e.clientX-bounds.left,0,w);target.y=clamp(e.clientY-bounds.top,0,h);target.weight=1;
   if(cursor.weight<.015){cursor.x=target.x;cursor.y=target.y}
  }
  function leave(){target.weight=0}
  function refresh(){bounds=stage!.getBoundingClientRect()}
  const ro=new ResizeObserver(resize);
  const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync()},{threshold:.01});
  ro.observe(stage);io.observe(stage);
  stage.addEventListener("pointermove",move,{passive:true});
  stage.addEventListener("pointerleave",leave,{passive:true});
  window.addEventListener("scroll",refresh,{passive:true});
  document.addEventListener("visibilitychange",sync);
  reduce.addEventListener("change",sync);
  syncRef.current=sync;resize();
  return()=>{disposed=true;if(raf)cancelAnimationFrame(raf);ro.disconnect();io.disconnect();stage.removeEventListener("pointermove",move);stage.removeEventListener("pointerleave",leave);window.removeEventListener("scroll",refresh);document.removeEventListener("visibilitychange",sync);reduce.removeEventListener("change",sync);syncRef.current=null};
 },[]);
 return <canvas ref={canvasRef} className="hero-contour-field" aria-hidden="true"/>;
}
