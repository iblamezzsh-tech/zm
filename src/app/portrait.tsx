"use client";
import { useEffect, useRef } from "react";
import { HeroSignature } from "./signature-motion";
import { LiquidField, heroFields } from "./liquid-field";
import "./hero-atmosphere.css";
import ContourField from "./contour-field";

export default function Portrait() {
  const stage = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLImageElement>(null);
  const overlay = useRef<HTMLImageElement>(null);
  const lens = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const area=stage.current, original=base.current, attire=overlay.current, output=lens.current;
    const ready=(ok=true)=>document.dispatchEvent(new CustomEvent("zm-portrait-ready",{detail:{ok}}));
    if(!area||!original||!attire||!output){ready(false);return;}
    const ctx=output.getContext("2d");
    if(!ctx){ready(false);return;}
    const mask=document.createElement("canvas");
    const maskCtx=mask.getContext("2d");
    if(!maskCtx){ready(false);return;}
    const motion=matchMedia("(prefers-reduced-motion: reduce)");
    const field=new LiquidField();
    heroFields.set(area,field);
    let bounds=area.getBoundingClientRect(), scale=1, dpr=1, alive=true, loaded=false, visible=false;
    let pointer:number|null=null, lastPoint:{x:number;y:number}|null=null;
    let raf=0,last=0,acc=0,age=0,lastInput=-1.5;
    let idlePoint:{x:number;y:number}|null=null;
    let targetX=0,targetY=0,dx=0,dy=0;
    let imageData:ImageData|null=null;
    const canMove=()=>visible&&!motion.matches&&!document.hidden;
    function paint(){
      if(!loaded||!ctx||!maskCtx||!output||!attire||!imageData)return;
      const w=bounds.width,h=bounds.height;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.globalCompositeOperation="source-over";ctx.clearRect(0,0,w,h);
      if(!field.hasInk)return;
      const fit=Math.min(w/attire.naturalWidth,h/attire.naturalHeight);
      const iw=attire.naturalWidth*fit,ih=attire.naturalHeight*fit;
      ctx.drawImage(attire,(w-iw)/2,h-ih,iw,ih);
      // Alpha comes from the evolving density field, not a circular CSS mask.
      field.writeMask(imageData.data);
      maskCtx.putImageData(imageData,0,0);
      ctx.globalCompositeOperation="destination-in";
      ctx.imageSmoothingEnabled=true;
      ctx.imageSmoothingQuality="high";
      ctx.drawImage(mask,(-dx-w*(1-scale)/2)/scale,(-dy-h*(1-scale))/scale,w/scale,h/scale);
      ctx.globalCompositeOperation="source-over";
    }
    function depth(){
      area!.style.setProperty("--hero-dx",dx+"px");area!.style.setProperty("--hero-dy",dy+"px");
    }
    function frame(now:number){
      raf=0;if(!alive||!canMove()){last=0;return}
      const dt=last?Math.min(.05,(now-last)/1000):1/60;last=now;age+=dt;acc+=dt;
      const ease=1-Math.exp(-dt*6);
      dx+=(targetX-dx)*ease;dy+=(targetY-dy)*ease;depth();
      if(age>lastInput+2.5){
        // A slow figure-eight gives the opening scene life even without input.
        const t=(age-lastInput-2.5)*.65;
        const next={x:.5+.12*Math.sin(t),y:.32+.15*Math.sin(t*2)};
        if(idlePoint)field.splat(next.x,next.y,idlePoint.x,idlePoint.y,.82);
        idlePoint=next;
      }else idlePoint=null;
      while(acc>=1/60){field.step();acc-=1/60}
      paint();raf=requestAnimationFrame(frame);
    }
    function sync(){
      if(!alive)return;
      if(canMove()){if(!raf){last=0;raf=requestAnimationFrame(frame)}}
      else{if(raf)cancelAnimationFrame(raf);raf=0;last=0;acc=0;targetX=targetY=dx=dy=0;lastPoint=null;idlePoint=null;depth();field.clear();paint()}
    }
    function resize(){
      bounds=area!.getBoundingClientRect();
      if(!bounds.width||!bounds.height)return;
      scale=Number.parseFloat(getComputedStyle(area!).getPropertyValue("--portrait-scale"))||1;
      dpr=Math.min(devicePixelRatio||1,1.6);
      output!.width=Math.round(bounds.width*dpr);output!.height=Math.round(bounds.height*dpr);
      field.resize(bounds.width,bounds.height);
      mask.width=field.width;mask.height=field.height;
      imageData=maskCtx!.createImageData(field.width,field.height);
      paint();
    }
    function refresh(){bounds=area!.getBoundingClientRect()}
    function track(e:PointerEvent){
      if(e.pointerType!=="mouse"&&pointer!==e.pointerId)return;
      lastInput=age;idlePoint=null;
      const x=Math.max(0,Math.min(1,(e.clientX-bounds.left)/Math.max(1,bounds.width)));
      const y=Math.max(0,Math.min(1,(e.clientY-bounds.top)/Math.max(1,bounds.height)));
      const prev=lastPoint;lastPoint={x,y};
      if(canMove()){
        if(e.pointerType==="mouse"){targetX=(x*2-1)*13;targetY=(y*2-1)*6}
        if(prev)field.splat(x,y,prev.x,prev.y,1);
      }else{field.clear();field.splat(x,y,prev?.x??x-.012,prev?.y??y,1);paint()}
    }
    function enter(e:PointerEvent){refresh();track(e)}
    function leave(){lastPoint=null;targetX=targetY=0;if(!canMove()){field.clear();paint()}}
    function down(e:PointerEvent){if(!e.isPrimary||e.pointerType==="mouse"||(e.target instanceof Element&&e.target.closest("a,button")))return;pointer=e.pointerId;area!.setPointerCapture(e.pointerId);enter(e)}
    function up(e:PointerEvent){if(e.pointerId===pointer){pointer=null;leave()}}
    const controller=new AbortController(),options={signal:controller.signal,passive:true};
    const ro=new ResizeObserver(resize);
    const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync()},{threshold:.03});
    Promise.all([original.decode(),attire.decode()]).then(()=>{
      if(!alive)return;
      loaded=true;resize();ro.observe(area);io.observe(area);
      area.addEventListener("pointerenter",enter,options);area.addEventListener("pointermove",track,options);area.addEventListener("pointerleave",leave,options);
      area.addEventListener("pointerdown",down,options);area.addEventListener("pointerup",up,options);area.addEventListener("pointercancel",up,options);area.addEventListener("lostpointercapture",up,options);
      window.addEventListener("scroll",refresh,{...options,capture:true});
      motion.addEventListener("change",sync,options);document.addEventListener("visibilitychange",sync,options);
      ready();
    }).catch(()=>{/* Keep the original portrait if the attire cannot be decoded. */if(alive)ready(false);});
    return()=>{alive=false;controller.abort();ro.disconnect();io.disconnect();if(raf)cancelAnimationFrame(raf);heroFields.delete(area)};
  }, []);

  return (
    <section aria-label="Interactive portrait">
      <link rel="preload" as="image" href="/images/portrait-present.webp" />
      <link rel="preload" as="image" href="/images/portrait-academic-attire.svg" />
      <div className="stage hero-composition hero-atmosphere" ref={stage}>
        <div className="hero-world" aria-hidden="true"><ContourField paused={false}/></div>
        <h1 className="hero-name" aria-label="ZiyoMuhammad">
          <svg viewBox="0 0 1200 164" role="presentation" aria-hidden="true">
            <text x="10" y="124" textLength="1180" lengthAdjust="spacingAndGlyphs">ZiyoMuhammad</text>
          </svg>
        </h1>
        <div className="hero-portrait-plane">
        <img
          className="photo"
          ref={base}
          src="/images/portrait-present.webp"
          alt="ZiyoMuhammad in a white shirt"
          fetchPriority="high"
        />
        <canvas className="hero-liquid-reveal" ref={lens} aria-hidden="true"/>
        <div className="hero-attire-source" aria-hidden="true">
          <img
            className="photo future-photo"
            ref={overlay}
            src="/images/portrait-academic-attire.svg"
            alt=""
            aria-hidden="true"
          />
        </div>
        </div>
        <div className="plate">
          <span className="plate-line" />
          Portrait / 01
        </div>
        <div className="caption">
          <div className="eyebrow">01 / The present</div>
          <h2>Curious by<br /><em>nature.</em></h2>
        </div>
        <aside className="hero-note" aria-label="Personal introduction">
          <span>Uzbekistan</span>
          <p>Student. Founder.<br />Always learning.</p>
        </aside>
        <HeroSignature />
        <a className="hero-scroll" href="#introduction"><span aria-hidden="true">↓</span> Scroll to discover</a>
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <div className="film-hero-curtain" aria-hidden="true"><div className="film-curtain-top"><span>ZM / 01—02</span><span>THE DISTANCE BETWEEN</span></div><svg className="film-curtain-engraving" viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth=".8">{Array.from({length:18},(_,i)=><ellipse key={i} cx="965" cy="380" rx={55+i*24} ry={40+i*16} transform={`rotate(${i*9-30} 965 380)`}/>)}</g></svg><div className="film-curtain-word"><span>NOW.</span><span>NEXT.</span></div><span className="film-curtain-bottom">KEEP SCROLLING ↓</span></div>
      </div>
    </section>
  );
}
