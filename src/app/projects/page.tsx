import Link from "next/link";
import SiteHeader from "../site-header";
import Signature from "../signature";
import ProjectArt from "../project-art";
import {projects} from "./data";
import "../chapters.css";
import "./projects.css";
export const metadata={title:"Projects — ZiyoMuhammad",description:"Explore OverThink, Finance4Youth and ReZamin, three personal initiatives spanning knowledge, finance and the environment."};
export default function ProjectsPage(){return <main className="projects-page" id="top">
<SiteHeader projects/>
<section className="projects-opening"><div className="projects-rule"><span>ZM / SELECTED INITIATIVES</span><span>01 — 03</span></div><h1>Ideas into <em>action.</em></h1><div className="projects-intro"><p>Three different interests. One desire to turn curiosity into something real.</p><div><Signature/></div></div></section>
<div className="project-directory">{projects.map(p=><article key={p.slug} className={"directory-item directory-"+p.kind}><Link className="directory-art" href={"/projects/"+p.slug} aria-label={"Read about "+p.name}><ProjectArt kind={p.kind}/><span className="directory-arrow" aria-hidden="true">↗</span></Link><div className="directory-info"><div className="projects-rule"><span>{p.number} / 03</span><span>{p.category}</span></div><h2><Link href={"/projects/"+p.slug}>{p.name}</Link></h2><span className="directory-role">{p.role}</span><p>{p.summary}</p><Link className="case-link" href={"/projects/"+p.slug}>Read the story <span aria-hidden="true">↗</span></Link></div></article>)}</div>
<section className="projects-ending"><span>ALWAYS A WORK IN PROGRESS.</span><h2>Learn by <em>doing.</em></h2><Link className="case-link" href="/about">Back to my story ↗</Link></section>
<footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/">Home</Link><a href="#top">Back to top ↑</a></footer></main>}
