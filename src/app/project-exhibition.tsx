"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import ProjectArt from "./project-art";
import {projects} from "./projects/data";
import "./exhibition.css";
const captions=["One question. Six minds.","Make the numbers make sense.","Start with the place you live."];
export default function ProjectExhibition({directory=false}:{directory?:boolean}){
 const root=useRef<HTMLDivElement>(null);
 const [active,setActive]=useState(0);
 useEffect(()=>{
   const el=root.current;if(!el||!("IntersectionObserver" in window))return;
   const scenes=Array.from(el.querySelectorAll<HTMLElement>("[data-exhibit-scene]"));
   const observer=new IntersectionObserver(entries=>{
     for(const entry of entries){if(entry.isIntersecting){const i=scenes.indexOf(entry.target as HTMLElement);if(i>=0)setActive(i)}}
   },{rootMargin:"-34% 0px -35% 0px",threshold:0});
   scenes.forEach(scene=>observer.observe(scene));return()=>observer.disconnect();
 },[]);
 return <div className={"project-exhibition"+(directory?" exhibition-directory":"")} ref={root}>
 <aside className="exhibition-index" aria-label="Project exhibition navigation">
   <div className="exhibition-index-top"><span>THE WORK / 01—03</span><span className="exhibition-count">{String(active+1).padStart(2,"0")}<small>/03</small></span></div>
   <nav aria-label="Jump to a project">{projects.map((p,i)=><a key={p.slug} href={"#exhibit-"+p.slug} aria-current={active===i?"location":undefined}><span>{p.number}</span><strong>{p.name}</strong><span aria-hidden="true">↘</span></a>)}</nav>
   <div className="exhibition-index-bottom"><span>Curiosity in practice.</span>{!directory&&<Link href="/projects">All projects ↗</Link>}</div>
 </aside>
 <div className="exhibition-scenes">
 {projects.map((p,i)=><article className={"exhibit-scene exhibit-"+p.kind} key={p.slug} id={"exhibit-"+p.slug} data-exhibit-scene>
 <Link className="exhibit-visual" href={"/projects/"+p.slug} aria-label={"Explore "+p.name}><ProjectArt kind={p.kind}/><span className="exhibit-badge" aria-hidden="true">OPEN<br/>PROJECT <b>↗</b></span></Link>
 <div className="exhibit-caption"><div><span className="exhibit-kicker">{p.number} / {p.category} — {p.role}</span><h3>{captions[i]}</h3></div><div><p>{p.summary}</p><Link className="exhibit-link" href={"/projects/"+p.slug}>Inside {p.name} <span aria-hidden="true">↗</span></Link></div></div>
 </article>)}
 </div></div>
}
