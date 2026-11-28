
import {deskCamera,sub,cross,unit,type V3} from "./desk-camera";
type UV=[number,number];
type Vertex={p:V3;uv:UV};
type Mesh={buffer:WebGLBuffer;count:number;texture:WebGLTexture;mode:number};
const VS=`
attribute vec3 aPos;attribute vec3 aNormal;attribute vec2 aUV;
uniform vec3 uEye,uRight,uUp,uForward;uniform float uTan,uAspect;
varying vec3 vN,vP;varying vec2 vUV;
void main(){vec3 d=aPos-uEye;float z=dot(d,uForward);gl_Position=vec4(dot(d,uRight)/(uTan*uAspect),dot(d,uUp)/uTan,z*1.00125-.10006,z);vP=aPos;vN=aNormal;vUV=aUV;}
`;
const FS=`
precision mediump float;uniform sampler2D uTex;uniform int uMode;uniform vec3 uEye;
varying vec3 vN,vP;varying vec2 vUV;
void main(){vec4 tex=texture2D(uTex,vUV);if(tex.a<.008)discard;if(uMode==1){gl_FragColor=tex;return;}
vec3 n=normalize(vN);vec3 l=normalize(vec3(-.65,.9,.38));float lam=max(0.,dot(n,l));
float band=smoothstep(-1.8,-.8,vP.x+vP.z*.77)*(1.-smoothstep(2.4,4.0,vP.x+vP.z*.77));
float illum=.61+lam*.35+band*.15;vec3 col=tex.rgb*illum*vec3(1.035,1.0,.94);
if(uMode==2){vec3 h=normalize(l+normalize(uEye-vP));col+=vec3(.30,.29,.26)*pow(max(0.,dot(n,h)),26.);}
gl_FragColor=vec4(col,tex.a);}
`;
const rgb=(r:number,g:number,b:number)=>"rgb("+r+","+g+","+b+")";
function canvas(w:number,h:number){const c=document.createElement("canvas");c.width=w;c.height=h;const ctx=c.getContext("2d");if(!ctx)throw Error("2D unavailable");return {c,ctx}}
function random(seed:number){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}
function surface(w:number,h:number,color:[number,number,number],kind:"wood"|"paper"|"leather"|"metal"|"solid"){
 const {c,ctx}=canvas(w,h),r=random(8123),im=ctx.createImageData(w,h);const rows=Array.from({length:h},()=>r());
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=(y*w+x)*4;let d=(r()-.5)*(kind==="paper"?19:kind==="leather"?24:kind==="metal"?7:8);
  if(kind==="wood"){const wave=y+5*Math.sin(x/95+y/57)+2*Math.sin(x/24+y/7);d+=Math.sin(wave*.48)*9+Math.sin(wave*.13)*13+Math.sin(wave*1.91)*3+(rows[Math.max(0,Math.min(h-1,Math.floor(wave)))]-.5)*15;}
  if(kind==="leather")d+=Math.sin(x*.8+Math.sin(y*.7)*2)*4;
  for(let k=0;k<3;k++)im.data[i+k]=color[k]+d;im.data[i+3]=255;
 }
 ctx.putImageData(im,0,0);return {c,ctx};
}
function labelTexture(){
 const {c,ctx}=surface(512,512,[226,177,56],"paper");ctx.fillStyle="#28251c";ctx.font="bold 45px Arial";ctx.fillText("OverThink",24,76);ctx.font="bold 68px Arial";ctx.textAlign="right";ctx.fillText("01",477,463);ctx.textAlign="left";ctx.strokeStyle="#3d3324";ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(275,224,43,21,-.65,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(246,338,43,12,-.1,0,Math.PI*2);ctx.stroke();ctx.setLineDash([7,10]);ctx.beginPath();ctx.moveTo(269,250);ctx.quadraticCurveTo(220,280,246,324);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(386,281);ctx.lineTo(403,304);ctx.lineTo(451,246);ctx.stroke();return c;
}
function laptopTexture(){
 const {c,ctx}=surface(1024,1024,[170,173,172],"metal");const g=ctx.createLinearGradient(0,0,1024,640);g.addColorStop(0,"#ffffff38");g.addColorStop(.5,"#ffffff00");g.addColorStop(1,"#232d3530");ctx.fillStyle=g;ctx.fillRect(0,0,1024,1024);ctx.scale(1,1.6);
 ctx.fillStyle="#686d6c";ctx.beginPath();ctx.arc(512,320,68,0,Math.PI*2);ctx.fill();ctx.fillStyle="#c3c6c4";ctx.font="italic bold 100px Arial";ctx.textAlign="center";ctx.fillText("hp",512,350);ctx.textAlign="left";
 ctx.save();ctx.translate(677,36);ctx.fillStyle="#ece8df";ctx.beginPath();ctx.roundRect(0,0,295,124,10);ctx.fill();ctx.fillStyle="#132d4b";ctx.beginPath();ctx.moveTo(14,17);ctx.lineTo(66,17);ctx.lineTo(66,52);ctx.quadraticCurveTo(66,84,40,100);ctx.quadraticCurveTo(14,84,14,52);ctx.closePath();ctx.fill();ctx.fillStyle="#852d36";ctx.fillRect(14,17,52,24);ctx.strokeStyle="#eee8da";ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(20,76);ctx.lineTo(40,57);ctx.lineTo(61,76);ctx.stroke();ctx.fillStyle="#142b47";ctx.font="62px Georgia";ctx.fillText("Penn",76,66);ctx.font="bold 10px Georgia";ctx.fillText("UNIVERSITY OF PENNSYLVANIA",76,83);ctx.fillStyle="#852d36";ctx.fillText("ESTABLISHED 1740",112,101);ctx.restore();return c;
}
function plannerTexture(){
 const {c,ctx}=surface(512,1024,[37,42,40],"leather");ctx.scale(1,1.6);ctx.strokeStyle="#64645a";ctx.lineWidth=1.7;ctx.setLineDash([5,5]);ctx.beginPath();ctx.roundRect(13,13,486,614,20);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#c3c0b3";ctx.beginPath();ctx.roundRect(387,583,86,29,4);ctx.fill();ctx.fillStyle="#333b39";ctx.font="22px Arial";ctx.textAlign="center";ctx.fillText("deli",430,604);return c;
}
function pageEdges(){
 const {c,ctx}=surface(512,64,[175,158,130],"paper");ctx.strokeStyle="#685e4c60";for(let y=3;y<64;y+=3){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y+.6);ctx.stroke()}return c;
}
function shadowTexture(){
 const {c,ctx}=canvas(256,256);ctx.filter="blur(10px)";ctx.fillStyle="#1b130d8c";ctx.beginPath();ctx.roundRect(17,17,222,222,14);ctx.fill();return c;
}
function shader(gl:WebGLRenderingContext,type:number,src:string){const s=gl.createShader(type);if(!s)throw Error("shader");gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s)||"shader");return s}
export function createDeskRenderer(canvasEl:HTMLCanvasElement,onTexture:()=>void){
 const gl=canvasEl.getContext("webgl",{alpha:false,antialias:true,depth:true,preserveDrawingBuffer:false,powerPreference:"low-power"});
 if(!gl)throw Error("WebGL unavailable");
 const program=gl.createProgram();if(!program)throw Error("program");const vert=shader(gl,gl.VERTEX_SHADER,VS),frag=shader(gl,gl.FRAGMENT_SHADER,FS);gl.attachShader(program,vert);gl.attachShader(program,frag);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)||"link");gl.useProgram(program);gl.deleteShader(vert);gl.deleteShader(frag);
 const aPos=gl.getAttribLocation(program,"aPos"),aNormal=gl.getAttribLocation(program,"aNormal"),aUV=gl.getAttribLocation(program,"aUV");
 const uniforms=Object.fromEntries(["uEye","uRight","uUp","uForward","uTan","uAspect","uMode","uTex"].map(n=>[n,gl.getUniformLocation(program,n)]));
 const meshes:Mesh[]=[],textures:WebGLTexture[]=[];let disposed=false;
 function texture(image:HTMLCanvasElement){const t=gl!.createTexture();if(!t)throw Error("texture");textures.push(t);gl!.bindTexture(gl!.TEXTURE_2D,t);gl!.texImage2D(gl!.TEXTURE_2D,0,gl!.RGBA,gl!.RGBA,gl!.UNSIGNED_BYTE,image);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_WRAP_S,gl!.CLAMP_TO_EDGE);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_WRAP_T,gl!.CLAMP_TO_EDGE);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_MIN_FILTER,gl!.LINEAR_MIPMAP_LINEAR);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_MAG_FILTER,gl!.LINEAR);gl!.generateMipmap(gl!.TEXTURE_2D);return t}
 const solid=(color:[number,number,number],kind:"solid"|"metal"|"leather"="solid")=>texture(surface(64,64,color,kind).c);
 const wood=texture(surface(1024,1024,[105,91,79],"wood").c),metal=solid([114,120,119],"metal"),black=solid([29,31,29]),leather=solid([39,42,39],"leather"),edge=texture(pageEdges()),yellow=texture(labelTexture()),shadow=texture(shadowTexture()),silver=solid([171,178,178],"metal"),barrel=solid([72,78,78],"metal");
 // All texture dimensions are powers of two for WebGL 1 mipmaps.
 const paper=surface(1024,1024,[234,222,197],"paper");const paperTex=texture(paper.c);
 const signature=new Image();signature.onload=()=>{if(disposed)return;paper.ctx.drawImage(signature,105,325,814,272);gl.bindTexture(gl.TEXTURE_2D,paperTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,paper.c);gl.generateMipmap(gl.TEXTURE_2D);onTexture()};signature.src="/brand/signature.svg";
 function mesh(data:number[],tex:WebGLTexture,mode=0){const b=gl!.createBuffer();if(!b)throw Error("buffer");gl!.bindBuffer(gl!.ARRAY_BUFFER,b);gl!.bufferData(gl!.ARRAY_BUFFER,new Float32Array(data),gl!.STATIC_DRAW);meshes.push({buffer:b,count:data.length/8,texture:tex,mode})}
 function tri(data:number[],a:Vertex,b:Vertex,c:Vertex,normal?:V3){const n=normal||unit(cross(sub(b.p,a.p),sub(c.p,a.p)));for(const v of [a,b,c])data.push(...v.p,...n,...v.uv)}
 function quad(data:number[],a:Vertex,b:Vertex,c:Vertex,d:Vertex,normal?:V3){tri(data,a,b,c,normal);tri(data,a,c,d,normal)}
 function grid(cx:number,cz:number,w:number,d:number,y:number,angle:number,tex:WebGLTexture,mode=0,curl=0,steps=1){
  const data:number[]=[],co=Math.cos(angle),si=Math.sin(angle);
  const pt=(u:number,v:number):Vertex=>{const x=(u-.5)*w,z=(v-.5)*d;const lift=curl*Math.pow(Math.max(0,(u-.58)/.42),2)*Math.pow(Math.max(0,(v-.55)/.45),2);return {p:[cx+x*co-z*si,y+lift,cz+x*si+z*co],uv:[u,v]}};
  for(let j=0;j<steps;j++)for(let i=0;i<steps;i++){const u=i/steps,v=j/steps,U=(i+1)/steps,V=(j+1)/steps;quad(data,pt(u,v),pt(u,V),pt(U,V),pt(U,v))}
  mesh(data,tex,mode);
 }
 function box(cx:number,cz:number,w:number,d:number,y:number,h:number,angle:number,top:WebGLTexture,side:WebGLTexture,mode=0,radius=.08){
  const co=Math.cos(angle),si=Math.sin(angle),ring:V3[]=[];const r=Math.min(radius,w/2,d/2);
  for(let k=0;k<4;k++){const a=k*Math.PI/2;const X=(k===0||k===3?1:-1)*(w/2-r),Z=(k<2?1:-1)*(d/2-r);for(let j=0;j<=6;j++){const t=a+j*Math.PI/12;ring.push([X+r*Math.cos(t),0,Z+r*Math.sin(t)])}}
  const p=(v:V3,H:number):Vertex=>({p:[cx+v[0]*co-v[2]*si,H,cz+v[0]*si+v[2]*co],uv:[v[0]/w+.5,v[2]/d+.5]});
  const face:number[]=[],sides:number[]=[];
  for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];tri(face,p([0,0,0],y+h),p(b,y+h),p(a,y+h),[0,1,0]);const A=p(a,y),B=p(b,y),C=p(b,y+h),D=p(a,y+h);A.uv=[0,1];B.uv=[1,1];C.uv=[1,0];D.uv=[0,0];quad(sides,A,D,C,B)}
  mesh(sides,side,mode);mesh(face,top,mode);
 }
 function rod(cx:number,cz:number,y:number,angle:number,start:number,end:number,r0:number,r1:number,tex:WebGLTexture,mode=2){
  const co=Math.cos(angle),si=Math.sin(angle),data:number[]=[];
  const p=(l:number,r:number,t:number,u:number):Vertex=>({p:[cx+l*co-r*Math.cos(t)*si,y+r*Math.sin(t),cz+l*si+r*Math.cos(t)*co],uv:[u,t/(2*Math.PI)]});
  for(let i=0;i<20;i++){const a=i/20*2*Math.PI,b=(i+1)/20*2*Math.PI;quad(data,p(start,r0,a,0),p(start,r0,b,0),p(end,r1,b,1),p(end,r1,a,1))}
  mesh(data,tex,mode);
 }
 // A single fixed arrangement, front edge is positive Z.
 grid(0,0,34,34,-.026,0,wood);
 grid(-2.62,-2.37,6.35,4.15,-.012,-.085,shadow,1);
 grid(3.18,-2.16,3.51,4.04,-.011,.045,shadow,1);
 grid(2.32,1.02,2.62,2.66,-.009,-.12,shadow,1);
 grid(-.58,1.15,5.94,4.25,-.007,-.105,shadow,1);
 grid(.02,3.42,4.16,.52,-.005,-.09,shadow,1);
 box(-2.68,-2.44,5.92,3.72,0,.105,-.085,metal,metal,2,.12);
 box(-2.68,-2.44,5.92,3.72,.11,.095,-.085,texture(laptopTexture()),metal,2,.12);
 box(3.16,-2.18,3.02,3.65,0,.075,.045,leather,leather,0,.13);
 box(3.16,-2.18,2.91,3.54,.075,.235,.045,edge,edge,0,.09);
 box(3.16,-2.18,3.04,3.65,.31,.09,.045,texture(plannerTexture()),leather,0,.13);
 box(3.91,-2.12,1.52,.46,.4,.077,.045,leather,leather,0,.22);
 box(4.23,-2.12,.18,.54,.476,.042,.045,black,leather,0,.06);
 grid(2.37,1.04,2.45,2.45,.018,-.12,yellow);
 grid(-.60,1.18,5.85,4.09,.024,-.105,shadow,1);
 grid(-.67,1.07,5.48,3.72,.044,-.105,paperTex,0,.24,32);
 // Cylindrical pen, tapered metal nib, grip and clip.
 rod(.02,3.42,.105,-.09,-1.91,-1.54,.012,.076,silver);
 rod(.02,3.42,.105,-.09,-1.54,-.75,.083,.083,black,0);
 for(let i=0;i<11;i++)rod(.02,3.42,.105,-.09,-1.49+i*.063,-1.47+i*.063,.087,.087,black,0);
 rod(.02,3.42,.105,-.09,-.75,1.35,.071,.071,barrel);
 rod(.02,3.42,.105,-.09,1.35,1.72,.083,.078,black,0);
 rod(.02,3.42,.105,-.09,1.72,1.91,.053,.04,black,0);
 box(.97,3.33,.85,.10,.18,.038,-.09,black,black,0,.045);
 gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(.35,.30,.25,1);
 function render(p:number,w:number,h:number,portrait:boolean,balanced:boolean){if(disposed||gl!.isContextLost())return;const ratio=Math.min(window.devicePixelRatio||1,balanced?1.15:1.65,1500/Math.max(w,h));const W=Math.max(1,Math.round(w*ratio)),H=Math.max(1,Math.round(h*ratio));if(canvasEl.width!==W||canvasEl.height!==H){canvasEl.width=W;canvasEl.height=H}gl!.viewport(0,0,W,H);gl!.clear(gl!.COLOR_BUFFER_BIT|gl!.DEPTH_BUFFER_BIT);const cam=deskCamera(p,w/h,portrait);gl!.uniform3fv(uniforms.uEye,cam.eye);gl!.uniform3fv(uniforms.uRight,cam.right);gl!.uniform3fv(uniforms.uUp,cam.up);gl!.uniform3fv(uniforms.uForward,cam.forward);gl!.uniform1f(uniforms.uTan,cam.tan);gl!.uniform1f(uniforms.uAspect,w/h);gl!.uniform1i(uniforms.uTex,0);
 for(const m of meshes){gl!.depthMask(m.mode!==1);gl!.uniform1i(uniforms.uMode,m.mode);gl!.bindTexture(gl!.TEXTURE_2D,m.texture);gl!.bindBuffer(gl!.ARRAY_BUFFER,m.buffer);gl!.enableVertexAttribArray(aPos);gl!.vertexAttribPointer(aPos,3,gl!.FLOAT,false,32,0);gl!.enableVertexAttribArray(aNormal);gl!.vertexAttribPointer(aNormal,3,gl!.FLOAT,false,32,12);gl!.enableVertexAttribArray(aUV);gl!.vertexAttribPointer(aUV,2,gl!.FLOAT,false,32,24);gl!.drawArrays(gl!.TRIANGLES,0,m.count)}gl!.depthMask(true)}
 return {render,dispose(){disposed=true;signature.onload=null;for(const m of meshes)gl.deleteBuffer(m.buffer);for(const t of textures)gl.deleteTexture(t);gl.deleteProgram(program)}};
}
