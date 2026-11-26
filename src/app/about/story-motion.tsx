"use client";
import {useEffect} from "react";
export default function StoryMotion(){
 useEffect(()=>{
   if(!("IntersectionObserver" in window)||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
   const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add("story-entered");observer.unobserve(entry.target)}}},{threshold:.14});
   document.querySelectorAll(".story-page [data-story-motion]").forEach(el=>observer.observe(el));
   return ()=>observer.disconnect();
 },[]);
 return null;
}
