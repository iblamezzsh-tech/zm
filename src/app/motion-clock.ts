"use client";
import type Lenis from "lenis";
import {scrollImpulseTarget,dampImpulse} from "./motion-impulse";
type Listener=()=>void;
const listeners=new Set<Listener>();
let raf=0,engine:Lenis|null=null,dirty=false;
let lastY=0,lastTime=0,impulse=0;
function resetImpulse(){
 lastY=window.scrollY;lastTime=0;impulse=0;
 document.documentElement.style.removeProperty("--zm-impulse");
 document.documentElement.style.removeProperty("--zm-speed");
}
function flush(now:number){
 raf=0;
 const work=dirty;dirty=false;
 const y=window.scrollY,dt=lastTime?now-lastTime:16.7;
 const motion=innerWidth<=899&&!document.hidden&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!document.querySelector("dialog[open]")&&document.querySelector(".zm-route-curtain")?.getAttribute("data-phase")!=="cover";
 const target=motion&&lastTime?scrollImpulseTarget(y-lastY,dt,innerHeight):0;
 impulse=motion?dampImpulse(impulse,target,dt):0;lastY=y;lastTime=now;
 const root=document.documentElement;
 const set=(key:string,v:number)=>{const next=v.toFixed(4);if(root.style.getPropertyValue(key)!==next)root.style.setProperty(key,next)};
 set("--zm-impulse",impulse);set("--zm-speed",Math.abs(impulse));
 // Tail frames update two CSS values only, never rescan the page geometry.
 if(work)for(const fn of listeners)fn();
 if((dirty||impulse!==0)&&!raf&&listeners.size)raf=requestAnimationFrame(flush);
}
export function requestMotionFrame(){dirty=true;if(!raf)raf=requestAnimationFrame(flush)}
export function subscribeMotion(fn:Listener){
 if(!listeners.size){resetImpulse();window.addEventListener("scroll",requestMotionFrame,{passive:true});window.addEventListener("resize",requestMotionFrame,{passive:true})}
 listeners.add(fn);requestMotionFrame();
 return()=>{listeners.delete(fn);if(!listeners.size){window.removeEventListener("scroll",requestMotionFrame);window.removeEventListener("resize",requestMotionFrame);if(raf)cancelAnimationFrame(raf);raf=0;dirty=false;resetImpulse()}};
}
export function setScrollEngine(value:Lenis|null){engine=value}
export function scrollToFilm(top:number,instant=false){
 if(engine&&!document.querySelector("dialog[open]"))engine.scrollTo(top,{immediate:instant,force:true});
 else window.scrollTo({top,behavior:instant||matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
}
export function resetScrollMomentum(){resetImpulse();if(engine)engine.scrollTo(window.scrollY,{immediate:true,force:true})}
