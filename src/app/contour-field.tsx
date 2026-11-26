"use client";
import {useEffect,useRef} from "react";

// The line artwork is a fixed image. Only independent lighting layers animate.
export default function ContourField({paused}:{paused:boolean}){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let visible=false;
  function sync(){el!.dataset.running=String(visible&&!paused&&!reduced.matches&&!document.hidden)}
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync()},{threshold:.01});
  observer.observe(el);
  reduced.addEventListener("change",sync);
  document.addEventListener("visibilitychange",sync);
  sync();
  return()=>{observer.disconnect();reduced.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync)};
 },[paused]);
 return <div ref={root} className="hero-editorial-background" data-running="false" aria-hidden="true">
  <div className="hero-editorial-light"/>
  <div className="hero-editorial-shadow"/>
  {/* Decorative fixed artwork, no pointer listeners or animation transforms. */}
  <img className="hero-editorial-lines" src="/hero-contours-static.svg" alt="" draggable={false}/>
 </div>;
}
