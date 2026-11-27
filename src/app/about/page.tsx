import PageAtmosphere from "../page-atmosphere";
import MotionWords from "../motion-words";
import {getFeaturedRecords} from "../featured-records";
import Link from "next/link";
import SiteHeader from "../site-header";
import Signature from "../signature";

import "./story.css";
import "../studio54.css";

export const metadata = {
  title: "My Story — ZiyoMuhammad",
  description: "The interests, ideas and aspirations behind ZiyoMuhammad, a student and founder from Uzbekistan."
};

const chapters = [
  { id:"curiosity", number:"01", label:"Past · Public School No. 1", title:"Where I", emphasis:"started.", body:"Looking back, my old school was where everything started for me—from learning my first letters in the 1st grade to finding my stride. I spent my years there as a class leader and part of the school’s leadership community, which taught me a lot about responsibility early on. Whether I was leading our football and Zakovat teams, or helping friends ace English and math, that school wasn’t just a place of learning; it was my second home.", note:"Where it all began.", kind:"questions" },
  { id:"learning", number:"02", label:"Present · Specialized Boarding School No. 1 · Andijan", title:"School in", emphasis:"Andijan.", body:"I joined Specialized Boarding School No. 1 in seventh grade. I’m in Grade 11 now, and English, maths, football, and Zakovat are still the things I keep coming back to.", note:"Always a student.", kind:"learning" },
  { id:"building", number:"03", label:"From thought to action", title:"Ideas need", emphasis:"a beginning.", body:"Through initiatives such as OverThink, Finance4Youth and ReZamin, I’m exploring how intellectual curiosity, financial education and environmental awareness can become real projects.", note:"Learn by doing.", kind:"building" },
  { id:"future", number:"04", label:"An unwritten chapter", title:"Still", emphasis:"becoming.", body:"I hope to continue my education, build meaningful initiatives and keep learning from the people and experiences I encounter. The graduation portrait on my homepage is an aspiration, not a finished achievement.", note:"The story continues.", kind:"future" }
] as const;

export default function About(){
 const records=getFeaturedRecords();
 const chapterRecords=(kind:string)=>records.filter(r=>kind==="questions"?r.id==="handball-first-place-2022"||r.id==="zakovat-best-player-2024":r.id==="informatics-olympiad-third-place"||r.id==="business-studies-2026");
 return <main className="story-page studio54" id="story-top">
   <SiteHeader about />
   <section className="story-opening" aria-labelledby="story-title"><PageAtmosphere kind="story"/>
     <div className="story-edition"><span>ZM / PERSONAL JOURNAL</span><span>UZBEKISTAN · IN PROGRESS</span></div>
     <h1 id="story-title"><MotionWords text="My"/> <em><MotionWords text="story."/></em></h1>
     <div className="story-opening-grid">
       <div className="story-portrait"><img src="/images/portrait-present.webp" alt="ZiyoMuhammad in a white shirt" width="1070" height="850"/><span>FIG. 01 / THE PRESENT</span></div>
       <div className="story-opening-copy"><span className="story-tag">A little introduction</span><h2><MotionWords text="A life in"/><br/><em><MotionWords text="the making."/></em></h2><p>I’m ZiyoMuhammad, a student and founder from Uzbekistan. This is a little about what I’m learning, what I’m building and where I hope to go.</p><div className="story-autograph"><Signature/></div><a className="story-continue" href="#curiosity">Read the chapters <span aria-hidden="true">↓</span></a></div>
     </div>
   </section>
   <div className="story-body">
    <nav className="story-index-nav" aria-label="Story chapters"><span>THE CHAPTERS</span>{chapters.map(c=><a href={"#"+c.id} key={c.id}><small>{c.number}</small>{c.id==="curiosity"?"Origins":c.id==="learning"?"School":c.id}<span aria-hidden="true">↘</span></a>)}</nav>
    <div className="story-entries">
      {chapters.map(c=><section className={"story-entry story-entry-"+c.kind} key={c.id} id={c.id} aria-labelledby={c.id+"-title"}><PageAtmosphere kind="story"/><div className="entry-top"><span>CHAPTER {c.number} / 04</span><span>{c.label}</span></div><div className="entry-spread"><div className="entry-art studio54-story-plate" data-story-motion>
 {c.kind==="questions"||c.kind==="learning"?<div className="studio54-document-pair">{chapterRecords(c.kind).length===0&&<div className="zm-story-index-leaf"><span>CHAPTER {c.number} / PERSONAL JOURNAL</span><strong>{c.kind==="questions"?"Where it all":"Always a"}<br/><em>{c.kind==="questions"?"began.":"student."}</em></strong><span>{c.label}</span></div>}{chapterRecords(c.kind).map((r,i)=><figure key={r.id} className={"studio54-document doc-"+i}><img src={r.document!.src} alt={r.document!.alt} loading="lazy" decoding="async"/><figcaption>{r.dateLabel} / {r.chapter}</figcaption></figure>)}</div>:c.kind==="building"?<div className="studio54-story-projects"><span>THREE INITIATIVES / IN PROGRESS</span><Link href="/projects/overthink">OverThink <small>↗</small></Link><Link href="/projects/finance4youth">Finance4Youth <small>↗</small></Link><Link href="/projects/rezamin">ReZamin <small>↗</small></Link></div>:<div className="studio54-unwritten"><span>04 / THE FUTURE</span><strong>To be<br/><em>continued.</em></strong><div><Signature/></div></div>}
 <span className="studio54-plate-caption">{c.note}</span></div><div className="entry-copy" data-story-motion><h2 id={c.id+"-title"}><MotionWords text={c.title}/><br/><em><MotionWords text={c.emphasis}/></em></h2><p>{c.body}</p>{c.kind==="building"&&<Link href="/projects" className="story-inline-link">Explore my projects ↗</Link>}</div></div></section>)}
    </div>
   </div>
   <section className="story-ending"><PageAtmosphere kind="story" dark/><div className="entry-top"><span>ZM / END OF THIS CHAPTER</span><span>TO BE CONTINUED</span></div><h2><MotionWords text="There’s more"/><br/><em><MotionWords text="to come."/></em></h2><div className="story-end-row"><Link href="/projects">Discover what I build <span aria-hidden="true">↗</span></Link><div><Signature/></div></div></section>
   <footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/">Back home</Link><a href="#story-top">Back to top ↑</a></footer>
 </main>
}
