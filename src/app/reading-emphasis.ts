/** A pure, reversible accent score. The text never depends on these values for visibility. */
export function readingEmphasis(progress:number):[number,number,number]{
 const t=Number.isFinite(progress)?Math.max(0,Math.min(1,progress)):0;
 const smooth=(a:number,b:number)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x)};
 const pulse=(start:number,peak:number,end:number)=>smooth(start,peak)*(1-smooth(peak,end));
 return [pulse(0,.22,.47),pulse(.22,.50,.78),pulse(.53,.82,1)];
}
