"use client";
import {useEffect,useRef,useState,type ReactNode} from "react";
import {gsap} from "gsap";
import {SHOTS,filmCamera,filmEdit,beatProgress,beatOffset,clamp,smooth} from "./film-camera";
import {subscribeMotion,requestMotionFrame,scrollToFilm} from "./motion-clock";

export default function FilmStage({children}:{children:ReactNode}){
 const root=useRef<HTMLDivElement>(null),viewport=useRef<HTMLDivElement>(null),world=useRef<HTMLDivElement>(null);
 
 const current=useRef(0),manual=useRef(false),recenter=useRef<number|null>(null);
 const [normal,setNormal]=useState(false);
 function jump(i:number,instant=false){
  const el=root.current,v=viewport.current;if(!el||!v)return;
  const n=clamp(i,0,SHOTS.length-1);
  if(el.dataset.live==="true"){const top=window.scrollY+el.getBoundingClientRect().top;scrollToFilm(top+(el.offsetHeight-v.offsetHeight)*beatOffset(n),instant)}
  else document.getElementById(SHOTS[n].id)?.scrollIntoView({behavior:instant?"instant":"smooth",block:"start"});
 }
 useEffect(()=>{
  const el=root.current,v=viewport.current,space=world.current,main=el?.closest<HTMLElement>("main");
  if(!el||!v||!space||!main)return;
  const mq=matchMedia("(min-width: 850px) and (min-height: 460px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const shots=Array.from(space.querySelectorAll<HTMLElement>(":scope > .film-shot"));
  if(shots.length!==SHOTS.length)return;
  let live=false,alive=true,previous=-1,w0=0,h0=0;
  let fitW=0,fitH=0;
  function fitTitles(w:number,h:number){
   if(fitW===w&&fitH===h)return;fitW=w;fitH=h;
   for(const shot of shots){
    const copy=shot.querySelector<HTMLElement>(".film-copy"),title=copy?.querySelector<HTMLElement>("h2");if(!copy||!title)continue;
    shot.style.removeProperty("--fit-heading");
    const style=getComputedStyle(shot),spaceH=shot.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
    const budget=spaceH*(shot.id==="next-chapter"?.72:shot.id==="film-memory"?.42:shot.id==="milestone-preview"?.36:shot.id==="projects"?.43:shot.id==="exhibit-rezamin"?.44:.92);
    let fs=parseFloat(getComputedStyle(title).fontSize);
    for(let attempt=0;attempt<8&&(copy.offsetHeight>budget||title.scrollWidth>copy.clientWidth+2);attempt++){
     fs=Math.max(25,fs*.89);shot.style.setProperty("--fit-heading",fs+"px");if(fs<=25)break;
    }
   }
  }
  const proxy={u:0};
  function paint(){
   if(!alive||!live)return;
   const w=v!.clientWidth,h=v!.clientHeight;if(!w||!h)return;
   const u=beatProgress(proxy.u),cam=filmCamera(u,w,h);
   if(Math.abs(previous-u)<.00005&&w===w0&&h===h0)return;previous=u;w0=w;h0=h;
   v!.style.setProperty("--film-focal",cam.focal+"px");fitTitles(w,h);
   const paper="rgb("+cam.color.map(x=>Math.round(x*255)).join(",")+")";v!.style.backgroundColor=paper;v!.style.setProperty("--film-paper",paper);
   space!.style.transform="rotateZ("+(-cam.roll)+"rad) translate3d("+(-cam.x)+"px,"+(-cam.y)+"px,"+cam.z+"px)";
   const n=clamp(Math.round(u),0,shots.length-1);
   for(let i=0;i<shots.length;i++){
    const shot=shots[i],edit=filmEdit(u,i),{local,owner,enter,exit,text,art}=edit;
    const nearby=art>.001||text>.001;
    shot.style.transform="translate3d("+(SHOTS[i].x*w)+"px,"+(SHOTS[i].y*h)+"px,"+(-SHOTS[i].z*cam.step)+"px)";
    shot.style.visibility=nearby?"visible":"hidden";
    shot.style.setProperty("--shot-opacity",text.toFixed(4));
    shot.style.setProperty("--shot-art-opacity",art.toFixed(4));
    shot.style.setProperty("--shot-relative",String(clamp(local,-1,1)));
    shot.style.setProperty("--shot-arrival",enter.toFixed(4));
    // Artwork is already present before the title. Let it fill the frame, then settle.
    const opening=smooth(-.66,-.42,local),settle=smooth(-.40,-.04,local),leave=smooth(.12,.63,local);
    shot.style.setProperty("--media-open",opening.toFixed(4));
    shot.style.setProperty("--media-settle",settle.toFixed(4));
    shot.style.setProperty("--media-leave",leave.toFixed(4));
    shot.style.setProperty("--copy-settle",smooth(-.30,-.04,local).toFixed(4));
    shot.style.setProperty("--media-cut",(1-smooth(.36,.63,local)).toFixed(4));
    shot.style.setProperty("--edit-in",enter.toFixed(4));
    shot.style.setProperty("--edit-out",exit.toFixed(4));
    shot.style.setProperty("--art-in",smooth(-.66,-.16,local).toFixed(4));
    shot.style.setProperty("--art-motion",smooth(-.77,-.17,local).toFixed(4));
    shot.style.setProperty("--art-travel",String(clamp(local+.5)));
    shot.dataset.textOwner=String(owner&&text>.001);
    if(!owner&&shot.contains(document.activeElement))(document.activeElement as HTMLElement)?.blur();
    const interactive=owner&&text>.60;if(shot.inert!==!interactive)shot.inert=!interactive;
    shot.setAttribute("aria-hidden",String(!interactive));
   }
   // Preserve the exact portrait interaction at frame zero, then open it like a film aperture.
   shots[0].style.setProperty("--hero-aperture",String(smooth(.04,.48,u)));
   v!.style.setProperty("--film-position",String(u/(shots.length-1)));
   main!.classList.toggle("film-after-portrait",u>.22);
   current.current=n;
  }
  // GSAP is the master timeline; Lenis supplies smooth scroll position. No separate
  // wheel hijacking, snap points, autoplay, or dwell timers.
  const timeline=gsap.timeline({paused:true,onUpdate:paint}).to(proxy,{u:1,duration:1,ease:"none"},0);
  function clean(){
   live=false;
   delete el!.dataset.live;space!.style.removeProperty("transform");v!.style.removeProperty("background-color");v!.style.removeProperty("--film-paper");
   main!.classList.remove("cinematic-live","film-after-portrait");
   for(const s of shots){s.inert=false;s.removeAttribute("aria-hidden");s.removeAttribute("style");delete s.dataset.textOwner}
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
   previous=-1;fitW=fitH=0;
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
  document.fonts.ready.then(()=>{if(alive){fitW=fitH=0;previous=-1;requestMotionFrame()}});
  if(recenter.current!==null){const n=recenter.current;recenter.current=null;requestAnimationFrame(()=>{if(alive)jump(n,true)})}else if(location.hash)requestAnimationFrame(()=>{if(alive)hash()});
  return()=>{alive=false;timeline.kill();un();ro.disconnect();mq.removeEventListener("change",sync);document.removeEventListener("click",anchor,true);window.removeEventListener("hashchange",hash);clean()};
 },[normal]);
 useEffect(()=>{const change=()=>{recenter.current=current.current;manual.current=!manual.current;setNormal(manual.current)};window.addEventListener("zm-film-mode",change);return()=>window.removeEventListener("zm-film-mode",change)},[]);
 return <div ref={root} className="cinematic-reel" style={{"--film-shots":SHOTS.length-1} as React.CSSProperties}>
  <div ref={viewport} className="cinematic-viewport">
   <div ref={world} className="cinematic-world">{children}</div>

  </div>

 </div>
}
