import MotionWords from "../motion-words";
import Link from "next/link";
import SiteHeader from "../site-header";
import Signature from "../signature";
import Archive from "./archive";
import FieldNotes from "../field-notes";
import {getFeaturedRecords} from "../featured-records";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { milestones, certificateRecords } from "./data";
import "./achievements.css";
export const metadata={title:"Milestones & Achievements — ZiyoMuhammad",description:"A personal archive of milestones, experiences and documented achievements."};
export default function Achievements(){return <main className="milestones-page" id="top"><SiteHeader achievements/>
<section className="milestone-hero"><div className="archive-rule"><span>ZM / PERSONAL ARCHIVE</span><span>THE JOURNEY SO FAR</span></div><h1><MotionWords text="Milestones."/></h1><div className="milestone-hero-bottom"><div><span>MORE THAN A COLLECTION OF TITLES</span><h2><MotionWords text="Every step"/><br/><em><MotionWords text="leaves a mark."/></em></h2><p>A record of the things I’ve taken part in, the responsibilities I’ve held and the experiences I’m learning from.</p><a href="#featured" className="archive-hero-link">Explore the archive ↓</a></div><div className="archive-emblem" aria-hidden="true"><svg viewBox="0 0 380 300"><g stroke="currentColor" fill="none" opacity=".45">{Array.from({length:12},(_,i)=><ellipse key={i} cx="190" cy="150" rx={25+i*12} ry={18+i*8} transform={`rotate(${i*13} 190 150)`}/>)}</g><path d="M190 40V260 M80 150H300" stroke="currentColor" strokeDasharray="4 7"/><path d="m190 85 14 47 47 18-47 18-14 47-14-47-47-18 47-18Z" fill="currentColor"/></svg><div><Signature/></div></div></div></section>
<FieldNotes records={getFeaturedRecords()} archive/>
<Archive records={[...certificateRecords.filter(record=>record.document && existsSync(join(process.cwd(),"public",record.document.src.replace(/^\//,"")))),...milestones]}/>
<section className="archive-ending"><div className="archive-rule"><span>02 / Looking forward</span><span>TO BE CONTINUED</span></div><h2><MotionWords text="Still a long"/><br/><em><MotionWords text="way to go."/></em></h2><Link href="/about">Read my story ↗</Link></section>
<footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/">Home</Link><a href="#top">Back to top ↑</a></footer></main>}
