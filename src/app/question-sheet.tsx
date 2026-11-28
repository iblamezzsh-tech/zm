"use client";
import {useState} from "react";
const answers=["Heads is more likely","Tails is more likely","Equal chance"];
function SheetHeader(){return <div className="zm-question-header"><b data-sheet-marker>01</b><span>QUESTION<br/>SHEET</span><span className="zm-question-coin" aria-hidden="true">H</span></div>}
function QuestionText(){return <h3>A fair coin lands heads five times.<br/>What happens on the next toss?</h3>}
export function QuestionSheetPreview({source=false}:{source?:boolean}){
 return <div className={"zm-question-paper zm-question-preview"+(source?" zm-question-source":"")}><SheetHeader/><QuestionText/><div className="zm-question-options">{answers.map((a,i)=><div className="zm-question-option" key={a}><span>{"ABC"[i]}</span><span>{a}</span></div>)}</div><small>ILLUSTRATIVE QUESTION</small></div>;
}
export function HomeQuestion(){
 const [choice,setChoice]=useState<number|null>(null);
 return <div className="zm-question-paper zm-question-target"><SheetHeader/><QuestionText/><div className="zm-question-options" role="group" aria-label="Choose your answer">{answers.map((a,i)=><button type="button" className="zm-question-option" key={a} aria-pressed={choice===i} onClick={()=>setChoice(i)}><span>{"ABC"[i]}</span><span>{a}</span><span aria-hidden="true">{choice===i?(i===2?"✓":"×"):""}</span></button>)}</div><p className="zm-question-feedback" aria-live="polite">{choice===null?"Choose an answer.":choice===2?"Exactly. Each independent toss has a 50% chance of heads.":"Not quite. Previous tosses do not change the next toss. Try again."}</p><small>ILLUSTRATIVE QUESTION / PROBABILITY</small></div>;
}
