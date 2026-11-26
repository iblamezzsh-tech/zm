export default function ProjectArt({ kind }: { kind: "think" | "finance" | "earth" }) {
  if (kind === "think") return (
    <div className="project-art art-think" aria-hidden="true">
      <div className="art-corner">ZM / INITIATIVE 01</div>
      <div className="think-orbit orbit-a" /><div className="think-orbit orbit-b" />
      <span className="think-question">?</span>
      <div className="think-word">Over<br/><em>Think.</em></div>
      <span className="art-foot">THE ART OF ASKING QUESTIONS</span>
    </div>
  );
  if (kind === "finance") return (
    <div className="project-art art-finance" aria-hidden="true">
      <div className="art-corner">ZM / INITIATIVE 02</div>
      <svg viewBox="0 0 600 390" preserveAspectRatio="xMidYMid slice">
        <defs><pattern id="finance-grid" width="45" height="45" patternUnits="userSpaceOnUse"><path d="M45 0H0V45" fill="none" stroke="currentColor" strokeOpacity=".13"/></pattern></defs>
        <rect width="600" height="390" fill="url(#finance-grid)"/>
        <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".65"><path d="M30 340 L160 256 225 290 330 169 399 205 550 62"/><path d="M510 62h40v40"/></g>
        <g fill="currentColor" opacity=".15"><rect x="80" y="270" width="45" height="100"/><rect x="180" y="230" width="45" height="140"/><rect x="280" y="165" width="45" height="205"/><rect x="380" y="120" width="45" height="250"/><rect x="480" y="75" width="45" height="295"/></g>
      </svg>
      <div className="finance-word">Money.<br/><em>Made clearer.</em></div>
      <span className="art-foot">LEARNING / FINANCIAL LITERACY</span>
    </div>
  );
  return (
    <div className="project-art art-earth" aria-hidden="true">
      <div className="art-corner">ZM / INITIATIVE 03</div>
      <svg viewBox="0 0 600 390" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="currentColor" opacity=".32">
          {Array.from({length:13},(_,i)=><ellipse key={i} cx="410" cy="196" rx={36+i*17} ry={24+i*11} transform="rotate(-32 410 196)"/>)}
        </g>
        <path d="M410 315V123 M410 222Q314 211 305 129Q397 130 410 222 M410 183Q414 101 491 83Q487 160 410 183" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="earth-word">Small acts.<br/><em>Living impact.</em></div>
      <span className="art-foot">COMMUNITY / ENVIRONMENT</span>
    </div>
  );
}
