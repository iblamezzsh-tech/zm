"use client";
import {useLayoutEffect,useRef,type ReactNode} from "react";
import {subscribeMotion,requestMotionFrame} from "./motion-clock";
const clamp=(x:number)=>Math.min(1,Math.max(0,x));
const ease=(a:number,b:number,x:number)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
export default function EditorialFlow({children}:{children:ReactNode}){
 const root=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const el=root.current,main=el?.closest<HTMLElement>("main");
  if(!el||!main){document.dispatchEvent(new CustomEvent("zm-film-ready",{detail:{ok:false}}));return;}
  const scenes=Array.from(el.querySelectorAll<HTMLElement>("[data-ed-scene]"));
  const reveals=Array.from(el.querySelectorAll<HTMLElement>("[data-ed-reveal],[data-ed-line]"));
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let manual=false,enabled=false;
  // Read only stationary wrappers, never the translated artwork itself.
  const active=new Set<HTMLElement>();
  const io=new IntersectionObserver(entries=>{for(const e of entries){const node=e.target as HTMLElement;if(e.isIntersecting)active.add(node);else active.delete(node)}requestMotionFrame()},{rootMargin:"45% 0px"});
  scenes.forEach(s=>io.observe(s));
  function render(){
   const h=window.innerHeight,anchor=Math.min(70,h*.12);
   const bounds=scenes.map(s=>({s,r:s.getBoundingClientRect()}));
   const at=bounds.filter(({r})=>r.top<=anchor&&r.bottom>anchor).at(-1);
   main!.classList.toggle("ed-dark-header",at?.s.dataset.edTheme==="dark");
   main!.classList.toggle("film-at-finale",at?.s.id==="next-chapter");
   if(!enabled)return;
   for(const {s,r} of bounds){
    if(!active.has(s)&&!(r.top<h&&r.bottom>0))continue;
    const pass=clamp((h-r.top)/(h+r.height)),enter=ease(0,.75,clamp((h-r.top)/(h*.8)));
    s.style.setProperty("--ed-pass",pass.toFixed(4));
    s.style.setProperty("--ed-enter",enter.toFixed(4));
    s.style.setProperty("--ed-travel",((pass-.5)*2).toFixed(4));
    if(s.id==="film-present")s.style.setProperty("--ed-hero-exit",ease(.06,.95,clamp(-r.top/Math.max(1,r.height-h))).toFixed(4));
    if(s.classList.contains("ed-manifesto"))s.style.setProperty("--ed-manifesto-pass",clamp((h-r.top)/(r.height+h*.5)).toFixed(4));
   }
   for(const node of reveals){
    // Layout coordinate of the element's static wrapper. The reveal is applied to its children
    // or via clipping, which does not affect geometry.
    const r=node.getBoundingClientRect();
    if(r.bottom<0||r.top>h*1.35)continue;
    const p=ease(0,1,clamp((h*.98-r.top)/Math.min(h*.5,Math.max(h*.22,r.height*.65))));
    node.style.setProperty("--ed-reveal",p.toFixed(4));
   }
  }
  function mode(){enabled=!manual&&!reduced.matches;el!.dataset.edMotion=String(enabled);render();requestMotionFrame()}
  function change(){manual=!manual;mode()}
  const unsub=subscribeMotion(render),ro=new ResizeObserver(requestMotionFrame);ro.observe(el);
  reduced.addEventListener("change",mode);window.addEventListener("zm-film-mode",change);
  document.addEventListener("zm-boot-prepare",render);
  mode();document.dispatchEvent(new CustomEvent("zm-film-ready",{detail:{ok:true}}));
  return()=>{unsub();io.disconnect();ro.disconnect();reduced.removeEventListener("change",mode);window.removeEventListener("zm-film-mode",change);document.removeEventListener("zm-boot-prepare",render);main.classList.remove("ed-dark-header","film-at-finale");delete el.dataset.edMotion};
 },[]);
 return <div ref={root} className="editorial-flow" id="main-content" tabIndex={-1}>{children}</div>
}
