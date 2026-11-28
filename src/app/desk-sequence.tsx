
"use client";
import {useEffect,useRef} from "react";
import Link from "next/link";
import {subscribeMotion,requestMotionFrame} from "./motion-clock";
import {getSceneTier} from "./motion-quality-store";
import {clamp} from "./desk-camera";
import type {createDeskRenderer} from "./desk-renderer";
import "./desk-sequence.css";

function DeskStill(){return <svg className="zm-desk-still" viewBox="0 0 1000 680" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="zm-desk-wood" x2="1" y2="1"><stop stopColor="#877563"/><stop offset="1" stopColor="#54483d"/></linearGradient><linearGradient id="zm-desk-paper" x2="1" y2="1"><stop stopColor="#f2e7d0"/><stop offset="1" stopColor="#d7c6a8"/></linearGradient><filter id="zm-desk-shadow"><feGaussianBlur stdDeviation="8"/></filter><pattern id="zm-desk-lines" width="140" height="18" patternUnits="userSpaceOnUse"><path d="M0 4Q36 1 73 5T140 4M0 12Q72 8 140 12" fill="none" stroke="#372b20" strokeOpacity=".16"/></pattern></defs><rect width="1000" height="680" fill="url(#zm-desk-wood)"/><rect width="1000" height="680" fill="url(#zm-desk-lines)"/><g transform="rotate(-8 260 100)"><rect x="-90" y="-110" width="570" height="310" rx="15" fill="#262823" filter="url(#zm-desk-shadow)"/><rect x="-90" y="-120" width="570" height="310" rx="15" fill="#a7aaa8" stroke="#666b68" strokeWidth="5"/><circle cx="180" cy="42" r="38" fill="#737977"/><text x="180" y="62" textAnchor="middle" fill="#d1d4cf" fontSize="56" fontStyle="italic" fontWeight="bold">hp</text><rect x="285" y="-20" width="156" height="67" rx="5" fill="#eee8db"/><text x="301" y="19" fill="#203650" fontSize="34" fontFamily="Georgia">Penn</text><text x="303" y="33" fontSize="6" fill="#203650">UNIVERSITY OF PENNSYLVANIA</text></g><g transform="rotate(3 805 100)"><rect x="661" y="-97" width="302" height="288" rx="13" fill="#a7977a" stroke="#292b27" strokeWidth="6"/><rect x="657" y="-110" width="308" height="283" rx="15" fill="#292e2b"/><rect x="668" y="-100" width="286" height="262" rx="10" stroke="#777467" strokeDasharray="3 4" fill="none"/><rect x="833" y="58" width="132" height="34" rx="17" fill="#343a35" stroke="#64665c"/><rect x="917" y="54" width="12" height="42" rx="3" fill="#292c27"/><rect x="902" y="137" width="42" height="17" rx="3" fill="#c0b9a8"/><text x="923" y="150" textAnchor="middle" fill="#302f29" fontSize="12">deli</text></g><g transform="rotate(-10 790 340)"><rect x="675" y="210" width="255" height="245" fill="#dbae40" stroke="#a17a24"/><text x="701" y="251" fontSize="26" fontWeight="bold" fill="#29251c">OverThink</text><ellipse cx="833" cy="321" rx="23" ry="12" transform="rotate(-25 833 321)" stroke="#54401c" fill="none" strokeWidth="2"/><text x="872" y="428" fontSize="44" fontWeight="bold" fill="#29251c">01</text></g><path d="M53 236L659 170 804 502Q736 544 583 561L76 631Z" fill="#2d241b" opacity=".6" filter="url(#zm-desk-shadow)"/><path d="M48 216L659 157 796 482Q751 515 580 547L67 612Z" fill="url(#zm-desk-paper)"/><g transform="translate(108 319) rotate(-6)"><image href="/brand/signature.svg" width="563" height="189"/></g><path d="M580 547Q745 521 796 482Q759 482 717 512Z" fill="#eaddc3"/><g transform="translate(401 601) rotate(-7)"><rect x="0" y="-10" width="345" height="20" rx="10" fill="#222824" stroke="#7b7d75"/><rect x="110" y="-8" width="198" height="16" rx="5" fill="#737b79"/><path d="M0 -7L-42 0 0 7Z" fill="#b0b7b6"/><path d="M15 -5H90M15 1H90" stroke="#555954"/><rect x="231" y="-14" width="70" height="7" rx="3" fill="#222824"/></g></svg>}
export default function DeskSequence(){
 const section=useRef<HTMLElement>(null),stage=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const host=section.current,frame=stage.current,element=canvas.current;if(!host||!frame||!element)return;
  let active=true,near=false,pending=false,failed=false,renderer:ReturnType<typeof createDeskRenderer>|null=null,last="";
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  function draw(){
   if(!active)return;
   const tier=getSceneTier("desk"),motion=!reduced.matches&&tier!=="lite"&&tier!=="reduced"&&!failed;
   host!.dataset.deskMotion=String(motion);
   if(!motion){host!.dataset.deskReady="false";return}
   if(!near)return;
   if(!renderer){if(pending)return;pending=true;import("./desk-renderer").then(({createDeskRenderer})=>{pending=false;if(!active)return;try{renderer=createDeskRenderer(element!,()=>{last="";requestMotionFrame()});last="";requestMotionFrame()}catch{failed=true;requestMotionFrame()}}).catch(()=>{pending=false;failed=true;requestMotionFrame()});return}
   const r=host!.getBoundingClientRect(),h=frame!.clientHeight,w=frame!.clientWidth;
   if(!h||!w||r.top>innerHeight+50||r.bottom< -50)return;
   const travel=Math.max(1,r.height-h),progress=clamp(-r.top/travel),portrait=w/h<.9;
   const key=[progress.toFixed(5),w,h,tier].join(":");if(key===last)return;last=key;
   try{renderer.render(progress,w,h,portrait,tier==="balanced");host!.dataset.deskReady="true";host!.dataset.deskProgress=progress.toFixed(4)}catch{failed=true;requestMotionFrame()}
  }
  const io=new IntersectionObserver(entries=>{near=entries.some(e=>e.isIntersecting);requestMotionFrame()},{rootMargin:"100% 0px"});io.observe(host);
  const resize=new ResizeObserver(()=>{last="";requestMotionFrame()});resize.observe(frame);
  const lost=(e:Event)=>{e.preventDefault();failed=true;requestMotionFrame()};
  element.addEventListener("webglcontextlost",lost);
  reduced.addEventListener("change",requestMotionFrame);
  const unsubscribe=subscribeMotion(draw);draw();
  return()=>{active=false;unsubscribe();io.disconnect();resize.disconnect();reduced.removeEventListener("change",requestMotionFrame);element.removeEventListener("webglcontextlost",lost);renderer?.dispose()};
 },[]);
 return <section ref={section} className="zm-desk-sequence" id="founders-desk" aria-label="The founder’s desk" data-motion-scene="desk" data-ed-scene data-ed-theme="dark" data-desk-motion="false" data-desk-ready="false"><div ref={stage} className="zm-desk-stage"><DeskStill/><canvas ref={canvas} className="zm-desk-canvas" aria-hidden="true"/><div className="zm-desk-top"><span>ZM / FIELD NOTES</span><span>01 — THE FOUNDER’S DESK</span></div><div className="zm-desk-bottom"><p>Where questions become ideas.</p><Link href="/projects/overthink" className="zm-desk-link">Explore OverThink <span aria-hidden="true">↗</span></Link></div></div></section>;
}
