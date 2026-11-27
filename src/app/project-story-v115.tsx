import Link from "next/link";
import ArrowIcon from "./arrow-icon";
import {Finance} from "./projects/project-experience";
import type {Project} from "./projects/data";

/* Real repository demo, and an explicitly proposed action plan. No outcome claims. */
export default function ProjectStory({project:p}:{project:Project}){
 const finance=p.kind==="finance";
 const href="/projects/"+p.slug;
 return <div className={"zm-v115-story zm-v115-"+p.kind}>
  <div className="zm-v115-story-intro"><span className="zm-v115-label">{p.number} / {finance?"THE MONEY LAB":"THE FIELD JOURNAL"}</span><h3>{finance?<>What can <em>time</em> do to money?</>:<>Start with <em>one shared space.</em></>}</h3><p>{finance?"A working compound-growth illustration from the portfolio’s existing financial education demo.":"A proposed local cleanup, drawn from the club’s documented plans."}</p></div>
  {finance?<div className="zm-v115-artifact"><Finance/></div>:<figure className="zm-v115-artifact zm-v115-field"><div className="zm-v115-field-meta"><span>FIELD PLAN / 01</span><span>PROPOSED · NOT COMPLETED</span></div><div className="zm-v115-field-body"><svg viewBox="0 0 240 190" role="img" aria-label="Concept drawing of a shared space, not a documentary image"><g fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 31Q120 4 228 31L216 156Q120 182 24 156Z" strokeDasharray="5 5"/><path d="M36 119Q81 77 124 103T207 82M42 137Q87 95 124 124T201 103"/><circle cx="69" cy="56" r="17"/><circle cx="170" cy="58" r="23"/><path d="M69 73V88M170 81V96M116 44V74M101 59H131"/><path className="zm-v115-field-trace" d="M24 156L44 133L89 112L126 124L184 99L216 80" pathLength="1" strokeWidth="3" strokeDasharray="1"/></g></svg><div><strong>Clean up a shared space.</strong><ol><li>Choose a small area.</li><li>Organize a safe cleanup.</li><li>Invite a friend to take part.</li></ol></div></div><figcaption>Concept sketch, not a site map. Proposed activity from the existing action-plan demo; no completed cleanup record supplied.</figcaption></figure>}
  <div className="zm-v115-story-credit"><span className="zm-v115-label">{p.name} / {p.role}</span><p>{finance?"As co-founder, I’m exploring accessible educational content and a student finance competition.":"As founder, I’m developing a club around practical environmental activities and awareness."}</p><Link href={href} className="ed-link">Inside the project <span><ArrowIcon direction="up-right"/></span></Link><Link href={href+"#project-demo"} className="ed-link">{finance?"Open the calculator":"Make your action plan"} <span><ArrowIcon direction="up-right"/></span></Link></div>
 </div>;
}
