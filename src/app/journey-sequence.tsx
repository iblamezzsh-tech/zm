"use client";
import {useEffect,useRef,useState} from "react";
import {subscribeMotion,requestMotionFrame,scrollToFilm} from "./motion-clock";
import Link from "next/link";
import Signature from "./signature";
import {createAtlasTerrain} from "./atlas-terrain";
import "./atlas-scroll.css";
import type {FeaturedRecord} from "./featured-records";
import "./journey-sequence.css";

const names=["The present","The journey","The future"];
export default function JourneySequence({records}:{records:FeaturedRecord[]}){
 const root=useRef<HTMLElement>(null);
 const stage=useRef<HTMLDivElement>(null);
 const terrain=useRef<HTMLCanvasElement>(null);
 const [enhanced,setEnhanced]=useState(false);
 const [active,setActive]=useState(0);
 const current=useRef(0);
 useEffect(()=>{
  const el=root.current,canvas=stage.current;if(!el||!canvas)return;
  const query=matchMedia("(min-width: 850px) and (min-height: 520px) and (prefers-reduced-motion: no-preference)");
  let renderer:ReturnType<typeof createAtlasTerrain>=null;
  let near=false;
  const observer=new IntersectionObserver(entries=>{near=entries[0]?.isIntersecting??false;requestMotionFrame()},{rootMargin:"100px"});observer.observe(el);
  function measure(){
   if(!query.matches)return;
   const rect=el!.getBoundingClientRect();
   const distance=rect.height-canvas!.offsetHeight;
   const p=Math.max(0,Math.min(1,-rect.top/Math.max(distance,1)));
   canvas!.style.setProperty("--journey-progress",String(p));
   const index=p<.325?0:p<.72?1:2;
   const smooth=(a:number,b:number,x:number)=>{const u=Math.max(0,Math.min(1,(x-a)/(b-a)));return u*u*(3-2*u)};
   const first=smooth(.18,.45,p),second=smooth(.59,.87,p);
   canvas!.style.setProperty("--journey-first",String(first));
   canvas!.style.setProperty("--journey-second",String(second));
   canvas!.style.setProperty("--journey-papers",String(smooth(.22,.51,p)));
   canvas!.style.setProperty("--journey-now-exit",String(smooth(.12,.39,p)));
   canvas!.style.setProperty("--journey-memory-exit",String(smooth(.56,.80,p)));
   canvas!.style.setProperty("--journey-future-in",String(smooth(.64,.94,p)));
   // Camera and content have independent easing; keep settled chapters readable.
   const out0=smooth(.18,.34,p),in1=smooth(.30,.47,p),out1=smooth(.59,.73,p),in2=smooth(.71,.91,p);
   const props={"--atlas-out0":out0,"--atlas-in1":in1,"--atlas-out1":out1,"--atlas-in2":in2,"--atlas-memory":smooth(.26,.50,p),"--atlas-phase":p,"--atlas-first":first,"--atlas-second":second};
   Object.entries(props).forEach(([k,v])=>canvas!.style.setProperty(k,v.toFixed(4)));
   if(near&&renderer)renderer.draw(p);
   if(index!==current.current){current.current=index;setActive(index)}
  }
  const schedule=requestMotionFrame;
  function sync(){setEnhanced(query.matches);current.current=0;setActive(0);if(query.matches&&terrain.current&&!renderer){renderer=createAtlasTerrain(terrain.current);canvas!.dataset.terrain=renderer?"gpu":"fallback"}else if(!query.matches&&renderer){renderer.dispose();renderer=null;canvas!.dataset.terrain="fallback"}schedule()}
  sync();query.addEventListener("change",sync);
  const unsubscribe=subscribeMotion(measure);const ro=new ResizeObserver(schedule);ro.observe(el);
  return()=>{query.removeEventListener("change",sync);unsubscribe();ro.disconnect();observer.disconnect();renderer?.dispose()}
 },[]);
 function jump(i:number){if(!enhanced||!root.current||!stage.current)return;const y=window.scrollY+root.current.getBoundingClientRect().top;const distance=root.current.offsetHeight-stage.current.offsetHeight;scrollToFilm(y+distance*[.09,.52,.96][i])}
 const archive=records.filter(r=>r.document).slice(0,3);
 return <section id="introduction" ref={root} className={"journey-sequence"+(enhanced?" journey-enhanced atlas-journey":"")} aria-label="From the present to the future">
 <div ref={stage} className="journey-stage" data-active={active}>
  <div className="atlas-backdrop" aria-hidden="true"><canvas ref={terrain} className="atlas-terrain"/><div className="atlas-grid"/><svg className="atlas-route" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice"><path d="M-120 525C80 585 205 350 350 400S490 545 610 305 770 90 1120 120" pathLength="1" fill="none" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke"/><circle cx="610" cy="305" r="6" fill="currentColor"/><circle cx="610" cy="305" r="14" fill="none" stroke="currentColor"/></svg></div>
  <div className="journey-scene journey-now" aria-hidden={enhanced&&active!==0}>
   <div className="journey-mast"><span>ZM / THE DISTANCE BETWEEN</span><span>01 / THE PRESENT</span></div>
   <span className="journey-question" aria-hidden="true">?</span><span className="atlas-coordinate" aria-hidden="true">01 / ORIGIN<br/>NOW → NEXT</span>
   <div className="journey-now-main"><span className="journey-overline">ANDIJAN, UZBEKISTAN</span><h2><span className="journey-line"><span>I’m not</span></span><br/><em className="journey-line"><span>there yet.</span></em></h2><p>I'm a student with questions, projects and a long way to go. The future you saw in the portrait is still unwritten.</p></div>
   <div className="journey-side-note"><span>NOW</span><span>→</span><span>NEXT</span></div>
  </div>
  <div className="journey-scene journey-past" aria-hidden={enhanced&&active!==1}>
   <div className="journey-mast"><span>ZM / THE DISTANCE BETWEEN</span><span>02 / THE JOURNEY</span></div>
   <div className="journey-past-copy"><span className="journey-overline">THE THINGS I KEEP</span><h2><span className="journey-line"><span>Small</span></span><br/><em className="journey-line"><span>moments.</span></em></h2><p>Leading school teams. Finding the answer to a Zakovat question. Learning something new on a court or in a classroom.</p></div>
   <div className="journey-documents atlas-document-cloud" aria-label="Selected original records">{archive.map((r,i)=><figure className={"journey-document journey-document-"+i} key={r.id}><img src={r.document!.src} alt={r.document!.alt} loading="lazy" decoding="async"/><figcaption>{r.dateLabel} / {r.chapter}</figcaption></figure>)}</div>
  </div>
  <div className="journey-scene journey-next" aria-hidden={enhanced&&active!==2}>
   <div className="journey-mast"><span>ZM / THE DISTANCE BETWEEN</span><span>03 / THE FUTURE</span></div>
   <div className="journey-contours" aria-hidden="true"><svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="currentColor" strokeWidth="1">{Array.from({length:22},(_,i)=><ellipse key={i} cx="750" cy="350" rx={30+i*25} ry={20+i*14} transform={`rotate(${i*8} 750 350)`}/>)}</g></svg></div>
   <div className="journey-next-copy"><span className="journey-overline">STILL BECOMING</span><h2><span className="journey-line"><span>The future</span></span><br/><span className="journey-line"><span>isn’t <em>written.</em></span></span></h2><p>Economics, technology, education and ideas worth turning into action. This is where the next chapter begins.</p></div>
   <div className="journey-signature"><Signature/></div>
  </div>
  <div className="journey-navigation"><div className="journey-progress" aria-hidden="true"><span/></div><div className="journey-navigation-inner">{enhanced?<nav aria-label="Jump to a story scene">{names.map((name,i)=><button key={name} type="button" aria-current={active===i?"step":undefined} onClick={()=>jump(i)}><span>0{i+1}</span> {name}</button>)}</nav>:<span>01 — 03 / NOW &amp; NEXT</span>}<Link href="/about">Read my story <span aria-hidden="true">↗</span></Link></div></div>
 </div>
 </section>
}
