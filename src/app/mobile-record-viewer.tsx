"use client";
import {useEffect,useRef,useState} from "react";
import type {RecordEntry} from "./achievements/data";
import {resetScrollMomentum} from "./motion-clock";

// A single native modal serves both homepage collections. Desktop links
// keep their original destination and modified clicks retain browser behavior.
export default function MobileRecordViewer({records}:{records:RecordEntry[]}){
 const [index,setIndex]=useState(-1),[zoom,setZoom]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLElement|null>(null);
 const paper=useRef<HTMLDivElement>(null);
 const selected=records[index];
 const open=index>=0;
 useEffect(()=>{
  function inspect(e:MouseEvent){
   if(!matchMedia("(max-width:899px)").matches||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||!(e.target instanceof Element))return;
   const item=e.target.closest<HTMLElement>("[data-mobile-record]");
   if(!item)return;
   const next=records.findIndex(r=>r.id===item.dataset.mobileRecord&&r.document);
   if(next<0)return;
   e.preventDefault();trigger.current=item;resetScrollMomentum();setZoom(false);setIndex(next);
  }
  document.addEventListener("click",inspect,true);
  return()=>document.removeEventListener("click",inspect,true);
 },[records]);
 useEffect(()=>{
  const el=dialog.current;if(!open||!el)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  if(!el.open)el.showModal();
  return()=>{document.body.style.overflow=previous;if(el.open)el.close()};
 },[open]);
 useEffect(()=>{if(paper.current){paper.current.scrollTop=0;paper.current.scrollLeft=0}},[index,zoom]);
 useEffect(()=>{
  const mq=matchMedia("(max-width:899px)");
  const changed=()=>{if(!mq.matches)dialog.current?.close()};
  mq.addEventListener("change",changed);return()=>mq.removeEventListener("change",changed)
 },[]);
 function move(delta:number){if(records.length<2)return;setZoom(false);setIndex(i=>(i+delta+records.length)%records.length)}
 return <dialog data-lenis-prevent ref={dialog} className="zm-record-viewer" aria-label="Original certificate viewer"
  onClose={()=>{setIndex(-1);setZoom(false);trigger.current?.focus({preventScroll:true});trigger.current=null}}
  onKeyDown={e=>{if(e.key==="ArrowLeft"&&!zoom){e.preventDefault();move(-1)}else if(e.key==="ArrowRight"&&!zoom){e.preventDefault();move(1)}}}>
  {selected&&<div className="zm-record-viewer-shell">
   <header className="zm-record-viewer-header"><span>ZM / ORIGINAL RECORDS</span><button type="button" autoFocus onClick={()=>dialog.current?.close()} aria-label="Close certificate viewer">×</button></header>
   <div className="zm-record-viewer-title"><span>{selected.category}{selected.period?" / "+selected.period:""}</span><h2>{selected.title}</h2><p>{selected.organization}</p></div>
   <div ref={paper} className={"zm-record-viewer-paper"+(zoom?" is-zoomed":"")}>
    {selected.document?.type==="image"?<img key={selected.id} src={selected.document.src} alt={selected.document.alt} decoding="async"/>:<a href={selected.document?.src} target="_blank" rel="noreferrer">Open original PDF ↗</a>}
   </div>
   <div className="zm-record-viewer-controls">
    <button type="button" onClick={()=>move(-1)} disabled={records.length<2} aria-label="Previous certificate">←</button>
    <span aria-live="polite">{String(index+1).padStart(2,"0")} / {String(records.length).padStart(2,"0")}</span>
    <button type="button" onClick={()=>move(1)} disabled={records.length<2} aria-label="Next certificate">→</button>
    {selected.document?.type==="image"&&<button type="button" aria-pressed={zoom} onClick={()=>setZoom(v=>!v)}>{zoom?"Fit":"Zoom +"}</button>}
   </div>
   <div className="zm-record-viewer-description"><p>{selected.description}</p><a href={selected.document?.src} target="_blank" rel="noreferrer">Open original ↗</a></div>
  </div>}
 </dialog>
}
