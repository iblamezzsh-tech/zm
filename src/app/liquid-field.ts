// Original CPU velocity-field implementation using semi-Lagrangian transport and pressure projection.
// Units are grid cells per simulation step. No third-party demo source is included.
export const heroFields=new WeakMap<HTMLElement,LiquidField>();
// Shared, read-only during the synchronous paint event; the background uploads
// the exact same alpha bytes that were composited into the photo.
export const heroMaskFrames=new WeakMap<HTMLElement,{width:number;height:number;data:Uint8ClampedArray;active:boolean}>();
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
export class LiquidField{
 width=120;height=66;aspect=1.8;hasInk=false;
 private u=new Float32Array(120*66);
 private v=new Float32Array(120*66);
 private nextU=new Float32Array(120*66);
 private nextV=new Float32Array(120*66);
 private pressure=new Float32Array(120*66);
 private nextPressure=new Float32Array(120*66);
 private div=new Float32Array(120*66);
 private curl=new Float32Array(120*66);
 private ink=new Float32Array(120*66);
 private nextInk=new Float32Array(120*66);
 private grain=new Float32Array(120*66);
 constructor(private living=false){}
 resize(w:number,h:number){
  this.aspect=w/Math.max(h,1);this.height=66;this.width=Math.max(35,Math.min(150,Math.round(this.height*this.aspect)));
  const n=this.width*this.height;
  this.u=new Float32Array(n);this.v=new Float32Array(n);this.nextU=new Float32Array(n);this.nextV=new Float32Array(n);
  this.pressure=new Float32Array(n);this.nextPressure=new Float32Array(n);this.div=new Float32Array(n);this.curl=new Float32Array(n);this.ink=new Float32Array(n);this.nextInk=new Float32Array(n);this.grain=new Float32Array(n);
 if(this.living)for(let j=0;j<this.height;j++)for(let i=0;i<this.width;i++)this.grain[j*this.width+i]=.5*Math.sin(i*.28+j*.39)+.28*Math.sin(i*.79-j*.51)+.13*Math.cos(i*1.31+j*.87);
 this.hasInk=false;
 }
 clear(){for(const a of [this.u,this.v,this.nextU,this.nextV,this.pressure,this.nextPressure,this.div,this.curl,this.ink,this.nextInk])a.fill(0);this.hasInk=false}
 private read(a:Float32Array,x:number,y:number){
  const W=this.width,H=this.height;
  x=clamp(x,0,W-1.001);y=clamp(y,0,H-1.001);
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,i=iy*W+ix;
  return (a[i]*(1-fx)+a[i+1]*fx)*(1-fy)+(a[i+W]*(1-fx)+a[i+W+1]*fx)*fy;
 }
 splat(x:number,y:number,px?:number,py?:number,strength=1){
  if(px===undefined||py===undefined)return;
  const W=this.width,H=this.height;
  const vx=(x-px)*(W-1),vy=(y-py)*(H-1),speed=Math.hypot(vx,vy);
  if(speed<.035)return;
  // No stationary brush: only movement injects momentum, with an upper speed limit.
  const force=Math.min(3.8,speed*.72)*strength;
  const fx=vx/speed*force,fy=vy/speed*force;
  const radius=H*.085;
  const count=Math.min(12,Math.max(1,Math.ceil(speed/(radius*.68))));
  for(let k=1;k<=count;k++){
   const cx=(px+(x-px)*k/count)*(W-1),cy=(py+(y-py)*k/count)*(H-1);
   const range=radius*2.1;
   for(let j=Math.max(1,Math.floor(cy-range));j<=Math.min(H-2,Math.ceil(cy+range));j++)
    for(let i=Math.max(1,Math.floor(cx-range));i<=Math.min(W-2,Math.ceil(cx+range));i++){
     const dx=i-cx,dy=j-cy,fall=Math.exp(-(dx*dx+dy*dy)/(radius*radius));
     const n=j*W+i;
     if(this.living)this.ink[n]=Math.min(1.4,this.ink[n]+Math.min(.95,.34+speed*.17)*fall);
     // Tangential force seeds organic curl without drawing a circular reveal.
     const swirl=force*.13*fall/radius;
     this.u[n]=clamp(this.u[n]+(fx*fall-dy*swirl)/Math.sqrt(count),-5,5);
     this.v[n]=clamp(this.v[n]+(fy*fall+dx*swirl)/Math.sqrt(count),-5,5);
    }
  }
  this.hasInk=true;
 }
 step(){
  if(!this.hasInk)return;
  const W=this.width,H=this.height,U=this.u,V=this.v,NU=this.nextU,NV=this.nextV,D=this.div,C=this.curl;
  // Transport momentum through itself; slower than the reference feel, with a longer tail.
  for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){
   const k=j*W+i,sx=i-U[k]*.72,sy=j-V[k]*.72;
   NU[k]=this.read(U,sx,sy)*.969;NV[k]=this.read(V,sx,sy)*.969;
  }
  for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){
   const k=j*W+i;C[k]=(NV[k+1]-NV[k-1]-NU[k+W]+NU[k-W])*.5;
  }
  // Vorticity confinement restores small fluid curls lost during advection.
  for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){
   const k=j*W+i;
   const gx=Math.abs(C[k+1])-Math.abs(C[k-1]),gy=Math.abs(C[k+W])-Math.abs(C[k-W]);
   const l=Math.hypot(gx,gy)+.0001;
   NU[k]+=gy/l*C[k]*.11;NV[k]-=gx/l*C[k]*.11;
  }
  for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){
   const k=j*W+i;D[k]=(NU[k+1]-NU[k-1]+NV[k+W]-NV[k-W])*.5;
  }
  let P=this.pressure,Q=this.nextPressure;P.fill(0);Q.fill(0);
  for(let pass=0;pass<7;pass++){
   for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){
    const k=j*W+i;Q[k]=(P[k-1]+P[k+1]+P[k-W]+P[k+W]-D[k])*.25;
   }
   const swap=P;P=Q;Q=swap;
  }
  this.pressure=P;this.nextPressure=Q;
  let peak=0,inkPeak=0;const ink=this.ink,nextInk=this.nextInk;
  for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){
   const k=j*W+i;
   NU[k]=clamp(NU[k]-(P[k+1]-P[k-1])*.5,-5,5);
   NV[k]=clamp(NV[k]-(P[k+W]-P[k-W])*.5,-5,5);
   peak=Math.max(peak,Math.abs(NU[k])+Math.abs(NV[k]));
 if(this.living){nextInk[k]=Math.max(0,this.read(ink,i-NU[k]*.68,j-NV[k]*.68)*.986-.0012-.0015*Math.max(0,this.grain[k]));inkPeak=Math.max(inkPeak,nextInk[k]);}
  }
  this.u=NU;this.v=NV;this.nextU=U;this.nextV=V;
  if(this.living){this.ink=nextInk;this.nextInk=ink;this.hasInk=peak>.19||inkPeak>.145;if(!this.hasInk)this.clear()}else this.hasInk=peak>.075;
 }
 sample(x:number,y:number){
  const gx=x*(this.width-1),gy=y*(this.height-1);
  const u=this.read(this.u,gx,gy),v=this.read(this.v,gx,gy);
  return {x:u*.065,y:v*.065,height:Math.hypot(u,v)*.035};
 }
 writeMask(out:Uint8ClampedArray){
  // Reveal is an iso-surface of moving fluid, with a directional bias and a narrow feather.
  // This produces separate, flowing ribbons rather than a translucent brush mark.
  for(let i=0;i<this.u.length;i++){
   const u=this.u[i],v=this.v[i],speed=Math.hypot(u,v);
   const directional=.73-.27*Math.tanh(u*.65);
   const density=speed*directional;
   const a=this.living?Math.max(clamp((density-.19)/.27,0,1),clamp((this.ink[i]-(.19+this.grain[i]*.045))/.20,0,1)):clamp((density-.19)/.27,0,1);
   out[i*4]=out[i*4+1]=out[i*4+2]=255;out[i*4+3]=Math.round(a*a*(3-2*a)*255);
  }
 }
}
