
export type V3=[number,number,number];
export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const mix=(a:V3,b:V3,t:number):V3=>a.map((x,i)=>x+(b[i]-x)*t) as V3;
export const sub=(a:V3,b:V3):V3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
export const cross=(a:V3,b:V3):V3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const unit=(v:V3):V3=>{const l=Math.hypot(...v)||1;return [v[0]/l,v[1]/l,v[2]/l]};
const bezier=(a:V3,b:V3,c:V3,p:number)=>mix(mix(a,b,p),mix(b,c,p),p);
export function deskCamera(progress:number,aspect:number,portrait:boolean){
 const p=clamp(progress);
 // Camera and target move on separate shallow arcs; lens stays fixed.
 const start:V3=portrait?[0,22,0.9]:[0,11.8,.55];
 const control:V3=portrait?[.2,16.8,5.0]:[.15,8.1,3.35];
 const end:V3=portrait?[.45,10.5,7.6]:[.35,4.7,5.45];
 const eye=bezier(start,control,end,p);
 const target=bezier([0,0,-.15],[.12,0,.55],[.45,0,1.05],p);
 const fit=portrait?Math.max(1,.49/aspect):Math.max(1,1.46/aspect);
 const adjusted:V3=[target[0]+(eye[0]-target[0])*fit,eye[1]*fit,target[2]+(eye[2]-target[2])*fit];
 const forward=unit(sub(target,adjusted)),right=unit(cross(forward,[0,1,0])),up=cross(right,forward);
 return {eye:adjusted,forward,right,up,tan:Math.tan((portrait?56:47)*Math.PI/360),target};
}
