import type {Project} from "./projects/data";
import "./project-edition.css";
import "./studio58.css";
/* Original editorial interpretations of the real project concepts.
   The educational examples are illustrative, not event or investment results. */
export default function ProjectEdition({project:p}:{project:Project}){
 return <div className={"studio54-edition edition-"+p.kind+" edition56 edition58"}>
  <div className="edition-top"><span>ZM / INITIATIVES</span><span>NO. {p.number}</span></div>
  {p.kind==="think"?<div className="edition56-main edition56-quiz">
   <div className="edition56-quiz-title"><span>THE INTELLECTUAL TOURNAMENT</span><strong>Think<br/><em>again.</em></strong><span>ONE QUESTION. SIX MINDS.</span></div>
   <div className="edition56-answer-sheet"><div className="edition56-sheet-meta"><b>01</b><span>QUESTION<br/>SHEET</span></div><strong>A fair coin lands heads five times.<br/>What happens on the next toss?</strong><div className="edition56-answer"><i>A</i> Heads is more likely</div><div className="edition56-answer"><i>B</i> Tails is more likely</div><div className="edition56-answer"><i>C</i> Equal chance</div><small>ILLUSTRATIVE QUESTION</small></div>
  </div>:p.kind==="finance"?<div className="edition56-main edition56-finance">
   <div className="edition56-finance-copy"><span>FINANCIAL LITERACY</span><strong>Make<br/><em>money</em><br/>make sense.</strong></div>
   <div className="edition56-chart"><div className="edition56-chart-caption"><span>COMPOUND GROWTH</span><strong>+62.9<small>%</small></strong></div><svg viewBox="0 0 300 168" role="img" aria-label="Illustration of a 5 percent annual compound growth over 10 years: from 100 to approximately 163 units"><g stroke="currentColor" strokeWidth=".6" opacity=".23"><path d="M10 25H290 M10 67H290 M10 109H290 M10 151H290"/></g><path d="M10 145 L38 136 L66 127 L94 118 L122 108 L150 98 L178 87 L206 75 L234 63 L262 50 L290 36 L290 151 L10 151Z" fill="#b9c898" opacity=".6"/><path d="M10 145 L38 136 L66 127 L94 118 L122 108 L150 98 L178 87 L206 75 L234 63 L262 50 L290 36" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" pathLength="1"/><circle cx="290" cy="36" r="4" fill="currentColor"/><g fontSize="9" fill="currentColor"><text x="10" y="165">YEAR 0</text><text x="290" y="165" textAnchor="end">YEAR 10</text></g></svg><small>100 UNITS · 5% ANNUALLY · ILLUSTRATION</small></div>
  </div>:<div className="edition56-main edition56-earth">
   <div className="edition56-earth-copy"><span>A LOCAL ACTION JOURNAL</span><strong>Start<br/><em>where<br/>you are.</em></strong></div>
   <div className="edition56-fieldnote"><span>FIELD NOTE / 01</span><strong>Small things<br/>we can do.</strong>{["Clean up a shared space","Reduce single-use waste","Invite someone to help"].map((task,i)=><div className="edition56-task" key={task}><b>{String(i+1).padStart(2,"0")}</b><span>{task}</span><i aria-hidden="true"/></div>)}<small>PROPOSED ACTIVITIES / NOT COMPLETED WORK</small></div>
  </div>}
  <div className="edition-bottom"><span>{p.name}</span><span>{p.category}</span></div>
 </div>
}
