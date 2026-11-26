// Keep words intact for line wrapping and provide a single accessible label.
export default function MotionWords({text}:{text:string}){
 return <span className="zm-words" aria-label={text}>{text.split(" ").map((word,i)=><span key={i} aria-hidden="true">{i>0?" ":""}<span className="zm-word" data-motion-word><span>{word}</span></span></span>)}</span>
}
