import MotionWords from "../motion-words";
import Link from "next/link";
import SiteHeader from "../site-header";

import Archive from "./archive";

import {getFeaturedRecords} from "../featured-records";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { milestones, certificateRecords } from "./data";
import "./achievements.css";
export const metadata={title:"Milestones & Achievements — ZiyoMuhammad",description:"A personal archive of milestones, experiences and documented achievements."};
export default function Achievements(){return <main className="milestones-page" id="top"><SiteHeader achievements/>
<section className="journal-cover archive-cover"><div className="folio-rule"><span>Personal archive</span><span>Selected original documents</span></div><h1>Milestones.</h1><div className="archive-proof">{getFeaturedRecords().slice(0,3).map(r=><figure key={r.id}><a href="#archive-title"><img src={r.document!.src} alt={r.document!.alt}/></a><figcaption>{r.dateLabel} / {r.chapter}</figcaption></figure>)}</div><p>A record of the things I’ve taken part in, the responsibilities I’ve held and the experiences I’m learning from.</p><a href="#archive-title">Enter the reading room ↓</a></section>
<Archive records={[...certificateRecords.filter(record=>record.document && existsSync(join(process.cwd(),"public",record.document.src.replace(/^\//,"")))),...milestones]}/>
<section className="archive-ending"><div className="archive-rule"><span>02 / Looking forward</span><span>TO BE CONTINUED</span></div><h2><MotionWords text="Still a long"/><br/><em><MotionWords text="way to go."/></em></h2><Link href="/about">Read my story ↗</Link></section>
<footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/">Home</Link><a href="#top">Back to top ↑</a></footer></main>}
