// Original procedural WebGL landscape. A single scene follows scroll, not time.
const VERTEX="attribute vec2 a; void main(){gl_Position=vec4(a,0.,1.);}";
const FRAGMENT=`
precision mediump float;
uniform vec2 resolution;
uniform float progress;
uniform float breath;
float wave(vec2 p){
 return sin(p.x*.74+sin(p.y*.53)*1.5)*.72
       +sin(p.y*.91+p.x*.43)*.38+cos(length(p-vec2(2.,-2.))*1.65)*.24;
}
void main(){
 vec2 uv=gl_FragCoord.xy/resolution;
 vec2 screen=(uv-.5)*vec2(resolution.x/resolution.y,1.);
 float a=smoothstep(.16,.43,progress);
 float b=smoothstep(.57,.87,progress);
 vec3 yellow=vec3(1.,.855,.141), dark=vec3(.114,.145,.098), cream=vec3(.957,.945,.91);
 vec3 bg=mix(mix(yellow,dark,a),cream,b);
 vec3 ink=mix(mix(vec3(.30,.25,.055),vec3(.85,.79,.32),a),vec3(.35,.42,.27),b);
 // Perspective projection of an undulating contour surface, advancing through the map.
 float horizon=.48+.08*sin(progress*3.14159);
 float depth=1./max(.09,abs(uv.y-horizon)+.13);
 vec2 ground=vec2(screen.x*depth*2.2+progress*2.4,depth*1.15-progress*8.4);
 ground.x+=sin(ground.y*.21+progress*2.4)*1.05;
 float height=wave(ground+vec2(breath*.016,0.));
 float level=height*5.8+ground.y*.36;
 float width=.035+.045*smoothstep(3.,9.,depth);
 float line=1.-smoothstep(width,width+.075,abs(fract(level+.5)-.5));
 float crossline=1.-smoothstep(.014,.06,abs(fract(ground.x*.45+.5)-.5));
 float fade=smoothstep(.13,.55,uv.x)*smoothstep(.04,.20,abs(uv.y-horizon));
 float vignette=1.-smoothstep(.14,.88,length(screen*vec2(.72,1.2)));
 vec3 color=mix(bg,bg*mix(.92,1.03,vignette),.6);
 color=mix(color,ink,(line*.33+crossline*.075)*fade);
 // A narrow luminous route along the terrain; scroll position determines its heading.
 float route=1.-smoothstep(.018,.058,abs(ground.x-(2.5+.7*sin(ground.y*.64+progress*4.))));
 color=mix(color,mix(vec3(.28,.31,.16),yellow,a*(1.-b)),route*.70*fade);
 gl_FragColor=vec4(color,1.);
}
`;
export function createAtlasTerrain(canvas:HTMLCanvasElement){
 const gl=canvas.getContext("webgl",{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:"low-power"});
 if(!gl)return null;
 function compile(type:number,source:string){
  const shader=gl!.createShader(type);if(!shader)return null;
  gl!.shaderSource(shader,source);gl!.compileShader(shader);
  if(!gl!.getShaderParameter(shader,gl!.COMPILE_STATUS)){gl!.deleteShader(shader);return null}return shader;
 }
 const vert=compile(gl.VERTEX_SHADER,VERTEX),frag=compile(gl.FRAGMENT_SHADER,FRAGMENT);
 if(!vert||!frag){if(vert)gl.deleteShader(vert);if(frag)gl.deleteShader(frag);return null}
 const program=gl.createProgram();if(!program){gl.deleteShader(vert);gl.deleteShader(frag);return null}
 gl.attachShader(program,vert);gl.attachShader(program,frag);gl.linkProgram(program);
 gl.deleteShader(vert);gl.deleteShader(frag);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);return null}
 const buffer=gl.createBuffer();if(!buffer){gl.deleteProgram(program);return null}
 gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.useProgram(program);
 const attr=gl.getAttribLocation(program,"a");gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
 const resolution=gl.getUniformLocation(program,"resolution"),progress=gl.getUniformLocation(program,"progress"),breath=gl.getUniformLocation(program,"breath");
 let last=-1,lastW=0,lastH=0,lost=false;
 const lose=(e:Event)=>{e.preventDefault();lost=true;canvas.style.visibility="hidden"};
 canvas.addEventListener("webglcontextlost",lose);
 function draw(p:number){
  if(lost)return;
  const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
  const factor=Math.min(1,1050/w,650/h);
  const W=Math.round(w*factor),H=Math.round(h*factor);
  if(W===lastW&&H===lastH&&Math.abs(p-last)<.0004)return;
  if(W!==lastW||H!==lastH){canvas.width=W;canvas.height=H;gl!.viewport(0,0,W,H);lastW=W;lastH=H}
  last=p;canvas.style.visibility="visible";gl!.useProgram(program);gl!.uniform2f(resolution,W,H);gl!.uniform1f(progress,p);gl!.uniform1f(breath,0);gl!.drawArrays(gl!.TRIANGLES,0,3);
 }
 return {draw,dispose(){canvas.removeEventListener("webglcontextlost",lose);gl.deleteBuffer(buffer);gl.deleteProgram(program)}};
}

// Render a moving perspective map even when WebGL is unavailable. Separate canvas
// because a failed WebGL context cannot be changed into a 2D context.
export function createAtlasFallback(canvas:HTMLCanvasElement){
 const ctx=canvas.getContext("2d",{alpha:false});if(!ctx)return null;
 const clamp=(v:number)=>Math.max(0,Math.min(1,v));
 const smooth=(a:number,b:number,p:number)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t)};
 const mix=(a:number[],b:number[],t:number)=>a.map((v,i)=>v+(b[i]-v)*t);
 const rgb=(a:number[])=>"rgb("+a.map(Math.round).join(",")+")";
 let previous=-1,oldW=0,oldH=0;
 function draw(p:number){
  const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight),f=Math.min(1,1100/w,700/h),W=Math.round(w*f),H=Math.round(h*f);
  if(Math.abs(previous-p)<.0004&&W===oldW&&H===oldH)return;
  previous=p;oldW=W;oldH=H;canvas.width=W;canvas.height=H;
  const a=smooth(.16,.43,p),b=smooth(.57,.87,p);
  const paper=mix(mix([255,218,36],[29,37,25],a),[244,241,232],b);
  const ink=mix(mix([77,64,14],[216,201,82],a),[89,107,69],b);
  ctx!.fillStyle=rgb(paper);ctx!.fillRect(0,0,W,H);
  const gradient=ctx!.createLinearGradient(W*.12,0,W*.68,H*.18);
  gradient.addColorStop(0,"rgba("+ink.map(Math.round).join(",")+",0)");
  gradient.addColorStop(1,"rgba("+ink.map(Math.round).join(",")+",0.34)");
  ctx!.strokeStyle=gradient;ctx!.lineWidth=.95;
  const horizon=H*(.48+.08*Math.sin(p*Math.PI));
  for(let j=-2;j<27;j++){
   // Perspective spacing contracts toward the horizon; wave phase follows camera travel.
   const d=(j+(p*11%1)+3)/28,depth=d*d;
   for(const sign of [-1,1]){
    ctx!.beginPath();
    for(let i=0;i<=100;i++){
     const u=i/100,x=u*W,amp=H*(.018+depth*.085);
     const y=horizon+sign*depth*H*.67+amp*(Math.sin(u*10+p*6+depth*5)+.45*Math.sin(u*21-depth*9+p*4));
     if(i===0)ctx!.moveTo(x,y);else ctx!.lineTo(x,y);
    }
    ctx!.stroke();
   }
  }
 }
 return {draw,dispose(){}};
}
