// Every homepage chapter has its own independent performance history.
import {frameHealth,nextTier,type Tier} from "./motion-quality-policy";
export const sceneNames={opening:"Portrait / signature",manifesto:"Introduction",memory:"Small moments",future:"Think / Learn / Build",worlds:"Two worlds",projects:"Projects",archive:"Milestones",personal:"Interests",social:"Social fan",finale:"Grand finale"} as const;
export type SceneKey=keyof typeof sceneNames;
export type SceneReading={tier:Tier;frames:number;p90:number;poor:number;good:number;lastChange:number};
export function initialReading(tier:Tier,now:number):SceneReading{return {tier,frames:0,p90:0,poor:0,good:0,lastChange:now}}
export function assessScene(prior:SceneReading,samples:number[],now:number){
 const health=frameHealth(samples);
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
