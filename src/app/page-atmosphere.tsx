"use client";
import {useEffect,useRef} from "react";
export type AtmosphereKind="story"|"archive"|"gallery"|"think"|"finance"|"earth"|"notebook"|"post";
export default function PageAtmosphere({kind,dark=false}:{kind:AtmosphereKind;dark?:boolean}){
 const ref=useRef<HTMLSpanElement>(null);
 useEffect(()=>{
  const node=ref.current;if(!node)return;
  let visible=false;
  const update=()=>{node.dataset.running=String(visible&&!document.hidden)};
  if(!("IntersectionObserver" in window))return;
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update()},{rootMargin:"80px 0px"});
  observer.observe(node);document.addEventListener("visibilitychange",update);
  return()=>{observer.disconnect();document.removeEventListener("visibilitychange",update)};
 },[]);
 return <span ref={ref} aria-hidden="true" className={"zm-atmosphere atm-"+kind+(dark?" atm-dark":"")}><span className="atm-light"/><span className="atm-primary"/><span className="atm-secondary"/></span>;
}
