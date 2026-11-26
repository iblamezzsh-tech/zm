import MotionWords from "../motion-words";
import Link from "next/link";
import SiteHeader from "../site-header";

import ProjectExhibition from "../project-exhibition";
import "../chapters.css";
import "./projects.css";
export const metadata={title:"Projects — ZiyoMuhammad",description:"Explore OverThink, Finance4Youth and ReZamin, three personal initiatives spanning knowledge, finance and the environment."};
export default function ProjectsPage(){return <main className="projects-page" id="top">
<SiteHeader projects/>
<section className="journal-cover directory-cover"><div className="folio-rule"><span>Selected initiatives</span><span>Knowledge / Economics / Environment</span></div><h1>Works <i>in progress.</i></h1><p>Three different interests. One desire to turn curiosity into something real.</p></section>
<ProjectExhibition directory/>
<section className="projects-ending"><span>ALWAYS A WORK IN PROGRESS.</span><h2><MotionWords text="Learn by"/> <em><MotionWords text="doing."/></em></h2><Link className="case-link" href="/about">Back to my story ↗</Link></section>
<footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/">Home</Link><a href="#top">Back to top ↑</a></footer></main>}
