import Link from "next/link";
import Signature from "./signature";
import ChapterMotion from "./chapter-motion";
import "./chapters.css";

import ProjectArt from "./project-art";

const projects = [
  { id:"01", slug:"overthink", kind:"think", title:"OverThink", category:"Curiosity & community", description:"An intellectual competition initiative built around questions, teamwork and the pleasure of figuring things out.", href:"https://overthink.uz" },
  { id:"02", slug:"finance4youth", kind:"finance", title:"Finance4Youth", category:"Education & finance", description:"A youth-oriented financial literacy initiative making the world of money more approachable." },
  { id:"03", slug:"rezamin", kind:"earth", title:"ReZamin", category:"Environment & community", description:"An environmental initiative encouraging awareness, local action and shared responsibility." },
] as const;

export default function HomeChapters() {
  return (
    <div className="home-chapters">
      <ChapterMotion />
      <section className="story-chapter" id="introduction" aria-labelledby="intro-title">
        <div className="chapter-rule"><span>01 / A little about me</span><span>ZM — Personal notes</span></div>
        <div className="story-grid">
          <div className="story-left" data-chapter-motion>
            <p className="story-overline">A student. A founder. A work in progress.</p>
            <h2 id="intro-title">The world<br/>makes me<br/><em>curious.</em></h2>
            <span className="story-asterisk" aria-hidden="true">✳</span>
          </div>
          <div className="story-right" data-chapter-motion>
            <span className="story-index">A NOTE FROM ME / 01</span>
            <p>I’m interested in understanding how the world works — why people make the decisions they do, how ideas become real, and what we can do with the things we learn.</p>
            <p>I’m still figuring things out. Along the way, I’ve started projects, met people with different perspectives and found reasons to keep asking questions.</p>
            <Link className="chapter-link chapter-link-light" href="/about">Read my story <span aria-hidden="true">↗</span></Link>
            <div className="story-signature"><Signature/></div>
          </div>
        </div>
      </section>
      <section className="work-chapter" id="projects" aria-labelledby="projects-title">
        <div className="chapter-rule"><span>02 / Selected initiatives</span><span>From idea to action</span></div>
        <div className="work-heading" data-chapter-motion><h2 id="projects-title">Things I <em>build.</em></h2><p>Different interests, different projects. Each one is a chance to learn by doing.</p></div>
        <div className="work-list">
          {projects.map(project=><article className={"work-item work-"+project.kind} key={project.id} data-chapter-motion>
            <ProjectArt kind={project.kind}/>
            <div className="work-info">
              <div className="work-meta"><span>{project.id} / 03</span><span>{project.category}</span></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <Link className="chapter-link" href={"/projects/"+project.slug}>Explore {project.title} <span aria-hidden="true">↗</span></Link>
            </div>
          </article>)}
        </div>
      </section>
      <section className="personal-chapter" id="interests" aria-labelledby="personal-title">
        <div className="chapter-rule"><span>03 / Off the record</span><span>Beyond the projects</span></div>
        <div className="personal-grid">
          <div data-chapter-motion><h2 id="personal-title">More than<br/><em>one thing.</em></h2><p>The things I’m drawn to don’t fit neatly into a single category. That’s part of what makes learning interesting.</p><Link className="chapter-link" href="/off-the-record">Get to know me <span aria-hidden="true">↗</span></Link></div>
          <div className="interest-index" data-chapter-motion>
            {["Economics","Psychology","Politics","Literature","Music"].map((interest,i)=><div className="interest-line" key={interest}><span>0{i+1}</span><span>{interest}</span><span aria-hidden="true">✳</span></div>)}
          </div>
        </div>
      </section>
    </div>
  );
}
