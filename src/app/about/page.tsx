import MotionWords from "../motion-words";

import Link from "next/link";
import SiteHeader from "../site-header";
import Signature from "../signature";

import "./story.css";

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

 return <main className="story-page" id="story-top">
   <SiteHeader about />
   <section className="journal-cover story-cover"><div className="folio-rule"><span>Personal journal</span><span>Andijan, Uzbekistan</span></div><div className="journal-spread"><div><h1>My<br/><i>story.</i></h1><p>I’m ZiyoMuhammad, a student and founder from Uzbekistan. This is a little about what I’m learning, what I’m building and where I hope to go.</p><a href="#curiosity">Read the chapters ↓</a></div><figure><img src="/images/portrait-present.webp" alt="ZiyoMuhammad in a white shirt"/><figcaption>The present</figcaption></figure></div></section>
   <div className="story-body">
    <nav className="story-index-nav" aria-label="Story chapters"><span>THE CHAPTERS</span>{chapters.map(c=><a href={"#"+c.id} key={c.id}><small>{c.number}</small>{c.id==="curiosity"?"Origins":c.id==="learning"?"School":c.id}<span aria-hidden="true">↘</span></a>)}</nav>
    <div className="story-entries">
      {chapters.map(c=><section className={"story-entry story-entry-"+c.kind} key={c.id} id={c.id} aria-labelledby={c.id+"-title"}><div className="entry-top"><span>CHAPTER {c.number} / 04</span><span>{c.label}</span></div><div className="entry-spread"><div className="entry-art" data-story-motion><figure className="journal-evidence"><img src={c.kind==="questions"?"/documents/grade-2-commendation-2018.webp":c.kind==="learning"?"/documents/school-honor-2026.webp":c.kind==="building"?"/images/specimen.webp":"/images/portrait-future.webp"} alt={c.kind==="building"?"ReZamin concept study":c.kind==="future"?"Graduation portrait expressing future aspirations":c.label}/><figcaption>{c.note}</figcaption></figure></div><div className="entry-copy" data-story-motion><h2 id={c.id+"-title"}><MotionWords text={c.title}/><br/><em><MotionWords text={c.emphasis}/></em></h2><p>{c.body}</p>{c.kind==="building"&&<Link href="/projects" className="story-inline-link">Explore my projects ↗</Link>}</div></div></section>)}
    </div>
   </div>
   <section className="story-ending"><div className="entry-top"><span>ZM / END OF THIS CHAPTER</span><span>TO BE CONTINUED</span></div><h2><MotionWords text="There’s more"/><br/><em><MotionWords text="to come."/></em></h2><div className="story-end-row"><Link href="/projects">Discover what I build <span aria-hidden="true">↗</span></Link><div><Signature/></div></div></section>
   <footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/">Back home</Link><a href="#story-top">Back to top ↑</a></footer>
 </main>
}
