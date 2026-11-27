"use client";
import {effectiveTier,initialTier,type EffectiveTier,type Preference,type Tier} from "./motion-quality-policy";
import {sceneNames,type SceneKey,type SceneReading} from "./scene-motion-policy";
type Snapshot={preference:Preference;tier:EffectiveTier;ready:boolean;scenes:Partial<Record<SceneKey,SceneReading>>;activeScene:SceneKey|null};
const initial:Snapshot={preference:"auto",tier:"balanced",ready:false,scenes:{},activeScene:null};
let state=initial,automatic:Tier="balanced",reduced=false;
const listeners=new Set<()=>void>();
export const motionQualityEvent="zm-motion-quality";
export const getMotionQuality=()=>state;
export const getServerMotionQuality=()=>initial;
export const getMotionTier=()=>state.tier;
export const sceneQualityEvent="zm-scene-motion-quality";
export function getSceneTier(key:SceneKey|null):EffectiveTier{return state.preference==="auto"&&state.tier!=="reduced"&&key?state.scenes[key]?.tier??state.tier:state.tier}
export function getNodeMotionTier(node:Element|null):EffectiveTier{const key=node?.closest<HTMLElement>("[data-motion-scene]")?.dataset.motionScene as SceneKey|undefined;return getSceneTier(key??null)}
export function setActiveMotionScene(key:SceneKey|null){if(state.activeScene===key)return;state={...state,activeScene:key};for(const fn of listeners)fn()}
export function setSceneReading(key:SceneKey,reading:SceneReading){const changed=getSceneTier(key)!==reading.tier;state={...state,scenes:{...state.scenes,[key]:reading}};for(const fn of listeners)fn();if(changed)window.dispatchEvent(new CustomEvent(sceneQualityEvent,{detail:key}))}
export function applySceneTiers(root:HTMLElement){root.querySelectorAll<HTMLElement>("[data-motion-scene]").forEach(node=>{const key=node.dataset.motionScene as SceneKey;if(key in sceneNames){const tier=getSceneTier(key);if(node.dataset.sceneTier!==tier)node.dataset.sceneTier=tier}})}
export function subscribeMotionQuality(fn:()=>void){listeners.add(fn);return()=>{listeners.delete(fn)}}
function publish(preference:Preference){
 const tier=effectiveTier(preference,automatic,reduced);
 if(state.ready&&state.preference===preference&&state.tier===tier)return;
 const changed=state.tier!==tier||state.preference!==preference||!state.ready;
 state={...state,preference,tier,ready:true};
 document.documentElement.dataset.motionTier=tier;
 for(const fn of listeners)fn();
 if(changed)window.dispatchEvent(new Event(motionQualityEvent));
}
export function initializeMotionQuality(){
 const nav=navigator as Navigator&{deviceMemory?:number;connection?:{saveData?:boolean}};
 automatic=initialTier(matchMedia("(max-width:899px), (pointer:coarse)").matches,nav.hardwareConcurrency||undefined,nav.deviceMemory,nav.connection?.saveData===true);
 reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 let preference:Preference="auto";
 try{const value=localStorage.getItem("zm-motion-preference");if(value==="auto"||value==="lite"||value==="balanced"||value==="cinematic")preference=value}catch{}
 publish(preference);
}
export function setMotionPreference(preference:Preference){
 try{localStorage.setItem("zm-motion-preference",preference)}catch{}
 publish(preference);
}
export function setAutomaticTier(tier:Tier){automatic=tier;publish(state.preference)}
export function setSystemReduced(value:boolean){reduced=value;publish(state.preference)}
