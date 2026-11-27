"use client";
import { useEffect, useRef, useState } from "react";
import { HeroSignature } from "./signature-motion";
import { LiquidField, heroFields } from "./liquid-field";
import "./hero-atmosphere.css";
import "./portrait-loading.css";
import ContourField from "./contour-field";
import {mobilePortraitScale,approachLook,lookAlpha} from "./mobile-portrait-geometry";

export default function Portrait() {
  const stage = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLImageElement>(null);
  const overlay = useRef<HTMLImageElement>(null);
  const lens = useRef<HTMLCanvasElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [attireReady,setAttireReady]=useState(false);
  const [mobileLook,setMobileLook]=useState(false);
  const lookTarget=useRef(false);
  function toggleLook(){lookTarget.current=!lookTarget.current;setMobileLook(lookTarget.current)}
  // Only an actually pending base image warrants an indicator. Never gate
  // the page, wait for other assets, or delay a cached/finished portrait.
  useEffect(() => {
    const img=base.current;
    if(!img || img.complete)return;
    let active=true;
    const finish=()=>{clearTimeout(timer);if(active)setShowLoading(false)};
    const timer=window.setTimeout(()=>{
      if(active&&!img.complete)setShowLoading(true);
    },220);
    img.addEventListener("load",finish);
    img.addEventListener("error",finish);
    if(img.complete)finish();
    return()=>{active=false;clearTimeout(timer);img.removeEventListener("load",finish);img.removeEventListener("error",finish)};
  }, []);


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
    let raf=0,last=0,acc=0,age=0,lastInput=-3;
    let idleAge=0,idleMix=0,lastPaint=0;
    let lookMix=0,mobile=false;
    let targetX=0,targetY=0,dx=0,dy=0;
    let imageData:ImageData|null=null;
    const canMove=()=>visible&&!motion.matches&&!document.hidden;
    function paint(){
      if(!loaded||!ctx||!maskCtx||!output||!attire||!imageData)return;
      const w=area!.clientWidth,h=area!.clientHeight;
      if(!w||!h)return;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.globalCompositeOperation="source-over";ctx.clearRect(0,0,w,h);
      if(!field.hasInk&&idleMix<.005&&lookMix<=0)return;
      const fit=Math.min(w/attire.naturalWidth,h/attire.naturalHeight);
      const iw=attire.naturalWidth*fit,ih=attire.naturalHeight*fit;
      ctx.drawImage(attire,(w-iw)/2,h-ih,iw,ih);
      if(mobile&&lookMix>=1)return;
      // Alpha comes from the evolving density field, not a circular CSS mask.
      field.writeMask(imageData.data);
      // A time-driven, softly feathered ribbon reveals real attire pixels even
      // without pointer velocity. Combine it with the original interactive field.
      if(mobile&&lookMix>0){
        const W=field.width,H=field.height,data=imageData.data;
        for(let j=0;j<H;j++)for(let i=0;i<W;i++){
          const k=(j*W+i)*4+3;
          data[k]=lookAlpha(i/(W-1),j/(H-1),lookMix);
        }
      }else if(idleMix>.005){
        const W=field.width,H=field.height,data=imageData.data;
        const phase=idleAge*Math.PI*2/11;
        const center=.49-.67*Math.cos(phase);
        const left=(w-iw)/2,top=h-ih;
        for(let j=0;j<H;j++){
          const py=(j/(H-1)*h-dy-h*(1-scale))/scale;
          const y=(py-top)/ih;
          if(y<-.15||y>1.15)continue;
          for(let i=0;i<W;i++){
            const px=(i/(W-1)*w-dx-w*(1-scale)/2)/scale;
            const x=(px-left)/iw;
            if(x<-.15||x>1.15)continue;
            const wave=.09*Math.sin(x*6.8-phase*1.4)+.035*Math.sin(x*15+phase);
            const d=Math.abs(y-center-wave);
            const t=Math.max(0,Math.min(1,(.29-d)/.16));
            const alpha=Math.round(255*idleMix*.96*t*t*(3-2*t));
            const k=(j*W+i)*4+3;
            data[k]=Math.max(data[k],alpha);
          }
        }
      }
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
      lookMix=mobile?approachLook(lookMix,lookTarget.current?1:0,dt):0;
      const idle=pointer===null&&age-lastInput>1.25&&!(mobile&&(lookTarget.current||lookMix>0));
      idleMix+=((idle?1:0)-idleMix)*(1-Math.exp(-dt*(idle?1.7:5.5)));
      if(idleMix>.005)idleAge+=dt;
      const amp=area!.clientWidth<600?1.5:3.5;
      const driftX=Math.sin(idleAge*Math.PI*2/8)*amp*idleMix;
      const driftY=(1-Math.cos(idleAge*Math.PI*2/10))*.9*idleMix;
      const ease=1-Math.exp(-dt*6);
      dx+=(targetX+driftX-dx)*ease;dy+=(targetY+driftY-dy)*ease;depth();
      while(acc>=1/60){field.step();acc-=1/60}
      // Idle compositing at 30fps; pointer interaction stays at display cadence.
      if(!idle||now-lastPaint>=1000/30){paint();lastPaint=now}
      raf=requestAnimationFrame(frame);
    }
    function sync(){
      if(!alive)return;
      if(canMove()){if(!raf){last=0;raf=requestAnimationFrame(frame)}}
      else{if(raf)cancelAnimationFrame(raf);raf=0;last=0;acc=0;targetX=targetY=dx=dy=0;lastPoint=null;idleMix=0;lastPaint=0;lookMix=mobile&&lookTarget.current?1:0;depth();field.clear();paint()}
    }
    function resize(){
      bounds=area!.getBoundingClientRect();
      const w=area!.clientWidth,h=area!.clientHeight;
      if(!w||!h)return;
      // The mobile hero uses a viewport-height composition rather than
      // a width-constrained thumbnail. Match the canvas and both photos
      // to one numeric scale; the same fit is used by the fluid mask.
      mobile=matchMedia("(max-width:899px)").matches;
      if(matchMedia("(max-width:599px) and (min-height:500px) and (orientation:portrait)").matches){
        const title=area!.querySelector<HTMLElement>(".hero-name");
        const kicker=area!.querySelector<HTMLElement>(".zm-mobile-hero-kicker");
        const titleBottom=Math.max(title?title.offsetTop+title.offsetHeight:0,kicker?kicker.offsetTop+kicker.offsetHeight:0);
        area!.style.setProperty("--portrait-scale",mobilePortraitScale(w,h,titleBottom).toFixed(4));
      }else area!.style.removeProperty("--portrait-scale");
      scale=Number.parseFloat(getComputedStyle(area!).getPropertyValue("--portrait-scale"))||1;
      dpr=mobile?Math.min((devicePixelRatio||1)*Math.max(1,scale),2.5):Math.min(devicePixelRatio||1,1.6);
      output!.width=Math.round(w*dpr);output!.height=Math.round(h*dpr);
      field.resize(w,h);
      mask.width=field.width;mask.height=field.height;
      imageData=maskCtx!.createImageData(field.width,field.height);
      paint();
    }
    function refresh(){bounds=area!.getBoundingClientRect()}
    function track(e:PointerEvent){
      if(e.pointerType!=="mouse"&&pointer!==e.pointerId)return;
      lastInput=age;
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
      loaded=true;setAttireReady(true);resize();ro.observe(area);io.observe(area);
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
      <div className="stage hero-composition hero-atmosphere" data-mobile-look={mobileLook?"future":"present"} ref={stage}>
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
        {showLoading && <div className="zm-portrait-loading" role="status" aria-label="Loading portrait">
          <img src="/icon.svg" alt="" width="52" height="52"/>
        </div>}
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
        <span className="zm-mobile-hero-kicker">STUDENT / FOUNDER / UZBEKISTAN</span>
        <button className="zm-mobile-look" type="button" disabled={!attireReady} aria-label={mobileLook?"Return to present portrait":"Reveal graduation portrait"} aria-pressed={mobileLook} onClick={toggleLook}><span>{mobileLook?"BACK TO NOW":"TAP TO LOOK"}</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.5v4m0 9v4M3.5 12h4m9 0h4M6 6l2.5 2.5m7 7L18 18m0-12-2.5 2.5m-7 7L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg></button>
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
