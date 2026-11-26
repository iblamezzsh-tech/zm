"use client";
import {useEffect,useRef,useState} from "react";
import {subscribeMotion,requestMotionFrame,scrollToFilm} from "./motion-clock";
import type {MouseEvent,FocusEvent} from "react";
import Link from "next/link";
import ProjectArt from "./project-art";
import {projects} from "./projects/data";
import "./exhibition.css";
import "./atlas-scroll.css";
const captions=["One question. Six minds.","Make the numbers make sense.","Start with the place you live."];
export default function ProjectExhibition({directory=false}:{directory?:boolean}){
 const root=useRef<HTMLDivElement>(null);
 const [active,setActive]=useState(0);
 const [cinematic,setCinematic]=useState(false);
 const indexRef=useRef(0);
 const sticky=useRef<HTMLDivElement>(null);
 const track=useRef<HTMLDivElement>(null);
 const count=projects.length;
 function jump(i:number,instant=false){
   const el=root.current,frame=sticky.current;
   if(!el||!frame)return;
   const top=window.scrollY+el.getBoundingClientRect().top;
   const distance=Math.max(0,el.offsetHeight-frame.offsetHeight);
   scrollToFilm(top+distance*[.09,.50,.91][i],instant);
 }
 function choose(e:MouseEvent<HTMLAnchorElement>,i:number){
   if(!cinematic||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   e.preventDefault();jump(i);
 }
 function focusSlide(e:FocusEvent<HTMLElement>,i:number){
   if(cinematic&&i!==indexRef.current&&!e.currentTarget.contains(e.relatedTarget as Node|null))jump(i,true);
 }
 useEffect(()=>{
   const el=root.current;if(!el)return;
   const q=matchMedia("(min-width: 900px) and (min-height: 520px) and (prefers-reduced-motion: no-preference)");
   function sync(){setCinematic(q.matches)}
   sync();q.addEventListener("change",sync);return()=>q.removeEventListener("change",sync);
 },[directory]);
 useEffect(()=>{
   const el=root.current;if(!el)return;
   const scenes=Array.from(el.querySelectorAll<HTMLElement>("[data-exhibit-scene]"));
   if(cinematic){
     function update(){
       const frame=sticky.current,rail=track.current;if(!frame||!rail)return;
       const distance=Math.max(1,el!.offsetHeight-frame.offsetHeight);
       const p=Math.max(0,Math.min(1,-el!.getBoundingClientRect().top/distance));
       // Each project sits at a spatial resting point. Travel through depth between holds.
       const smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
       const shift=smooth(.17,.40,p)+smooth(.60,.83,p);
       rail.style.removeProperty("transform");
       scenes.forEach((scene,i)=>{
         const direction=shift-i,distance=Math.abs(direction);
         const focus=1-Math.min(1,distance);
         scene.style.setProperty("--slide-away",Math.min(1,distance).toFixed(4));
         scene.style.setProperty("--slide-direction",Math.max(-1,Math.min(1,direction)).toFixed(4));
         scene.style.setProperty("--slide-focus",focus.toFixed(4));
         scene.style.setProperty("--gallery-x",(direction*38).toFixed(4)+"%");
         scene.style.setProperty("--gallery-y",(-direction*18).toFixed(4)+"%");
         scene.style.setProperty("--gallery-z",(-distance*420).toFixed(4)+"px");
         scene.style.setProperty("--gallery-angle",(-direction*19).toFixed(4)+"deg");
         scene.style.setProperty("--gallery-visibility",String(Math.max(0,1-Math.max(0,distance-.10)*.86)));
         scene.style.zIndex=String(100-Math.round(distance*20));
       });
       frame.style.setProperty("--exhibit-progress",String(p));
       const n=Math.min(count-1,Math.round(shift));
       if(n!==indexRef.current){indexRef.current=n;setActive(n)}
     }
     const schedule=requestMotionFrame;
     function hash(){const n=scenes.findIndex(s=>"#"+s.id===location.hash);if(n>=0)jump(n,true)}
     update();const unsubscribe=subscribeMotion(update);const ro=new ResizeObserver(schedule);ro.observe(el);window.addEventListener("hashchange",hash);
     if(location.hash.startsWith("#exhibit-"))hash();
     return()=>{unsubscribe();ro.disconnect();window.removeEventListener("hashchange",hash);railReset()};
     function railReset(){track.current?.style.removeProperty("transform");sticky.current?.style.removeProperty("--exhibit-progress");scenes.forEach(scene=>{scene.style.removeProperty("--slide-away");scene.style.removeProperty("--slide-direction");scene.style.removeProperty("--slide-focus");for(const name of ["--gallery-x","--gallery-y","--gallery-z","--gallery-angle","--gallery-visibility"])scene.style.removeProperty(name);scene.style.removeProperty("z-index")})}
   }
   if(!("IntersectionObserver" in window))return;
   const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){const i=scenes.indexOf(entry.target as HTMLElement);if(i>=0){indexRef.current=i;setActive(i)}}}},{rootMargin:"-34% 0px -35% 0px",threshold:0});
   scenes.forEach(scene=>observer.observe(scene));return()=>observer.disconnect();
 },[cinematic,count]);
 return <div className={"project-exhibition"+(directory?" exhibition-directory":"")+(cinematic?" exhibition-cinematic exhibition-spatial":"")} ref={root}>
 <div className="exhibition-sticky" ref={sticky}>
 <aside className="exhibition-index" aria-label="Project exhibition navigation">
   <div className="exhibition-index-top"><span>THE WORK / 01—03</span><span className="exhibition-count">{String(active+1).padStart(2,"0")}<small>/03</small></span></div>
   <nav aria-label="Jump to a project">{projects.map((p,i)=><a key={p.slug} href={"#exhibit-"+p.slug} onClick={e=>choose(e,i)} aria-current={active===i?"location":undefined}><span>{p.number}</span><strong>{p.name}</strong><span aria-hidden="true">↘</span></a>)}</nav>
   <div className="exhibition-index-bottom"><span>Curiosity in practice.</span>{!directory&&<Link href="/projects">All projects ↗</Link>}</div>
 </aside>
 <div className="exhibition-window"><div className="gallery-axis" aria-hidden="true"><span>ZM / SELECTED WORK</span><b>{String(active+1).padStart(2,"0")}</b><span>SCROLL TO EXPLORE</span></div><div className="exhibition-scenes" ref={track}>
 {projects.map((p,i)=><article className={"exhibit-scene exhibit-"+p.kind+(active===i?" is-current":"")} key={p.slug} id={"exhibit-"+p.slug} data-exhibit-scene inert={cinematic&&active!==i} aria-hidden={cinematic&&active!==i} onFocusCapture={e=>focusSlide(e,i)}>
 <Link className="exhibit-visual" href={"/projects/"+p.slug} aria-label={"Explore "+p.name}><ProjectArt kind={p.kind}/><span className="exhibit-badge" aria-hidden="true">OPEN<br/>PROJECT <b>↗</b></span></Link>
 <div className="exhibit-caption"><div><span className="exhibit-kicker">{p.number} / {p.category} — {p.role}</span><h3>{captions[i]}</h3></div><div><p>{p.summary}</p><Link className="exhibit-link" href={"/projects/"+p.slug}>Inside {p.name} <span aria-hidden="true">↗</span></Link></div></div>
 </article>)}
 </div></div>
 {cinematic&&<div className="exhibition-film-progress" aria-hidden="true"><span/></div>}
 </div></div>
}
