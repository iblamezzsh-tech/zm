// Pure, frame-rate-independent scroll impulse. No scroll interception.
export function scrollImpulseTarget(delta:number,dt:number,viewport:number){
 if(!Number.isFinite(delta)||dt<=0||dt>180||Math.abs(delta)>viewport*1.2)return 0;
 return Math.max(-1,Math.min(1,delta/Math.max(8,dt)/2.4));
}
export function dampImpulse(current:number,target:number,dt:number){
 const v=target+(current-target)*Math.exp(-Math.max(0,Math.min(100,dt))/(target===0?105:48));
 return Math.abs(v)<.002?0:v;
}
