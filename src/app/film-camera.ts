// Spatial editorial map: the content is the world, with no decorative mesh.
export const SHOTS=[
 {id:"film-present",label:"The present",x:0,y:0,z:0,palette:[238,236,227]},
 {id:"introduction",label:"Curiosity",x:0.94,y:0,z:0.22,palette:[255,218,36]},
 {id:"film-memory",label:"The journey",x:0.94,y:0.84,z:0.52,palette:[36,41,30]},
 {id:"film-future",label:"The future",x:-0.04,y:0.84,z:0.31,palette:[244,241,232]},
 {id:"projects",label:"OverThink",x:-1.04,y:0.18,z:0.66,palette:[36,41,30]},
 {id:"exhibit-finance4youth",label:"Finance4Youth",x:-1.04,y:-0.7,z:0.42,palette:[229,232,218]},
 {id:"exhibit-rezamin",label:"ReZamin",x:0.06,y:-0.7,z:0.89,palette:[53,68,49]},
 {id:"milestone-preview",label:"Milestones",x:1.1,y:-0.25,z:0.58,palette:[244,241,232]},
 {id:"interests",label:"Off the record",x:0.44,y:0.55,z:0.2,palette:[255,218,36]},
 {id:"next-chapter",label:"The next chapter",x:0,y:0,z:0.05,palette:[36,41,30]},
] as const;
export const clamp=(n:number,a=0,b=1)=>Math.min(b,Math.max(a,n));
export function smooth(a:number,b:number,n:number){const t=clamp((n-a)/(b-a));return t*t*(3-2*t)}
// All positions are fixed in one three-dimensional map. Depth is deliberately
// non-monotonic: the camera moves sideways, rises, turns back and pulls away.
const MOVES=[
 {x:.02,y:-.08,roll:0,lens:.10,depth:.22},
 {x:.15,y:0,roll:.035,lens:-.12,depth:-.06},
 {x:0,y:.13,roll:-.04,lens:.06,depth:.17},
 {x:-.13,y:-.04,roll:.055,lens:-.08,depth:.22},
 {x:-.12,y:0,roll:0,lens:.14,depth:.12},
 {x:0,y:-.13,roll:-.045,lens:-.09,depth:.20},
 {x:.13,y:.08,roll:.04,lens:.08,depth:-.12},
 {x:.06,y:.16,roll:0,lens:-.09,depth:.13},
 {x:0,y:-.09,roll:0,lens:.03,depth:-.10}
] as const;
export function filmCamera(u:number,w:number,h:number){
 const i=Math.min(SHOTS.length-2,Math.floor(clamp(u,0,SHOTS.length-1))),t=clamp(u-i),a=SHOTS[i],b=SHOTS[i+1],m=MOVES[i];
 const q=smooth(0,1,t),arc=Math.sin(t*Math.PI)**2,step=h*1.56;
 const x=(a.x+(b.x-a.x)*q+m.x*arc)*w,y=(a.y+(b.y-a.y)*q+m.y*arc)*h;
 const z=(a.z+(b.z-a.z)*q+m.depth*arc)*step;
 const colorMix=smooth(.44,.56,t);
 const color=a.palette.map((n,j)=>(n+(b.palette[j]-n)*colorMix)/255) as [number,number,number];
 return {x,y,z,roll:m.roll*arc,focal:h*1.42*(1+m.lens*arc),step,color};
}
export type FilmCamera=ReturnType<typeof filmCamera>;
export function filmEdit(u:number,i:number){
 const local=u-i,owner=clamp(Math.round(u),0,SHOTS.length-1)===i;
 const enter=i===0?1:smooth(-.50,-.17,local);
 const exit=i===SHOTS.length-1?0:smooth(.18,.50,local);
 const text=owner?enter*(1-exit):0;
 const art=(i===0?1:smooth(-.66,-.16,local))*(i===SHOTS.length-1?1:1-smooth(.18,.66,local));
 return {local,owner,enter,exit,text,art};
}
