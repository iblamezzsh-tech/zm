"use client";
import {useEffect,useRef} from "react";
export default function OpeningMarquee(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const node=ref.current;if(!node)return;
  let visible=false;
  const sync=()=>{node.dataset.running=String(visible&&!document.hidden)};
  if(!("IntersectionObserver" in window)){visible=true;sync();return}
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()},{threshold:.01});
  io.observe(node);document.addEventListener("visibilitychange",sync);
  return()=>{io.disconnect();document.removeEventListener("visibilitychange",sync)};
 },[]);
 return <div className="zm-opening-marquee" ref={ref} aria-hidden="true" data-running="false">
  <div className="zm-opening-marquee-track">
   {[0,1].map(i=><span className="zm-opening-marquee-unit" key={i}>STAY CURIOUS. KEEP BECOMING.</span>)}
  </div>
 </div>;
}
