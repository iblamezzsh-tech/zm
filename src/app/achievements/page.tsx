import ArrowIcon from "../arrow-icon";
import PageAtmosphere from "../page-atmosphere";
import MotionWords from "../motion-words";
import Link from "next/link";
import SiteHeader from "../site-header";
import Signature from "../signature";
import Archive from "./archive";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { milestones, certificateRecords } from "./data";
import "./achievements.css";
import "../studio54.css";
export const metadata={title:"Milestones & Achievements — ZiyoMuhammad",description:"A personal archive of milestones, experiences and documented achievements."};
export default function Achievements(){return <main className="milestones-page studio54" id="top"><SiteHeader achievements/>
<section className="milestone-hero"><PageAtmosphere kind="archive" dark/><div className="archive-rule"><span>ZM / PERSONAL ARCHIVE</span><span>THE JOURNEY SO FAR</span></div><h1><MotionWords text="Milestones."/></h1><div className="milestone-hero-bottom"><div><span>MORE THAN A COLLECTION OF TITLES</span><h2><MotionWords text="Every step"/><br/><em><MotionWords text="leaves a mark."/></em></h2><p>A record of the things I’ve taken part in, the responsibilities I’ve held and the experiences I’m learning from.</p><a href="#featured" className="archive-hero-link">Explore the archive <ArrowIcon direction="down"/></a></div><div className="studio54-archive-index"><span>PERSONAL RECORDS / COLLECTION</span><strong>{String(certificateRecords.filter(r=>r.document&&existsSync(join(process.cwd(),"public",r.document.src.replace(/^\//,"")))).length).padStart(2,"0")}</strong><span>ORIGINAL DOCUMENTS</span><div><Signature/></div></div></div></section>

<Archive records={[...certificateRecords.filter(record=>record.document && existsSync(join(process.cwd(),"public",record.document.src.replace(/^\//,"")))),...milestones]}/>
<section className="archive-ending"><PageAtmosphere kind="archive"/><div className="archive-rule"><span>02 / Looking forward</span><span>TO BE CONTINUED</span></div><h2><MotionWords text="Still a long"/><br/><em><MotionWords text="way to go."/></em></h2><Link href="/about">Read my story <ArrowIcon direction="up-right"/></Link></section>
<footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/">Home</Link><a href="#top">Back to top <ArrowIcon direction="up"/></a></footer></main>}
