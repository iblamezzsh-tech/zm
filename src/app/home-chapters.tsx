import Link from "next/link";
import Portrait from "./portrait";
import Signature from "./signature";
import ProjectEdition from "./project-edition";
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
import "./studio54.css";
import "./studio55.css";
import "./studio62.css";
import "./studio63.css";
import "./motion-v74.css";
import "./motion-v76.css";
import PageAtmosphere from "./page-atmosphere";
import "./home-atmosphere-v78.css";
import "./home-contours-v80.css";
import OpeningMarquee from "./opening-marquee";
import "./opening-v81.css";
import KineticText from "./kinetic-text";
import "./kinetic-v84.css";
import "./motion-v84.css";
import "./memory-v89.css";
import "./work-marquee-v90.css";
import "./archive-v91.css";
import "./finale-frame-v92.css";
import "./mobile-v93.css";
import "./mobile-hero-v94.css";
import "./mobile-hero-v97.css";
import "./mobile-finale-v95.css";

function SurfaceSeam({tone}:{tone:"ink"|"paper"}){
 return <svg className={"ed-surface-seam seam-"+tone} viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 50C190 68 340 5 595 20S1000 75 1200 42V80H0Z"/></svg>
}
export default function HomeChapters(){
 const records=getFeaturedRecords();
 const archive=certificateRecords.filter(r=>r.document&&existsSync(join(process.cwd(),"public",r.document.src.replace(/^\//,"")))).slice(0,8);
 const interests=["Economics","Psychology","Politics","Literature","Music"];
 return <EditorialFlow>
  <section className="ed-opening" id="film-present" data-ed-scene data-ed-theme="light">
   <div className="ed-opening-sticky"><PageAtmosphere kind="story" dark/>
    <OpeningMarquee/>
    <div className="ed-opening-credits" aria-hidden="true"><div className="zm-mobile-credit-kicker"><img src="/icon.svg" width="38" height="38" alt=""/><span>A PORTRAIT IN PROGRESS</span></div><div className="ed-opening-signature"><Signature/></div><span className="ed-opening-credit-label">01 / THE ART OF BECOMING</span></div>
    <div className="home-hero zm-opening-portrait"><Portrait/></div>
   </div>
  </section>
  <section className="ed-manifesto" id="introduction" data-ed-scene data-ed-theme="dark"><PageAtmosphere kind="story" dark/>
   <div className="ed-gutter ed-caption"><span>01 / ANDIJAN, UZBEKISTAN</span><span>A PORTRAIT IN PROGRESS</span></div>
   <div className="ed-manifesto-portrait" data-ed-reveal><img src="/images/portrait-present.webp" alt="ZiyoMuhammad" fetchPriority="low" decoding="async"/><span>FIG. 01 — THE PRESENT</span></div>
   <h2 className="ed-statement" aria-label="Curious by nature. Turning questions into ideas and ideas into action.">
    {["Curious by nature.","Turning questions","into ideas and","ideas into action."].map((line,i)=><span className={"ed-statement-line line-"+i} key={line} data-ed-line style={{"--ed-i":i} as React.CSSProperties}><KineticText text={line} kind="marker" index={i}/></span>)}
   </h2>
   <div className="ed-gutter ed-manifesto-bottom"><p>Student. Founder. Always learning. I’m not there yet — and that is precisely what makes the journey interesting.</p><Link href="/about" className="ed-link">My story <span>↗</span></Link></div>
  </section>
  <section className="ed-collage ed-paper" id="film-memory" data-ed-scene data-ed-theme="light">
   <div className="ed-collage-sticky"><PageAtmosphere kind="gallery"/><div className="ed-gutter ed-caption"><span>02 / THE THINGS I KEEP</span><span>ORIGINAL RECORDS</span></div>
   <div className="ed-collage-grid">
    <div className="ed-collage-intro"><h2 className="kt-heading" aria-label="Small moments."><KineticText text="Small" kind="marker"/><br/><em><KineticText text="moments." kind="marker" index={1}/></em></h2><p>On a court, around a Zakovat table, in a classroom. Little things that make up a life.</p><Link href="/about" className="ed-link">Read my journey <span>↗</span></Link></div>
    {records.map((r,i)=>r.document&&<figure className={"ed-document ed-document-"+i} key={r.id} data-ed-drift style={{"--ed-tilt":[-2,2,-1,2,-2][i%5]+"deg","--ed-depth":[.28,-.18,.43,-.28,.20][i%5]} as React.CSSProperties}><div className="ed-document-image" data-ed-reveal><img src={r.document.src} alt={r.document.alt} decoding="async" fetchPriority="low"/></div><figcaption><span><KineticText text={r.dateLabel+" / "+r.chapter} kind="stamp"/></span><strong><KineticText text={r.headline} kind="caption" index={1}/></strong></figcaption></figure>)}
   </div></div>
  </section>
  <section className="ed-future ed-paper" id="film-future" data-ed-scene data-ed-theme="light"><PageAtmosphere kind="finance"/>
   <div className="ed-gutter ed-future-content"><span className="ed-kicker">03 / STILL BECOMING</span><h2 className="kt-heading" aria-label="Ideas worth acting on."><KineticText text="Ideas worth" kind="assemble"/><br/><em><KineticText text="acting on." kind="unfold" index={1}/></em></h2><p>Economics, technology, education and a desire to turn curiosity into something real.</p><Link href="/projects" className="ed-link">Explore my projects <span>↗</span></Link></div>
   <div className="ed-future-words" aria-hidden="true"><span>THINK.</span><em>LEARN.</em><span>BUILD.</span></div>
  </section>
  <section className="zm-worlds" aria-label="Two sides of my journey" data-ed-scene data-ed-theme="dark"><SurfaceSeam tone="ink"/><PageAtmosphere kind="think" dark/>
   <div className="ed-gutter ed-caption"><span>03 / TWO WORLDS</span><span>ONE CURIOSITY</span></div>
   <div className="zm-worlds-grid">
    <Link href="/projects" className="zm-world zm-world-build" data-ed-reveal>
     <div className="zm-world-art" aria-hidden="true"><PageAtmosphere kind="think"/><ProjectEdition project={projects[0]}/></div>
     <div className="zm-world-copy"><span>01 / THE WORK</span><strong><KineticText text="What I" kind="assemble"/> <em><KineticText text="build." kind="engrave" index={1}/></em></strong><small>Explore the projects <b aria-hidden="true">↗</b></small></div>
    </Link>
    <Link href="/off-the-record" className="zm-world zm-world-life" data-ed-reveal>
     <div className="zm-world-art" aria-hidden="true"><PageAtmosphere kind="notebook" dark/><div className="zm-world-sig"><Signature/></div></div>
     <div className="zm-world-copy"><span>02 / OFF THE RECORD</span><strong><KineticText text="What I" kind="unfold"/> <em><KineticText text="love." kind="swerve" index={1}/></em></strong><small>Beyond the résumé <b aria-hidden="true">↗</b></small></div>
    </Link>
   </div>
  </section>
  <section className="ed-work" id="projects" data-ed-scene data-ed-theme="dark"><PageAtmosphere kind="gallery" dark/>
   <div className="ed-gutter ed-caption"><span>04 / SELECTED INITIATIVES</span><span>01 — 03</span></div>
   <div className="ed-work-banner" aria-hidden="true"><div className="qa-marquee-track">{[0,1].map(i=><div key={i} className="qa-marquee-unit"><span>QUESTIONS → ACTION.</span><span>QUESTIONS → ACTION.</span></div>)}</div></div><div className="ed-gutter ed-work-heading"><h2 className="kt-heading" aria-label="Ideas into action."><KineticText text="Ideas into" kind="assemble"/> <em><KineticText text="action." kind="engrave" index={1}/></em></h2><p>Three different interests. One desire to turn curiosity into something real.</p></div>
   <div className="ed-gutter ed-work-grid">
    {projects.map((p,i)=><article className={"ed-work-item ed-work-"+p.kind} id={i===0?"exhibit-overthink":"exhibit-"+p.slug} key={p.slug} data-ed-scene data-ed-theme="dark">
     <Link href={"/projects/"+p.slug} className="ed-work-image" data-ed-reveal aria-label={"Explore "+p.name}><ProjectEdition project={p}/></Link>
     <span className="ed-project-ghost" aria-hidden="true">{p.number}</span><div className="ed-work-copy"><span className="ed-kicker">{p.number} / {p.category}</span><h3 className="ed-project-name"><KineticText text={p.name} kind="press"/></h3><p>{p.summary}</p><Link href={"/projects/"+p.slug} className="ed-link">Inside the project <span>↗</span></Link></div>
    </article>)}
   </div>
  </section>
  <section className="ed-archive" id="milestone-preview" data-ed-scene data-ed-theme="dark"><PageAtmosphere kind="archive" dark/>
   <div className="ed-gutter ed-caption"><span>05 / THE ARCHIVE</span><span>DOCUMENTED EXPERIENCES</span></div>
   <div className="ed-gutter ed-archive-heading"><h2 className="kt-heading" aria-label="Every step leaves a mark."><KineticText text="Every step" kind="press"/><br/><em><KineticText text="leaves a mark." kind="engrave" index={1}/></em></h2><Link href="/achievements" className="ed-link">All milestones <span>↗</span></Link></div>
   <div className="ed-gutter ed-archive-grid">{archive.map((r,i)=>r.document&&<Link href="/achievements" className="ed-archive-item" key={r.id} data-ed-reveal style={{"--ed-i":i} as React.CSSProperties}>
    <div className="ed-record-display">
     <svg className="ed-record-outline" viewBox="0 0 360 310" preserveAspectRatio="none" aria-hidden="true">
      <path d="M9 1H351Q359 1 359 9V252Q359 260 351 260H227Q215 260 207 270L181 298Q171 309 157 309H9Q1 309 1 301V9Q1 1 9 1Z" vectorEffect="non-scaling-stroke"/>
     </svg>
     <div className="ed-record-index" aria-hidden="true">{String(i+1).padStart(2,"0")}</div>
     <div className="ed-archive-image"><img src={r.document.src} alt={r.document.alt} decoding="async" fetchPriority="low"/></div>
     <div className="ed-record-tab"><span>{r.category}</span><b>{r.period?.match(/(?:19|20)\d{2}/g)?.at(-1)??String(i+1).padStart(2,"0")}</b></div>
    </div>
    <div className="ed-archive-label"><strong>{r.title}</strong><span className="ed-record-arrow" aria-hidden="true">↗</span></div>
   </Link>)}</div>
  </section>
  <section className="ed-personal ed-paper" id="interests" data-ed-scene data-ed-theme="light"><SurfaceSeam tone="paper"/><PageAtmosphere kind="notebook"/>
   <div className="ed-gutter ed-caption"><span>06 / OFF THE RECORD</span><span>MORE THAN ONE THING</span></div>
   <div className="ed-gutter ed-personal-head"><h2 className="kt-heading" aria-label="What keeps me curious?"><KineticText text="What keeps" kind="unfold"/><br/><em><KineticText text="me curious?" kind="swerve" index={1}/></em></h2><p>Not everything I do belongs on a résumé. A few things I enjoy, even without a deadline.</p></div>
   <div className="ed-gutter ed-interest-list">{interests.map((s,i)=><Link href="/off-the-record" data-ed-reveal key={s} style={{"--ed-i":i} as React.CSSProperties}><small>0{i+1}</small><span>{s}</span><b>↗</b></Link>)}</div>
   <div className="ed-gutter ed-personal-end"><Link href="/off-the-record" className="ed-link">Get to know me <span>↗</span></Link></div>
  </section>
  <section className="ed-social ed-paper" data-ed-scene data-ed-theme="light">
   <div className="ed-social-sticky"><PageAtmosphere kind="post"/><div className="ed-social-heading"><span className="ed-kicker">07 / STAY IN TOUCH</span><h2 className="kt-heading" aria-label="See you around."><KineticText text="See you" kind="press"/> <em><KineticText text="around." kind="swerve" index={1}/></em></h2></div>
   <div className="ed-fan ed-fan-without-portrait" aria-hidden="true">{[0,1,2,3].map(i=><div className={"ed-fan-card ed-fan-"+i} key={i} style={{"--fan-i":i-1.5} as React.CSSProperties}>{i===0||i===3?<ProjectEdition project={projects[i===0?0:2]}/>:records[i===1?0:records.length-1]?.document?<img src={records[i===1?0:records.length-1].document!.src} alt="" decoding="async" fetchPriority="low"/>:<Signature/>}</div>)}</div>
   <div className="zm-mobile-social-caption">Find me beyond the portfolio.</div><div className="ed-social-links"><a href="https://t.me/Shoxruxbekovich">Telegram ↗</a><a href="https://www.instagram.com/the_zzsh/">Instagram ↗</a><a href="https://github.com/iblamezzsh-tech/zm">GitHub ↗</a></div></div>
  </section>
  <section className="film-shot film-shot-contact film-dark film-finale-shot" id="next-chapter" data-ed-scene data-ed-theme="dark" aria-label="The next chapter">
   <div className="film-finale">
    <div className="finale-inner"><PageAtmosphere kind="earth" dark/>
     <div className="zm-mobile-finale-index" aria-hidden="true"><span>THE ART OF BECOMING</span><img src="/icon.svg" alt="" width="28" height="28"/><span>ZM / 2026</span></div>
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
    <svg className="finale-frame-cut finale-frame-cut-left" viewBox="0 0 260 42" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0C0 16 9 24 25 24H180C194 24 201 27 213 36C220 41 226 42 238 42H260V42H0Z"/></svg>
    <svg className="finale-frame-cut finale-frame-cut-right" viewBox="0 0 260 42" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0C0 16 9 24 25 24H180C194 24 201 27 213 36C220 41 226 42 238 42H260V42H0Z"/></svg>
   </div>
  </section>
 </EditorialFlow>
}
