import {useId} from "react";

/** Original concept artwork; not a representation of project results or official logos. */
export default function ProjectArt({kind}:{kind:"think"|"finance"|"earth"}){
 const id=useId().replace(/[^a-zA-Z0-9_-]/g,"");
 const ref=(s:string)=>"url(#"+id+s+")";
 return <div className={"project-art studio-poster art-"+kind+" art-v32"} aria-hidden="true">
 <div className="art-corner">ZM / SELECTED WORK <span>0{kind==="think"?1:kind==="finance"?2:3}</span></div>
 {kind==="think"?<>
 <svg className="studio-artwork" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice">
 <defs><pattern id={id+"dots"} width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#f4f1e8" opacity=".25"/></pattern></defs>
 <rect width="900" height="600" fill={ref("dots")}/>
 <g transform="translate(645 306) rotate(-9)">
 <circle className="poster-orbit" r="218" fill="none" stroke="#ffda24" strokeWidth="1" opacity=".42"/><circle className="poster-orbit-inner" r="181" fill="none" stroke="#ffda24" strokeDasharray="2 11" opacity=".65"/>
 <path d="M-225 0H225M0-225V225" stroke="#ffda24" opacity=".23"/>
 <g className="poster-object poster-question"><circle r="146" fill="#ffda24"/><circle r="128" fill="none" stroke="#24291e" strokeWidth="1.5"/><text x="0" y="94" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="270" fill="#24291e">?</text></g>
 <path d="M-220-128h50m-25-25v50M183 153h40m-20-20v40" stroke="#ffda24" strokeWidth="2"/>
 </g><path d="M0 480H900M0 488H900" stroke="#ffda24" opacity=".14"/>
 </svg>
 <div className="think-word">OVER<br/>THINK<span>.</span></div><div className="art-foot">THE ART OF ASKING QUESTIONS <span>01 / INTELLECT</span></div>
 </>:kind==="finance"?<>
 <svg className="studio-artwork" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice">
 <defs><pattern id={id+"grid"} width="46" height="46" patternUnits="userSpaceOnUse"><path d="M46 0H0V46" fill="none" stroke="#24291e" opacity=".09"/></pattern></defs>
 <rect width="900" height="600" fill={ref("grid")}/>
 <g className="poster-object poster-coins">
 <path className="poster-finance-line" pathLength="1" d="M430 462L513 404L595 419L687 275L784 143" fill="none" stroke="#24291e" strokeWidth="3" strokeLinejoin="round"/>
 <path d="M430 462L513 404L595 419L687 275L784 143V500H430Z" fill="#788367" opacity=".14"/>
 {[{x:459,y:418,h:82},{x:535,y:357,h:143},{x:611,y:306,h:194},{x:687,y:226,h:274},{x:763,y:138,h:362}].map((v,i)=><g key={i}><rect className="poster-finance-bar" style={{"--bar-index":i,"--bar-base":v.y+v.h} as React.CSSProperties} x={v.x} y={v.y} width="45" height={v.h} fill={i===4?"#ffda24":"#788367"} stroke="#24291e" strokeWidth="1"/><path d={`M${v.x} ${v.y+12}h45`} stroke="#24291e" opacity=".3"/></g>)}
 <circle cx="784" cy="143" r="12" fill="#24291e"/><circle cx="784" cy="143" r="26" fill="none" stroke="#24291e" strokeDasharray="2 5"/><path d="M410 500H830" stroke="#24291e"/><text x="827" y="530" textAnchor="end" fill="#24291e" fontFamily="Arial" fontSize="11" letterSpacing="2">ILLUSTRATIVE / NO ACTUAL DATA</text>
 </g></svg>
 <div className="finance-word">Money.<br/><em>Made clearer.</em><small>FINANCE4YOUTH</small></div><div className="art-foot">FINANCIAL LITERACY <span>02 / LEARNING</span></div>
 </>:<>
 <svg className="studio-artwork" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice">
 <defs><pattern id={id+"earth"} width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1" fill="#f4f1e8" opacity=".25"/></pattern></defs><rect width="900" height="600" fill={ref("earth")}/>
 <g transform="translate(650 312)">
 <g stroke="#c9d0b6" fill="none" opacity=".25">{Array.from({length:9},(_,i)=><ellipse key={i} rx={85+i*17} ry={75+i*15} transform={`rotate(${i*17})`}/>)}</g>
 <g className="poster-object poster-leaf"><path d="M0 200Q-8 40 32-195" fill="none" stroke="#f4f1e8" strokeWidth="3"/>
 <path className="poster-leaf-one" d="M18-26Q-160-20-165-175Q-30-177 18-26Z" fill="#bfc9a8" stroke="#24291e"/>
 <path className="poster-leaf-two" d="M14 60Q185 31 172-116Q54-116 14 60Z" fill="#ffda24" stroke="#24291e"/>
 <path className="poster-leaf-three" d="M3 148Q-148 137-148 2Q-22 1 3 148Z" fill="#788367" stroke="#f4f1e8"/>
 <path d="M18-26L-165-175M14 60L172-116M3 148L-148 2" stroke="#24291e" fill="none"/>
 </g></g><path d="M0 520Q180 440 340 520T900 500" stroke="#f4f1e8" fill="none" opacity=".28"/></svg>
 <div className="earth-word">Small acts.<br/><em>Living impact.</em><small>REZAMIN</small></div><div className="art-foot">COMMUNITY / ENVIRONMENT <span>03 / CARE</span></div>
 </>}
 </div>
}
