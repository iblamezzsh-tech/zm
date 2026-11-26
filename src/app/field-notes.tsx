"use client";
import {useState,useRef,useEffect} from "react";
import Link from "next/link";
import type {FeaturedRecord} from "./featured-records";
import "./field-notes.css";
export default function FieldNotes({records,archive=false}:{records:FeaturedRecord[];archive?:boolean}){
 const [active,setActive]=useState(0);
 const stage=useRef<HTMLDivElement>(null);
 const [direction,setDirection]=useState(1);
 const record=records[active];
 const length=records.length;
 function select(index:number){if(index===active||index<0||index>=length)return;setDirection(index>active?1:-1);setActive(index)}
 useEffect(()=>{const el=stage.current;if(!el||!window.matchMedia("(prefers-reduced-motion: no-preference)").matches)return;const observer=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting){el.classList.add("field-visible");observer.disconnect()}},{threshold:.15});observer.observe(el);return ()=>observer.disconnect()},[]);
 if(!record)return null;
 return <section className={"field-notes"+(archive?" field-notes-archive":"")} id={archive?"featured":"milestone-preview"} aria-labelledby="field-title">
 <div className="field-top"><span>{archive?"SELECTED MILESTONES":"03 / THE DISTANCE BETWEEN"}</span><span>THE PRESENT IS MADE OF SMALL MOMENTS</span></div>
 <div className="field-heading"><h2 id="field-title">{archive?"Selected":"Before the"}<br/><em>{archive?"moments.":"next chapter."}</em></h2><p>From the handball court to an Olympiad and a room full of different perspectives. A few moments that made me who I am today.</p></div>
 <div className="field-stage" ref={stage}>
 <div className="field-stage-line" aria-hidden="true"><span>ZM</span><svg viewBox="0 0 900 440" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="currentColor" strokeWidth=".8">{Array.from({length:16},(_,i)=><ellipse key={i} cx="450" cy="220" rx={90+i*30} ry={38+i*16} transform={`rotate(${i*9-35} 450 220)`}/>)}</g></svg></div>
 <div className="field-stage-info" aria-live="polite"><div className="field-counter"><span>{String(active+1).padStart(2,"0")}</span><span> / {String(length).padStart(2,"0")}</span></div><div key={record.id} className="field-caption"><span className="field-year">{record.dateLabel} — {record.chapter}</span><h3>{record.headline}</h3><p>{record.title}</p><p className="field-org">{record.organization}</p></div></div>
 <div className="field-art"><div className="field-print" key={record.id} style={{"--field-direction":direction} as React.CSSProperties}><div className="field-print-top"><span>PERSONAL ARCHIVE</span><span>FIG. {String(active+1).padStart(2,"0")}</span></div>{record.document&&<img src={record.document.src} alt={record.document.alt} loading="lazy" decoding="async"/>}<div className="field-print-bottom"><span>{record.type.toUpperCase()}</span><span>{record.period??record.dateLabel}</span></div></div></div>
 <div className="field-controls"><button type="button" disabled={active===0} onClick={()=>select(active-1)} aria-label="Previous milestone">←</button><button type="button" disabled={active===length-1} onClick={()=>select(active+1)} aria-label="Next milestone">→</button></div></div>
 <div className="field-index" role="group" aria-label="Choose a milestone">{records.map((r,i)=><button key={r.id} type="button" aria-pressed={active===i} onClick={()=>select(i)}><span>{String(i+1).padStart(2,"0")}</span><strong>{r.dateLabel}</strong><small>{r.chapter}</small><span className="field-index-indicator" aria-hidden="true"/></button>)}</div>
 <div className="field-footer"><span>{length} SELECTED RECORDS / ORIGINAL DOCUMENTS</span><Link href={archive?"#archive-title":"/achievements"}>{archive?"Explore the full archive":"Discover all milestones"} <span aria-hidden="true">↗</span></Link></div>
 </section>
}
