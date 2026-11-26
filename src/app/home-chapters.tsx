import Link from "next/link";
import Portrait from "./portrait";
import Signature from "./signature";
import ProjectArt from "./project-art";
import FilmStage from "./film-stage";
import {getFeaturedRecords} from "./featured-records";
import {projects} from "./projects/data";
import "./chapters.css";
import "./cinematic-film.css";

export default function HomeChapters(){
 const records=getFeaturedRecords();
 const archive=records.filter(r=>r.document).slice(0,3);
 return <FilmStage>
  <section className="film-shot film-shot-hero" id="film-present" aria-label="The present"><div className="film-hero-layer"><div className="home-hero"><Portrait/></div></div></section>
  <section className="film-shot film-shot-origin film-yellow" id="introduction" aria-label="Curiosity">
   <div className="film-super" aria-hidden="true">WHY?</div><div className="film-art film-origin-art" aria-hidden="true"><svg viewBox="0 0 500 500"><g fill="none" stroke="currentColor" strokeWidth="1">{Array.from({length:18},(_,i)=><ellipse key={i} cx="250" cy="250" rx={30+i*11} ry={48+i*9} transform={`rotate(${i*13} 250 250)`}/>)}</g><circle cx="250" cy="250" r="9" fill="currentColor"/></svg></div>
   <div className="film-copy"><div className="film-kicker">01 / ANDIJAN, UZBEKISTAN</div><h2><span className="edit-line">I’m not</span><em className="edit-line">there yet.</em></h2><p>I'm a student with questions, projects and a long way to go. The future you saw in the portrait is still unwritten.</p><Link href="/about" className="film-link">My story <span>↗</span></Link></div>
  </section>
  <section className="film-shot film-shot-memory film-dark" id="film-memory" aria-label="The journey">
   <div className="film-super" aria-hidden="true">02</div><div className="film-copy"><div className="film-kicker">02 / THE THINGS I KEEP</div><h2>Small <em>moments.</em></h2><p>Leading school teams. Finding the answer to a Zakovat question. Learning something new on a court or in a classroom.</p><Link className="film-link" href="/about">Read my journey <span>↗</span></Link></div>
   <div className="film-art film-paper-cloud">{archive.map((r,i)=><figure className={"film-paper paper-"+i} key={r.id}><img src={r.document!.src} alt={r.document!.alt} loading="eager" decoding="async"/><figcaption>{r.dateLabel} / {r.chapter}</figcaption></figure>)}</div>
  </section>
  <section className="film-shot film-shot-future" id="film-future" aria-label="The future">
   <div className="film-super" aria-hidden="true">NEXT.</div><div className="film-art film-future-portrait" aria-hidden="true"><img src="/images/portrait-present.webp" alt="" decoding="async"/><img src="/images/portrait-academic-attire.svg" alt="" decoding="async"/></div>
   <div className="film-copy"><div className="film-kicker">03 / STILL BECOMING</div><h2>The future<br/><em>isn’t written.</em></h2><p>Economics, technology, education and ideas worth turning into action. This is where the next chapter begins.</p><Link className="film-link" href="/projects">Explore my projects <span>↗</span></Link></div>
  </section>
  {projects.map((p,i)=><section key={p.slug} className={"film-shot film-project film-project-"+p.kind+(i===1?"":" film-dark")} id={i===0?"projects":"exhibit-"+p.slug} aria-label={p.name}>
   <div className="film-super" aria-hidden="true">{p.number}</div><div className="film-copy"><div className="film-kicker">{p.number} / {p.name} — {p.role}</div><h2><span className="edit-line">{p.headline}</span><em className="edit-line">{p.emphasis}</em></h2><p>{p.summary}</p><Link className="film-link" href={"/projects/"+p.slug}>Inside {p.name} <span>↗</span></Link></div><div className="film-art film-project-art"><ProjectArt kind={p.kind}/></div><span className="film-project-name" aria-hidden="true">{p.name}</span>
  </section>)}
  <section className="film-shot film-shot-archive" id="milestone-preview" aria-label="Milestones">
   <div className="film-super" aria-hidden="true">ARCHIVE.</div><div className="film-copy"><div className="film-kicker">04 / ORIGINAL RECORDS</div><h2>Before the<br/><em>next chapter.</em></h2><p>From the handball court to an Olympiad and a room full of different perspectives. A few moments that made me who I am today.</p><Link className="film-link" href="/achievements">Discover all milestones <span>↗</span></Link></div>
   <div className="film-art film-paper-cloud archive-cloud">{records.slice(2,5).map((r,i)=>r.document&&<figure className={"film-paper paper-"+i} key={r.id}><img src={r.document.src} alt={r.document.alt} loading="lazy" decoding="async"/><figcaption>{r.dateLabel} / {r.chapter}</figcaption></figure>)}</div>
  </section>
  <section className="film-shot film-shot-personal film-yellow" id="interests" aria-label="Off the record"><div className="film-super" aria-hidden="true">OFF.</div><div className="film-copy"><div className="film-kicker">05 / OFF THE RECORD</div><h2>More than <em>one thing.</em></h2><p>From economics and psychology to the violin: some of the things I enjoy when there is no deadline attached.</p><Link href="/off-the-record" className="film-link">Get to know me <span>↗</span></Link></div><div className="film-art film-interests">{["Economics","Psychology","Politics","Literature","Music"].map((s,i)=><span key={s} style={{"--interest-index":i} as React.CSSProperties}><small>0{i+1}</small>{s}</span>)}</div></section>
  <section className="film-shot film-shot-contact film-dark" id="next-chapter" aria-label="The next chapter"><div className="film-super" aria-hidden="true">NEXT.</div><div className="film-copy"><div className="film-kicker">06 / CORRESPONDENCE</div><h2>Let’s keep <em>in touch.</em></h2><p>Good conversations often start with a simple hello.</p><Link className="film-link" href="/contact">Let’s connect <span>↗</span></Link></div><div className="film-art film-autograph"><Signature/></div></section>
 </FilmStage>
}
