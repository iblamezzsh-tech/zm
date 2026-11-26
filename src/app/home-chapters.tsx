import Link from "next/link";
import Portrait from "./portrait";
import Signature from "./signature";
import ProjectArt from "./project-art";
import FilmStage from "./film-stage";
import FilmWords from "./film-words";
import {getFeaturedRecords} from "./featured-records";
import {projects} from "./projects/data";
import "./chapters.css";
import "./cinematic-film.css";
import "./editorial-film-v44.css";
import "./finale-v45.css";

export default function HomeChapters(){
 const records=getFeaturedRecords();
 const archive=records.filter(r=>r.document).slice(0,3);
 return <FilmStage>
  <section className="film-shot film-shot-hero" id="film-present" aria-label="The present"><div className="film-hero-layer"><div className="home-hero"><Portrait/></div></div></section>
  <section className="film-shot film-shot-origin film-yellow" id="introduction" aria-label="Curiosity">
   <div className="film-copy"><div className="film-kicker">01 / ANDIJAN, UZBEKISTAN</div><h2><span className="edit-line"><FilmWords text="I’m not"/></span><em className="edit-line"><FilmWords text="there yet."/></em></h2><p>I'm a student with questions, projects and a long way to go. There is still a long way to go.</p><Link href="/about" className="film-link">My story <span>↗</span></Link></div>
  </section>
  <section className="film-shot film-shot-memory film-dark" id="film-memory" aria-label="The journey">
   <div className="film-copy"><div className="film-kicker">02 / THE THINGS I KEEP</div><h2><FilmWords text="Small"/><br/><em><FilmWords text="moments."/></em></h2><p>Leading school teams. Finding the answer to a Zakovat question. Learning something new on a court or in a classroom.</p><Link className="film-link" href="/about">Read my journey <span>↗</span></Link></div>
   <div className="film-art film-paper-cloud film-memory-strip">{archive.map((r,i)=><figure className={"film-paper paper-"+i} key={r.id}><img src={r.document!.src} alt={r.document!.alt} loading="eager" fetchPriority="low" decoding="async"/><figcaption>{r.dateLabel} / {r.chapter}</figcaption></figure>)}</div>
  </section>
  <section className="film-shot film-shot-future" id="film-future" aria-label="The future">
   
   <div className="film-copy"><div className="film-kicker">03 / STILL BECOMING</div><h2><FilmWords text="The future"/><br/><em><FilmWords text="isn’t written."/></em></h2><p>Economics, technology, education and ideas worth turning into action. This is where the next chapter begins.</p><Link className="film-link" href="/projects">Explore my projects <span>↗</span></Link></div>
  </section>
  {projects.map((p,i)=><section key={p.slug} className={"film-shot film-project film-project-"+p.kind+(i===1?"":" film-dark")} id={i===0?"projects":"exhibit-"+p.slug} aria-label={p.name}>
   <div className="film-copy"><div className="film-kicker">{p.number} / {p.name} — {p.role}</div><h2><span className="edit-line"><FilmWords text={p.headline}/></span><em className="edit-line"><FilmWords text={p.emphasis}/></em></h2><p>{p.summary}</p><Link className="film-link" href={"/projects/"+p.slug}>Inside {p.name} <span>↗</span></Link></div><div className="film-art film-project-art"><div className="film-project-aperture"><ProjectArt kind={p.kind}/></div></div>
  </section>)}
  <section className="film-shot film-shot-archive" id="milestone-preview" aria-label="Milestones">
   <div className="film-copy"><div className="film-kicker">04 / ORIGINAL RECORDS</div><h2><FilmWords text="Before the"/><br/><em><FilmWords text="next chapter."/></em></h2><p>From the handball court to an Olympiad and a room full of different perspectives. A few moments that made me who I am today.</p><Link className="film-link" href="/achievements">Discover all milestones <span>↗</span></Link></div>
   <div className="film-art film-paper-cloud archive-cloud film-archive-strip">{records.filter(r=>r.document).slice(3,6).map((r,i)=>r.document&&<figure className={"film-paper paper-"+i} key={r.id}><img src={r.document.src} alt={r.document.alt} loading="eager" fetchPriority="low" decoding="async"/><figcaption>{r.dateLabel} / {r.chapter}</figcaption></figure>)}</div>
  </section>
  <section className="film-shot film-shot-personal film-yellow" id="interests" aria-label="Off the record"><div className="film-copy"><div className="film-kicker">05 / OFF THE RECORD</div><h2><FilmWords text="More than"/><br/><em><FilmWords text="one thing."/></em></h2><p>From economics and psychology to the violin: some of the things I enjoy when there is no deadline attached.</p><Link href="/off-the-record" className="film-link">Get to know me <span>↗</span></Link></div><div className="film-art film-interests">{["Economics","Psychology","Politics","Literature","Music"].map((s,i)=><span key={s} style={{"--interest-index":i} as React.CSSProperties}><small>0{i+1}</small>{s}</span>)}</div></section>
  <section className="film-shot film-shot-contact film-dark film-finale-shot" id="next-chapter" aria-label="The next chapter">
   <div className="film-finale">
    <div className="finale-inner">
     <div className="finale-heading">
      <div className="finale-signature"><Signature/></div>
      <h2><FilmWords text="Always"/><em><FilmWords text="becoming."/></em><br/><FilmWords text="Never"/><em><FilmWords text="standing still."/></em></h2>
     </div>
     <nav className="finale-nav finale-pages" aria-label="Explore the portfolio">
      <span>EXPLORE</span>
      <a href="#top">Home</a><Link href="/about">My story</Link><Link href="/projects">Projects</Link><Link href="/achievements">Milestones</Link><Link href="/off-the-record">Off the record</Link>
     </nav>
     <div className="finale-portrait" role="img" aria-label="ZiyoMuhammad imagined in graduation attire">
      <img src="/images/portrait-present.webp" alt="" fetchPriority="low" decoding="async"/>
      <img src="/images/portrait-academic-attire.svg" alt="" fetchPriority="low" decoding="async"/>
     </div>
     <nav className="finale-nav finale-socials" aria-label="Social links">
      <span>FOLLOW ME</span>
      <a href="https://t.me/Shoxruxbekovich">Telegram</a><a href="https://www.instagram.com/the_zzsh/">Instagram</a><a href="https://github.com/iblamezzsh-tech/zm">GitHub</a>
     </nav>
     <div className="finale-cta"><Link href="/contact">Let’s connect <span aria-hidden="true">↗</span></Link></div>
     <div className="finale-location">ANDIJAN / UZBEKISTAN</div>
     <div className="finale-note">THE JOURNEY CONTINUES.</div>
    </div>
    <footer className="finale-footer"><span>© ZiyoMuhammad</span><a href="#top">Back to top ↑</a></footer>
   </div>
  </section>
 </FilmStage>
}
