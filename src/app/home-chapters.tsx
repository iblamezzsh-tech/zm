import Link from "next/link";
import JourneySequence from "./journey-sequence";
import Signature from "./signature";
import MotionWords from "./motion-words";
import "./chapters.css";

import ProjectExhibition from "./project-exhibition";
import FieldNotes from "./field-notes";
import {getFeaturedRecords} from "./featured-records";

export default function HomeChapters() {
  return (
    <div className="home-chapters">
      <JourneySequence records={getFeaturedRecords()}/>
      <section className="work-chapter" id="projects" aria-labelledby="projects-title">
        <div className="chapter-rule"><span>02 / Selected initiatives</span><span>From idea to action</span></div>
        <div className="work-heading" data-chapter-motion><h2 id="projects-title"><MotionWords text="Things I"/> <em><MotionWords text="build."/></em></h2><p>A quiz tournament, a financial education initiative and an environmental club. Three ways to put an idea to work.</p></div>
        <ProjectExhibition/>
      </section>
      <FieldNotes records={getFeaturedRecords()}/>
      <section className="personal-chapter" id="interests" aria-labelledby="personal-title">
        <div className="chapter-rule"><span>04 / Off the record</span><span>Beyond the projects</span></div>
        <div className="personal-grid">
          <div data-chapter-motion><h2 id="personal-title"><MotionWords text="More than"/><br/><em><MotionWords text="one thing."/></em></h2><p>From economics and psychology to the violin: some of the things I enjoy when there is no deadline attached.</p><Link className="chapter-link" href="/off-the-record">Get to know me <span aria-hidden="true">↗</span></Link></div>
          <div className="interest-index" data-chapter-motion>
            {["Economics","Psychology","Politics","Literature","Music"].map((interest,i)=><div className="interest-line" key={interest}><span>0{i+1}</span><span>{interest}</span><span aria-hidden="true">✳</span></div>)}
          </div>
        </div>
      </section>
      <section className="home-contact" id="next-chapter" aria-labelledby="home-contact-title">
        <div className="chapter-rule"><span>05 / Correspondence</span><span>Until next time</span></div>
        <div className="home-contact-grid"><h2 id="home-contact-title"><MotionWords text="Let's keep"/><br/><em><MotionWords text="in touch."/></em></h2><div><p>Good conversations often start with a simple hello.</p><Link className="chapter-link chapter-link-light finale-contact" href="/contact">Let’s connect <span aria-hidden="true">↗</span></Link><div className="finale-signature"><Signature/></div></div></div>
      </section>
    </div>
  );
}
