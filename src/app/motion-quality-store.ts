"use client";
import {effectiveTier,initialTier,type EffectiveTier,type Preference,type Tier} from "./motion-quality-policy";
import {sceneNames,initialReading,parseProfile,type SceneKey,type SceneReading} from "./scene-motion-policy";
type Snapshot={preference:Preference;tier:EffectiveTier;ready:boolean;desktopLocked:boolean;scenes:Partial<Record<SceneKey,SceneReading>>;activeScene:SceneKey|null};
const initial:Snapshot={preference:"auto",tier:"balanced",ready:false,desktopLocked:false,scenes:{},activeScene:null};
export const desktopMotionQuery="(min-width:900px)";
let state=initial,automatic:Tier="balanced",reduced=false,desktopLocked=false;
let selectedPreference:Preference="auto";
const listeners=new Set<()=>void>();
const profileKey="zm-scene-profile-v109";
let learned:Partial<Record<SceneKey,Tier>>={};
export const profileResetEvent="zm-motion-profile-reset";
export const motionQualityEvent="zm-motion-quality";
export const getMotionQuality=()=>state;
export const getServerMotionQuality=()=>initial;
export const getMotionTier=()=>state.tier;
export const sceneQualityEvent="zm-scene-motion-quality";
export function getSceneTier(key:SceneKey|null):EffectiveTier{return state.preference==="auto"&&state.tier!=="reduced"&&key?state.scenes[key]?.tier??state.tier:state.tier}
export function getNodeMotionTier(node:Element|null|undefined):EffectiveTier{const key=node?.closest<HTMLElement>("[data-motion-scene]")?.dataset.motionScene as SceneKey|undefined;return getSceneTier(key??null)}
export function setActiveMotionScene(key:SceneKey|null){if(state.activeScene===key)return;state={...state,activeScene:key};for(const fn of listeners)fn()}
export function setSceneReading(key:SceneKey,reading:SceneReading){if(desktopLocked)return;const changed=getSceneTier(key)!==reading.tier;state={...state,scenes:{...state.scenes,[key]:reading}};for(const fn of listeners)fn();if(changed){learned[key]=reading.tier;try{localStorage.setItem(profileKey,JSON.stringify({version:1,savedAt:Date.now(),scenes:learned}))}catch{}window.dispatchEvent(new CustomEvent(sceneQualityEvent,{detail:key}))}}
export function applySceneTiers(root:HTMLElement){root.querySelectorAll<HTMLElement>("[data-motion-scene]").forEach(node=>{const key=node.dataset.motionScene as SceneKey;if(key in sceneNames){const tier=getSceneTier(key);if(node.dataset.sceneTier!==tier)node.dataset.sceneTier=tier}})}
export function subscribeMotionQuality(fn:()=>void){listeners.add(fn);return()=>{listeners.delete(fn)}}
function publish(){
 // Lock the desktop to Cinematic without overwriting the saved mobile choice.
 // Explicit system reduced-motion preferences still take precedence.
 const preference:Preference=desktopLocked?"cinematic":selectedPreference;
 const tier=effectiveTier(preference,automatic,reduced);
 if(state.ready&&state.preference===preference&&state.tier===tier&&state.desktopLocked===desktopLocked)return;
 state={...state,preference,tier,desktopLocked,ready:true};
 document.documentElement.dataset.motionTier=tier;
 for(const fn of listeners)fn();
 window.dispatchEvent(new Event(motionQualityEvent));
}
function viewportAutomaticTier(){
 const nav=navigator as Navigator&{deviceMemory?:number;connection?:{saveData?:boolean}};
 return initialTier(matchMedia("(max-width:899px), (pointer:coarse)").matches,nav.hardwareConcurrency||undefined,nav.deviceMemory,nav.connection?.saveData===true);
}
export function initializeMotionQuality(){
 desktopLocked=matchMedia(desktopMotionQuery).matches;
 automatic=viewportAutomaticTier();
 reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 selectedPreference="auto";
 try{const value=localStorage.getItem("zm-motion-preference");if(value==="auto"||value==="lite"||value==="balanced"||value==="cinematic")selectedPreference=value}catch{}
 try{learned=parseProfile(localStorage.getItem(profileKey),Date.now())}catch{learned={}}
 const scenes:Partial<Record<SceneKey,SceneReading>>={};for(const key of Object.keys(learned) as SceneKey[]){const tier=learned[key];if(tier)scenes[key]=initialReading(tier,performance.now())}
 state={...state,scenes};
 publish();
}
export function syncMotionViewport(){
 const next=matchMedia(desktopMotionQuery).matches;
 if(next===desktopLocked)return;
 desktopLocked=next;
 if(!desktopLocked)automatic=viewportAutomaticTier();
 publish();
}
export function resetMotionProfile(){
 learned={};try{localStorage.removeItem(profileKey)}catch{}
 state={...state,scenes:{}};for(const fn of listeners)fn();window.dispatchEvent(new Event(profileResetEvent));window.dispatchEvent(new CustomEvent(sceneQualityEvent,{detail:null}));
}
export function setMotionPreference(preference:Preference){
 if(desktopLocked)return;
 selectedPreference=preference;
 try{localStorage.setItem("zm-motion-preference",preference)}catch{}
 publish();
}
export function setAutomaticTier(tier:Tier){if(desktopLocked)return;automatic=tier;publish()}
export function setSystemReduced(value:boolean){reduced=value;publish()}
