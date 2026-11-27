import { useId } from "react";

// Each guide follows the pen through a separate outline traced from the PNG.
// The outline supplies the nib width and taper, including at crossings.
const strokes = [
  {
    id: "z",
    guide:
      "M136 87 C142 77 221 50 258 48 C228 73 127 147 110 174 C151 144 216 119 250 117",
  },
  { id: "dot", guide: "M264 119 l3 -2" },
  {
    id: "m",
    guide:
      "M277 130 Q293 98 333 47 Q318 98 321 107 C332 103 365 59 397 37 C378 67 354 110 365 120",
  },
  { id: "tail", guide: "M127 182 C213 139 479 95 571 131" },
];

export default function Signature({continuation=false}:{continuation?:boolean}={}) {
  const instance = useId();
  return (
    <svg
      className="signature"
      viewBox="100 28 478 160"
      aria-hidden="true"
      focusable="false"
    >
      {strokes.map(({ id, guide }) => {
        const mask = instance + id;
        return (
          <g key={id}>
            <mask
              id={mask}
              maskUnits="userSpaceOnUse"
              x="100"
              y="28"
              width="478"
              height="160"
            >
              <path
                className={`pen pen-${id}`}
                d={guide}
                pathLength="1"
                fill="none"
                stroke="white"
                strokeWidth="21"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
            <use
              href={`/brand/signature.svg#${id}`}
              fill="currentColor"
              mask={`url(#${mask})`}
            />
          </g>
        );
      })}
      {continuation&&<path className="zm-v116-tail-continuation" d="M564 129 C573 132 578 137 569 144 C551 158 507 162 476 177" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" pathLength="1"/>}
    </svg>
  );
}
