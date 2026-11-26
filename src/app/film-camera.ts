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
// Nine different camera moves: pan, crane, orbit, push, bank, rise, pull, traverse, settle.
const MOVES=[
 {x:.25,y:-.05,roll:-.035,lens:.25,depth:.08},
 {x:-.04,y:.34,roll:.03,lens:-.22,depth:-.16},
 {x:.32,y:-.23,roll:.14,lens:.12,depth:.06},
 {x:-.26,y:-.04,roll:-.07,lens:-.13,depth:.19},
 {x:.03,y:.33,roll:.02,lens:.29,depth:-.12},
 {x:.28,y:.06,roll:-.13,lens:-.17,depth:.08},
 {x:-.12,y:-.35,roll:.075,lens:.20,depth:-.08},
 {x:-.34,y:.04,roll:-.045,lens:-.12,depth:.14},
 {x:.02,y:-.20,roll:.02,lens:.10,depth:-.10}
] as const;
export function filmCamera(u:number,w:number,h:number){
 const i=Math.min(SHOTS.length-2,Math.floor(clamp(u,0,SHOTS.length-1))),t=clamp(u-i),a=SHOTS[i],b=SHOTS[i+1],m=MOVES[i];
 const q=smooth(0,1,t),arc=Math.sin(t*Math.PI)**2;
 const step=h*1.56;
 const focal=h*1.42*(1+m.lens*arc);
 const x=(a.x+(b.x-a.x)*q+m.x*arc)*w,y=(a.y+(b.y-a.y)*q+m.y*arc)*h;
 const z=(i+t+m.depth*arc)*step;
 const colorMix=smooth(.37,.56,t);
 const color=a.palette.map((n,j)=>(n+(b.palette[j]-n)*colorMix)/255) as [number,number,number];
 return {x,y,z,roll:m.roll*arc,focal,step,color};
}
export type FilmCamera=ReturnType<typeof filmCamera>;
// Only one chapter owns readable typography. Artwork has a separate, wider
// window, giving the transition room to breathe without overlapping headlines.
export function filmEdit(u:number,i:number){
 const local=u-i,owner=clamp(Math.round(u),0,SHOTS.length-1)===i;
 const inEnd=[-.12,-.10,-.13,-.10,-.11,-.14,-.09,-.12,-.13,-.08][i];
 const enter=i===0?1:smooth(-.42,inEnd,local);
 const exit=i===SHOTS.length-1?0:smooth(.08,.39,local);
 const text=owner?enter*(1-exit):0;
 const art=(i===0?1:smooth(-.77,-.17,local))*(i===SHOTS.length-1?1:1-smooth(.13,.60,local));
 return {local,owner,enter,exit,text,art};
}
