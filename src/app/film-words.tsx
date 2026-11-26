// Accessible, individually timed word masks; no text duplication in the layout.
export default function FilmWords({text}:{text:string}){
 return <span className="film-words" aria-label={text}>{text.split(" ").map((word,i)=><span key={i} aria-hidden="true">{i>0?" ":""}<span className="film-word" style={{"--word-i":i} as React.CSSProperties}><span>{word}</span></span></span>)}</span>
}
