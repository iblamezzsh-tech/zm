"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import Signature from "./signature";
import type {FeaturedRecord} from "./featured-records";
import "./journey-sequence.css";

const names=["The present","The journey","The future"];
export default function JourneySequence({records}:{records:FeaturedRecord[]}){
 const root=useRef<HTMLElement>(null);
 const stage=useRef<HTMLDivElement>(null);
 const [enhanced,setEnhanced]=useState(false);
 const [active,setActive]=useState(0);
 const current=useRef(0);
 useEffect(()=>{
  const el=root.current,canvas=stage.current;if(!el||!canvas)return;
  const query=matchMedia("(min-width: 850px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)");
  let raf=0;
  function measure(){
   raf=0;if(!query.matches)return;
   const rect=el!.getBoundingClientRect();
   const distance=rect.height-canvas!.offsetHeight;
   const p=Math.max(0,Math.min(1,-rect.top/Math.max(distance,1)));
   canvas!.style.setProperty("--journey-progress",String(p));
   const index=Math.min(2,Math.floor(p*3));
   if(index!==current.current){current.current=index;setActive(index)}
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(measure)}
  function sync(){setEnhanced(query.matches);current.current=0;setActive(0);schedule()}
  sync();query.addEventListener("change",sync);
  window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule,{passive:true});
  return()=>{query.removeEventListener("change",sync);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);if(raf)cancelAnimationFrame(raf)}
 },[]);
 function jump(i:number){if(!enhanced||!root.current||!stage.current)return;const y=window.scrollY+root.current.getBoundingClientRect().top;const distance=root.current.offsetHeight-stage.current.offsetHeight;window.scrollTo({top:y+distance*((i+.35)/3),behavior:"smooth"})}
 const archive=records.filter(r=>r.document).slice(0,3);
 return <section id="introduction" ref={root} className={"journey-sequence"+(enhanced?" journey-enhanced":"")} aria-label="From the present to the future">
 <div ref={stage} className="journey-stage" data-active={active}>
  <div className="journey-scene journey-now" aria-hidden={enhanced&&active!==0}>
   <div className="journey-mast"><span>ZM / THE DISTANCE BETWEEN</span><span>01 / THE PRESENT</span></div>
   <span className="journey-question" aria-hidden="true">?</span>
   <div className="journey-now-main"><span className="journey-overline">ANDIJAN, UZBEKISTAN</span><h2>I’m not<br/><em>there yet.</em></h2><p>I'm a student with questions, projects and a long way to go. The future you saw in the portrait is still unwritten.</p></div>
   <div className="journey-side-note"><span>NOW</span><span>→</span><span>NEXT</span></div>
  </div>
  <div className="journey-scene journey-past" aria-hidden={enhanced&&active!==1}>
   <div className="journey-mast"><span>ZM / THE DISTANCE BETWEEN</span><span>02 / THE JOURNEY</span></div>
   <div className="journey-past-copy"><span className="journey-overline">THE THINGS I KEEP</span><h2>Small<br/><em>moments.</em></h2><p>Leading school teams. Finding the answer to a Zakovat question. Learning something new on a court or in a classroom.</p></div>
   <div className="journey-documents" aria-label="Selected original records">{archive.map((r,i)=><figure className={"journey-document journey-document-"+i} key={r.id}><img src={r.document!.src} alt={r.document!.alt} loading="lazy" decoding="async"/><figcaption>{r.dateLabel} / {r.chapter}</figcaption></figure>)}</div>
  </div>
  <div className="journey-scene journey-next" aria-hidden={enhanced&&active!==2}>
   <div className="journey-mast"><span>ZM / THE DISTANCE BETWEEN</span><span>03 / THE FUTURE</span></div>
   <div className="journey-contours" aria-hidden="true"><svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="currentColor" strokeWidth="1">{Array.from({length:22},(_,i)=><ellipse key={i} cx="750" cy="350" rx={30+i*25} ry={20+i*14} transform={`rotate(${i*8} 750 350)`}/>)}</g></svg></div>
   <div className="journey-next-copy"><span className="journey-overline">STILL BECOMING</span><h2>The future<br/>isn’t <em>written.</em></h2><p>Economics, technology, education and ideas worth turning into action. This is where the next chapter begins.</p></div>
   <div className="journey-signature"><Signature/></div>
  </div>
  <div className="journey-navigation"><div className="journey-progress" aria-hidden="true"><span/></div><div className="journey-navigation-inner">{enhanced?<nav aria-label="Jump to a story scene">{names.map((name,i)=><button key={name} type="button" aria-current={active===i?"step":undefined} onClick={()=>jump(i)}><span>0{i+1}</span> {name}</button>)}</nav>:<span>01 — 03 / NOW &amp; NEXT</span>}<Link href="/about">Read my story <span aria-hidden="true">↗</span></Link></div></div>
 </div>
 </section>
}
