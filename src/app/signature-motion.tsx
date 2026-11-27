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

// Timings shared with motion-polish.css: 600ms cover, 350ms minimum hold after cover, 700ms exit.
const COVER_MS=600, MINIMUM_MS=950, REVEAL_MS=700, FAILSAFE_MS=6500;
export function RouteSignature(){
 const path=usePathname(),router=useRouter();
 const curtain=useRef<HTMLDivElement>(null),pending=useRef<string|null>(null);
 const coverTimer=useRef<ReturnType<typeof setTimeout>|null>(null),failTimer=useRef<ReturnType<typeof setTimeout>|null>(null),releaseTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const previous=useRef(path);
 const pushed=useRef(false);
 const timing=useRef({cover:COVER_MS,minimum:MINIMUM_MS,reveal:REVEAL_MS});
 const match=useRef<{clone:HTMLElement;animation:Animation|null;destination:HTMLElement|null;stage:HTMLDivElement}|null>(null);
 function clearMatch(){
  const m=match.current;if(!m)return;
  m.animation?.cancel();if(m.destination)m.destination.style.removeProperty("opacity");
  m.stage.replaceChildren();match.current=null;
 }
 function artFrame(rect:{left:number;top:number;width:number;height:number}){
  return {left:rect.left+"px",top:rect.top+"px",width:rect.width+"px",height:rect.height+"px"};
 }
 function startMatch(a:HTMLAnchorElement){
  const art=a.querySelector<HTMLElement>(".studio54-edition")??a.closest(".ed-work-item,.exhibit-scene")?.querySelector<HTMLElement>(".studio54-edition");
  const stage=curtain.current?.querySelector<HTMLDivElement>(".route-match-art");
  if(!art||!stage||typeof art.animate!=="function")return false;
  const r=art.getBoundingClientRect();if(r.width<100||r.height<70||r.top>=innerHeight*.9||r.bottom<=innerHeight*.1)return false;
  const clone=art.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[id]").forEach(n=>n.removeAttribute("id"));
  clone.setAttribute("aria-hidden","true");clone.classList.add("route-flight");
  const w=Math.min(innerWidth*.83,innerHeight*.79*r.width/r.height),h=w*r.height/r.width;
  const target={left:(innerWidth-w)/2,top:(innerHeight-h)/2,width:w,height:h};
  Object.assign(clone.style,artFrame(r));stage.replaceChildren(clone);
  const animation=clone.animate([artFrame(r),artFrame(target)],{duration:timing.current.cover,easing:"cubic-bezier(.76,0,.24,1)",fill:"forwards"});
  match.current={clone,animation,destination:null,stage};return true;
 }
 function landMatch(){
  const m=match.current;if(!m)return;
  const target=document.querySelector<HTMLElement>("main.case-page .case-feature-art .studio54-edition");
  const from=m.clone.getBoundingClientRect(),to=target?.getBoundingClientRect();
  if(!target||!to||to.width<100||to.height<70||to.top>=innerHeight||!["think","finance","earth"].some(k=>target.classList.contains("edition-"+k)&&m.clone.classList.contains("edition-"+k))){m.animation?.cancel();Object.assign(m.clone.style,artFrame(from));return;}
  m.destination=target;target.style.opacity="0";m.animation?.cancel();
  Object.assign(m.clone.style,artFrame(from));
  m.animation=m.clone.animate([artFrame(from),artFrame(to)],{duration:timing.current.reveal,easing:"cubic-bezier(.22,1,.36,1)",fill:"forwards"});
 }

 const started=useRef(0);
 const holdTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const names:Record<string,string>={"/":"The Present","/about":"My Story","/projects":"Projects","/achievements":"Milestones","/off-the-record":"Off the Record","/contact":"Let’s Connect","/projects/overthink":"OverThink","/projects/finance4youth":"Finance4Youth","/projects/rezamin":"ReZamin"};
 function clear(){if(holdTimer.current)clearTimeout(holdTimer.current);holdTimer.current=null;if(coverTimer.current)clearTimeout(coverTimer.current);if(failTimer.current)clearTimeout(failTimer.current);if(releaseTimer.current)clearTimeout(releaseTimer.current);coverTimer.current=failTimer.current=releaseTimer.current=null}
 function reveal(){
  clear();pending.current=null;
  const el=curtain.current;if(!el)return;
  if(el.dataset.edit==="match")landMatch();
  el.dataset.phase="reveal";
  releaseTimer.current=setTimeout(()=>{el.dataset.phase="idle";clearMatch();releaseTimer.current=null},timing.current.reveal);
 }
 useEffect(()=>{
  function onClick(e:MouseEvent){
   if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||matchMedia("(prefers-reduced-motion: reduce)").matches||!(e.target instanceof Element))return;
   const a=e.target.closest<HTMLAnchorElement>("a[href]");
   if(!a||a.target||a.hasAttribute("download")||a.hasAttribute("data-no-transition"))return;
   // Mobile record links belong to the native certificate viewer.
   if(matchMedia("(max-width:899px)").matches&&a.hasAttribute("data-mobile-record"))return;
   const url=new URL(a.href,location.href);
   if(url.origin!==location.origin||url.pathname===location.pathname||!["http:","https:"].includes(url.protocol))return;
   if(!curtain.current||!names[url.pathname])return;
   e.preventDefault();if(pending.current||curtain.current.dataset.phase!=="idle")return;
   const href=url.pathname+url.search+url.hash;
   clear();clearMatch();pending.current=href;pushed.current=false;started.current=performance.now();resetScrollMomentum();
   const phone=matchMedia("(max-width:899px)").matches;
   timing.current=phone?{cover:420,minimum:540,reveal:520}:{cover:COVER_MS,minimum:MINIMUM_MS,reveal:REVEAL_MS};
   curtain.current.style.setProperty("--zm-route-cover",timing.current.cover+"ms");
   curtain.current.style.setProperty("--zm-route-reveal",timing.current.reveal+"ms");
   router.prefetch(href);
   const dest=url.pathname;
   curtain.current.dataset.edit=dest==="/about"?"paper":dest==="/achievements"?"archive":dest==="/off-the-record"?"notebook":dest==="/projects/overthink"?"think":dest==="/projects/finance4youth"?"finance":dest==="/projects/rezamin"?"earth":dest==="/projects"?"project":dest==="/contact"?"letter":"signature";
   if(dest.startsWith("/projects/")&&startMatch(a))curtain.current.dataset.edit="match";
   curtain.current.dataset.phase="cover";
   const label=curtain.current.querySelector<HTMLElement>("[data-destination]");if(label)label.textContent=names[url.pathname];
   coverTimer.current=setTimeout(()=>{pushed.current=true;router.push(href);coverTimer.current=null},timing.current.cover);
   failTimer.current=setTimeout(reveal,FAILSAFE_MS);
  }
  // Capture before Next's link handler, without intercepting same-page anchors.
  document.addEventListener("click",onClick,true);
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  function abortEdit(){clear();pending.current=null;if(curtain.current)curtain.current.dataset.phase="idle";clearMatch();resetScrollMomentum();}
  function cancelMotion(){if(!reduced.matches)return;const href=pending.current,alreadyPushed=pushed.current;abortEdit();if(href&&!alreadyPushed)router.push(href)}
  function onHistory(){abortEdit()}
  window.addEventListener("popstate",onHistory);
  reduced.addEventListener("change",cancelMotion);
  return()=>{document.removeEventListener("click",onClick,true);window.removeEventListener("popstate",onHistory);reduced.removeEventListener("change",cancelMotion);clear();clearMatch()};
 },[router]);
 useLayoutEffect(()=>{
  if(previous.current===path)return;
  previous.current=path;
  resetScrollMomentum();requestMotionFrame();
  if(pending.current){
   const remaining=Math.max(0,timing.current.minimum-(performance.now()-started.current));
   if(holdTimer.current)clearTimeout(holdTimer.current);
   holdTimer.current=setTimeout(reveal,remaining);
  }
 },[path]);
 return <div className="zm-route-curtain" ref={curtain} data-phase="idle" aria-hidden="true"><div className="zm-route-curtain-inner"><span>ZM / THE JOURNEY CONTINUES</span><Signature/><div className="route-motif" aria-hidden="true"><i/><i/><i/></div><span className="route-destination" data-destination>NOW &amp; NEXT</span></div><div className="route-match-art" aria-hidden="true"/></div>;
}
