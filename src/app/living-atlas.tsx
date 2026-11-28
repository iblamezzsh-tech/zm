"use client";
import {useEffect,useRef} from "react";
import {getNodeMotionTier,motionQualityEvent,sceneQualityEvent} from "./motion-quality-store";

export const ATLAS_VERTEX = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
export const ATLAS_FRAGMENT = `
#extension GL_OES_standard_derivatives : enable
precision mediump float;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_active;
float terrain(vec2 q,float t){
 vec2 w=q+vec2(.15*sin(q.y*3.1+t*.49),.20*cos(q.x*2.15-t*.37));
 return .64*sin(w.x*2.6+w.y*1.28+t*.30)
 +.48*cos(w.y*3.5-w.x*.92-t*.34)
 +.29*sin(w.x*4.1+w.y*2.8+t*.21);
}
void main(){
 vec2 uv=gl_FragCoord.xy/u_res;
 vec2 p=(uv-.5)*vec2(u_res.x/u_res.y,1.);
 vec2 m=(u_mouse-.5)*vec2(u_res.x/u_res.y,1.);
 float t=u_time;
 vec2 d=p-m;float r=length(d);
 float influence=u_active*exp(-r*r*9.);
 vec2 q=p+vec2(.09*sin(t*.47),.07*cos(t*.37));
 q+=d*influence*.22*sin(r*12.-t*1.9);
 float h=terrain(q,t);
 float levels=h*5.2;
 float edge=abs(fract(levels+.5)-.5);
 float aa=clamp(fwidth(levels)*.72,.008,.19);
 float line=1.-smoothstep(.018,.018+aa,edge);
 float broad=.5+.5*sin(p.x*2.9+p.y*1.7+t*.45);
 float glow=exp(-dot(p-vec2(.60*sin(t*.35),.30*cos(t*.41)),p-vec2(.60*sin(t*.35),.30*cos(t*.41)))*2.7);
 vec3 paper=vec3(.958,.946,.906),sage=vec3(.79,.835,.70),gold=vec3(.96,.876,.64);
 vec3 col=mix(paper,sage,.20+.23*broad);
 col=mix(col,paper,glow*.58);
 col=mix(col,gold,influence*.30);
 float major=1.-smoothstep(.13,.13+aa,abs(fract(levels/4.+.5)-.5)*4.);
 col=mix(col,vec3(.37,.43,.30),line*(.27+.12*major+.19*influence));
 gl_FragColor=vec4(col,1.);
}`;

