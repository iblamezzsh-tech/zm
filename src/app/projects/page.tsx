import ArrowIcon from "../arrow-icon";
import PageAtmosphere from "../page-atmosphere";
import MotionWords from "../motion-words";
import Link from "next/link";
import SiteHeader from "../site-header";
import Signature from "../signature";
import ProjectExhibition from "../project-exhibition";
import "../chapters.css";
import "./projects.css";
import "../studio54.css";
export const metadata={title:"Projects — ZiyoMuhammad",description:"Explore OverThink, Finance4Youth and ReZamin, three personal initiatives spanning knowledge, finance and the environment."};
export default function ProjectsPage(){return <main className="projects-page studio54" id="top">
<SiteHeader projects/>
<section className="projects-opening"><PageAtmosphere kind="gallery"/><div className="projects-rule"><span>ZM / SELECTED INITIATIVES</span><span>01 — 03</span></div><h1><MotionWords text="Ideas into"/> <em><MotionWords text="action."/></em></h1><div className="projects-intro"><p>Three different interests. One desire to turn curiosity into something real.</p><div><Signature/></div></div></section>
<ProjectExhibition directory/>
<section className="projects-ending"><PageAtmosphere kind="gallery" dark/><span>ALWAYS A WORK IN PROGRESS.</span><h2><MotionWords text="Learn by"/> <em><MotionWords text="doing."/></em></h2><Link className="case-link" href="/about">Back to my story <ArrowIcon direction="up-right"/></Link></section>
<footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/">Home</Link><a href="#top">Back to top <ArrowIcon direction="up"/></a></footer></main>}
