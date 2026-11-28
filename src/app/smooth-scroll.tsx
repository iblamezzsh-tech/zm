"use client";
import {useEffect,useLayoutEffect} from "react";
import Lenis from "lenis";
import {usePathname} from "next/navigation";
import {requestMotionFrame,setScrollEngine,resetScrollMomentum} from "./motion-clock";
import "lenis/dist/lenis.css";
import {getMotionTier,motionQualityEvent} from "./motion-quality-store";
export default function SmoothScroll(){
 const pathname=usePathname();
 useLayoutEffect(()=>{
  const query=matchMedia("(min-width: 760px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  let instance:Lenis|null=null;
  function sync(){
   if(instance){instance.destroy();instance=null;setScrollEngine(null)}
   if(pathname==="/"||!query.matches||getMotionTier()==="lite"||getMotionTier()==="reduced")return;
   instance=new Lenis({autoRaf:true,smoothWheel:true,syncTouch:false,lerp:.105,wheelMultiplier:1,anchors:false,prevent:node=>!!node.closest("dialog, [data-lenis-prevent]")});
   setScrollEngine(instance);instance.on("scroll",requestMotionFrame);
  }
  function click(e:MouseEvent){
   if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||!(e.target instanceof Element))return;
   const link=e.target.closest<HTMLAnchorElement>("a[href]");if(!link||link.target||link.hasAttribute("download"))return;
   const u=new URL(link.href,location.href);
   if(u.origin!==location.origin||u.pathname!==location.pathname||u.search!==location.search||!u.hash||!instance)return;
   let hash:string;try{hash=decodeURIComponent(u.hash.slice(1))}catch{return}const target=document.getElementById(hash);if(!target)return;
   if(link.closest(".exhibition-cinematic"))return;
   e.preventDefault();history.pushState(null,"",u.hash);
   instance.scrollTo(target,{offset:link.classList.contains("skip-link")?0:-82});if(link.classList.contains("skip-link"))target.focus({preventScroll:true});
  }
  sync();document.dispatchEvent(new Event("zm-scroll-ready"));query.addEventListener("change",sync);window.addEventListener(motionQualityEvent,sync);document.addEventListener("click",click);
  return()=>{query.removeEventListener("change",sync);window.removeEventListener(motionQualityEvent,sync);document.removeEventListener("click",click);instance?.destroy();setScrollEngine(null)};
 },[pathname]);
 useEffect(()=>{resetScrollMomentum();requestMotionFrame()},[pathname]);
 return null;
}
