// Pure policy, independent of the browser. Thresholds are conservative
// 60 Hz frame-budget heuristics, not a device model or a GPU benchmark.
export type Tier="lite"|"balanced"|"cinematic";
export type Preference="auto"|Tier;
export type EffectiveTier=Tier|"reduced";
export const tiers:Tier[]=["lite","balanced","cinematic"];
export function initialTier(phone:boolean,cores?:number,memory?:number,saveData=false):Tier{
 if(saveData||(memory!==undefined&&memory<=2)||(cores!==undefined&&cores<=2))return "lite";
 if(phone||(memory!==undefined&&memory<=4)||(cores!==undefined&&cores<=4))return "balanced";
 return "cinematic";
}
export function frameHealth(samples:number[]){
 if(samples.length<32)return "insufficient" as const;
 const sorted=samples.slice().sort((a,b)=>a-b);
 const p90=sorted[Math.ceil(sorted.length*.9)-1];
 const late=samples.filter(v=>v>25).length/samples.length;
 if(p90>55||late>=.65)return "severe" as const;
 if(p90>34||late>=.30)return "poor" as const;
 if(p90<=22&&late<=.08)return "good" as const;
 return "mixed" as const;
}
export function nextTier(tier:Tier,direction:-1|1):Tier{
 return tiers[Math.max(0,Math.min(tiers.length-1,tiers.indexOf(tier)+direction))];
}
export function effectiveTier(preference:Preference,automatic:Tier,reduced:boolean):EffectiveTier{
 return reduced?"reduced":preference==="auto"?automatic:preference;
}

// Shared desktop breakpoint, including pre-hydration bootstrap.
export const desktopMotionQuery="(min-width:900px)";
export const reducedMotionQuery="(prefers-reduced-motion: reduce)";
export const desktopMotionBootstrap=`if(window.matchMedia(${JSON.stringify(desktopMotionQuery)}).matches){document.documentElement.dataset.motionTier=window.matchMedia(${JSON.stringify(reducedMotionQuery)}).matches?'reduced':'cinematic'}`;
