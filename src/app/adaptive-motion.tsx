"use client";
import {useLayoutEffect} from "react";
import {frameHealth,nextTier} from "./motion-quality-policy";
import {getMotionQuality,initializeMotionQuality,setAutomaticTier,setSystemReduced,motionQualityEvent} from "./motion-quality-store";

export default function AdaptiveMotion(){
 useLayoutEffect(()=>{
  initializeMotionQuality();
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let raf=0,idle=0,last=0,lastScroll=-Infinity,lastChange=performance.now(),poor=0,good=0;
  let samples:number[]=[];
  let pending:-1|1|0=0;
  const allowed=()=>getMotionQuality().preference==="auto"&&!reduced.matches&&!document.hidden&&!document.querySelector("dialog[open],.zm-route-curtain[data-phase=cover],.zm-route-curtain[data-phase=reveal]");
  function reset(){if(raf)cancelAnimationFrame(raf);if(idle)clearTimeout(idle);raf=idle=last=0;samples=[];poor=good=0;pending=0}
  function commit(){
   idle=0;
   if(!allowed()||!pending)return;
   // Never alter the active visual effect mid-swipe. Layout geometry
   // is identical across quality tiers.
   const state=getMotionQuality();if(state.tier==="reduced")return;
   const next=nextTier(state.tier,pending);
   pending=0;poor=good=0;
   if(next!==state.tier){lastChange=performance.now();setAutomaticTier(next)}
  }
  function frame(now:number){
   raf=0;
   if(!allowed()||now-lastScroll>180){last=0;return}
   if(last){
    const dt=now-last;
    // Exclude gaps from stopping/starting a trace; retain actual slow frames.
    if(dt>=4&&dt<=500)samples.push(dt);
    if(samples.length>=48){
     const health=frameHealth(samples);samples=[];
     if(health==="severe"){pending=-1;good=0;poor=0}
     else if(health==="poor"){poor++;good=0;if(poor>=2)pending=-1}
     else if(health==="good"){good++;poor=0;if(good>=4&&!pending&&now-lastChange>15000)pending=1}
     else{poor=good=0}
    }
   }
   last=now;
   raf=requestAnimationFrame(frame);
  }
  function scroll(){
   if(!allowed())return;
   lastScroll=performance.now();
   if(!raf){last=0;raf=requestAnimationFrame(frame)}
   if(idle)clearTimeout(idle);
   idle=window.setTimeout(commit,260);
  }
  function preferenceChanged(){reset();lastChange=performance.now()}
  function systemChanged(){reset();setSystemReduced(reduced.matches)}
  function visibility(){reset()}
  window.addEventListener("scroll",scroll,{passive:true});
  window.addEventListener(motionQualityEvent,preferenceChanged);
  reduced.addEventListener("change",systemChanged);
  document.addEventListener("visibilitychange",visibility);
  return()=>{reset();window.removeEventListener("scroll",scroll);window.removeEventListener(motionQualityEvent,preferenceChanged);reduced.removeEventListener("change",systemChanged);document.removeEventListener("visibilitychange",visibility)}
 },[]);
 return null;
}
