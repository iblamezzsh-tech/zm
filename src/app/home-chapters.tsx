import ArrowIcon from "./arrow-icon";
import Link from "next/link";
import Portrait from "./portrait";
import Signature from "./signature";
import ProjectEdition from "./project-edition";
import ProjectStory from "./project-story-v115";
import "./project-story-v115.css";
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
import "./mobile-opening-v98.css";
import "./mobile-editorial-v99.css";
import MobileRecordViewer from "./mobile-record-viewer";
import "./mobile-gallery-v100.css";
import "./mobile-projects-v101.css";
import "./mobile-social-v102.css";
import "./mobile-finale-v103.css";
import "./motion-score-v105.css";
import "./mobile-qa-v106.css";
import "./mobile-performance-v106-3.css";
import "./adaptive-motion-v107.css";
import "./audit-v111.css";
import "./audit-v112.css";
import "./portrait-in-progress.css";
import "./cinematic-recovery.css";
import "./signature-scene-v114.css";
import "./question-thread-v116.css";

function SurfaceSeam({tone}:{tone:"ink"|"paper"}){
 return <svg className={"ed-surface-seam seam-"+tone} viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 50C190 68 340 5 595 20S1000 75 1200 42V80H0Z"/></svg>
}
export default function HomeChapters(){
 const records=getFeaturedRecords();
 const archive=certificateRecords.filter(r=>r.document&&existsSync(join(process.cwd(),"public",r.document.src.replace(/^\//,"")))).slice(0,8);
 const interests=["Economics","Psychology","Politics","Literature","Music"];
 return <EditorialFlow>
  <MobileRecordViewer records={Array.from(new Map([...records,...archive].map(r=>[r.id,r])).values())}/>
  <section className="ed-opening" id="film-present" data-motion-scene="opening" data-ed-scene data-ed-theme="light">
   <div className="ed-opening-sticky"><PageAtmosphere kind="story" dark/>
    <OpeningMarquee/>
    <div className="zm-lite-credit-portrait" aria-hidden="true"><img src="/images/portrait-present.webp" alt="" decoding="async"/></div>
    <div className="ed-opening-credits" aria-hidden="true"><div className="zm-mobile-credit-kicker"><span>A PORTRAIT IN PROGRESS</span></div><div className="ed-opening-signature"><Signature continuation/></div><span className="ed-opening-credit-label">01 / THE ART OF BECOMING</span></div>
    <div className="home-hero zm-opening-portrait"><Portrait/></div>
   </div>
  </section>
  <section className="ed-manifesto" id="introduction" data-motion-scene="manifesto" data-ed-scene data-ed-theme="dark"><PageAtmosphere kind="story" dark/>
   <div className="ed-gutter ed-caption"><span>01 / ANDIJAN, UZBEKISTAN</span><span>A PORTRAIT IN PROGRESS</span></div>
   <div className="ed-manifesto-portrait" data-ed-reveal><img src="/images/portrait-present.webp" alt="ZiyoMuhammad" fetchPriority="low" decoding="async"/><span>FIG. 01 — THE PRESENT</span></div>
   <h2 className="ed-statement" aria-label="Curious by nature. Turning questions into ideas and ideas into action.">
    {["Curious by nature.","Turning questions","into ideas and","ideas into action."].map((line,i)=><span className={"ed-statement-line line-"+i} key={line} data-ed-line style={{"--ed-i":i} as React.CSSProperties}><KineticText text={line} kind="marker" index={i}/></span>)}
   </h2>
   <div className="ed-gutter ed-manifesto-bottom"><p>Student. Founder. Always learning. I’m not there yet — and that is precisely what makes the journey interesting.</p><Link href="/about" className="ed-link">My story <span><ArrowIcon direction="up-right"/></span></Link></div>
  </section>
  <section className={"ed-collage ed-paper"+(records.length===0?" zm-memory-empty":"")} id="film-memory" data-motion-scene="memory" data-ed-scene data-ed-theme="light">
   <div className="ed-collage-sticky"><PageAtmosphere kind="gallery"/><div className="ed-gutter ed-caption"><span>02 / THE THINGS I KEEP</span><span>ORIGINAL RECORDS</span></div>
   <div className="ed-collage-grid">
    <div className="ed-collage-intro"><h2 className="kt-heading" aria-label="Small moments."><KineticText text="Small" kind="marker"/><br/><em><KineticText text="moments." kind="marker" index={1}/></em></h2><p>On a court, around a Zakovat table, in a classroom. Little things that make up a life.</p><Link href="/about" className="ed-link">Read my journey <span><ArrowIcon direction="up-right"/></span></Link></div>
    {records.map((r,i)=>r.document&&<figure className={"ed-document ed-document-"+i} key={r.id} data-ed-drift style={{"--ed-tilt":[-2,2,-1,2,-2][i%5]+"deg","--ed-depth":[.28,-.18,.43,-.28,.20][i%5]} as React.CSSProperties}><div className="ed-document-image" data-ed-reveal><img src={r.document.src} alt={r.document.alt} decoding="async" fetchPriority="low"/><button type="button" className="zm-memory-inspect" data-mobile-record={r.id} aria-label={"Inspect "+r.title}><span aria-hidden="true"><ArrowIcon direction="up-right"/></span></button></div><figcaption><span><KineticText text={r.dateLabel+" / "+r.chapter} kind="stamp"/></span><strong><KineticText text={r.headline} kind="caption" index={1}/></strong></figcaption></figure>)}
   </div><div className="zm-memory-rail-meter" aria-hidden="true"><span>SCROLL / EXPLORE</span><i><b/></i><span>{String(records.length).padStart(2,"0")} RECORDS</span></div></div>
  </section>
  <section className="ed-future ed-paper" id="film-future" data-motion-scene="future" data-ed-scene data-ed-theme="light"><div className="zm-future-stage"><PageAtmosphere kind="finance"/>
   <div className="ed-gutter ed-future-content"><span className="ed-kicker">03 / STILL BECOMING</span><h2 className="kt-heading" aria-label="Ideas worth acting on."><KineticText text="Ideas worth" kind="assemble"/><br/><em><KineticText text="acting on." kind="unfold" index={1}/></em></h2><p>Economics, technology, education and a desire to turn curiosity into something real.</p><Link href="/projects" className="ed-link">Explore my projects <span><ArrowIcon direction="up-right"/></span></Link></div>
   <div className="ed-future-words" aria-hidden="true"><span>THINK<span className="zm-v116-think-dot"/></span><em>LEARN.</em><span>BUILD.</span></div><div className="zm-future-timeline" aria-hidden="true"><span>01 / THINK</span><i/><span>02 / LEARN</span><i/><span>03 / BUILD</span></div></div>
  </section>
  <section className="zm-worlds" data-motion-scene="worlds" aria-label="Two sides of my journey" data-ed-scene data-ed-theme="dark"><SurfaceSeam tone="ink"/><PageAtmosphere kind="think" dark/>
   <div className="ed-gutter ed-caption"><span>03 / TWO WORLDS</span><span>ONE CURIOSITY</span></div>
   <div className="zm-worlds-grid">
    <Link href="/projects" className="zm-world zm-world-build" data-ed-reveal>
     <div className="zm-world-art" aria-hidden="true"><PageAtmosphere kind="think"/><ProjectEdition project={projects[0]}/></div>
     <div className="zm-world-copy"><span>01 / THE WORK</span><strong><KineticText text="What I" kind="assemble"/> <em><KineticText text="build." kind="engrave" index={1}/></em></strong><small>Explore the projects <b aria-hidden="true"><ArrowIcon direction="up-right"/></b></small></div>
    </Link>
    <Link href="/off-the-record" className="zm-world zm-world-life" data-ed-reveal>
     <div className="zm-world-art" aria-hidden="true"><PageAtmosphere kind="notebook" dark/><div className="zm-world-sig"><Signature/></div></div>
     <div className="zm-world-copy"><span>02 / OFF THE RECORD</span><strong><KineticText text="What I" kind="unfold"/> <em><KineticText text="love." kind="swerve" index={1}/></em></strong><small>Beyond the résumé <b aria-hidden="true"><ArrowIcon direction="up-right"/></b></small></div>
    </Link>
   </div>
  </section>
  <section className="ed-work" id="projects" data-motion-scene="projects" data-ed-scene data-ed-theme="dark"><PageAtmosphere kind="gallery" dark/>
   <div className="ed-gutter ed-caption"><span>04 / SELECTED INITIATIVES</span><span>01 — 03</span></div>
   <div className="ed-work-banner" aria-hidden="true" data-running="false"><div className="qa-marquee-track">{[0,1].map(i=><div key={i} className="qa-marquee-unit"><span>QUESTIONS <ArrowIcon direction="right"/> ACTION.</span><span>QUESTIONS <ArrowIcon direction="right"/> ACTION.</span></div>)}</div></div><div className="ed-gutter ed-work-heading"><h2 className="kt-heading" aria-label="Ideas into action."><KineticText text="Ideas into" kind="assemble"/> <em><KineticText text="action." kind="engrave" index={1}/></em></h2><p>Three different interests. One desire to turn curiosity into something real.</p><Link href="/projects" className="ed-link zm-v115-projects-cta">Explore the projects <span><ArrowIcon direction="up-right"/></span></Link></div>
   <div className="ed-gutter ed-work-grid">
    {projects.map((p,i)=><article className={"ed-work-item ed-work-"+p.kind} id={i===0?"exhibit-overthink":"exhibit-"+p.slug} key={p.slug} data-ed-scene data-ed-theme="dark">
     {p.kind!=="think"?<ProjectStory project={p}/>:<>
     <div className="zm-project-mobile-index" aria-hidden="true"><span>SELECTED INITIATIVE / {p.number}</span><span>{p.role}</span></div>
     <Link href={"/projects/"+p.slug} className="ed-work-image" data-ed-reveal aria-label={"Explore "+p.name}><ProjectEdition project={p} signatureQuestion={i===0}/></Link>
     <span className="ed-project-ghost" aria-hidden="true">{p.number}</span><div className="ed-work-copy"><span className="ed-kicker">{p.number} / {p.category}</span><h3 className="ed-project-name"><KineticText text={p.name} kind="press"/></h3><p>{p.summary}</p><Link href={"/projects/"+p.slug} className="ed-link">Inside the project <span><ArrowIcon direction="up-right"/></span></Link></div>
     </>}
    </article>)}
   </div>
  </section>
  <section className="ed-archive" id="milestone-preview" data-motion-scene="archive" data-ed-scene data-ed-theme="dark"><PageAtmosphere kind="archive" dark/>
   <div className="ed-gutter ed-caption"><span>05 / THE ARCHIVE</span><span>DOCUMENTED EXPERIENCES</span></div>
   <div className="ed-gutter ed-archive-heading"><h2 className="kt-heading" aria-label="Every step leaves a mark."><KineticText text="Every step" kind="press"/><br/><em><KineticText text="leaves a mark." kind="engrave" index={1}/></em></h2><Link href="/achievements" className="ed-link">All milestones <span><ArrowIcon direction="up-right"/></span></Link></div>
   {archive.length===0&&<div className="ed-gutter zm-archive-empty"><span>ZM / ARCHIVE NOTES</span><p>Original documents are not available in this build. You can still explore the personal records.</p><Link href="/achievements" className="ed-link">Explore milestones <span><ArrowIcon direction="up-right"/></span></Link></div>}
   <div className="ed-gutter ed-archive-grid">{archive.map((r,i)=>r.document&&<Link href={"/achievements#record-"+r.id} className="ed-archive-item" key={r.id} data-return-record={r.id} data-ed-reveal style={{"--ed-i":i} as React.CSSProperties}>
    <div className="ed-record-display">
     <svg className="ed-record-outline" viewBox="0 0 360 310" preserveAspectRatio="none" aria-hidden="true">
      <path d="M9 1H351Q359 1 359 9V252Q359 260 351 260H227Q215 260 207 270L181 298Q171 309 157 309H9Q1 309 1 301V9Q1 1 9 1Z" vectorEffect="non-scaling-stroke"/>
     </svg>
     <div className="ed-record-index" aria-hidden="true">{String(i+1).padStart(2,"0")}</div>
     <div className="ed-archive-image"><img src={r.document.src} alt={r.document.alt} loading="lazy" decoding="async" fetchPriority="low"/></div>
     <div className="ed-record-tab"><span>{r.category}</span><b className={r.period?"":"ed-record-undated"}>{r.period?.match(/(?:19|20)\d{2}/g)?.at(-1)??"Undated"}</b></div>
    </div>
    <div className="ed-archive-label"><strong>{r.title}</strong><span className="ed-record-arrow" aria-hidden="true"><ArrowIcon direction="up-right"/></span></div>
   </Link>)}</div>
  </section>
  <section className="ed-personal ed-paper" id="interests" data-motion-scene="personal" data-ed-scene data-ed-theme="light"><SurfaceSeam tone="paper"/><PageAtmosphere kind="notebook"/>
   <div className="ed-gutter ed-caption"><span>06 / OFF THE RECORD</span><span>MORE THAN ONE THING</span></div>
   <div className="ed-gutter ed-personal-head"><h2 className="kt-heading" aria-label="What keeps me curious?"><KineticText text="What keeps" kind="unfold"/><br/><em><KineticText text="me curious?" kind="swerve" index={1}/></em></h2><p>Not everything I do belongs on a résumé. A few things I enjoy, even without a deadline.</p></div>
   <div className="ed-gutter ed-interest-list">{interests.map((s,i)=><Link href={"/off-the-record#"+s.toLowerCase()} data-ed-reveal key={s} style={{"--ed-i":i} as React.CSSProperties}><small>0{i+1}</small><span className="zm-interest-label"><span className="zm-interest-text">{s}</span></span><b><ArrowIcon direction="up-right"/></b></Link>)}</div>
   <div className="ed-gutter ed-personal-end"><Link href="/off-the-record" className="ed-link">Get to know me <span><ArrowIcon direction="up-right"/></span></Link></div>
  </section>
  <section className="ed-social ed-paper" data-motion-scene="social" data-ed-scene data-ed-theme="light">
   <div className="ed-social-sticky"><PageAtmosphere kind="post"/><div className="zm-v114-fan-kicker ed-gutter"><span>07 / WHAT I CARRY FORWARD</span><span>THE NEXT CHAPTER <ArrowIcon direction="down"/></span></div>
   <div className="ed-fan ed-fan-without-portrait" aria-hidden="true">
    {[0,1,2,3].map(i=><div className={"ed-fan-card ed-fan-"+i} key={i} style={{"--fan-i":i-1.5} as React.CSSProperties}>
     {i===0||i===3?<ProjectEdition project={projects[i===0?0:2]}/>:records[i===1?0:records.length-1]?.document?<img src={records[i===1?0:records.length-1].document!.src} alt="" loading="lazy" decoding="async" fetchPriority="low"/>:<>
      <span className="zm-fan-desktop-fallback"><Signature/></span>
      <div className={"zm-fan-note zm-fan-note-"+i}><span>ZM / OFF THE RECORD</span>{i===1?<><strong>Stay<br/><em>curious.</em></strong><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="36"/><ellipse cx="50" cy="50" rx="17" ry="36" transform="rotate(45 50 50)"/><path d="M14 50H86M50 14V86"/></svg><small>THINK. LEARN. BUILD.</small></>:<><strong>Always<br/><em>learning.</em></strong><Signature/><small>THE NEXT CHAPTER</small></>}</div>
     </>}
    </div>)}
    <div className="ed-fan-card zm-fan-center"><ProjectEdition project={projects[1]}/></div>
   </div>
   <div className="zm-social-handoff" aria-hidden="true"><svg viewBox="0 0 400 46" preserveAspectRatio="none"><path d="M0 29C65 29 98 12 155 12H173L185 2H215L227 12H245C302 12 335 29 400 29V46H0Z"/></svg></div></div>
  </section>
  <section className="film-shot film-shot-contact film-dark film-finale-shot" id="next-chapter" data-motion-scene="finale" data-ed-scene data-ed-theme="dark" aria-label="The next chapter">
   <div className="film-finale">
    <div className="finale-inner"><PageAtmosphere kind="earth" dark/>
     <div className="finale-heading">
      <p className="finale-edition">THE NEXT CHAPTER <span> / </span> IMAGINED FUTURE</p>
      <h2 className="finale-desktop-title"><span className="finale-line-one"><FilmWords text="Always"/></span> <em className="finale-line-two"><FilmWords text="becoming."/></em></h2>
      <h2 className="zm-finale-reference-title"><span><FilmWords text="Always"/> <em><FilmWords text="becoming."/></em></span></h2>
     </div>
     <div className="finale-portrait" role="img" aria-label="ZiyoMuhammad imagined in graduation attire">
      <img src="/images/portrait-present.webp" alt="" loading="lazy" fetchPriority="low" decoding="async"/>
      <img src="/images/portrait-academic-attire.svg" alt="" loading="lazy" fetchPriority="low" decoding="async"/>
     </div>
     <div className="finale-right">
      <nav className="finale-nav finale-socials" aria-label="Social links">
       <span><span className="zm-finale-desktop-label">02 / ELSEWHERE</span><span className="zm-finale-reference-label">FOLLOW ME</span></span>
       <a href="https://t.me/Shoxruxbekovich" style={{"--nav-i":0} as React.CSSProperties}><span>Telegram</span><small aria-hidden="true"><ArrowIcon direction="up-right"/></small></a>
       <a href="https://www.instagram.com/the_zzsh/" style={{"--nav-i":1} as React.CSSProperties}><span>Instagram</span><small aria-hidden="true"><ArrowIcon direction="up-right"/></small></a>
       <a href="https://github.com/iblamezzsh-tech/zm" style={{"--nav-i":2} as React.CSSProperties}><span>GitHub</span><small aria-hidden="true"><ArrowIcon direction="up-right"/></small></a>
      </nav>
      <div className="finale-cta"><Link href="/contact">Let’s connect <span aria-hidden="true"><ArrowIcon direction="up-right"/></span></Link></div>
     </div>
     <div className="finale-signature"><Signature/></div>
     <div className="zm-finale-mobile-colophon" aria-hidden="true"><span>ANDIJAN / UZBEKISTAN</span><span>THE JOURNEY CONTINUES.</span></div>
     <svg className="zm-finale-mobile-cut" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 0Q0 9 12 9H42Q51 9 59 18Q65 24 78 24H0Z M400 0Q400 9 388 9H358Q349 9 341 18Q335 24 322 24H400Z"/></svg>
     <div className="finale-location">ANDIJAN / UZBEKISTAN</div>
     <div className="finale-note">THE JOURNEY CONTINUES.</div>
    </div>
    <footer className="finale-footer"><span>© ZiyoMuhammad</span><span className="finale-footer-caption">THE FUTURE IS STILL UNWRITTEN</span><a href="#top">Back to top <span aria-hidden="true"><ArrowIcon direction="up"/></span></a></footer>
    <svg className="finale-frame-cut finale-frame-cut-left" viewBox="0 0 260 42" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0C0 16 9 24 25 24H180C194 24 201 27 213 36C220 41 226 42 238 42H260V42H0Z"/></svg>
    <svg className="finale-frame-cut finale-frame-cut-right" viewBox="0 0 260 42" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0C0 16 9 24 25 24H180C194 24 201 27 213 36C220 41 226 42 238 42H260V42H0Z"/></svg>
   </div>
  </section>
 </EditorialFlow>
}
