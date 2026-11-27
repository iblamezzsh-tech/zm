// A deterministic score: release, carry, dock. Geometry comes from the
// current scroll frame, so no time-based tween, stored scroll history or pin.
export type ThreadPoint={x:number;y:number;size:number};
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const smooth=(x:number)=>{const t=clamp(x);return t*t*(3-2*t)};
const mix=(a:ThreadPoint,b:ThreadPoint,t:number):ThreadPoint=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,size:a.size+(b.size-a.size)*t});
export function questionThread(source:ThreadPoint,rail:ThreadPoint,dock:ThreadPoint,release:number,landing:number){
 const a=smooth(release),b=smooth(landing);
 return {point:mix(mix(source,rail,a),dock,b),coin:a,active:release>0&&landing<1};
}
