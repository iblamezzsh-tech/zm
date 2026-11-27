"use client";
import ArrowIcon from "./arrow-icon";
import PageAtmosphere from "./page-atmosphere";

import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import ProjectArt from "./project-art";
import ProjectEdition from "./project-edition";
import {projects} from "./projects/data";
import "./exhibition.css";
const captions=["One question. Six minds.","Make the numbers make sense.","Start with the place you live."];
export default function ProjectExhibition({directory=false}:{directory?:boolean}){
 const root=useRef<HTMLDivElement>(null);const [active,setActive]=useState(0);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const scenes=Array.from(el.querySelectorAll<HTMLElement>("[data-exhibit-scene]"));
  const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){const i=scenes.indexOf(e.target as HTMLElement);if(i>=0)setActive(i)}},{rootMargin:"-30% 0px -45% 0px"});
  scenes.forEach(s=>observer.observe(s));return()=>observer.disconnect();
 },[]);
 return <div className={"project-exhibition"+(directory?" exhibition-directory":"")+" exhibition-flow"} ref={root}>
 <div className="exhibition-sticky">
 <aside className="exhibition-index" aria-label="Project exhibition navigation">
   <div className="exhibition-index-top"><span>THE WORK / 01—03</span><span className="exhibition-count">{String(active+1).padStart(2,"0")}<small>/03</small></span></div>
   <nav aria-label="Jump to a project">{projects.map((p,i)=><a key={p.slug} href={"#exhibit-"+p.slug} aria-current={active===i?"location":undefined}><span>{p.number}</span><strong>{p.name}</strong><span aria-hidden="true"><ArrowIcon direction="down-right"/></span></a>)}</nav>
   <div className="exhibition-index-bottom"><span>Curiosity in practice.</span>{!directory&&<Link href="/projects">All projects <ArrowIcon direction="up-right"/></Link>}</div>
 </aside>
 <div className="exhibition-window"><div className="exhibition-scenes">
 {projects.map((p,i)=><article className={"exhibit-scene exhibit-"+p.kind+(active===i?" is-current":"")} key={p.slug} id={"exhibit-"+p.slug} data-exhibit-scene data-flow-scene="project">{directory&&<PageAtmosphere kind={p.kind}/>}
 <Link className="exhibit-visual" href={"/projects/"+p.slug} aria-label={"Explore "+p.name}>{directory?<ProjectEdition project={p}/>:<ProjectArt kind={p.kind}/>}<span className="exhibit-badge" aria-hidden="true">OPEN<br/>PROJECT <b><ArrowIcon direction="up-right"/></b></span></Link>
 <div className="exhibit-caption"><div><span className="exhibit-kicker">{p.number} / {p.category} — {p.role}</span><h3>{captions[i]}</h3></div><div><p>{p.summary}</p><Link className="exhibit-link" href={"/projects/"+p.slug}>Inside {p.name} <span aria-hidden="true"><ArrowIcon direction="up-right"/></span></Link></div></div>
 </article>)}
 </div></div>

 </div></div>
}
