import {useId} from "react";

/** Original editorial artwork. The graphics are conceptual, not project results. */
export default function ProjectArt({kind}:{kind:"think"|"finance"|"earth"}){
 const uid=useId().replace(/:/g,"");
 const id=(name:string)=>uid+"-"+name;
 const url=(name:string)=>"url(#"+id(name)+")";
 return <div className={"project-art art-"+kind+" studio-poster"} aria-hidden="true">
 <div className="art-corner">ZM / INITIATIVE {kind==="think"?"01":kind==="finance"?"02":"03"}</div>
 <svg className="studio-artwork" viewBox="0 0 800 540" preserveAspectRatio="xMidYMid slice">
 <defs>
 <linearGradient id={id("metal")} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f4ffc2"/><stop offset=".32" stopColor="#d5ed73"/><stop offset=".68" stopColor="#809548"/><stop offset="1" stopColor="#e4f1a0"/></linearGradient>
 <linearGradient id={id("edge")} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#637638"/><stop offset="1" stopColor="#2b3923"/></linearGradient>
 <linearGradient id={id("coin")} x1="0" y1="0" x2="1" y2=".8"><stop stopColor="#f5edca"/><stop offset=".5" stopColor="#c5bc83"/><stop offset="1" stopColor="#82916c"/></linearGradient>
 <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d5ed73"/><stop offset=".48" stopColor="#819b58"/><stop offset="1" stopColor="#263b29"/></linearGradient>
 <radialGradient id={id("glow")}><stop stopColor="#b1c975" stopOpacity=".32"/><stop offset="1" stopColor="#b1c975" stopOpacity="0"/></radialGradient>
 <pattern id={id("grid")} width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="currentColor" strokeOpacity=".12"/></pattern>
 </defs>
 <rect width="800" height="540" fill={url("grid")}/>
 {kind==="think"?<>
 <ellipse cx="560" cy="260" rx="310" ry="280" fill={url("glow")}/>
 <g stroke="#b6c78a" strokeWidth="1" fill="none" opacity=".45" transform="rotate(-18 560 265)"><ellipse cx="560" cy="265" rx="225" ry="116"/><ellipse cx="560" cy="265" rx="253" ry="154"/><ellipse cx="560" cy="265" rx="281" ry="192"/><path d="M310 265H810M560 38V492" strokeDasharray="4 8"/></g>
 <g transform="translate(535 290) rotate(12)"><ellipse cx="10" cy="174" rx="104" ry="15" fill="#14190e" opacity=".65"/>{Array.from({length:18},(_,i)=><text key={i} x={12-i*.7} y={20-i*.7} textAnchor="middle" dominantBaseline="middle" fontFamily="Georgia,serif" fontSize="370" fontWeight="bold" fill={url("edge")}>?</text>)}<text x="0" y="8" textAnchor="middle" dominantBaseline="middle" fontFamily="Georgia,serif" fontSize="370" fontWeight="bold" stroke="#e1ee9e" strokeWidth=".8" fill={url("metal")}>?</text></g>
 <g fill="#d5ed73"><circle cx="387" cy="115" r="4"/><circle cx="723" cy="405" r="4"/><path d="M720 81v24m-12-12h24" stroke="#d5ed73"/></g>
 </>:kind==="finance"?<>
 <g transform="translate(510 268) rotate(-12)"><ellipse cx="18" cy="176" rx="198" ry="41" fill="#435039" opacity=".15"/>
 {[{x:-135,y:108,n:4},{x:-5,y:78,n:7},{x:125,y:42,n:11}].map((s,j)=><g key={j} transform={`translate(${s.x} ${s.y})`}>{Array.from({length:s.n},(_,i)=><g key={i} transform={`translate(0 ${-i*15})`}><path d="M-58 0v11a58 18 0 0 0 116 0V0" fill="#82916c" stroke="#46563c" strokeWidth=".7"/><ellipse rx="58" ry="18" fill={url("coin")} stroke="#f4f1e8" strokeWidth=".9"/><ellipse rx="48" ry="13" fill="none" stroke="#63734c" strokeWidth=".7"/></g>)}</g>)}
 <path d="M-179 66Q-28-120 177-164" stroke="#33492e" strokeWidth="2.5" strokeDasharray="3 8" fill="none"/><path d="m153-175 24 11-10 26" stroke="#33492e" strokeWidth="2.5" fill="none"/></g>
 </>:<>
 <g fill="none" stroke="#52674a" strokeWidth=".9" opacity=".4" transform="rotate(-27 565 265)">{Array.from({length:20},(_,i)=><ellipse key={i} cx="565" cy="265" rx={40+i*16} ry={25+i*11}/>)}</g>
 <g transform="translate(515 290) rotate(15)"><path d="M-10 187Q-48 55 18-170Q168-128 145 14Q118 145-10 187" fill="#405638" opacity=".16" transform="translate(13 13)"/><path d="M-10 187Q-48 55 18-170Q168-128 145 14Q118 145-10 187" fill={url("leaf")} stroke="#f4f1e8" strokeWidth="1"/><path d="M-10 187Q40 56 18-170" stroke="#f4f1e8" strokeWidth="2" fill="none"/>{Array.from({length:8},(_,i)=><g key={i} stroke="#eaf0d2" strokeWidth=".9" opacity=".7" fill="none"><path d={`M${-5+i*5} ${158-i*34} Q${52+i*7} ${124-i*34} ${94+i*4} ${95-i*32}`}/><path d={`M${-5+i*5} ${158-i*34} Q${-23+i*3} ${117-i*32} ${-20+i*4} ${93-i*30}`}/></g>)}</g>
 </>}
 <path d="M24 24h22m-22 0v22M776 24h-22m22 0v22M24 516h22m-22 0v-22M776 516h-22m22 0v-22" stroke="currentColor" opacity=".55" fill="none"/>
 </svg>
 {kind==="think"?<div className="think-word">Over<br/><em>Think.</em></div>:kind==="finance"?<div className="finance-word">Money.<br/><em>Made clearer.</em></div>:<div className="earth-word">Small acts.<br/><em>Living impact.</em></div>}
 <span className="art-foot">{kind==="think"?"THE ART OF ASKING QUESTIONS":kind==="finance"?"LEARNING / FINANCIAL LITERACY":"COMMUNITY / ENVIRONMENT"}</span>
 </div>
}
