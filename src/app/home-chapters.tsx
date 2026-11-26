import Link from "next/link";
import Signature from "./signature";
import ChapterMotion from "./chapter-motion";
import "./chapters.css";

import ProjectExhibition from "./project-exhibition";
import FieldNotes from "./field-notes";
import {getFeaturedRecords} from "./featured-records";

export default function HomeChapters() {
  return (
    <div className="home-chapters">
      <ChapterMotion />
      <section className="story-chapter" id="introduction" aria-labelledby="intro-title">
        <div className="chapter-rule"><span>01 / A little about me</span><span>ZM — Personal notes</span></div>
        <div className="story-grid">
          <div className="story-left" data-chapter-motion>
            <p className="story-overline">ANDIJAN, UZBEKISTAN / THE PRESENT</p>
            <h2 id="intro-title">I started<br/>with a<br/><em>question.</em></h2>
            <span className="story-asterisk" aria-hidden="true">✳</span>
          </div>
          <div className="story-right" data-chapter-motion>
            <span className="story-index">A NOTE FROM ME / 01</span>
            <p>In school, I found myself drawn to the things that happened beyond the lesson: leading a team, helping a friend with maths, trying to find the answer to a Zakovat question.</p>
            <p>Today that curiosity takes me into economics, technology and projects of my own. The person in the graduation portrait is still ahead of me. This is the journey in between.</p>
            <Link className="chapter-link chapter-link-light" href="/about">Read my story <span aria-hidden="true">↗</span></Link>
            <div className="story-signature"><Signature/></div>
          </div>
        </div>
      </section>
      <section className="work-chapter" id="projects" aria-labelledby="projects-title">
        <div className="chapter-rule"><span>02 / Selected initiatives</span><span>From idea to action</span></div>
        <div className="work-heading" data-chapter-motion><h2 id="projects-title">Things I <em>build.</em></h2><p>A quiz tournament, a financial education initiative and an environmental club. Three ways to put an idea to work.</p></div>
        <ProjectExhibition/>
      </section>
      <FieldNotes records={getFeaturedRecords()}/>
      <section className="personal-chapter" id="interests" aria-labelledby="personal-title">
        <div className="chapter-rule"><span>04 / Off the record</span><span>Beyond the projects</span></div>
        <div className="personal-grid">
          <div data-chapter-motion><h2 id="personal-title">More than<br/><em>one thing.</em></h2><p>From economics and psychology to the violin: some of the things I enjoy when there is no deadline attached.</p><Link className="chapter-link" href="/off-the-record">Get to know me <span aria-hidden="true">↗</span></Link></div>
          <div className="interest-index" data-chapter-motion>
            {["Economics","Psychology","Politics","Literature","Music"].map((interest,i)=><div className="interest-line" key={interest}><span>0{i+1}</span><span>{interest}</span><span aria-hidden="true">✳</span></div>)}
          </div>
        </div>
      </section>
      <section className="home-contact" aria-labelledby="home-contact-title">
        <div className="chapter-rule"><span>05 / Correspondence</span><span>Until next time</span></div>
        <div className="home-contact-grid"><h2 id="home-contact-title">Let's keep<br/><em>in touch.</em></h2><div><p>Good conversations often start with a simple hello.</p><Link className="chapter-link chapter-link-light" href="/contact">Let’s connect <span aria-hidden="true">↗</span></Link></div></div>
      </section>
    </div>
  );
}
