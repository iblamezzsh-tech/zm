"use client";

import { useEffect,useLayoutEffect,useRef } from "react";
import { usePathname,useRouter } from "next/navigation";
import {resetScrollMomentum,requestMotionFrame} from "./motion-clock";
import Signature from "./signature";

let heroHasPlayed = false;

export function HeroSignature() {
  const accent = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (heroHasPlayed || !accent.current) return;
    heroHasPlayed = true;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      accent.current.classList.add("writing");
  }, []);
  return (
    <div ref={accent} className="hero-signature">
      <Signature />
    </div>
  );
}

export function RouteSignature(){
 const path=usePathname(),router=useRouter();
 const curtain=useRef<HTMLDivElement>(null),pending=useRef<string|null>(null);
 const coverTimer=useRef<ReturnType<typeof setTimeout>|null>(null),failTimer=useRef<ReturnType<typeof setTimeout>|null>(null),releaseTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const previous=useRef(path);
 const names:Record<string,string>={"/":"The Present","/about":"My Story","/projects":"Projects","/achievements":"Milestones","/off-the-record":"Off the Record","/contact":"Let’s Connect","/projects/overthink":"OverThink","/projects/finance4youth":"Finance4Youth","/projects/rezamin":"ReZamin"};
 function clear(){if(coverTimer.current)clearTimeout(coverTimer.current);if(failTimer.current)clearTimeout(failTimer.current);if(releaseTimer.current)clearTimeout(releaseTimer.current);coverTimer.current=failTimer.current=releaseTimer.current=null}
 function reveal(){
  clear();pending.current=null;
  const el=curtain.current;if(!el)return;
  el.dataset.phase="reveal";
  releaseTimer.current=setTimeout(()=>{el.dataset.phase="idle";releaseTimer.current=null},520);
 }
 useEffect(()=>{
  function onClick(e:MouseEvent){
   if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||matchMedia("(prefers-reduced-motion: reduce)").matches||!(e.target instanceof Element))return;
   const a=e.target.closest<HTMLAnchorElement>("a[href]");
   if(!a||a.target||a.hasAttribute("download")||a.hasAttribute("data-no-transition"))return;
   const url=new URL(a.href,location.href);
   if(url.origin!==location.origin||url.pathname===location.pathname||!["http:","https:"].includes(url.protocol))return;
   if(!curtain.current||!names[url.pathname])return;
   e.preventDefault();if(pending.current)return;
   const href=url.pathname+url.search+url.hash;
   clear();pending.current=href;resetScrollMomentum();
   router.prefetch(href);
   curtain.current.dataset.phase="cover";
   const label=curtain.current.querySelector<HTMLElement>("[data-destination]");if(label)label.textContent=names[url.pathname];
   coverTimer.current=setTimeout(()=>{router.push(href);coverTimer.current=null},360);
   failTimer.current=setTimeout(reveal,3500);
  }
  // Capture before Next's link handler, without intercepting same-page anchors.
  document.addEventListener("click",onClick,true);
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  function cancelMotion(){if(!reduced.matches)return;const href=pending.current;clear();pending.current=null;if(curtain.current)curtain.current.dataset.phase="idle";if(href)router.push(href)}
  reduced.addEventListener("change",cancelMotion);
  return()=>{document.removeEventListener("click",onClick,true);reduced.removeEventListener("change",cancelMotion);clear()};
 },[router]);
 useLayoutEffect(()=>{
  if(previous.current===path)return;
  previous.current=path;
  resetScrollMomentum();requestMotionFrame();
  if(pending.current)reveal();
 },[path]);
 return <div className="zm-route-curtain" ref={curtain} data-phase="idle" aria-hidden="true"><div className="zm-route-curtain-inner"><span>ZM / THE JOURNEY CONTINUES</span><Signature/><span className="route-destination" data-destination>NOW &amp; NEXT</span></div></div>;
}
