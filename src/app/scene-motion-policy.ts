// Every homepage chapter has its own independent performance history.
import {frameHealth,nextTier,type Tier} from "./motion-quality-policy";
export const sceneNames={opening:"Portrait / signature",manifesto:"Introduction",memory:"Small moments",future:"Think / Learn / Build",worlds:"Two worlds",projects:"Projects",archive:"Milestones",personal:"Interests",social:"Social fan",finale:"Grand finale"} as const;
export type SceneKey=keyof typeof sceneNames;
export type SceneReading={tier:Tier;frames:number;p90:number;poor:number;good:number;lastChange:number};
export function initialReading(tier:Tier,now:number):SceneReading{return {tier,frames:0,p90:0,poor:0,good:0,lastChange:now}}
export function assessScene(prior:SceneReading,samples:number[],now:number){
 const health=urgentFrameWindow(samples)?"severe":frameHealth(samples);
 if(health==="insufficient")return {reading:prior,pending:null};
 const sorted=samples.slice().sort((a,b)=>a-b);
 const p90=Math.round(sorted[Math.ceil(sorted.length*.9)-1]*10)/10;
 const poor=health==="poor"?prior.poor+1:0;
 const good=health==="good"?prior.good+1:0;
 let pending:Tier|null=null;
 if(health==="severe"||poor>=2)pending=nextTier(prior.tier,-1);
 else if(good>=4&&now-prior.lastChange>=20000)pending=nextTier(prior.tier,1);
 if(pending===prior.tier)pending=null;
 return {reading:{...prior,frames:prior.frames+samples.length,p90,poor,good},pending};
}

// A short burst can be enough evidence for a downgrade, but never an upgrade.
export function urgentFrameWindow(samples:number[]):boolean{
 if(samples.length<12)return false;
 return samples.filter(v=>v>=50).length>=Math.ceil(samples.length*.5)||samples.filter(v=>v>=120).length>=3;
}
export function mergePendingTier(queued:Tier|undefined,proposed:Tier):Tier{
 const order:Tier[]=["lite","balanced","cinematic"];
 if(!queued)return proposed;
 return order.indexOf(proposed)<order.indexOf(queued)?proposed:queued;
}
export const profileLifetime=7*24*60*60*1000;
export function parseProfile(raw:string|null,now:number):Partial<Record<SceneKey,Tier>>{
 const result:Partial<Record<SceneKey,Tier>>={};
 if(!raw)return result;
 try{
  const value=JSON.parse(raw);
  if(!value||value.version!==1||typeof value.savedAt!=="number"||!Number.isFinite(value.savedAt)||value.savedAt>now||now-value.savedAt>profileLifetime||!value.scenes||typeof value.scenes!=="object")return result;
  for(const key of Object.keys(sceneNames) as SceneKey[]){const tier=value.scenes[key];if(tier==="lite"||tier==="balanced"||tier==="cinematic")result[key]=tier}
 }catch{}
 return result;
}
