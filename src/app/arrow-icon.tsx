// A vector arrow, never a platform emoji. Inherits text color and size.
import type {CSSProperties} from "react";
type Direction="up-right"|"down-right"|"right"|"left"|"up"|"down";
const rotation:Record<Direction,number>={"up-right":-45,"down-right":45,right:0,left:180,up:-90,down:90};
const style:CSSProperties={display:"inline-block",width:"1em",height:"1em",verticalAlign:"-.12em",flexShrink:0};
export default function ArrowIcon({direction="up-right"}:{direction?:Direction}){
 return <svg className="zm-arrow-icon" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={style}><path d="M4.5 12h14.5m-6-6 6 6-6 6" transform={`rotate(${rotation[direction]} 12 12)`}/></svg>
}
