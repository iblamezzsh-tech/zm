"use client";
import type Lenis from "lenis";
type Listener=()=>void;
const listeners=new Set<Listener>();
let raf=0,engine:Lenis|null=null;
function flush(){raf=0;for(const fn of listeners)fn()}
export function requestMotionFrame(){if(!raf)raf=requestAnimationFrame(flush)}
export function subscribeMotion(fn:Listener){
 if(!listeners.size){window.addEventListener("scroll",requestMotionFrame,{passive:true});window.addEventListener("resize",requestMotionFrame,{passive:true})}
 listeners.add(fn);requestMotionFrame();
 return()=>{listeners.delete(fn);if(!listeners.size){window.removeEventListener("scroll",requestMotionFrame);window.removeEventListener("resize",requestMotionFrame);if(raf)cancelAnimationFrame(raf);raf=0}};
}
export function setScrollEngine(value:Lenis|null){engine=value}
export function scrollToFilm(top:number,instant=false){
 if(engine&&!document.querySelector("dialog[open]"))engine.scrollTo(top,{immediate:instant,force:true});
 else window.scrollTo({top,behavior:instant||matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
}
export function resetScrollMomentum(){if(engine)engine.scrollTo(window.scrollY,{immediate:true,force:true})}
