// V37: genuine world-space geometry, perspective camera, depth-tested WebGL.
// The CPU fallback projects exactly the same 3D geometry, not a 2D imitation.
type V=[number,number,number];
type Face={a:V;b:V;c:V;color:V;light:number};
type Edge={a:V;b:V;color:V};
const add=(a:V,b:V):V=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const sub=(a:V,b:V):V=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const dot=(a:V,b:V)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a:V,b:V):V=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=(a:V):V=>{const l=Math.hypot(...a)||1;return [a[0]/l,a[1]/l,a[2]/l]};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(a:number,b:number,x:number)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const mix=(a:V,b:V,t:number):V=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const cream:V=[.95,.94,.89],yellow:V=[1,.855,.141],olive:V=[.36,.42,.29],dark:V=[.115,.145,.1],brass:V=[.73,.59,.17];
const faces:Face[]=[],edges:Edge[]=[];
const sun=unit([-1,2,1]);
function tri(a:V,b:V,c:V,color:V){const normal=unit(cross(sub(b,a),sub(c,a)));faces.push({a,b,c,color,light:.63+.37*Math.abs(dot(normal,sun))})}
function quad(a:V,b:V,c:V,d:V,color:V){tri(a,b,c,color);tri(a,c,d,color)}
function edge(a:V,b:V,color:V){edges.push({a,b,color})}
function box(center:V,size:V,color:V,yaw=0){
 const [w,h,d]=size.map(v=>v/2),c=Math.cos(yaw),s=Math.sin(yaw);
 const p=(x:number,y:number,z:number):V=>add(center,[x*c-z*s,y,x*s+z*c]);
 const v=[p(-w,-h,-d),p(w,-h,-d),p(w,h,-d),p(-w,h,-d),p(-w,-h,d),p(w,-h,d),p(w,h,d),p(-w,h,d)];
 for(const [a,b,c,d] of [[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]])quad(v[a],v[b],v[c],v[d],color);
}
function torus(center:V,r:number,tube:number,color:V,tilt=0){
 const N=56,M=8,ct=Math.cos(tilt),st=Math.sin(tilt);
 function point(i:number,j:number):V{const a=i/N*Math.PI*2,b=j/M*Math.PI*2;const x=(r+tube*Math.cos(b))*Math.cos(a),y=(r+tube*Math.cos(b))*Math.sin(a),z=tube*Math.sin(b);return add(center,[x,y*ct-z*st,y*st+z*ct])}
 for(let i=0;i<N;i++)for(let j=0;j<M;j++)quad(point(i,j),point(i+1,j),point(i+1,j+1),point(i,j+1),color);
}
function terrainY(x:number,z:number){return -2.1+.28*Math.sin(x*.6+z*.25)+.20*Math.cos(z*.8-x*.33)}
// Sculptural landscape: sparse triangulated floor, raised contour strata, a route.
for(let z=-46;z<18;z+=2)for(let x=-11;x<11;x+=2){
 const p=(u:number,v:number):V=>[u,terrainY(u,v),v];
 const tint=.5+.5*Math.sin(x*.32+z*.27);
 quad(p(x,z),p(x+2,z),p(x+2,z+2),p(x,z+2),mix(olive,cream,.12+tint*.11));
 edge(p(x,z),p(x+2,z),[.52,.56,.39]);if(x%4===-3)edge(p(x,z),p(x,z+2),[.52,.56,.39]);
}
for(let j=0;j<110;j++){const z=17-j*.57,z2=z-.57;const x=1.25+Math.sin(z*.16)*.65,x2=1.25+Math.sin(z2*.16)*.65;quad([x-.035,terrainY(x,z)+.06,z],[x+.035,terrainY(x,z)+.06,z],[x2+.035,terrainY(x2,z2)+.06,z2],[x2-.035,terrainY(x2,z2)+.06,z2],yellow)}
// Origin: tangible rings on a stepped topographic plinth.
for(let i=0;i<6;i++)box([3.2,-1.93+i*.16,2],[3.9-i*.40,.16,3.25-i*.33],mix(olive,cream,i*.095),-.14);
torus([3.2,.36,2],1.38,.16,yellow,.13);
torus([3.2,.36,2],.96,.075,cream,-.55);
torus([3.2,.36,2],.49,.065,brass,.78);
box([3.2,-.86,2],[.28,.73,.28],brass);
// Memories: angled archival slabs, each built from real solid edges and paper layers.
for(let i=0;i<3;i++){
 const x=2.25+i*.93,z=-14-i*.48,y=-.15+i*.19,yaw=(i-1)*.19;
 box([x,y-.13,z],[1.8,2.55,.18],olive,yaw);
 box([x,y,z+.13],[1.58,2.29,.065],cream,yaw);
 box([x,y+.78,z+.18],[.86,.055,.04],brass,yaw);
 for(let j=0;j<5;j++)box([x,y+.39-j*.15,z+.18],[.88-j*.06,.025,.038],olive,yaw);
}
box([3.1,-1.84,-14.5],[4.55,.36,3.4],dark,-.07);
// Future: repeated solid architectural portals converge on a luminous opening.
for(let i=0;i<5;i++){
 const z=-28-i*1.08,w=3.8-i*.38,h=3.7-i*.30,x=3.1-i*.12,y=-1.95+h/2;
 const col=i===0?yellow:mix(cream,olive,i*.15);
 box([x-w/2,y,z],[.19,h,.25],col);
 box([x+w/2,y,z],[.19,h,.25],col);
 box([x,y+h/2,z],[w+.19,.19,.25],col);
}
box([3.1,-1.88,-29],[4.3,.23,5.5],olive);
torus([2.65,-.1,-33.2],.73,.09,yellow,.05);
function camera(p:number){
 // The camera travels along the negative Z axis; the three land­marks are fixed in world space.
 const travel=16*smooth(0,.51,p)+14*smooth(.51,1,p);
 const pos:V=[-.3+.6*Math.sin(p*Math.PI),.85+.24*Math.sin(p*2*Math.PI),12-travel];
 const forward=unit([.065+.08*Math.sin(p*Math.PI*2),-.115,-1]);
 const right=unit(cross(forward,[0,1,0]));const up=unit(cross(right,forward));
 const a=smooth(.18,.43,p),b=smooth(.60,.88,p);
 const bg=mix(mix(yellow,dark,a),cream,b);
 return {pos,forward,right,up,bg};
}
const focal=1.78,near=.16,far=80;
function view(point:V,c:ReturnType<typeof camera>):V{const v=sub(point,c.pos);return [dot(v,c.right),dot(v,c.up),dot(v,c.forward)]}
function rgb(c:V){return "rgb("+c.map(v=>Math.round(clamp(v)*255)).join(",")+")"}
function shade(color:V,light:number,depth:number,bg:V):V{return mix([color[0]*light,color[1]*light,color[2]*light],bg,smooth(13,52,depth)*.93)}
function size(canvas:HTMLCanvasElement,max=1150){const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight),f=Math.min(1,max/w,720/h);return [Math.max(1,Math.round(w*f)),Math.max(1,Math.round(h*f))] as const}
export function createWorldCPU(canvas:HTMLCanvasElement){
 const ctx=canvas.getContext("2d",{alpha:false});if(!ctx)return null;
 let old=-1,ow=0,oh=0;
 function draw(p:number){
  const [w,h]=size(canvas,950);if(w===ow&&h===oh&&Math.abs(p-old)<.0003)return;
  if(w!==ow||h!==oh){canvas.width=w;canvas.height=h;ow=w;oh=h}old=p;
  const c=camera(p);ctx!.fillStyle=rgb(c.bg);ctx!.fillRect(0,0,w,h);
  const k=h*.5*focal;
  const project=(v:V):[number,number]=>[w*.5+v[0]*k/v[2],h*.5-v[1]*k/v[2]];
  const commands:{z:number;points:V[];color:V;line?:boolean}[]=[];
  // Near-plane clipping prevents objects exploding as the camera passes them.
  function clip(poly:V[]){const out:V[]=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],inside=a[2]>=near,next=b[2]>=near;if(inside)out.push(a);if(inside!==next){const t=(near-a[2])/(b[2]-a[2]);out.push(mix(a,b,t))}}return out}
  for(const f of faces){const pts=clip([view(f.a,c),view(f.b,c),view(f.c,c)]);if(pts.length<3)continue;const z=pts.reduce((s,v)=>s+v[2],0)/pts.length;if(z>far)continue;commands.push({z,points:pts,color:shade(f.color,f.light,z,c.bg)})}
  for(const e of edges){const a=view(e.a,c),b=view(e.b,c);if(a[2]<near||b[2]<near)continue;const z=(a[2]+b[2])*.5-.018;commands.push({z,points:[a,b],color:shade(e.color,.83,z,c.bg),line:true})}
  commands.sort((a,b)=>b.z-a.z);
  for(const item of commands){ctx!.beginPath();item.points.forEach((v,i)=>{const [x,y]=project(v);if(i===0)ctx!.moveTo(x,y);else ctx!.lineTo(x,y)});if(item.line){ctx!.strokeStyle=rgb(item.color);ctx!.lineWidth=.7;ctx!.stroke()}else{ctx!.closePath();ctx!.fillStyle=rgb(item.color);ctx!.fill();ctx!.strokeStyle=ctx!.fillStyle;ctx!.lineWidth=.4;ctx!.stroke()}}
 }
 return {draw,dispose(){},kind:"cpu" as const};
}
export function createWorldGPU(canvas:HTMLCanvasElement){
 const gl=canvas.getContext("webgl",{alpha:false,antialias:true,depth:true,powerPreference:"low-power"});if(!gl)return null;
 const vs=`attribute vec3 position;attribute vec3 tint;uniform vec3 eye,right,up,forward,bg;uniform float aspect;varying vec3 color;void main(){vec3 d=position-eye;float z=dot(d,forward);float x=dot(d,right);float y=dot(d,up);float fog=smoothstep(13.,52.,z)*.93;color=mix(tint,bg,fog);gl_Position=vec4(x*1.78/aspect,y*1.78,1.004008*z-.3206413,z);}`;
 const fs=`precision mediump float;varying vec3 color;void main(){gl_FragColor=vec4(color,1.);}`;
 function compile(type:number,src:string){const s=gl!.createShader(type);if(!s)return null;gl!.shaderSource(s,src);gl!.compileShader(s);if(!gl!.getShaderParameter(s,gl!.COMPILE_STATUS)){gl!.deleteShader(s);return null}return s}
 const v=compile(gl.VERTEX_SHADER,vs),f=compile(gl.FRAGMENT_SHADER,fs);
 if(!v||!f){if(v)gl.deleteShader(v);if(f)gl.deleteShader(f);return null}
 const program=gl.createProgram();if(!program){gl.deleteShader(v);gl.deleteShader(f);return null}
 gl.attachShader(program,v);gl.attachShader(program,f);gl.linkProgram(program);gl.deleteShader(v);gl.deleteShader(f);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);return null}
 const vertices:number[]=[];for(const f of faces)for(const p of [f.a,f.b,f.c])vertices.push(...p,...f.color.map(x=>x*f.light));
 const n=vertices.length/6;for(const e of edges)for(const p of [e.a,e.b])vertices.push(p[0],p[1]+.012,p[2],...e.color.map(x=>x*.83));
 const buf=gl.createBuffer();if(!buf){gl.deleteProgram(program);return null}
 gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
 gl.useProgram(program);for(const [name,offset] of [["position",0],["tint",12]] as const){const a=gl.getAttribLocation(program,name);if(a>=0){gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,24,offset)}}
 const uniforms=Object.fromEntries(["eye","right","up","forward","bg","aspect"].map(k=>[k,gl.getUniformLocation(program,k)]));
 let ow=0,oh=0,old=-1,lost=false;
 function lose(e:Event){e.preventDefault();lost=true}
 canvas.addEventListener("webglcontextlost",lose);
 function draw(p:number){
  if(lost)return false;
  const [w,h]=size(canvas);if(w===ow&&h===oh&&Math.abs(old-p)<.0003)return true;
  if(w!==ow||h!==oh){canvas.width=w;canvas.height=h;ow=w;oh=h}old=p;
  const c=camera(p);gl!.viewport(0,0,w,h);gl!.enable(gl!.DEPTH_TEST);gl!.depthFunc(gl!.LEQUAL);gl!.clearColor(...c.bg,1);gl!.clear(gl!.COLOR_BUFFER_BIT|gl!.DEPTH_BUFFER_BIT);
  gl!.useProgram(program);gl!.uniform3fv(uniforms.eye,c.pos);gl!.uniform3fv(uniforms.right,c.right);gl!.uniform3fv(uniforms.up,c.up);gl!.uniform3fv(uniforms.forward,c.forward);gl!.uniform3fv(uniforms.bg,c.bg);gl!.uniform1f(uniforms.aspect,w/h);
  gl!.drawArrays(gl!.TRIANGLES,0,n);gl!.drawArrays(gl!.LINES,n,vertices.length/6-n);return true;
 }
 return {draw,dispose(){canvas.removeEventListener("webglcontextlost",lose);gl.deleteBuffer(buf);gl.deleteProgram(program)},kind:"gpu" as const};
}
