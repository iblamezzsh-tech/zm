// A single continuous ribbon lives in world space. The HTML and both renderers
// share the same camera, depth, roll, focal length and palette.
import {filmCamera,SHOTS,type FilmCamera} from "./film-camera";
type V=[number,number,number];
type Vertex={p:V;shade:number};
type Triangle=[Vertex,Vertex,Vertex];
// Discrete sculptural edits instead of a repeated winding ribbon. Each bridge
// is a different object in the same world coordinate system.
function mesh(w:number,h:number){
 const faces:Triangle[]=[];
 const vertex=(p:V,shade:number):Vertex=>({p,shade});
 const quad=(a:V,b:V,c:V,d:V,s:number)=>faces.push([vertex(a,s),vertex(b,s*.86),vertex(c,s)],[vertex(a,s),vertex(c,s),vertex(d,s*.77)]);
 for(let i=0;i<SHOTS.length-1;i++){
  const c=filmCamera(i+.48,w,h),r=h*.31;
  const point=(x:number,y:number,z:number):V=>[c.x+x,c.y+y,-c.z+z];
  const ring=(radius:number,width:number,tilt:number,offset:number,shade:number,start=0,span=Math.PI*2)=>{
   const N=64;
   for(let j=0;j<N;j++){
    const a=start+j/N*span,b=start+(j+1)/N*span;
    const p=(t:number,k:number):V=>point(Math.cos(t)*k,Math.sin(t)*k*Math.cos(tilt),offset+Math.sin(t)*k*Math.sin(tilt));
    quad(p(a,radius-width),p(b,radius-width),p(b,radius+width),p(a,radius+width),shade*(.62+.38*Math.sin(a*.5)**2));
   }
  };
  const panel=(x:number,y:number,ww:number,hh:number,z:number,angle:number,s:number)=>{
   const p=(u:number,v:number):V=>point(x+u*Math.cos(angle),y+v,z+u*Math.sin(angle));
   quad(p(-ww/2,-hh/2),p(ww/2,-hh/2),p(ww/2,hh/2),p(-ww/2,hh/2),s);
  };
  if(i===0){for(let k=0;k<5;k++)ring(r*(.76+k*.18),h*.009,k*.24,-k*h*.08,.73,0,Math.PI*1.8)}
  else if(i===1){for(let k=0;k<6;k++)panel((k-2.5)*h*.12,(k%2-.5)*h*.18,h*.10,h*.70,-k*h*.07,(k-2.5)*.19,.45+k*.07)}
  else if(i===2){ring(r*1.05,h*.055,.88,0,.94);ring(r*.71,h*.016,-.52,-h*.14,.63)}
  else if(i===3){for(let k=0;k<4;k++){const a=(k-1.5)*h*.20;panel(a,0,h*.16,h*.48,k*h*.10,.6-k*.24,.55+k*.10)}}
  else if(i===4){for(let k=0;k<7;k++){const hh=h*(.12+k*.062);panel((k-3)*h*.12,h*.22-hh/2,h*.072,hh,-k*h*.06,.3,.45+k*.07)}}
  else if(i===5){for(let k=0;k<5;k++)ring(r*(.38+k*.18),h*.028,1.14-k*.18,-k*h*.10,.58+k*.08,k*.28,Math.PI*1.28)}
  else if(i===6){for(let k=0;k<5;k++)panel((k-2)*h*.10,(k-2)*h*.055,h*.44,h*.31,-k*h*.14,(k-2)*.20,.48+k*.10)}
  else if(i===7){for(let k=0;k<7;k++)panel((k-3)*h*.10,0,h*.014,h*.76,-k*h*.05,-.55,.74)}
  else{ring(r*.90,h*.019,.15,0,.85,0,Math.PI*1.77);ring(r*1.08,h*.008,-.35,-h*.08,.54)}
 }
 return faces;
}
const vertex=`attribute vec3 point;attribute float shade;uniform vec3 eye;uniform vec2 viewport;uniform float focal,roll;uniform vec3 paper;varying vec3 tint;void main(){vec3 p=point-eye;float c=cos(roll),s=sin(roll);vec2 xy=vec2(c*p.x+s*p.y,-s*p.x+c*p.y);float depth=focal-p.z;float fog=smoothstep(focal*.85,focal*6.,depth);vec3 gold=mix(vec3(.36,.29,.075),vec3(1.,.84,.22),shade);float lum=dot(paper,vec3(.299,.587,.114));vec3 metal=mix(gold,vec3(.35,.41,.28)*(.7+shade*.3),smoothstep(.65,.91,lum)*.65);tint=mix(metal,paper,fog*.94+.13*(1.-fog));gl_Position=vec4(2.*focal*xy.x/viewport.x,-2.*focal*xy.y/viewport.y,1.001*depth-16.008,depth);}`;
const fragment=`precision mediump float;varying vec3 tint;void main(){gl_FragColor=vec4(tint,1.);}`;
export function createRibbonGPU(canvas:HTMLCanvasElement){
 const gl=canvas.getContext("webgl",{alpha:false,antialias:true,depth:true,powerPreference:"low-power"});if(!gl)return null;
 function compile(type:number,src:string){const s=gl!.createShader(type);if(!s)return null;gl!.shaderSource(s,src);gl!.compileShader(s);if(!gl!.getShaderParameter(s,gl!.COMPILE_STATUS)){gl!.deleteShader(s);return null}return s}
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs){if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);return null}
 const program=gl.createProgram();if(!program){gl.deleteShader(vs);gl.deleteShader(fs);return null}
 gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);return null}
 const buffer=gl.createBuffer();if(!buffer){gl.deleteProgram(program);return null}
 const attrs=[gl.getAttribLocation(program,"point"),gl.getAttribLocation(program,"shade")];
 const uniforms=Object.fromEntries(["eye","viewport","focal","roll","paper"].map(k=>[k,gl.getUniformLocation(program,k)]));
 let lastW=0,lastH=0,count=0,lost=false;
 function onLost(e:Event){e.preventDefault();lost=true}
 canvas.addEventListener("webglcontextlost",onLost);
 function draw(c:FilmCamera,w:number,h:number){
  if(lost)return false;
  if(w!==lastW||h!==lastH){
   const scale=Math.min(1,1280/w,820/h);canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));lastW=w;lastH=h;
   const data:number[]=[];for(const face of mesh(w,h))for(const v of face)data.push(...v.p,v.shade);
   count=data.length/4;gl!.bindBuffer(gl!.ARRAY_BUFFER,buffer);gl!.bufferData(gl!.ARRAY_BUFFER,new Float32Array(data),gl!.STATIC_DRAW);
  }
  gl!.viewport(0,0,canvas.width,canvas.height);gl!.enable(gl!.DEPTH_TEST);gl!.depthFunc(gl!.LEQUAL);gl!.clearColor(...c.color,1);gl!.clear(gl!.COLOR_BUFFER_BIT|gl!.DEPTH_BUFFER_BIT);
  gl!.useProgram(program);gl!.bindBuffer(gl!.ARRAY_BUFFER,buffer);
  if(attrs[0]>=0){gl!.enableVertexAttribArray(attrs[0]);gl!.vertexAttribPointer(attrs[0],3,gl!.FLOAT,false,16,0)}
  if(attrs[1]>=0){gl!.enableVertexAttribArray(attrs[1]);gl!.vertexAttribPointer(attrs[1],1,gl!.FLOAT,false,16,12)}
  gl!.uniform3f(uniforms.eye,c.x,c.y,-c.z);gl!.uniform2f(uniforms.viewport,w,h);gl!.uniform1f(uniforms.focal,c.focal);gl!.uniform1f(uniforms.roll,c.roll);gl!.uniform3fv(uniforms.paper,c.color);
  gl!.drawArrays(gl!.TRIANGLES,0,count);return true;
 }
 return {draw,dispose(){canvas.removeEventListener("webglcontextlost",onLost);gl.deleteBuffer(buffer);gl.deleteProgram(program)}};
}
export function createRibbonCPU(canvas:HTMLCanvasElement){
 const ctx=canvas.getContext("2d",{alpha:false});if(!ctx)return null;
 let lastW=0,lastH=0,geometry:Triangle[]=[];
 const rgb=(a:number[])=>"rgb("+a.map(x=>Math.round(Math.max(0,Math.min(1,x))*255)).join(",")+")";
 function draw(c:FilmCamera,w:number,h:number){
  if(w!==lastW||h!==lastH){const scale=Math.min(1,1050/w,700/h);canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));geometry=mesh(w,h);lastW=w;lastH=h}
  const W=canvas.width,H=canvas.height;ctx!.fillStyle=rgb(c.color);ctx!.fillRect(0,0,W,H);
  const cosine=Math.cos(c.roll),sine=Math.sin(c.roll);
  function view(v:Vertex){const x=v.p[0]-c.x,y=v.p[1]-c.y,z=c.focal-v.p[2]-c.z;return {x:x*cosine+y*sine,y:-x*sine+y*cosine,z,shade:v.shade}}
  type P=ReturnType<typeof view>;
  function clip(poly:P[]){const out:P[]=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],inside=a.z>45,next=b.z>45;if(inside)out.push(a);if(inside!==next){const t=(45-a.z)/(b.z-a.z);out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:45,shade:a.shade+(b.shade-a.shade)*t})}}return out}
  const commands=geometry.map(f=>clip(f.map(view))).filter(f=>f.length>=3&&f.some(p=>p.z<c.focal*6)).sort((a,b)=>b.reduce((s,p)=>s+p.z,0)/b.length-a.reduce((s,p)=>s+p.z,0)/a.length);
  for(const f of commands){const z=f.reduce((s,p)=>s+p.z,0)/f.length,s=f.reduce((sum,p)=>sum+p.shade,0)/f.length;const fog=Math.min(.96,Math.max(.10,(z-c.focal*.65)/(c.focal*5.35)));
   const metal=[.36+.64*s,.29+.55*s,.075+.145*s];const color=metal.map((v,i)=>v+(c.color[i]-v)*fog);
   ctx!.beginPath();f.forEach((p,i)=>{const x=W/2+p.x*c.focal/p.z*W/w,y=H/2+p.y*c.focal/p.z*H/h;if(i)ctx!.lineTo(x,y);else ctx!.moveTo(x,y)});ctx!.closePath();ctx!.fillStyle=rgb(color);ctx!.fill();ctx!.strokeStyle=ctx!.fillStyle;ctx!.lineWidth=.6;ctx!.stroke();
  }
 }
 return {draw,dispose(){}};
}
