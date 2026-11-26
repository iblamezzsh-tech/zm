// Pure helpers shared by the reversible editorial timeline.
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const smooth=(x:number)=>{const t=clamp(x);return t*t*(3-2*t)};
export function kineticEnvelope(start:number,end:number,extent:number,compact:boolean){
 const enter=smooth(((extent-start)/extent-.045)/(compact ? .36:.56));
 // Keep content fully readable until its trailing edge approaches the viewport edge.
 const exit=smooth((end/extent)/(compact ? .10:.14));
 return Math.min(enter,exit)
}
export function advanceMotion(current:number,target:number,dt:number,duration:number){
 const diff=target-current;
 if(Math.abs(diff)<.0008)return target;
 // Linear speed limit prevents one-frame reveals; damping avoids abrupt stops.
 const step=Math.min(Math.abs(diff),dt/duration,Math.abs(diff)*(1-Math.exp(-dt/145)));
 return current+Math.sign(diff)*step
}
