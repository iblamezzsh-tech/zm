import Link from "next/link";
import SiteHeader from "../site-header";
import Signature from "../signature";
import ProjectExhibition from "../project-exhibition";
import "../chapters.css";
import "./projects.css";
export const metadata={title:"Projects — ZiyoMuhammad",description:"Explore OverThink, Finance4Youth and ReZamin, three personal initiatives spanning knowledge, finance and the environment."};
export default function ProjectsPage(){return <main className="projects-page" id="top">
<SiteHeader projects/>
<section className="projects-opening"><div className="projects-rule"><span>ZM / SELECTED INITIATIVES</span><span>01 — 03</span></div><h1>Ideas into <em>action.</em></h1><div className="projects-intro"><p>Three different interests. One desire to turn curiosity into something real.</p><div><Signature/></div></div></section>
<ProjectExhibition directory/>
<section className="projects-ending"><span>ALWAYS A WORK IN PROGRESS.</span><h2>Learn by <em>doing.</em></h2><Link className="case-link" href="/about">Back to my story ↗</Link></section>
<footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/">Home</Link><a href="#top">Back to top ↑</a></footer></main>}
