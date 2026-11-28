"use client";
import {useEffect,useRef} from "react";
import {heroFields} from "./liquid-field";
import {getNodeMotionTier,motionQualityEvent,sceneQualityEvent} from "./motion-quality-store";

// One field, two worlds. The very same density image that reveals the
// registered graduation portrait reveals an alternate cartographic surface.
export const PAPER_VERTEX=`attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
export const PAPER_FRAGMENT=`
precision mediump float;
uniform sampler2D u_map;
uniform sampler2D u_ink;
uniform vec2 u_size;
uniform vec2 u_fit;
uniform vec4 u_plane;
uniform vec2 u_eye;
uniform float u_time;
uniform float u_active;
float mapInk(vec2 p){return texture2D(u_map,clamp(p,.001,.999)).a;}
void main(){
 vec2 uv=vec2(gl_FragCoord.x/u_size.x,1.-gl_FragCoord.y/u_size.y);
 vec2 q=uv-.5;
 // The original map slowly flows on a broad surface. This is not a
 // newly generated pattern, and the palette remains restrained.
 vec2 flow=vec2(.028*sin(u_time*.42+uv.y*4.7)+.013*cos(u_time*.31+uv.x*3.1),
                .020*cos(u_time*.37+uv.x*4.3)+.009*sin(u_time*.29+uv.y*4.));
 vec2 d=uv-u_eye;
 float aspect=u_size.x/u_size.y;
 float r=length(d*vec2(aspect,1.));
 float local=exp(-r*r*14.)*u_active;
 vec2 refraction=d/(r+.09)*sin(r*19.-u_time*2.1)*.019*local;
 vec2 tex=(q+flow+refraction)*u_fit+.5;
 float line=mapInk(tex);
 vec2 maskUV=(uv-u_plane.xy)/max(u_plane.zw,vec2(.001));
 float within=step(0.,maskUV.x)*step(maskUV.x,1.)*step(0.,maskUV.y)*step(maskUV.y,1.);
 float density=texture2D(u_ink,clamp(maskUV,0.,1.)).a*within;
 float reveal=smoothstep(.04,.91,density);
 // Keep the typography lanes light. The saturated forest material exists
 // only near the photograph, dissolving into a subtle translucent wash.
 float centre=smoothstep(.17,.39,uv.x)*(1.-smoothstep(.61,.83,uv.x));
 float strength=reveal*(.22+.72*centre);
 vec2 futureTex=tex+vec2(.018,-.025)*reveal;
 float altLine=mapInk(futureTex);
 float l=.5+.5*sin(uv.x*3.7+uv.y*2.3+u_time*.27);
 vec3 green=mix(vec3(.26,.32,.25),vec3(.49,.55,.40),l);
 vec3 future=mix(green,vec3(.86,.79,.50),altLine*.62);
 float original=line*.32*(1.-strength);
 float a=strength+original*(1.-strength);
 vec3 color=(future*strength+vec3(.38,.43,.34)*original*(1.-strength))/max(a,.0001);
 gl_FragColor=vec4(color,a);
}`;
export default function PaperFlow(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current,stage=canvas?.closest<HTMLElement>(".hero-composition"),opening=canvas?.closest<HTMLElement>("#film-present");
  if(!canvas||!stage||!opening)return;
  const plane=stage.querySelector<HTMLElement>(".hero-portrait-plane");if(!plane)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)"),desktop=matchMedia("(min-width:900px) and (pointer:fine)");
  if(!desktop.matches||reduced.matches)return;
  const gl=canvas.getContext("webgl",{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:"low-power"});
  if(!gl)return;
  function compile(kind:number,source:string){const sh=gl!.createShader(kind);if(!sh)return null;gl!.shaderSource(sh,source);gl!.compileShader(sh);if(!gl!.getShaderParameter(sh,gl!.COMPILE_STATUS)){gl!.deleteShader(sh);return null}return sh}
  const vertex=compile(gl.VERTEX_SHADER,PAPER_VERTEX),fragment=compile(gl.FRAGMENT_SHADER,PAPER_FRAGMENT);
  if(!vertex||!fragment){if(vertex)gl.deleteShader(vertex);if(fragment)gl.deleteShader(fragment);return}
  const program=gl.createProgram(),buffer=gl.createBuffer(),map=gl.createTexture(),ink=gl.createTexture();
  if(!program||!buffer||!map||!ink){if(program)gl.deleteProgram(program);if(buffer)gl.deleteBuffer(buffer);if(map)gl.deleteTexture(map);if(ink)gl.deleteTexture(ink);gl.deleteShader(vertex);gl.deleteShader(fragment);return}
  gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteBuffer(buffer);gl.deleteTexture(map);gl.deleteTexture(ink);gl.deleteShader(vertex);gl.deleteShader(fragment);return}
  gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,"a");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const uniform=(key:string)=>gl.getUniformLocation(program,key);
  const size=uniform("u_size"),fit=uniform("u_fit"),time=uniform("u_time"),planeUniform=uniform("u_plane"),eye=uniform("u_eye"),active=uniform("u_active");
  function initTex(unit:number,texture:WebGLTexture,key:string){gl!.activeTexture(unit);gl!.bindTexture(gl!.TEXTURE_2D,texture);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_WRAP_S,gl!.CLAMP_TO_EDGE);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_WRAP_T,gl!.CLAMP_TO_EDGE);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_MIN_FILTER,gl!.LINEAR);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_MAG_FILTER,gl!.LINEAR);gl!.texImage2D(gl!.TEXTURE_2D,0,gl!.RGBA,1,1,0,gl!.RGBA,gl!.UNSIGNED_BYTE,new Uint8Array(4));gl!.uniform1i(uniform(key),unit-gl!.TEXTURE0)}
  initTex(gl.TEXTURE0,map,"u_map");initTex(gl.TEXTURE1,ink,"u_ink");
  const image=new Image();let loaded=false,lost=false,disposed=false,visible=false,raf=0,last=0,t=0,lastDraw=0,rect=stage.getBoundingClientRect(),x=.5,y=.5,tx=.5,ty=.5,a=0,ta=0,dirty=true,hadInk=false;
  let bytes:Uint8ClampedArray|null=null;
  const permit=()=>!disposed&&!lost&&loaded&&visible&&!document.hidden&&!reduced.matches&&desktop.matches&&getNodeMotionTier(stage)==="cinematic"&&opening.dataset.creditStage!=="true";
  function resize(){rect=stage!.getBoundingClientRect();const w=stage!.clientWidth,h=stage!.clientHeight;if(!w||!h)return;
   const d=Math.min(devicePixelRatio||1,1.2,Math.sqrt(1250000/(w*h)));
   canvas!.width=Math.max(1,Math.round(w*d));canvas!.height=Math.max(1,Math.round(h*d));
   gl!.viewport(0,0,canvas!.width,canvas!.height);gl!.uniform2f(size,canvas!.width,canvas!.height);
   const ratio=1500/940,view=w/h;gl!.uniform2f(fit,Math.min(1,view/ratio)*.85,Math.min(1,ratio/view)*.85);dirty=true;
  }
  function upload(){
   const field=heroFields.get(stage!);
   if(!field?.hasInk){if(hadInk){gl!.activeTexture(gl!.TEXTURE1);gl!.bindTexture(gl!.TEXTURE_2D,ink);gl!.texImage2D(gl!.TEXTURE_2D,0,gl!.RGBA,1,1,0,gl!.RGBA,gl!.UNSIGNED_BYTE,new Uint8Array(4));hadInk=false}dirty=false;return}
   if(!bytes||bytes.length!==field.width*field.height*4)bytes=new Uint8ClampedArray(field.width*field.height*4);
   field.writeMask(bytes);gl!.activeTexture(gl!.TEXTURE1);gl!.bindTexture(gl!.TEXTURE_2D,ink);
   gl!.texImage2D(gl!.TEXTURE_2D,0,gl!.RGBA,field.width,field.height,0,gl!.RGBA,gl!.UNSIGNED_BYTE,bytes);hadInk=true;dirty=false;
  }
  function tick(now:number){raf=0;if(!permit()){stop();return}
   const dt=last?Math.min(.05,(now-last)/1000):1/60;last=now;t+=dt;
   const k=1-Math.exp(-dt*7);x+=(tx-x)*k;y+=(ty-y)*k;a+=(ta-a)*k;
   if(now-lastDraw>=1000/(hadInk||dirty||a>.02?60:30)-1||!lastDraw){
    lastDraw=now;if(dirty)upload();
    const b=plane!.getBoundingClientRect(),r=stage!.getBoundingClientRect();
    gl!.uniform4f(planeUniform,(b.left-r.left)/Math.max(1,r.width),(b.top-r.top)/Math.max(1,r.height),b.width/Math.max(1,r.width),b.height/Math.max(1,r.height));
    gl!.uniform1f(time,t);gl!.uniform2f(eye,x,y);gl!.uniform1f(active,a);gl!.drawArrays(gl!.TRIANGLES,0,3);
    canvas!.dataset.ready="true";canvas!.dataset.ink=String(hadInk);
   }raf=requestAnimationFrame(tick)
  }
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;lastDraw=0;ta=a=0;dirty=true;delete canvas!.dataset.ready;delete canvas!.dataset.ink}
  function sync(){if(permit()){if(!raf)raf=requestAnimationFrame(tick)}else stop()}
  function move(e:PointerEvent){if(!permit()||e.pointerType!=="mouse")return;tx=Math.max(0,Math.min(1,(e.clientX-rect.left)/Math.max(1,rect.width)));ty=Math.max(0,Math.min(1,(e.clientY-rect.top)/Math.max(1,rect.height)));ta=1}
  const ac=new AbortController(),opts={signal:ac.signal,passive:true};
  const ro=new ResizeObserver(()=>{resize();sync()});ro.observe(stage);
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()},{threshold:.03});io.observe(stage);
  const mo=new MutationObserver(sync);mo.observe(opening,{attributes:true,attributeFilter:["data-credit-stage","data-scene-tier"]});
  stage.addEventListener("zm-studio-ink-frame",()=>{dirty=true},opts);
  stage.addEventListener("pointermove",move,opts);stage.addEventListener("pointerenter",()=>{rect=stage.getBoundingClientRect()},opts);stage.addEventListener("pointerleave",()=>{ta=0},opts);
  window.addEventListener(motionQualityEvent,sync,opts);window.addEventListener(sceneQualityEvent,sync,opts);document.addEventListener("visibilitychange",sync,opts);desktop.addEventListener("change",sync,opts);reduced.addEventListener("change",sync,opts);
  canvas.addEventListener("webglcontextlost",e=>{e.preventDefault();lost=true;stop()},{signal:ac.signal});
  image.onload=()=>{if(disposed||lost)return;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,map);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);loaded=true;resize();sync()};image.src="/atmosphere/home-contours-v80.svg";
  resize();sync();
  return()=>{disposed=true;stop();image.onload=null;ac.abort();ro.disconnect();io.disconnect();mo.disconnect();gl.deleteTexture(map);gl.deleteTexture(ink);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment)};
 },[]);
 return <canvas ref={ref} className="studio-paper-flow" aria-hidden="true"/>;
}
