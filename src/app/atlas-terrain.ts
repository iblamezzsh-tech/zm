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
