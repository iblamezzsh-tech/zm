// Camera coordinates use CSS pixels so HTML and the WebGL scene share one projection.
export const SHOTS=[
 {id:"film-present",label:"The present",x:0,y:0,palette:[238,236,227]},
 {id:"introduction",label:"Curiosity",x:.24,y:-.12,palette:[255,218,36]},
 {id:"film-memory",label:"The journey",x:-.28,y:.10,palette:[36,41,30]},
 {id:"film-future",label:"The future",x:.22,y:-.09,palette:[244,241,232]},
 {id:"projects",label:"OverThink",x:-.25,y:.04,palette:[36,41,30]},
 {id:"exhibit-finance4youth",label:"Finance4Youth",x:.22,y:-.14,palette:[229,232,218]},
 {id:"exhibit-rezamin",label:"ReZamin",x:-.24,y:.09,palette:[53,68,49]},
 {id:"milestone-preview",label:"Milestones",x:.26,y:-.05,palette:[244,241,232]},
 {id:"interests",label:"Off the record",x:-.20,y:.09,palette:[255,218,36]},
 {id:"next-chapter",label:"The next chapter",x:0,y:0,palette:[36,41,30]},
] as const;
export const clamp=(n:number,a=0,b=1)=>Math.min(b,Math.max(a,n));
export function smooth(a:number,b:number,n:number){const t=clamp((n-a)/(b-a));return t*t*(3-2*t)}
function spline(a:number,b:number,c:number,d:number,t:number){return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t)}
export function filmCamera(u:number,w:number,h:number){
 const i=Math.min(SHOTS.length-2,Math.floor(clamp(u,0,SHOTS.length-1))),t=clamp(u-i);
 const a=SHOTS[Math.max(0,i-1)],b=SHOTS[i],c=SHOTS[i+1],d=SHOTS[Math.min(SHOTS.length-1,i+2)];
 const focal=h*1.42,step=h*1.56;
 const x=spline(a.x,b.x,c.x,d.x,t)*w,y=spline(a.y,b.y,c.y,d.y,t)*h;
 const roll=Math.sin(t*Math.PI)*((i%2===0)?-.075:.075);
 const mix=smooth(.30,.73,t);
 const color=b.palette.map((n,j)=>(n+(c.palette[j]-n)*mix)/255) as [number,number,number];
 return {x,y,z:u*step,roll,focal,step,color};
}
export type FilmCamera=ReturnType<typeof filmCamera>;
