"use client";
import {useLayoutEffect} from "react";
import {frameHealth,nextTier,type Tier} from "./motion-quality-policy";
import {assessScene,initialReading,type SceneKey} from "./scene-motion-policy";
import {getMotionQuality,getSceneTier,initializeMotionQuality,setAutomaticTier,setSystemReduced,setSceneReading,motionQualityEvent} from "./motion-quality-store";

// Observe actual active scroll. The existing editorial clock supplies the
// scene identifier; no second per-frame geometry scan is necessary.
export default function AdaptiveMotion(){
 useLayoutEffect(()=>{
  initializeMotionQuality();
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let raf=0,idle=0,last=0,lastScroll=-Infinity,lastChange=performance.now();
  let lastKey:SceneKey|"route"|null=null;
  const buffers=new Map<SceneKey|"route",number[]>();
  const pending=new Map<SceneKey,Tier>();
  let routePending:Tier|null=null,routePoor=0,routeGood=0;
  const allowed=()=>getMotionQuality().preference==="auto"&&!reduced.matches&&!document.hidden&&!document.querySelector("dialog[open],.zm-route-curtain[data-phase=cover],.zm-route-curtain[data-phase=reveal]");
  function reset(){if(raf)cancelAnimationFrame(raf);if(idle)clearTimeout(idle);raf=idle=last=0;lastKey=null;buffers.clear();pending.clear();routePending=null;routePoor=routeGood=0}
  function commit(){
   idle=0;
   if(!allowed()){pending.clear();routePending=null;return}
   const now=performance.now();
   for(const [key,tier] of pending){
    const current=getMotionQuality().scenes[key];if(!current||current.tier===tier)continue;
    setSceneReading(key,{...current,tier,poor:0,good:0,lastChange:now});
    buffers.delete(key);
   }
   pending.clear();
   if(routePending){const tier=routePending;routePending=null;lastChange=now;routePoor=routeGood=0;setAutomaticTier(tier)}
  }
  function assess(key:SceneKey|"route",samples:number[],now:number){
   if(key==="route"){
    const tier=getMotionQuality().tier;if(tier==="reduced")return;
    const health=frameHealth(samples);
    routePoor=health==="poor"?routePoor+1:0;routeGood=health==="good"?routeGood+1:0;
    if(health==="severe"||routePoor>=2)routePending=nextTier(tier,-1);
    else if(!routePending&&routeGood>=4&&now-lastChange>20000)routePending=nextTier(tier,1);
    return;
   }
   const tier=getSceneTier(key);if(tier==="reduced")return;
   const prior=getMotionQuality().scenes[key]??initialReading(tier,now);
   const result=assessScene(prior,samples,now);
   setSceneReading(key,result.reading);
   // A later good window must never cancel an already queued downgrade.
   if(result.pending&&(!pending.has(key)||result.pending==="lite"||(result.pending==="balanced"&&prior.tier==="cinematic")))pending.set(key,result.pending);
  }
  function frame(now:number){
   raf=0;
   if(!allowed()||now-lastScroll>180){last=0;lastKey=null;return}
   const key=getMotionQuality().activeScene??"route";
   if(last&&lastKey===key){
    const dt=now-last;
    if(dt>=4&&dt<=500){
     const bucket=buffers.get(key)??[];bucket.push(dt);
     if(bucket.length>=48){assess(key,bucket,now);buffers.delete(key)}else buffers.set(key,bucket);
    }
   }
   last=now;lastKey=key;raf=requestAnimationFrame(frame);
  }
  function scroll(){
   if(!allowed())return;
   lastScroll=performance.now();
   if(!raf){last=0;lastKey=null;raf=requestAnimationFrame(frame)}
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
