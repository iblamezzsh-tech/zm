import Link from "next/link";
import Portrait from "./portrait";
import Signature from "./signature";
import ProjectArt from "./project-art";
import EditorialFlow from "./editorial-flow";
import FilmWords from "./film-words";
import {getFeaturedRecords} from "./featured-records";
import {certificateRecords} from "./achievements/data";
import {existsSync} from "node:fs";
import {join} from "node:path";
import {projects} from "./projects/data";
import "./chapters.css";
import "./cinematic-film.css";
import "./finale-v45.css";
import "./editorial-flow.css";
import "./motion-cut-v52.css";

export default function HomeChapters(){
 const records=getFeaturedRecords();
 const archive=certificateRecords.filter(r=>r.document&&existsSync(join(process.cwd(),"public",r.document.src.replace(/^\//,"")))).slice(0,8);
 const interests=["Economics","Psychology","Politics","Literature","Music"];
 return <EditorialFlow>
  <section className="ed-opening" id="film-present" data-ed-scene data-ed-theme="light">
   <div className="ed-opening-sticky">
    <div className="ed-opening-credits" aria-hidden="true"><div className="ed-opening-ticker"><span>STAY CURIOUS. KEEP BECOMING. </span><span>STAY CURIOUS. KEEP BECOMING. </span></div><div className="ed-opening-signature"><Signature/></div><span className="ed-opening-credit-label">01 / THE ART OF BECOMING</span></div>
    <div className="home-hero"><Portrait/></div>
   </div>
  </section>
  <section className="ed-manifesto" id="introduction" data-ed-scene data-ed-theme="dark">
   <div className="ed-gutter ed-caption"><span>01 / ANDIJAN, UZBEKISTAN</span><span>A PORTRAIT IN PROGRESS</span></div>
   <div className="ed-manifesto-portrait" data-ed-reveal><img src="/images/portrait-present.webp" alt="ZiyoMuhammad" fetchPriority="low" decoding="async"/><span>FIG. 01 — THE PRESENT</span></div>
   <h2 className="ed-statement" aria-label="Curious by nature. Turning questions into ideas and ideas into action.">
    {["Curious by nature.","Turning questions","into ideas and","ideas into action."].map((line,i)=><span className={"ed-statement-line line-"+i} key={line} data-ed-line style={{"--ed-i":i} as React.CSSProperties}><span>{line}</span></span>)}
   </h2>
   <div className="ed-gutter ed-manifesto-bottom"><p>Student. Founder. Always learning. I’m not there yet — and that is precisely what makes the journey interesting.</p><Link href="/about" className="ed-link">My story <span>↗</span></Link></div>
  </section>
  <section className="ed-collage ed-paper" id="film-memory" data-ed-scene data-ed-theme="light">
   <div className="ed-collage-sticky"><div className="ed-gutter ed-caption"><span>02 / THE THINGS I KEEP</span><span>ORIGINAL RECORDS</span></div>
   <div className="ed-collage-grid">
    <div className="ed-collage-intro"><h2 data-ed-reveal>Small<br/><em>moments.</em></h2><p>On a court, around a Zakovat table, in a classroom. Little things that make up a life.</p><Link href="/about" className="ed-link">Read my journey <span>↗</span></Link></div>
    {records.map((r,i)=>r.document&&<figure className={"ed-document ed-document-"+i} key={r.id} data-ed-drift style={{"--ed-tilt":[-2,2,-1,2,-2][i%5]+"deg","--ed-depth":[.28,-.18,.43,-.28,.20][i%5]} as React.CSSProperties}><div className="ed-document-image" data-ed-reveal><img src={r.document.src} alt={r.document.alt} decoding="async" fetchPriority="low"/></div><figcaption><span>{r.dateLabel} / {r.chapter}</span><strong>{r.headline}</strong></figcaption></figure>)}
   </div></div>
  </section>
  <section className="ed-future ed-paper" id="film-future" data-ed-scene data-ed-theme="light">
   <div className="ed-gutter ed-future-content"><span className="ed-kicker">03 / STILL BECOMING</span><h2 data-ed-reveal>Ideas worth<br/><em>acting on.</em></h2><p>Economics, technology, education and a desire to turn curiosity into something real.</p><Link href="/projects" className="ed-link">Explore my projects <span>↗</span></Link></div>
   <div className="ed-future-words" aria-hidden="true"><span>THINK.</span><em>LEARN.</em><span>BUILD.</span></div>
  </section>
  <section className="ed-work" id="projects" data-ed-scene data-ed-theme="dark">
   <div className="ed-gutter ed-caption"><span>04 / SELECTED INITIATIVES</span><span>01 — 03</span></div>
   <div className="ed-work-banner" aria-hidden="true"><span>IDEAS INTO ACTION.</span></div><div className="ed-gutter ed-work-heading"><h2 data-ed-reveal>Ideas into <em>action.</em></h2><p>Three different interests. One desire to turn curiosity into something real.</p></div>
   <div className="ed-gutter ed-work-grid">
    {projects.map((p,i)=><article className={"ed-work-item ed-work-"+p.kind} id={i===0?"exhibit-overthink":"exhibit-"+p.slug} key={p.slug} data-ed-scene data-ed-theme="dark">
     <Link href={"/projects/"+p.slug} className="ed-work-image" data-ed-reveal aria-label={"Explore "+p.name}><ProjectArt kind={p.kind}/></Link>
     <div className="ed-work-copy"><span className="ed-kicker">{p.number} / {p.category}</span><h3>{p.name}</h3><p>{p.summary}</p><Link href={"/projects/"+p.slug} className="ed-link">Inside the project <span>↗</span></Link></div>
    </article>)}
   </div>
  </section>
  <section className="ed-archive" id="milestone-preview" data-ed-scene data-ed-theme="dark">
   <div className="ed-gutter ed-caption"><span>05 / THE ARCHIVE</span><span>DOCUMENTED EXPERIENCES</span></div>
   <div className="ed-gutter ed-archive-heading"><h2 data-ed-reveal>Every step<br/><em>leaves a mark.</em></h2><Link href="/achievements" className="ed-link">All milestones <span>↗</span></Link></div>
   <div className="ed-gutter ed-archive-grid">{archive.map((r,i)=>r.document&&<Link href="/achievements" className="ed-archive-item" key={r.id} data-ed-reveal style={{"--ed-i":i} as React.CSSProperties}><div className="ed-archive-image"><img src={r.document.src} alt={r.document.alt} decoding="async" fetchPriority="low"/></div><div className="ed-archive-label"><span>{r.category} / {String(i+1).padStart(2,"0")}</span><strong>{r.title}</strong></div></Link>)}</div>
  </section>
  <section className="ed-personal ed-paper" id="interests" data-ed-scene data-ed-theme="light">
   <div className="ed-gutter ed-caption"><span>06 / OFF THE RECORD</span><span>MORE THAN ONE THING</span></div>
   <div className="ed-gutter ed-personal-head"><h2 data-ed-reveal>What keeps<br/><em>me curious?</em></h2><p>Not everything I do belongs on a résumé. A few things I enjoy, even without a deadline.</p></div>
   <div className="ed-gutter ed-interest-list">{interests.map((s,i)=><Link href="/off-the-record" data-ed-reveal key={s} style={{"--ed-i":i} as React.CSSProperties}><small>0{i+1}</small><span>{s}</span><b>↗</b></Link>)}</div>
   <div className="ed-gutter ed-personal-end"><Link href="/off-the-record" className="ed-link">Get to know me <span>↗</span></Link></div>
  </section>
  <section className="ed-social ed-paper" data-ed-scene data-ed-theme="light">
   <div className="ed-social-sticky"><div className="ed-social-heading"><span className="ed-kicker">07 / STAY IN TOUCH</span><h2 data-ed-reveal>See you <em>around.</em></h2></div>
   <div className="ed-fan" aria-hidden="true">{[0,1,2,3,4].map(i=><div className={"ed-fan-card ed-fan-"+i} key={i} style={{"--fan-i":i-2} as React.CSSProperties}>{i===2?<img src="/images/portrait-present.webp" alt="" decoding="async" fetchPriority="low"/>:i===0||i===4?<ProjectArt kind={i===0?"think":"earth"}/>:records[i===1?0:records.length-1]?.document?<img src={records[i===1?0:records.length-1].document!.src} alt="" decoding="async" fetchPriority="low"/>:<Signature/>}</div>)}</div>
   <div className="ed-social-links"><a href="https://t.me/Shoxruxbekovich">Telegram ↗</a><a href="https://www.instagram.com/the_zzsh/">Instagram ↗</a><a href="https://github.com/iblamezzsh-tech/zm">GitHub ↗</a></div></div>
  </section>
  <section className="film-shot film-shot-contact film-dark film-finale-shot" id="next-chapter" data-ed-scene data-ed-theme="dark" aria-label="The next chapter">
   <div className="film-finale">
    <div className="finale-inner">
     <div className="finale-heading">
      <p className="finale-edition">THE NEXT CHAPTER <span> / </span> A PORTRAIT IN PROGRESS</p>
      <h2><span className="finale-line-one"><FilmWords text="Always becoming."/></span><em className="finale-line-two"><FilmWords text="Never standing still."/></em></h2>
     </div>
     <div className="finale-portrait" role="img" aria-label="ZiyoMuhammad imagined in graduation attire">
      <img src="/images/portrait-present.webp" alt="" fetchPriority="low" decoding="async"/>
      <img src="/images/portrait-academic-attire.svg" alt="" fetchPriority="low" decoding="async"/>
     </div>
     <nav className="finale-nav finale-pages" aria-label="Explore the portfolio">
      <span>01 / EXPLORE</span>
      {([{href:"#top",label:"Home"},{href:"/about",label:"My story"},{href:"/projects",label:"Projects"},{href:"/achievements",label:"Milestones"},{href:"/off-the-record",label:"Off the record"}]).map((item,i)=><Link key={item.href} href={item.href} style={{"--nav-i":i} as React.CSSProperties}><small>0{i+1}</small><span>{item.label}</span></Link>)}
     </nav>
     <div className="finale-right">
      <nav className="finale-nav finale-socials" aria-label="Social links">
       <span>02 / ELSEWHERE</span>
       <a href="https://t.me/Shoxruxbekovich" style={{"--nav-i":0} as React.CSSProperties}><span>Telegram</span><small aria-hidden="true">↗</small></a>
       <a href="https://www.instagram.com/the_zzsh/" style={{"--nav-i":1} as React.CSSProperties}><span>Instagram</span><small aria-hidden="true">↗</small></a>
       <a href="https://github.com/iblamezzsh-tech/zm" style={{"--nav-i":2} as React.CSSProperties}><span>GitHub</span><small aria-hidden="true">↗</small></a>
      </nav>
      <div className="finale-cta"><Link href="/contact">Let’s connect <span aria-hidden="true">↗</span></Link></div>
     </div>
     <div className="finale-signature"><Signature/></div>
     <div className="finale-location">ANDIJAN / UZBEKISTAN</div>
     <div className="finale-note">THE JOURNEY CONTINUES.</div>
    </div>
    <footer className="finale-footer"><span>© ZiyoMuhammad</span><span className="finale-footer-caption">THE FUTURE IS STILL UNWRITTEN</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></footer>
   </div>
  </section>
 </EditorialFlow>
}
