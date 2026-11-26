"use client";
import {useEffect,useRef,useState,type ReactNode} from "react";
import {gsap} from "gsap";
import {SHOTS,filmCamera,clamp,smooth} from "./film-camera";
import {createRibbonGPU,createRibbonCPU} from "./film-ribbon";
import {subscribeMotion,requestMotionFrame,scrollToFilm} from "./motion-clock";

// Independent editorial edit windows: no one-size-fits-all crossfade.
const EDITS=[[-1,-.3,.04,.46],[-1.05,-.16,.12,.60],[-1.2,-.22,.15,.55],[-.95,-.25,.08,.44],[-1.08,-.24,.06,.50],[-1.15,-.10,.17,.58],[-1.25,-.28,.12,.60],[-1.02,-.18,.11,.54],[-.94,-.20,.06,.48],[-1.15,-.16,.20,.65]] as const;
export default function FilmStage({children}:{children:ReactNode}){
 const root=useRef<HTMLDivElement>(null),viewport=useRef<HTMLDivElement>(null),world=useRef<HTMLDivElement>(null);
 const gpuCanvas=useRef<HTMLCanvasElement>(null),cpuCanvas=useRef<HTMLCanvasElement>(null);
 
 const current=useRef(0),manual=useRef(false),recenter=useRef<number|null>(null);
 const [normal,setNormal]=useState(false);
 function jump(i:number,instant=false){
  const el=root.current,v=viewport.current;if(!el||!v)return;
  const n=clamp(i,0,SHOTS.length-1);
  if(el.dataset.live==="true"){const top=window.scrollY+el.getBoundingClientRect().top;scrollToFilm(top+(el.offsetHeight-v.offsetHeight)*n/(SHOTS.length-1),instant)}
  else document.getElementById(SHOTS[n].id)?.scrollIntoView({behavior:instant?"instant":"smooth",block:"start"});
 }
 useEffect(()=>{
  const el=root.current,v=viewport.current,space=world.current,main=el?.closest<HTMLElement>("main");
  if(!el||!v||!space||!main)return;
  const mq=matchMedia("(min-width: 850px) and (min-height: 460px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const shots=Array.from(space.querySelectorAll<HTMLElement>(":scope > .film-shot"));
  if(shots.length!==SHOTS.length)return;
  let gpu:ReturnType<typeof createRibbonGPU>=null,cpu:ReturnType<typeof createRibbonCPU>=null;
  let live=false,alive=true,previous=-1,w0=0,h0=0;
  const proxy={u:0};
  function paint(){
   if(!alive||!live)return;
   const w=v!.clientWidth,h=v!.clientHeight;if(!w||!h)return;
   const u=proxy.u,cam=filmCamera(u,w,h);
   if(Math.abs(previous-u)<.00005&&w===w0&&h===h0)return;previous=u;w0=w;h0=h;
   v!.style.setProperty("--film-focal",cam.focal+"px");
   const paper="rgb("+cam.color.map(x=>Math.round(x*255)).join(",")+")";v!.style.backgroundColor=paper;v!.style.setProperty("--film-paper",paper);
   space!.style.transform="rotateZ("+(-cam.roll)+"rad) translate3d("+(-cam.x)+"px,"+(-cam.y)+"px,"+cam.z+"px)";
   const n=clamp(Math.round(u),0,shots.length-1);
   for(let i=0;i<shots.length;i++){
    const shot=shots[i],local=u-i,near=local>-1.32&&local<.78;
    const edit=EDITS[i];
    const fadeIn=smooth(edit[0],edit[1],local),fadeOut=1-smooth(edit[2],edit[3],local);
    const artAlpha=(i===0?1:smooth(-1.10,-.28,local))*(1-smooth(.20,.63,local));
    const alpha=i===0?fadeOut:fadeIn*fadeOut;
    shot.style.transform="translate3d("+(SHOTS[i].x*w)+"px,"+(SHOTS[i].y*h)+"px,"+(-i*cam.step)+"px)";
    shot.style.visibility=near||Math.abs(local)<.001?"visible":"hidden";
    shot.style.setProperty("--shot-opacity",String(alpha));
    shot.style.setProperty("--shot-art-opacity",String(artAlpha));
    shot.style.setProperty("--shot-relative",String(clamp(local,-1,1)));
    shot.style.setProperty("--shot-arrival",String(fadeIn));
    shot.style.setProperty("--edit-in",String(smooth(edit[0],edit[1],local)));
    shot.style.setProperty("--edit-out",String(smooth(edit[2],edit[3],local)));
    shot.style.setProperty("--shot-exit",String(smooth(.02,.55,local)));
    shot.style.setProperty("--art-motion",String(fadeIn));
    shot.style.setProperty("--art-travel",String(clamp(local+.5)));
    if(i!==n&&shot.contains(document.activeElement)) (document.activeElement as HTMLElement)?.blur();
    if(shot.inert!==(i!==n)){shot.inert=i!==n;shot.setAttribute("aria-hidden",String(i!==n))}
   }
   // Preserve the exact portrait interaction at frame zero, then open it like a film aperture.
   shots[0].style.setProperty("--hero-aperture",String(smooth(.015,.52,u)));
   v!.style.setProperty("--film-position",String(u/(shots.length-1)));
   main!.classList.toggle("film-after-portrait",u>.22);
   current.current=n;
   if(gpu&&gpu.draw(cam,w,h)===false){gpu.dispose();gpu=null;if(cpuCanvas.current)cpu=createRibbonCPU(cpuCanvas.current);v!.dataset.renderer=cpu?"canvas":"css"}
   if(cpu)cpu.draw(cam,w,h);
  }
  // GSAP is the master timeline; Lenis supplies smooth scroll position. No separate
  // wheel hijacking, snap points, autoplay, or dwell timers.
  const timeline=gsap.timeline({paused:true,onUpdate:paint}).to(proxy,{u:shots.length-1,duration:shots.length-1,ease:"none"},0);
  function clean(){
   live=false;gpu?.dispose();cpu?.dispose();gpu=null;cpu=null;
   delete el!.dataset.live;delete v!.dataset.renderer;space!.style.removeProperty("transform");v!.style.removeProperty("background-color");v!.style.removeProperty("--film-paper");
   main!.classList.remove("cinematic-live","film-after-portrait");
   for(const s of shots){s.inert=false;s.removeAttribute("aria-hidden");s.removeAttribute("style")}
  }
  function measure(){
   if(!live)return;
   const rect=el!.getBoundingClientRect(),distance=Math.max(1,el!.offsetHeight-v!.offsetHeight);
   const p=clamp(-rect.top/distance);
   timeline.progress(p);paint();
  }
  function sync(){
   const next=mq.matches&&!manual.current;
   if(next===live)return
   if(!next){clean();return}
   live=true;el!.dataset.live="true";main!.classList.add("cinematic-live");
   previous=-1;
   if(gpuCanvas.current)gpu=createRibbonGPU(gpuCanvas.current);
   if(!gpu&&cpuCanvas.current)cpu=createRibbonCPU(cpuCanvas.current);
   v!.dataset.renderer=gpu?"gpu":cpu?"canvas":"css";
   measure();requestMotionFrame();
  }
  function anchor(e:MouseEvent){
   if(!live||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||!(e.target instanceof Element))return;
   const a=e.target.closest<HTMLAnchorElement>("a[href]");if(!a||a.target||a.hasAttribute("download"))return;
   const url=new URL(a.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
   const id=url.hash.slice(1),n=id==="top"?0:SHOTS.findIndex(s=>s.id===id);if(n<0)return;
   e.preventDefault();e.stopPropagation();history.pushState(null,"",url.hash);jump(n);
  }
  function hash(){if(!live)return;const id=location.hash.slice(1),n=id==="top"?0:SHOTS.findIndex(s=>s.id===id);if(n>=0)jump(n,true)}
  const ro=new ResizeObserver(requestMotionFrame);ro.observe(el);ro.observe(v);
  const un=subscribeMotion(measure);
  mq.addEventListener("change",sync);document.addEventListener("click",anchor,true);window.addEventListener("hashchange",hash);
  sync();
  if(recenter.current!==null){const n=recenter.current;recenter.current=null;requestAnimationFrame(()=>{if(alive)jump(n,true)})}else if(location.hash)requestAnimationFrame(()=>{if(alive)hash()});
  return()=>{alive=false;timeline.kill();un();ro.disconnect();mq.removeEventListener("change",sync);document.removeEventListener("click",anchor,true);window.removeEventListener("hashchange",hash);clean()};
 },[normal]);
 useEffect(()=>{const change=()=>{recenter.current=current.current;manual.current=!manual.current;setNormal(manual.current)};window.addEventListener("zm-film-mode",change);return()=>window.removeEventListener("zm-film-mode",change)},[]);
 return <div ref={root} className="cinematic-reel" style={{"--film-shots":SHOTS.length-1} as React.CSSProperties}>
  <div ref={viewport} className="cinematic-viewport">
   <canvas ref={gpuCanvas} className="cinematic-ribbon ribbon-gpu" aria-hidden="true"/>
   <canvas ref={cpuCanvas} className="cinematic-ribbon ribbon-cpu" aria-hidden="true"/>
   <div className="cinematic-grain" aria-hidden="true"/>
   <div ref={world} className="cinematic-world">{children}</div>

  </div>

 </div>
}