export default function LivingAtlas(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current,stage=canvas?.closest<HTMLElement>(".hero-composition"),opening=canvas?.closest<HTMLElement>("#film-present");
  if(!canvas||!stage||!opening)return;
  const media=matchMedia("(prefers-reduced-motion: reduce)"),wide=matchMedia("(min-width:900px)");
  const gl=canvas.getContext("webgl",{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:"low-power"});
  if(!gl||!gl.getExtension("OES_standard_derivatives"))return;
  function compile(type:number,source:string){const s=gl!.createShader(type);if(!s)return null;gl!.shaderSource(s,source);gl!.compileShader(s);if(!gl!.getShaderParameter(s,gl!.COMPILE_STATUS)){gl!.deleteShader(s);return null}return s}
  const vert=compile(gl.VERTEX_SHADER,ATLAS_VERTEX),frag=compile(gl.FRAGMENT_SHADER,ATLAS_FRAGMENT);
  if(!vert||!frag){if(vert)gl.deleteShader(vert);if(frag)gl.deleteShader(frag);return}
  const program=gl.createProgram(),buffer=gl.createBuffer();if(!program||!buffer)return;
  gl.attachShader(program,vert);gl.attachShader(program,frag);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteShader(vert);gl.deleteShader(frag);gl.deleteBuffer(buffer);return}
  gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,"a");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const res=gl.getUniformLocation(program,"u_res"),mouse=gl.getUniformLocation(program,"u_mouse"),time=gl.getUniformLocation(program,"u_time"),active=gl.getUniformLocation(program,"u_active");
  let raf=0,visible=false,disposed=false,lost=false,last=0,elapsed=0,lastDraw=0,rect=stage.getBoundingClientRect(),x=.5,y=.5,tx=.5,ty=.5,a=0,ta=0;
  function permitted(){const tier=getNodeMotionTier(stage);return !disposed&&!lost&&visible&&!document.hidden&&!media.matches&&wide.matches&&tier==="cinematic"&&opening!.dataset.creditStage!=="true"}
  function resize(){rect=stage!.getBoundingClientRect();const w=stage!.clientWidth,h=stage!.clientHeight;if(!w||!h)return;const d=Math.min(.95,Math.sqrt(740000/(w*h)));canvas!.width=Math.max(1,Math.round(w*d));canvas!.height=Math.max(1,Math.round(h*d));gl!.viewport(0,0,canvas!.width,canvas!.height);gl!.uniform2f(res,canvas!.width,canvas!.height)}
  function tick(now:number){raf=0;if(!permitted()){stop();return}const dt=last?Math.min(.05,(now-last)/1000):1/60;last=now;elapsed+=dt;const k=1-Math.exp(-dt*6);x+=(tx-x)*k;y+=(ty-y)*k;a+=(ta-a)*k;
   if(now-lastDraw>=1000/60-1||!lastDraw){lastDraw=now;gl!.uniform1f(time,elapsed);gl!.uniform2f(mouse,x,y);gl!.uniform1f(active,a);gl!.drawArrays(gl!.TRIANGLES,0,3);canvas!.dataset.ready="true";canvas!.dataset.running="true"}
   raf=requestAnimationFrame(tick)
  }
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;lastDraw=0;canvas!.dataset.running="false";if(media.matches||!wide.matches||lost||getNodeMotionTier(stage)!=="cinematic")delete canvas!.dataset.ready}
  function sync(){if(permitted()){if(!raf)raf=requestAnimationFrame(tick)}else stop()}
  function move(e:PointerEvent){if(e.pointerType!=="mouse"||!permitted())return;tx=Math.max(0,Math.min(1,(e.clientX-rect.left)/Math.max(1,rect.width)));ty=1-Math.max(0,Math.min(1,(e.clientY-rect.top)/Math.max(1,rect.height)));ta=1}
  function leave(){ta=0}
  function contextLost(e:Event){e.preventDefault();lost=true;stop();delete canvas!.dataset.ready}
  function contextRestored(){lost=true;delete canvas!.dataset.ready;stop()} // safe CSS fallback until a fresh mount
  const ro=new ResizeObserver(()=>{resize();sync()});ro.observe(stage);
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()},{threshold:.03});io.observe(stage);
  const mo=new MutationObserver(sync);mo.observe(opening,{attributes:true,attributeFilter:["data-credit-stage","data-scene-tier"]});
  const ac=new AbortController(),opts={signal:ac.signal,passive:true};stage.addEventListener("pointermove",move,opts);stage.addEventListener("pointerleave",leave,opts);stage.addEventListener("pointerenter",()=>{rect=stage.getBoundingClientRect()},opts);
  document.addEventListener("visibilitychange",sync,opts);window.addEventListener(motionQualityEvent,sync,opts);window.addEventListener(sceneQualityEvent,sync,opts);media.addEventListener("change",sync,opts);wide.addEventListener("change",sync,opts);
  canvas.addEventListener("webglcontextlost",contextLost,{signal:ac.signal});canvas.addEventListener("webglcontextrestored",contextRestored,{signal:ac.signal});
  resize();sync();
  return()=>{disposed=true;stop();ac.abort();ro.disconnect();io.disconnect();mo.disconnect();gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vert);gl.deleteShader(frag);delete canvas.dataset.ready}
 },[]);
 return <canvas ref={ref} className="zm-atlas-webgl" aria-hidden="true"/>;
}
