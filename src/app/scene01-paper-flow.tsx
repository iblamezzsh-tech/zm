"use client";
import {useEffect,useRef} from "react";
import {getNodeMotionTier,motionQualityEvent,sceneQualityEvent} from "./motion-quality-store";

// The texture is the existing original ZM cartography. A single shader bends
// that texture locally; no procedural contour generation or copied artwork.
export const PAPER_VERTEX=`attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
export const PAPER_FRAGMENT=`
precision mediump float;
uniform sampler2D u_map;
uniform vec2 u_size;
uniform vec2 u_fit;
uniform float u_time;
uniform vec4 u_wakes[4];
void main(){
 vec2 uv=vec2(gl_FragCoord.x/u_size.x,1.-gl_FragCoord.y/u_size.y);
 float aspect=u_size.x/u_size.y;
 vec2 metric=vec2(aspect,1.);
 vec2 p=uv*metric;
 vec2 q=p+vec2(.010*sin(u_time*.39+uv.y*3.1),.013*cos(u_time*.31+uv.x*4.2));
 float wash=0.;
 for(int i=0;i<4;i++){
  vec4 w=u_wakes[i];
  vec2 d=p-w.xy*metric;
  float r=length(d);
  float envelope=exp(-r*r/0.0196)*w.z;
  float wave=sin(r*24.-w.w*3.2);
  q+=d/(r+.045)*(.023*wave+.014)*envelope;
  wash=max(wash,envelope*(.67+.33*wave));
 }
 vec2 tex=(q/metric-.5)*u_fit+.5;
 float line=texture2D(u_map,clamp(tex,0.,1.)).a;
 // Ink stays very fine. A transient neutral sage wash belongs to the
 // moving surface, not a colored blob or neon glow.
 float ink=line*(.26+.17*wash);
 float veil=wash*.075;
 float a=ink+veil*(1.-ink);
 vec3 rgb=(vec3(.38,.43,.35)*ink+vec3(.68,.71,.65)*veil*(1.-ink))/max(a,.0001);
 gl_FragColor=vec4(rgb,a);
}`;
export default function PaperFlow(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current,found=canvas?.closest<HTMLElement>(".hero-composition"),scene=canvas?.closest<HTMLElement>("#film-present");
  if(!canvas||!found||!scene)return;
  const stage:HTMLElement=found,opening:HTMLElement=scene;
  const motion=matchMedia("(prefers-reduced-motion: reduce)"),desktop=matchMedia("(min-width:900px) and (pointer:fine)");
  if(!desktop.matches||motion.matches)return;
  const gl=canvas.getContext("webgl",{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:"low-power"});
  if(!gl)return;
  const shader=(kind:number,source:string)=>{
   const s=gl.createShader(kind);if(!s)return null;gl.shaderSource(s,source);gl.compileShader(s);
   if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);return null}return s;
  };
  const vertex=shader(gl.VERTEX_SHADER,PAPER_VERTEX),fragment=shader(gl.FRAGMENT_SHADER,PAPER_FRAGMENT);
  if(!vertex||!fragment){if(vertex)gl.deleteShader(vertex);if(fragment)gl.deleteShader(fragment);return}
  const program=gl.createProgram(),buffer=gl.createBuffer(),texture=gl.createTexture();
  if(!program||!buffer||!texture){if(program)gl.deleteProgram(program);if(buffer)gl.deleteBuffer(buffer);if(texture)gl.deleteTexture(texture);gl.deleteShader(vertex);gl.deleteShader(fragment);return}
  gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteBuffer(buffer);gl.deleteTexture(texture);gl.deleteShader(vertex);gl.deleteShader(fragment);return}
  gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,"a");gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const size=gl.getUniformLocation(program,"u_size"),fit=gl.getUniformLocation(program,"u_fit"),time=gl.getUniformLocation(program,"u_time"),wake=gl.getUniformLocation(program,"u_wakes[0]");
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.uniform1i(gl.getUniformLocation(program,"u_map"),0);
  const img=new Image();let ready=false,lost=false,disposed=false,visible=false,raf=0,last=0,elapsed=0,drawn=0,rect=stage.getBoundingClientRect(),prev:{x:number;y:number}|null=null,lastSplat=0;
  const wakes=Array.from({length:4},()=>({x:.5,y:.5,strength:0,age:0}));const data=new Float32Array(16);
  const permit=()=>!disposed&&!lost&&ready&&visible&&!motion.matches&&!document.hidden&&desktop.matches&&getNodeMotionTier(stage)==="cinematic"&&opening.dataset.creditStage!=="true";
  function sizeCanvas(){
   rect=stage.getBoundingClientRect();const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;
   const density=Math.min(1.25,devicePixelRatio||1,Math.sqrt(1350000/(w*h)));
   canvas!.width=Math.max(1,Math.round(w*density));canvas!.height=Math.max(1,Math.round(h*density));
   gl!.viewport(0,0,canvas!.width,canvas!.height);gl!.uniform2f(size,canvas!.width,canvas!.height);
   const ratio=1500/940,view=w/h,overscan=.86;
   gl!.uniform2f(fit,Math.min(1,view/ratio)*overscan,Math.min(1,ratio/view)*overscan);
  }
  function tick(now:number){
   raf=0;if(!permit()){stop();return}
   // Cap work at display cadence and use just one fullscreen texture pass.
   const dt=last?Math.min(.05,(now-last)/1000):1/60;last=now;elapsed+=dt;
   wakes.forEach((w,i)=>{w.age+=dt;w.strength*=Math.exp(-dt*1.55);if(w.strength<.003)w.strength=0;data.set([w.x,w.y,w.strength,w.age],i*4)});
   if(now-drawn>=1000/60-1||!drawn){
    drawn=now;gl!.uniform1f(time,elapsed);gl!.uniform4fv(wake,data);gl!.drawArrays(gl!.TRIANGLES,0,3);canvas!.dataset.ready="true";
   }
   raf=requestAnimationFrame(tick);
  }
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;drawn=0;prev=null;for(const w of wakes)w.strength=0;delete canvas!.dataset.ready}
  function sync(){if(permit()){if(!raf)raf=requestAnimationFrame(tick)}else stop()}
  function move(e:PointerEvent){
   if(!permit()||e.pointerType!=="mouse")return;
   const x=Math.max(0,Math.min(1,(e.clientX-rect.left)/Math.max(1,rect.width))),y=Math.max(0,Math.min(1,(e.clientY-rect.top)/Math.max(1,rect.height)));
   const delta=prev?Math.hypot((x-prev.x)*rect.width,(y-prev.y)*rect.height):0;prev={x,y};
   const now=performance.now();if(delta<1.3||now-lastSplat<55)return;lastSplat=now;
   const w=wakes.reduce((a,b)=>a.strength<b.strength?a:b);w.x=x;w.y=y;w.age=0;w.strength=Math.min(.95,.37+delta/75);
  }
  const ac=new AbortController(),opts={signal:ac.signal,passive:true};
  const ro=new ResizeObserver(()=>{sizeCanvas();sync()});ro.observe(stage);
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()},{threshold:.03});io.observe(stage);
  const mo=new MutationObserver(sync);mo.observe(opening,{attributes:true,attributeFilter:["data-credit-stage","data-scene-tier"]});
  stage.addEventListener("pointermove",move,opts);stage.addEventListener("pointerleave",()=>{prev=null},opts);stage.addEventListener("pointerenter",()=>{rect=stage.getBoundingClientRect();prev=null},opts);
  window.addEventListener(motionQualityEvent,sync,opts);window.addEventListener(sceneQualityEvent,sync,opts);document.addEventListener("visibilitychange",sync,opts);desktop.addEventListener("change",sync,opts);motion.addEventListener("change",sync,opts);
  canvas.addEventListener("webglcontextlost",e=>{e.preventDefault();lost=true;stop()},{signal:ac.signal});
  img.onload=()=>{if(disposed||lost)return;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);ready=true;sizeCanvas();sync()};
  img.src="/atmosphere/home-contours-v80.svg";
  sizeCanvas();sync();
  return()=>{disposed=true;stop();img.onload=null;ac.abort();ro.disconnect();io.disconnect();mo.disconnect();gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment)};
 },[]);
 return <canvas ref={ref} className="studio-paper-flow" aria-hidden="true"/>;
}
