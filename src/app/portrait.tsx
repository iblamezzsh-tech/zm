"use client";
import { useEffect, useRef, useState } from "react";
import { HeroSignature } from "./signature-motion";
import { LiquidField, heroFields } from "./liquid-field";
import "./hero-atmosphere.css";
import ContourField from "./contour-field";

export default function Portrait() {
  const stage = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLImageElement>(null);
  const overlay = useRef<HTMLImageElement>(null);
  const lens = useRef<HTMLCanvasElement>(null);
  const switcher = useRef<HTMLButtonElement>(null);
  const pauseButton = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const area=stage.current, original=base.current, attire=overlay.current, output=lens.current, button=switcher.current, pause=pauseButton.current;
    if(!area||!original||!attire||!output||!button||!pause)return;
    const ctx=output.getContext("2d");
    if(!ctx)return;
    const mask=document.createElement("canvas");
    const maskCtx=mask.getContext("2d");
    if(!maskCtx)return;
    const motion=matchMedia("(prefers-reduced-motion: reduce)");
    const field=new LiquidField();
    heroFields.set(area,field);
    let bounds=area.getBoundingClientRect(), scale=1, dpr=1, alive=true, loaded=false, visible=false, stopped=false, full=false;
    let pointer:number|null=null, lastPoint:{x:number;y:number}|null=null;
    let raf=0,last=0,acc=0,age=0,lastInput=-1.5;
    let idlePoint:{x:number;y:number}|null=null;
    let targetX=0,targetY=0,dx=0,dy=0;
    let imageData:ImageData|null=null;
    const canMove=()=>visible&&!stopped&&!motion.matches&&!document.hidden;
    function paint(){
      if(!loaded||!ctx||!maskCtx||!output||!attire||!imageData)return;
      const w=bounds.width,h=bounds.height;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.globalCompositeOperation="source-over";ctx.clearRect(0,0,w,h);
      if(!full&&!field.hasInk)return;
      const fit=Math.min(w/attire.naturalWidth,h/attire.naturalHeight);
      const iw=attire.naturalWidth*fit,ih=attire.naturalHeight*fit;
      ctx.drawImage(attire,(w-iw)/2,h-ih,iw,ih);
      if(full)return;
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
      if(!full&&age>lastInput+2.5){
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
      }else if(!full){field.clear();field.splat(x,y,prev?.x??x-.012,prev?.y??y,1);paint()}
    }
    function enter(e:PointerEvent){refresh();track(e)}
    function leave(){lastPoint=null;targetX=targetY=0;if(!canMove()){field.clear();paint()}}
    function down(e:PointerEvent){if(!e.isPrimary||e.pointerType==="mouse"||(e.target instanceof Element&&e.target.closest("a,button")))return;pointer=e.pointerId;area!.setPointerCapture(e.pointerId);enter(e)}
    function up(e:PointerEvent){if(e.pointerId===pointer){pointer=null;leave()}}
    function toggle(){lastInput=age;idlePoint=null;full=!full;setPinned(full);field.clear();paint()}
    function toggleMotion(){stopped=!stopped;setPaused(stopped);lastInput=age;idlePoint=null;sync()}
    const controller=new AbortController(),options={signal:controller.signal,passive:true};
    const ro=new ResizeObserver(resize);
    const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync()},{threshold:.03});
    Promise.all([original.decode(),attire.decode()]).then(()=>{
      if(!alive)return;
      loaded=true;resize();setReady(true);ro.observe(area);io.observe(area);
      area.addEventListener("pointerenter",enter,options);area.addEventListener("pointermove",track,options);area.addEventListener("pointerleave",leave,options);
      area.addEventListener("pointerdown",down,options);area.addEventListener("pointerup",up,options);area.addEventListener("pointercancel",up,options);area.addEventListener("lostpointercapture",up,options);
      window.addEventListener("scroll",refresh,{...options,capture:true});
      button.addEventListener("click",toggle,options);pause.addEventListener("click",toggleMotion,options);
      motion.addEventListener("change",sync,options);document.addEventListener("visibilitychange",sync,options);
    }).catch(()=>{/* Keep the original portrait if the attire cannot be decoded. */});
    return()=>{alive=false;controller.abort();ro.disconnect();io.disconnect();if(raf)cancelAnimationFrame(raf);heroFields.delete(area)};
  }, []);

  return (
    <section aria-label="Interactive portrait">
      <link rel="preload" as="image" href="/images/portrait-present.webp" />
      <link rel="preload" as="image" href="/images/portrait-academic-attire.svg" />
      <div className={"stage hero-composition hero-atmosphere"+(paused?" hero-motion-paused":"")} ref={stage}>
        <div className="hero-world" aria-hidden="true"><ContourField paused={paused}/></div>
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
          <div className="eyebrow">{pinned ? "02 / The future" : "01 / The present"}</div>
          <h2>
            {pinned ? (
              <>
                Who I aspire
                <br />
                <em>to become.</em>
              </>
            ) : (
              <>
                Curious by
                <br />
                <em>nature.</em>
              </>
            )}
          </h2>
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
      </div>
      <div className="toolbar">
        <div className="hint">
          {ready ? (
            <>
              <span className="cross" aria-hidden="true">
                ⌖
              </span>
              <span className="mouse-hint">Move across the portrait to reveal the future</span>
              <span className="touch-hint">Touch and drag to reveal the future</span>
            </>
          ) : (
            <span>Personal portrait of ZiyoMuhammad</span>
          )}
        </div>
        <div className="hero-toolbar-actions">
        <button ref={pauseButton} type="button" className="hero-motion-toggle" hidden={!ready} aria-label={paused?"Resume ambient motion":"Pause ambient motion"} title={paused?"Resume ambient motion":"Pause ambient motion"}>{paused?<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z" fill="currentColor"/></svg>:<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4v12m6-12v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}</button>
        <button
          hidden={!ready}
          ref={switcher}
          className="switch"
          aria-pressed={pinned}
          aria-label="Show future portrait"
        >
          <span className={!pinned ? "selected" : ""}>Present</span>
          <span className={pinned ? "selected" : ""}>Future</span>
        </button>
        </div>
      </div>
    </section>
  );
}
