import type {CSSProperties} from "react";
type Kind="marker"|"stamp"|"caption"|"assemble"|"unfold"|"press"|"engrave"|"swerve";
// Keep real text and spaces; animate complete words to preserve font kerning.
export default function KineticText({text,kind,index=0}:{text:string;kind:Kind;index?:number}){
 return <span className="kt-phrase" data-kinetic={kind} style={{"--kt-line":index} as CSSProperties}>{text.split(" ").map((word,i)=><span className="kt-unit" key={i}>{i>0?" ":""}<span className="kt-word" style={{"--kt-i":i} as CSSProperties}><span className="kt-glyph">{word}</span></span></span>)}</span>;
}
