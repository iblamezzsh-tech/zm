// Geometry-only, reversible score. The card settles early; its readable hold
// is the normal document scroll, not a timer, pin or extra scroll distance.
const ease=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
export function signatureQuestionScore(edge:number){
 return {enter:ease(.02,.30,edge),rule:ease(.08,.34,edge),action:ease(.42,.80,edge)};
}
