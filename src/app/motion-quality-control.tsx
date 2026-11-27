"use client";
import {useSyncExternalStore} from "react";
import {getMotionQuality,getServerMotionQuality,subscribeMotionQuality,setMotionPreference} from "./motion-quality-store";
import type {Preference} from "./motion-quality-policy";
const choices:{value:Preference;label:string}[]=[{value:"auto",label:"Auto"},{value:"cinematic",label:"Cinematic"},{value:"balanced",label:"Balanced"},{value:"lite",label:"Lite"}];
const labels={cinematic:"Cinematic",balanced:"Balanced",lite:"Lite",reduced:"Reduced motion"};
export default function MotionQualityControl(){
 const state=useSyncExternalStore(subscribeMotionQuality,getMotionQuality,getServerMotionQuality);
 return <section className="zm-motion-settings" aria-label="Motion quality">
  <div className="zm-motion-settings-head"><span>MOTION / QUALITY</span><strong aria-live="polite">{state.ready?labels[state.tier]:"Auto"}</strong></div>
  <div className="zm-motion-settings-choices" role="group" aria-label="Choose motion quality">{choices.map(c=><button key={c.value} type="button" aria-pressed={state.preference===c.value} onClick={()=>setMotionPreference(c.value)}>{c.label}</button>)}</div>
  <p>{state.tier==="reduced"?"Your system’s reduced motion preference takes priority.":state.preference==="auto"?"Automatically adapts to rendering performance.":"Your selected motion quality is saved on this device."}</p>
 </section>
}
