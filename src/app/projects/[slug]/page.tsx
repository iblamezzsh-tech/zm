import ArrowIcon from "../../arrow-icon";
import PageAtmosphere from "../../page-atmosphere";
import MotionWords from "../../motion-words";
import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import SiteHeader from "../../site-header";
import ProjectEdition from "../../project-edition";
import {findProject,projects} from "../data";
import ProjectExperience from "../project-experience";
import "../../chapters.css";
import "../projects.css";
import "../../studio54.css";
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const p=findProject((await params).slug);return p?{title:p.name+" — ZiyoMuhammad",description:p.summary}:{title:"Project not found"}}
export default async function ProjectPage({params}:Props){const p=findProject((await params).slug);if(!p)notFound();const next=projects[(projects.findIndex(item=>item.slug===p.slug)+1)%projects.length];return <main className={"projects-page studio54 case-page case-world-"+p.kind} id="top"><SiteHeader projects/>
<div className="case-breadcrumb"><Link href="/projects"><ArrowIcon direction="left"/> All projects</Link><span>INITIATIVE {p.number} / 03</span></div>
<section className={"case-opening case-"+p.kind}><PageAtmosphere kind={p.kind} dark={p.kind!=="finance"}/><div className="projects-rule"><span>{p.category}</span><span>{p.role}</span></div><div className="case-title-group"><div><span className="case-edition-number" aria-hidden="true">{p.number}</span><h1><MotionWords text={p.name}/></h1></div><p>{p.summary}</p></div><div className="case-feature-art"><ProjectEdition project={p}/></div></section>
<section className="audit-project-evidence" aria-label="Project context"><dl><div><dt>Role</dt><dd>{p.role}</dd></div><div><dt>Current stage</dt><dd>Initiative described in this portfolio; latest stage not verified.</dd></div><div><dt>Last updated</dt><dd>Not dated</dd></div><div><dt>Explore the work</dt><dd>{p.website?<a href={p.website}>Project website <ArrowIcon direction="up-right"/></a>:<a href="#project-demo">Interactive portfolio demo (illustrative)</a>}</dd></div></dl></section>
<section className="case-introduction"><PageAtmosphere kind={p.kind}/><div className="projects-rule"><span>01 / The idea</span><span>Personal initiative</span></div><div className="case-intro-grid"><h2><MotionWords text={p.headline}/><br/><em><MotionWords text={p.emphasis}/></em></h2><div><p className="case-question">{p.question}</p><p>{p.motivation}</p>{p.website&&<a className="case-link" href={p.website}>Visit official website <ArrowIcon direction="up-right"/></a>}</div></div></section>
<section className="case-details"><PageAtmosphere kind={p.kind} dark={p.kind!=="finance"}/><div className="projects-rule"><span>02 / The approach</span><span>{p.role}</span></div><div className="case-detail-grid"><div><h2><MotionWords text="From idea"/><br/><em><MotionWords text="to action."/></em></h2><p>{p.approach}</p></div><div className="case-focus"><span>AREAS OF FOCUS</span>{p.focus.map((item,i)=><div key={item}><small>0{i+1}</small>{item}</div>)}</div></div></section>
<div id="project-demo"><ProjectExperience kind={p.kind}/></div>
<section className="case-future"><PageAtmosphere kind={p.kind}/><div className="projects-rule"><span>03 / Looking ahead</span><span>In progress</span></div><h2><MotionWords text="What comes"/> <em><MotionWords text="next."/></em></h2><p>{p.next}</p></section>
<Link className="case-next" href={"/projects/"+next.slug}><div className="next-project-art"><ProjectEdition project={next}/></div><div className="next-project-title"><span>NEXT INITIATIVE / {next.number}</span><h2>{next.name}</h2></div><span aria-hidden="true"><ArrowIcon direction="up-right"/></span></Link>
<footer className="home-footer"><span>ZiyoMuhammad</span><Link href="/projects">All projects</Link><a href="#top">Back to top <ArrowIcon direction="up"/></a></footer></main>}
