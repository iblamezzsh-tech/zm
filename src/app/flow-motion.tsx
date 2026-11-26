"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {subscribeMotion,requestMotionFrame} from "./motion-clock";
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const smooth=(a:number,b:number,x:number)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
export default function FlowMotion(){
 const path=usePathname();
 useEffect(()=>{
  const main=document.querySelector<HTMLElement>("main");if(!main||main.classList.contains("film-home"))return;
  const q=matchMedia("(prefers-reduced-motion: no-preference)");
  const selector="[data-flow-scene],.home-hero,.field-stage,.personal-chapter,.home-contact,.story-entry,.case-feature-art,.case-introduction,.case-details,.case-future,.archive-desk,.personal-music,.personal-books,.contact-letter";
  const nodes=Array.from(main.querySelectorAll<HTMLElement>(selector));
  const cache=new Map<HTMLElement,string>();
  const seen=new Set<HTMLElement>();
  const io=new IntersectionObserver(entries=>{for(const e of entries){const el=e.target as HTMLElement;if(e.isIntersecting)seen.add(el);else seen.delete(el)}requestMotionFrame()},{rootMargin:"35% 0px"});
  nodes.forEach(n=>io.observe(n));
  function update(){
   if(!q.matches)return;
   const h=window.innerHeight;
   // Measure stationary layout wrappers first; only children receive motion.
   const values=nodes.filter(n=>seen.has(n)).map(el=>({el,r:el.getBoundingClientRect()}));
   for(const {el,r} of values){
    const pass=clamp((h-r.top)/(h+r.height));
    const enter=smooth(0,.37,pass);
    const exit=smooth(.64,1,pass);
    const travel=(pass-.5)*2;
    const phase=[pass,enter,exit,travel].map(v=>v.toFixed(4));
    const key=phase.join("/");
    if(cache.get(el)===key)continue;cache.set(el,key);
    ["--flow-pass","--flow-enter","--flow-exit","--flow-travel"].forEach((k,i)=>el.style.setProperty(k,phase[i]));
   }
  }
  function mode(){main!.classList.toggle("flow-motion",q.matches);if(!q.matches){cache.clear();nodes.forEach(el=>["--flow-pass","--flow-enter","--flow-exit","--flow-travel"].forEach(k=>el.style.removeProperty(k)))}requestMotionFrame()}
  const unsub=subscribeMotion(update),ro=new ResizeObserver(requestMotionFrame);ro.observe(main);
  q.addEventListener("change",mode);mode();
  return()=>{unsub();ro.disconnect();io.disconnect();q.removeEventListener("change",mode);main.classList.remove("flow-motion");nodes.forEach(el=>["--flow-pass","--flow-enter","--flow-exit","--flow-travel"].forEach(k=>el.style.removeProperty(k)))};
 },[path]);
 return null;
}
