export type Rect={left:number;top:number;width:number;height:number};
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export function sheetFlight(source:Rect,target:Rect,sourceMark:Rect,targetMark:Rect,scrollY:number,viewport:number,mobile:boolean){
 const start=scrollY+source.top-viewport*(mobile?.20:.27);
 const end=scrollY+target.top-viewport*(mobile?.34:.23);
 const span=end-start;
 const p=span>0?clamp((scrollY-start)/span):0;
 const active=span>0&&p>0&&p<1;
 const t=p*p*(3-2*p);
 const sourceAnchor={x:sourceMark.left+sourceMark.width/2,y:sourceMark.top+sourceMark.height/2};
 const targetAnchor={x:targetMark.left+targetMark.width/2,y:targetMark.top+targetMark.height/2};
 const x=mix(sourceAnchor.x,targetAnchor.x,t);
 const y=mix(sourceAnchor.y+scrollY-start,targetAnchor.y+scrollY-end,t);
 const left=x-mix(sourceAnchor.x-source.left,targetAnchor.x-target.left,t);
 const top=y-mix(sourceAnchor.y-source.top,targetAnchor.y-target.top,t);
 return {active,p,left,top,anchorX:x,anchorY:y,width:mix(source.width,target.width,t),height:mix(source.height,target.height,t),arrival:clamp((p-.89)/.11),span};
}
