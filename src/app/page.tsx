import Link from "next/link";
import SiteHeader from "./site-header";
import Portrait from "./portrait";
import Signature from "./signature";

const initiatives = [
  { number: "01", name: "OverThink", field: "Ideas / Community", description: "An intellectual competition initiative built around curiosity, questions and teamwork.", href: "https://overthink.uz" },
  { number: "02", name: "Finance4Youth", field: "Education / Finance", description: "Making financial literacy more approachable for young people." },
  { number: "03", name: "ReZamin", field: "Environment / Community", description: "An initiative encouraging environmental awareness and local action." },
];

export default function Home() {
  return (
    <main className="home-page" id="top">
      <a className="skip-link" href="#introduction">Skip to introduction</a>
      <SiteHeader />
      <div className="home-hero">
        <div className="mast">
          <div className="eyebrow"><i /> Student &amp; founder</div>
          <div className="location">Uzbekistan / Personal archive</div>
          <h1>Ziyo<span>Muhammad</span></h1>
        </div>
        <Portrait />
      </div>
      <section id="introduction" className="intro-chapter" aria-labelledby="intro-title">
        <div className="chapter-kicker"><span>01 /</span> A little about me</div>
        <div className="intro-content">
          <h2 id="intro-title">Curious by nature.<br/><em>Always learning.</em></h2>
          <p>I’m a student from Uzbekistan, exploring how the world works through economics, ideas and the projects I build with others.</p>
          <Link href="/about" className="editorial-link">More about me <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="intro-mark" aria-hidden="true"><Signature /></div>
      </section>
      <section id="projects" className="project-chapter" aria-labelledby="project-title">
        <div className="chapter-kicker"><span>02 /</span> Selected initiatives</div>
        <div className="chapter-title"><h2 id="project-title">Ideas into <em>action.</em></h2><p>A few things I’m building, exploring and learning from.</p></div>
        <div className="project-list">
          {initiatives.map((project) => (
            <article className="project-row" key={project.name}>
              <span className="project-number">{project.number}</span>
              <div className="project-main"><p className="project-field">{project.field}</p><h3>{project.name}</h3></div>
              <p className="project-description">{project.description}</p>
              {project.href ? <a className="project-link" href={project.href} aria-label={`Visit ${project.name}`}>Visit site <span aria-hidden="true">↗</span></a> : <span className="project-link project-status">Initiative</span>}
            </article>
          ))}
        </div>
      </section>
      <section id="interests" className="interests-chapter" aria-labelledby="interests-title">
        <div className="chapter-kicker"><span>03 /</span> Beyond the projects</div>
        <h2 id="interests-title">More than<br/><em>one thing.</em></h2>
        <p>Economics. Psychology. Politics. Literature. Music. Different ways of looking at the same world.</p>
        <Link href="/about" className="editorial-link">Get to know me <span aria-hidden="true">↗</span></Link>
      </section>
      <footer className="home-footer"><span>ZiyoMuhammad</span><span>Personal portfolio / Uzbekistan</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
