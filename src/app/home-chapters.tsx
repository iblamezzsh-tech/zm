import Link from "next/link";
import Signature from "./signature";
import ChapterMotion from "./chapter-motion";
import "./chapters.css";

function ProjectArt({ kind }: { kind: "think" | "finance" | "earth" }) {
  if (kind === "think") return (
    <div className="project-art art-think" aria-hidden="true">
      <div className="art-corner">ZM / INITIATIVE 01</div>
      <div className="think-orbit orbit-a" /><div className="think-orbit orbit-b" />
      <span className="think-question">?</span>
      <div className="think-word">Over<br/><em>Think.</em></div>
      <span className="art-foot">THE ART OF ASKING QUESTIONS</span>
    </div>
  );
  if (kind === "finance") return (
    <div className="project-art art-finance" aria-hidden="true">
      <div className="art-corner">ZM / INITIATIVE 02</div>
      <svg viewBox="0 0 600 390" preserveAspectRatio="xMidYMid slice">
        <defs><pattern id="finance-grid" width="45" height="45" patternUnits="userSpaceOnUse"><path d="M45 0H0V45" fill="none" stroke="currentColor" strokeOpacity=".13"/></pattern></defs>
        <rect width="600" height="390" fill="url(#finance-grid)"/>
        <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".65"><path d="M30 340 L160 256 225 290 330 169 399 205 550 62"/><path d="M510 62h40v40"/></g>
        <g fill="currentColor" opacity=".15"><rect x="80" y="270" width="45" height="100"/><rect x="180" y="230" width="45" height="140"/><rect x="280" y="165" width="45" height="205"/><rect x="380" y="120" width="45" height="250"/><rect x="480" y="75" width="45" height="295"/></g>
      </svg>
      <div className="finance-word">Money.<br/><em>Made clearer.</em></div>
      <span className="art-foot">LEARNING / FINANCIAL LITERACY</span>
    </div>
  );
  return (
    <div className="project-art art-earth" aria-hidden="true">
      <div className="art-corner">ZM / INITIATIVE 03</div>
      <svg viewBox="0 0 600 390" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="currentColor" opacity=".32">
          {Array.from({length:13},(_,i)=><ellipse key={i} cx="410" cy="196" rx={36+i*17} ry={24+i*11} transform="rotate(-32 410 196)"/>)}
        </g>
        <path d="M410 315V123 M410 222Q314 211 305 129Q397 130 410 222 M410 183Q414 101 491 83Q487 160 410 183" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="earth-word">Small acts.<br/><em>Living impact.</em></div>
      <span className="art-foot">COMMUNITY / ENVIRONMENT</span>
    </div>
  );
}

const projects = [
  { id:"01", kind:"think", title:"OverThink", category:"Curiosity & community", description:"An intellectual competition initiative built around questions, teamwork and the pleasure of figuring things out.", href:"https://overthink.uz" },
  { id:"02", kind:"finance", title:"Finance4Youth", category:"Education & finance", description:"A youth-oriented financial literacy initiative making the world of money more approachable." },
  { id:"03", kind:"earth", title:"ReZamin", category:"Environment & community", description:"An environmental initiative encouraging awareness, local action and shared responsibility." },
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
              {"href" in project ? <a className="chapter-link" href={project.href}>Explore OverThink <span aria-hidden="true">↗</span></a> : <span className="work-note">Personal initiative</span>}
            </div>
          </article>)}
        </div>
      </section>
      <section className="personal-chapter" id="interests" aria-labelledby="personal-title">
        <div className="chapter-rule"><span>03 / Off the record</span><span>Beyond the projects</span></div>
        <div className="personal-grid">
          <div data-chapter-motion><h2 id="personal-title">More than<br/><em>one thing.</em></h2><p>The things I’m drawn to don’t fit neatly into a single category. That’s part of what makes learning interesting.</p><Link className="chapter-link" href="/about">Get to know me <span aria-hidden="true">↗</span></Link></div>
          <div className="interest-index" data-chapter-motion>
            {["Economics","Psychology","Politics","Literature","Music"].map((interest,i)=><div className="interest-line" key={interest}><span>0{i+1}</span><span>{interest}</span><span aria-hidden="true">✳</span></div>)}
          </div>
        </div>
      </section>
    </div>
  );
}
