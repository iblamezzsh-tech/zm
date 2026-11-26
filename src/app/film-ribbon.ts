// A single continuous ribbon lives in world space. The HTML and both renderers
// share the same camera, depth, roll, focal length and palette.
import {filmCamera,SHOTS,type FilmCamera} from "./film-camera";
type V=[number,number,number];
type Vertex={p:V;shade:number};
type Triangle=[Vertex,Vertex,Vertex];
function mesh(w:number,h:number){
 const faces:Triangle[]=[];
 for(let band=0;band<2;band++){
  const edge=(u:number,side:number):Vertex=>{
   const c=filmCamera(Math.max(0,Math.min(SHOTS.length-1,u)),w,h);
   const phase=u*2.15+band*Math.PI,twist=u*3.2+band*.7;
   const radiusX=w*(.49+band*.10),radiusY=h*(.36+band*.08);
   const width=h*(band===0?.10:.027);
   return {p:[c.x+Math.cos(phase)*radiusX+side*width*Math.cos(twist),c.y+Math.sin(phase)*radiusY+side*width*Math.sin(twist),-u*c.step+side*width*.35*Math.cos(twist)],shade:.25+.75*(.5+.5*Math.cos(twist+side*.68))};
  };
  const n=SHOTS.length*52;
  for(let i=0;i<n;i++){
   const u=-.55+i/n*(SHOTS.length+.1),v=-.55+(i+1)/n*(SHOTS.length+.1);
   const a=edge(u,-1),b=edge(u,1),c=edge(v,1),d=edge(v,-1);faces.push([a,b,c],[a,c,d]);
  }
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
  for(const f of commands){const z=f.reduce((s,p)=>s+p.z,0)/f.length,s=f.reduce((s,p)=>s+p.shade,0)/f.length;const fog=Math.min(.96,Math.max(.10,(z-c.focal*.65)/(c.focal*5.35)));
   const metal=[.36+.64*s,.29+.55*s,.075+.145*s];const color=metal.map((v,i)=>v+(c.color[i]-v)*fog);
   ctx!.beginPath();f.forEach((p,i)=>{const x=W/2+p.x*c.focal/p.z*W/w,y=H/2+p.y*c.focal/p.z*H/h;if(i)ctx!.lineTo(x,y);else ctx!.moveTo(x,y)});ctx!.closePath();ctx!.fillStyle=rgb(color);ctx!.fill();ctx!.strokeStyle=ctx!.fillStyle;ctx!.lineWidth=.6;ctx!.stroke();
  }
 }
 return {draw,dispose(){}};
}
