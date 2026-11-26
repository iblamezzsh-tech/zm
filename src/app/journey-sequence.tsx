import Link from "next/link";
import Signature from "./signature";
import type {FeaturedRecord} from "./featured-records";
import "./journey-sequence.css";
export default function JourneySequence({records}:{records:FeaturedRecord[]}){
 const archive=records.filter(r=>r.document).slice(0,3);
 return <section id="introduction" className="journey-sequence flow-journey" aria-label="From the present to the future">
  <div className="flow-opening journey-scene journey-now" data-flow-scene="origin">
   <div className="flow-type-cloud" aria-hidden="true"><span>NOW.</span><span>NEXT.</span></div>
   <div className="journey-mast"><span>ZM / THE DISTANCE BETWEEN</span><span>01 / THE PRESENT</span></div>
   <div className="flow-orbit" aria-hidden="true"><svg viewBox="0 0 600 600"><g fill="none" stroke="currentColor" strokeWidth="1">{Array.from({length:18},(_,i)=><ellipse key={i} cx="300" cy="300" rx={56+i*13} ry={90+i*11} transform={`rotate(${i*11} 300 300)`}/>)}</g><circle cx="300" cy="300" r="7" fill="currentColor"/></svg></div>
   <div className="journey-now-main"><span className="journey-overline">ANDIJAN, UZBEKISTAN</span><h2><span className="flow-line"><span>I’m not</span></span><br/><em className="flow-line"><span>there yet.</span></em></h2><p>I’m a student with questions, projects and a long way to go. The future you saw in the portrait is still unwritten.</p></div>
   <div className="flow-scene-index" aria-hidden="true">01 / ORIGIN</div>
  </div>
  <div className="flow-memory journey-scene journey-past" data-flow-scene="memory">
   <div className="journey-mast"><span>ZM / THE DISTANCE BETWEEN</span><span>02 / THE JOURNEY</span></div>
   <div className="flow-memory-number" aria-hidden="true">02</div>
   <div className="journey-past-copy"><span className="journey-overline">THE THINGS I KEEP</span><h2><span className="flow-line"><span>Small</span></span><br/><em className="flow-line"><span>moments.</span></em></h2><p>Leading school teams. Finding the answer to a Zakovat question. Learning something new on a court or in a classroom.</p></div>
   <div className="flow-documents" aria-label="Selected original records">{archive.map((r,i)=><figure className={"flow-document flow-document-"+i} key={r.id}><img src={r.document!.src} alt={r.document!.alt} loading="lazy" decoding="async"/><figcaption>{r.dateLabel} / {r.chapter}</figcaption></figure>)}</div>
  </div>
  <div className="flow-future journey-scene journey-next" data-flow-scene="future">
   <div className="journey-mast"><span>ZM / THE DISTANCE BETWEEN</span><span>03 / THE FUTURE</span></div>
   <div className="flow-future-landscape" aria-hidden="true"><svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="currentColor">{Array.from({length:22},(_,i)=><ellipse key={i} cx="720" cy="300" rx={45+i*23} ry={24+i*17} transform={`rotate(${i*8} 720 300)`}/>)}</g></svg></div>
   <div className="journey-next-copy"><span className="journey-overline">STILL BECOMING</span><h2><span className="flow-line"><span>The future</span></span><br/><span className="flow-line"><span>isn’t <em>written.</em></span></span></h2><p>Economics, technology, education and ideas worth turning into action. This is where the next chapter begins.</p><Link className="chapter-link" href="/about">Read my story <span aria-hidden="true">↗</span></Link></div>
   <div className="journey-signature"><Signature/></div>
  </div>
 </section>
}
