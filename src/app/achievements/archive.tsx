"use client";
import {useEffect,useRef,useState} from "react";
import {categories,type Category,type RecordEntry} from "./data";
import MotionWords from "../motion-words";

function Mark({category}:{category:RecordEntry["category"]}){
 return <svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.2" fill="none">
 {category==="Competitions"?<><circle cx="50" cy="44" r="28"/><circle cx="50" cy="44" r="21"/><path d="m31 66-6 25 24-13 24 13-6-25 M50 30l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1Z"/></>:category==="Leadership"?<><circle cx="50" cy="50" r="35"/><path d="M50 10v80M10 50h80 M50 18l12 32-12 32-12-32Z"/><circle cx="50" cy="50" r="6" fill="currentColor"/></>:category==="Volunteering"?<><path d="M50 83C43 75 12 56 12 33 12 13 38 8 50 29 62 8 88 13 88 33 88 56 57 75 50 83Z"/><path d="M50 71V36 M50 56Q30 51 28 37 M50 50Q67 45 72 33"/></>:category==="Sports"?<><circle cx="50" cy="50" r="36"/><path d="m50 32 17 12-6 20H39l-6-20Z M50 32V14 M67 44l18-6 M61 64l11 15 M39 64 28 79 M33 44 15 38"/></>:<><path d="M12 26Q33 19 50 31Q67 19 88 26V72Q67 64 50 77Q33 64 12 72Z M50 31V77 M21 36l20 5 M59 41l20-5"/></>}
 </g></svg>
}
function EntryCard({entry,onOpen}:{entry:RecordEntry;onOpen:(button:HTMLButtonElement)=>void}){
 return <button type="button" className={"archive-record"+(entry.document?" record-has-document":" record-experience")} onClick={event=>onOpen(event.currentTarget)}>
 <span className={"record-cover"+(entry.document?.type==="image"?" record-cover-photo":"")}><span>ZM / ORIGINAL RECORD</span>{entry.document?.type==="image"?<img src={entry.document.src} alt={entry.document.alt} loading="lazy" decoding="async"/>:<Mark category={entry.category}/>}<span>{entry.type.toUpperCase()}</span></span>
 <span className="record-info"><span>{entry.category}{entry.period?" / "+entry.period:""}</span><span className="record-title">{entry.title}</span><span className="record-org">{entry.organization}</span><span className="record-open">Read record <span aria-hidden="true">↗</span></span></span>
 </button>
}
export default function Archive({records}:{records:RecordEntry[]}){
 const [category,setCategory]=useState<Category>("All");
 const [selected,setSelected]=useState<RecordEntry|null>(null);
 const [featuredId,setFeaturedId]=useState(records[0]?.id??"");
 const deskTrigger=useRef<HTMLButtonElement>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement|null>(null);
 const items=records.filter(item=>category==="All"||(category==="Certificates"?Boolean(item.document):item.category===category));
 const featured=items.find(r=>r.id===featuredId)??items[0];
 const index=items.findIndex(r=>r.id===featured?.id);
 function move(delta:number){if(items.length)setFeaturedId(items[(index+delta+items.length)%items.length].id)}
 useEffect(()=>{const el=dialog.current;if(!selected||!el)return;if(!el.open)el.showModal();const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=previous}},[selected]);
 function open(entry:RecordEntry,button:HTMLButtonElement){trigger.current=button;setSelected(entry)}
 function close(){dialog.current?.close()}
 return <section className="archive-section" aria-labelledby="archive-title">
 <div className="archive-rule"><span>01 / Personal records</span><span>Experiences &amp; evidence</span></div>
 <div className="archive-heading"><h2 id="archive-title"><MotionWords text="The"/> <em><MotionWords text="archive."/></em></h2><p>School days, competitions, volunteering and the documents I’ve kept along the way.</p></div>
 <div className="archive-tabs" role="group" aria-label="Filter archive">{categories.map(c=><button type="button" key={c} aria-pressed={category===c} onClick={()=>{setCategory(c);setFeaturedId("")}}>{c}</button>)}</div>
 <div className="archive-count" aria-live="polite">{String(items.length).padStart(2,"0")} {items.length===1?"record":"records"} / {category}</div>
 {featured&&<div className="archive-desk" aria-label="Selected archive record">
 <div className="desk-top"><span>ZM / READING ROOM</span><span>{String(index+1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</span></div>
 <div className="desk-object"><div className="desk-paper-back" aria-hidden="true"/><div className="desk-paper" key={featured.id}>
 {featured.document?.type==="image"?<img src={featured.document.src} alt={featured.document.alt} decoding="async"/>:<div className="desk-index-sheet"><Mark category={featured.category}/><span>{featured.category} / {featured.type}</span><strong>{featured.title}</strong></div>}
 <span className="desk-paper-label">ORIGINAL RECORD / {featured.period??featured.category}</span></div></div>
 <div className="desk-copy" key={featured.id}><span className="desk-kicker">{featured.category} / {featured.type}</span><h3>{featured.title}</h3><p>{featured.organization}</p><button ref={deskTrigger} type="button" className="desk-open" onClick={e=>open(featured,e.currentTarget)}>Inspect record <span aria-hidden="true">↗</span></button></div>
 <div className="desk-controls"><button type="button" onClick={()=>move(-1)} disabled={items.length<2} aria-label="Previous archive record">←</button><span>TURN THE PAGE</span><button type="button" onClick={()=>move(1)} disabled={items.length<2} aria-label="Next archive record">→</button></div>
 </div>}
 {items.length?<div className="archive-grid" key={category}>{items.map(entry=><EntryCard entry={entry} key={entry.id} onOpen={button=>open(entry,button)}/>)}</div>:<div className="archive-empty"><span>ZM / ARCHIVE NOTES</span><h3>{category==="Certificates"?"Documents yet to be added.":"A chapter still unfolding."}</h3><p>{category==="Certificates"?"No certificate files have been published in this archive yet.":"There are no published records in this category yet."}</p><button type="button" onClick={()=>setCategory("All")}>Browse all records ↗</button></div>}
 <dialog data-lenis-prevent className="archive-dialog" ref={dialog} aria-label={selected?.title ?? "Archive record"} onClose={()=>{setSelected(null);trigger.current?.focus();trigger.current=null}} onClick={e=>{if(e.target===e.currentTarget){const rect=e.currentTarget.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)close()}}}>
 <button type="button" autoFocus className="archive-close" aria-label="Close record" onClick={close}>×</button>
 {selected&&<><div className="dialog-meta">{selected.type} / {selected.category}{selected.period?" / "+selected.period:""}</div><h2 id="record-title">{selected.title}</h2><div className="dialog-org">{selected.organization}</div><p>{selected.description}</p>{selected.document?(<div className="archive-document">{selected.document.type==="image"?<img src={selected.document.src} alt={selected.document.alt}/>:<object data={selected.document.src} type="application/pdf" aria-label={selected.document.alt}><a href={selected.document.src}>Open PDF</a></object>}<a href={selected.document.src} target="_blank" rel="noreferrer">Open original document ↗</a></div>):<div className="dialog-evidence">Personal record · No supporting certificate published.</div>}</>}
 </dialog>
 </section>
}
