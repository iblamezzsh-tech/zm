"use client";
import {useSyncExternalStore} from "react";
import {getMotionQuality,getServerMotionQuality,subscribeMotionQuality,setMotionPreference,resetMotionProfile} from "./motion-quality-store";
import type {Preference} from "./motion-quality-policy";
import {sceneNames,type SceneKey} from "./scene-motion-policy";
const choices:{value:Preference;label:string}[]=[{value:"auto",label:"Auto"},{value:"cinematic",label:"Cinematic"},{value:"balanced",label:"Balanced"},{value:"lite",label:"Lite"}];
const labels={cinematic:"Cinematic",balanced:"Balanced",lite:"Lite",reduced:"Reduced motion"};
export default function MotionQualityControl(){
 const state=useSyncExternalStore(subscribeMotionQuality,getMotionQuality,getServerMotionQuality);
 return <section className="zm-motion-settings" aria-label="Motion quality">
  <div className="zm-motion-settings-head"><span>SELECTED / {choices.find(c=>c.value===state.preference)?.label}</span><strong aria-live="polite">Effective: {state.ready?labels[state.preference==="auto"&&state.tier!=="reduced"&&state.activeScene?(state.scenes[state.activeScene]?.tier??state.tier):state.tier]:"Auto"}</strong></div>
  <div className="zm-motion-settings-choices" role="group" aria-label="Choose motion quality">{choices.map(c=><button key={c.value} type="button" aria-pressed={state.preference===c.value} onClick={()=>setMotionPreference(c.value)}>{c.label}</button>)}</div>
  <p>{state.tier==="reduced"?"Your system’s reduced motion preference takes priority.":state.preference==="auto"?"Auto adapts each homepage chapter independently.":"Your selected motion quality is saved on this device."}</p>
  <details className="zm-scene-diagnostics"><summary>Scene performance / details</summary><div className="zm-scene-diagnostics-list">{(Object.keys(sceneNames) as SceneKey[]).map(key=>{const reading=state.scenes[key];const tier=state.preference==="auto"&&state.tier!=="reduced"?(reading?.tier??state.tier):state.tier;return <div className="zm-scene-diagnostics-row" key={key}><span>{sceneNames[key]}</span><strong>{labels[tier]}</strong><span>{reading&&reading.frames>0?reading.p90+" ms / "+reading.frames+" frames":"Not sampled"}</span></div>})}</div><p>Effective quality by chapter. p90 is the 90th-percentile frame interval, not FPS. Auto quality is learned on this device for up to 7 days.</p><button className="zm-motion-reset" type="button" onClick={resetMotionProfile}>Reset learned quality</button></details>
 </section>
}
