"use client";
import {useEffect,useRef} from "react";
import {usePathname} from "next/navigation";
import {requestMotionFrame,resetScrollMomentum,scrollToFilm} from "./motion-clock";
import {desiredCardOffset,parseReturnMarker,type ReturnMarker} from "./record-return-policy.mjs";
const KEY="zmRecordReturnV112";
// The marker belongs to the outgoing Home HISTORY ENTRY, not a global last
// visited card. A new Home navigation must not restore an unrelated visit.
export default function ReturnToRecord(){
 const path=usePathname();
 const pending=useRef<ReturnMarker|null>(null);
 const restore=useRef<(()=>void)|null>(null);
 useEffect(()=>{
  function remember(event:MouseEvent){
   if(location.pathname!=="/"||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!(event.target instanceof Element))return;
   const link=event.target.closest<HTMLAnchorElement>("a[data-return-record]");
   if(!link||link.target||link.hasAttribute("download"))return;
   const id=link.dataset.returnRecord;
   if(!id||!/^[-a-z0-9]+$/.test(id))return;
   const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname!=="/achievements"||url.hash!=="#record-"+id)return;
   const box=link.getBoundingClientRect();
   const marker:ReturnMarker={id,y:scrollY,top:box.top,width:innerWidth,height:innerHeight};
   history.replaceState({...history.state,[KEY]:marker},"",location.href);
  }
  function onBack(){
   pending.current=location.pathname==="/"?parseReturnMarker(history.state?.[KEY]):null;
   if(pending.current)restore.current?.();
  }
  function onShow(e:PageTransitionEvent){if(e.persisted)onBack()}
  document.addEventListener("click",remember,true);
  window.addEventListener("popstate",onBack);window.addEventListener("pageshow",onShow);
  // Browser Back may create a new document after the archive was reloaded.
  const nav=performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming|undefined;
  if(location.pathname==="/"&&nav?.type==="back_forward")onBack();
  return()=>{document.removeEventListener("click",remember,true);window.removeEventListener("popstate",onBack);window.removeEventListener("pageshow",onShow)};
 },[]);
 useEffect(()=>{
  if(path!=="/")return;
  let raf=0,started=0,stable=0,last=-Infinity,active=false,focused=false;
  const stop=()=>{active=false;cancelAnimationFrame(raf);pending.current=null;window.removeEventListener("wheel",stop);window.removeEventListener("touchstart",stop);window.removeEventListener("pointerdown",stop);window.removeEventListener("keydown",stop)};
  function step(now:number){
   if(!active||!pending.current)return;
   const marker=pending.current;
   const card=document.querySelector<HTMLElement>(`[data-return-record="${CSS.escape(marker.id)}"]`);
   const flow=document.querySelector<HTMLElement>(".editorial-flow");
   if(now-started>2500){stop();return}
   if(!card||!flow?.hasAttribute("data-ed-motion")){raf=requestAnimationFrame(step);return}
   const r=card.getBoundingClientRect();
   const header=document.querySelector<HTMLElement>("main.home-page>.site-header");
   const safe=Math.max(12,header?.getBoundingClientRect().bottom??0)+8;
   const offset=desiredCardOffset(marker.top,r.height,innerHeight,safe);
   const target=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,scrollY+r.top-offset));
   if(Math.abs(target-scrollY)>2){resetScrollMomentum();scrollToFilm(target,true);requestMotionFrame();stable=0}
   else if(Math.abs(last-target)<=2)stable++;else stable=0;
   last=target;
   if(!focused){card.focus({preventScroll:true});focused=true}
   // Wait through Next/browser restoration, font layout and editorial rail
   // measurement, then stop touching the scroll position entirely.
   if(stable>=8&&now-started>=650){stop();return}
   raf=requestAnimationFrame(step);
  }
  function begin(){
   if(!pending.current||active)return;
   active=true;started=performance.now();stable=0;last=-Infinity;focused=false;
   for(const name of ["wheel","touchstart","pointerdown","keydown"] as const)window.addEventListener(name,stop,{passive:true,once:true});
   raf=requestAnimationFrame(step);
  }
  restore.current=begin;begin();
  return()=>{restore.current=null;stop()};
 },[path]);
 return null;
}
