import type {Project} from "./projects/data";
/** Editorial artwork using the project's real stated aims, not official brand assets or claimed outcomes. */
export default function ProjectEdition({project:p}:{project:Project}){
 return <div className={"studio54-edition edition-"+p.kind}>
  <div className="edition-top"><span>ZM / SELECTED INITIATIVES</span><span>0{Number(p.number)} / CONCEPT STUDY</span></div>
  {p.kind==="think"?<div className="edition-think-main"><div className="edition-think-type"><span>ASK.</span><span>THINK.</span><span>DISCUSS.</span></div><div className="edition-think-note"><span>ANDIJAN / ZAKOVAT</span><strong>One question.<br/>Six minds.</strong><span>KNOWLEDGE / COMMUNITY</span></div></div>:p.kind==="finance"?<div className="edition-finance-main"><div className="edition-finance-title"><span>THE FINANCIAL LITERACY NOTEBOOK</span><strong>Money<br/><em>made clearer.</em></strong></div><div className="edition-finance-sheet"><span>01 / COMPOUND GROWTH</span><strong>A = P(1 + r)<sup>t</sup></strong><dl><div><dt>P</dt><dd>Starting amount</dd></div><div><dt>r</dt><dd>Annual rate</dd></div><div><dt>t</dt><dd>Time in years</dd></div></dl><span>ILLUSTRATIVE FORMULA / NOT RESULTS</span></div></div>:<div className="edition-earth-main"><div className="edition-earth-title"><span>THE LOCAL ACTION NOTEBOOK</span><strong>Start<br/><em>where you are.</em></strong></div><div className="edition-earth-list"><span>PLANNED AREAS OF FOCUS</span>{p.focus.slice(0,3).map((f,i)=><div key={f}><small>0{i+1}</small><span>{f}</span></div>)}</div></div>}
  <div className="edition-bottom"><span>{p.name}</span><span>{p.category}</span></div>
 </div>
}
