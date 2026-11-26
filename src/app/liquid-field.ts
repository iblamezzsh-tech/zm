// Low-resolution damped wave + transported reveal density. All coordinates are normalized.
export const heroFields=new WeakMap<HTMLElement,LiquidField>();
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
export class LiquidField{
 width=120;height=65;aspect=1.8;hasInk=false;
 private a=new Float32Array(120*65);
 private b=new Float32Array(120*65);
 private c=new Float32Array(120*65);
 private ink=new Float32Array(120*65);
 private nextInk=new Float32Array(120*65);
 private phase=0;
 resize(w:number,h:number){
  this.aspect=w/Math.max(h,1);
  this.width=Math.max(40,Math.min(160,Math.round(82*this.aspect)));
  this.height=82;
  const n=this.width*this.height;
  this.a=new Float32Array(n);this.b=new Float32Array(n);this.c=new Float32Array(n);this.ink=new Float32Array(n);this.nextInk=new Float32Array(n);this.hasInk=false;
 }
 clear(){this.a.fill(0);this.b.fill(0);this.c.fill(0);this.ink.fill(0);this.nextInk.fill(0);this.hasInk=false}
 splat(x:number,y:number,px?:number,py?:number,strength=1){
  const vx=px===undefined?0:x-px,vy=py===undefined?0:y-py;
  const speed=Math.hypot(vx*this.aspect,vy);
  const count=Math.min(16,Math.max(1,Math.ceil(speed/.035)));
  const angle=Math.atan2(vy,vx*this.aspect),cs=Math.cos(angle),sn=Math.sin(angle);
  const radius=.15,stretch=1+Math.min(1.65,speed*10);
  for(let k=1;k<=count;k++){
   const cx=x-vx*(1-k/count),cy=y-vy*(1-k/count);
   const maxR=radius*stretch*1.28;
   const left=Math.max(1,Math.floor((cx-maxR/this.aspect)*this.width)),right=Math.min(this.width-2,Math.ceil((cx+maxR/this.aspect)*this.width));
   const top=Math.max(1,Math.floor((cy-maxR)*this.height)),bottom=Math.min(this.height-2,Math.ceil((cy+maxR)*this.height));
   for(let j=top;j<=bottom;j++)for(let i=left;i<=right;i++){
    const dx=(i/(this.width-1)-cx)*this.aspect,dy=j/(this.height-1)-cy;
    const u=(dx*cs+dy*sn)/stretch,v=-dx*sn+dy*cs;
    const theta=Math.atan2(v,u);
    // Asymmetric, continuously changing edges: a liquid footprint, never a rigid circle.
    const shape=1+.23*Math.sin(theta*3+this.phase*2)+.14*Math.cos(theta*5-this.phase*3)+.10*Math.sin(theta*7+angle);
    const r=Math.hypot(u,v)/(radius*shape);
    if(r>1.32)continue;
    const idx=j*this.width+i;
    const alpha=clamp((1.16-r)/.36,0,1)*strength;
    this.ink[idx]=Math.min(1,Math.max(this.ink[idx],alpha)+alpha*.19);
    if(strength>.4){const impulse=Math.exp(-r*r*4.4)*Math.min(.7,.12+speed*4)*strength/count;this.a[idx]=clamp(this.a[idx]+impulse,-1.5,1.5)}
   }
  }
  this.hasInk=true;
 }
 step(){
  const W=this.width,H=this.height,A=this.a,B=this.b,C=this.c,I=this.ink,N=this.nextInk;
  this.phase+=.0167;
  let peak=0;
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){
   const i=y*W+x;
   const lap=A[i-1]+A[i+1]+A[i-W]+A[i+W]-4*A[i];
   C[i]=(2*A[i]-B[i]+.24*lap)*.983;
   // Transport the ink down the local wave slope, then diffuse and dissolve.
   const sx=clamp(x+(A[i+1]-A[i-1])*1.8+Math.sin(y*.16+this.phase*2)*.21,1,W-2);
   const sy=clamp(y+(A[i+W]-A[i-W])*1.8+Math.cos(x*.11-this.phase*1.7)*.19,1,H-2);
   const ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy,ii=iy*W+ix;
   const transported=(I[ii]*(1-fx)+I[ii+1]*fx)*(1-fy)+(I[ii+W]*(1-fx)+I[ii+W+1]*fx)*fy;
   const value=Math.max(0,(transported*.91+(I[i-1]+I[i+1]+I[i-W]+I[i+W])*.0225)*.982-.0013);
   N[i]=value;peak=Math.max(peak,value);
  }
  this.a=C;this.b=A;this.c=B;this.ink=N;this.nextInk=I;this.hasInk=peak>.014;
 }
 sample(x:number,y:number){
  const i=Math.round(clamp(x,0,1)*(this.width-1)),j=Math.round(clamp(y,0,1)*(this.height-1));
  const k=j*this.width+i;
  const left=this.a[j*this.width+Math.max(0,i-1)],right=this.a[j*this.width+Math.min(this.width-1,i+1)];
  const top=this.a[Math.max(0,j-1)*this.width+i],bottom=this.a[Math.min(this.height-1,j+1)*this.width+i];
  return {x:(right-left)*.5,y:(bottom-top)*.5,height:this.a[k]};
 }
 writeMask(out:Uint8ClampedArray){
  for(let i=0;i<this.ink.length;i++){const v=clamp((this.ink[i]-.08)/.57,0,1);out[i*4]=out[i*4+1]=out[i*4+2]=255;out[i*4+3]=Math.round(v*v*(3-2*v)*255)}
 }
}
