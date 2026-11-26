"use client";
import {useEffect,useRef,useState} from "react";
import {subscribeMotion,requestMotionFrame} from "./motion-clock";

const chapters=[
 {selector:".home-hero",name:"The present"},
 {selector:"#introduction",name:"My journey"},
 {selector:"#projects",name:"Ideas into action"},
 {selector:"#milestone-preview",name:"Milestones"},
 {selector:"#interests",name:"Off the record"},
 {selector:"#next-chapter",name:"The next chapter"}
];
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(a:number,b:number,v:number)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
export default function ScrollDirector(){
 const progress=useRef<HTMLDivElement>(null);
 const [chapter,setChapter]=useState(0);
 const current=useRef(0);
 const [visible,setVisible]=useState(false);
 const shown=useRef(false);
 useEffect(()=>{
  const main=document.querySelector<HTMLElement>(".home-page");if(!main)return;
  const parts=chapters.map(c=>main.querySelector<HTMLElement>(c.selector));
  const hero=parts[0],stage=hero?.querySelector<HTMLElement>(".hero-composition"),frame=hero?.querySelector<HTMLElement>(":scope > section");
  const q=matchMedia("(min-width: 760px) and (min-height: 460px) and (prefers-reduced-motion: no-preference)");
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const items=Array.from(main.querySelectorAll<HTMLElement>(".work-heading,.field-heading,.personal-grid,.home-contact-grid,.interest-line,.field-stage,.home-contact,.exhibit-visual,.personal-chapter"));
  const positions=new Map<HTMLElement,number>();
  const headings=items.map(el=>({el,words:Array.from(el.querySelectorAll<HTMLElement>("[data-motion-word]"))})).filter(group=>group.words.length);

  function write(el:HTMLElement,name:string,value:number){el.style.setProperty(name,value.toFixed(4))}
  function measure(){
   const y=window.scrollY,h=window.innerHeight;
   const max=Math.max(1,document.documentElement.scrollHeight-h);
   progress.current?.style.setProperty("--film-progress",String(clamp(y/max)));
   let active=0;
   parts.forEach((el,i)=>{if(el&&el.getBoundingClientRect().top<=h*.42)active=i});
   if(active!==current.current){current.current=active;setChapter(active)}
   const past=!!hero&&hero.getBoundingClientRect().bottom<76;
   if(past!==shown.current){shown.current=past;setVisible(past)}
   main!.classList.toggle("film-nav-floating",past);
   if(reduced.matches)return;
   if(hero&&stage&&frame){
    const travel=Math.max(1,hero.offsetHeight-frame.offsetHeight);
    const p=q.matches?clamp(-hero.getBoundingClientRect().top/travel):clamp(-hero.getBoundingClientRect().top/(h*.8));
    write(stage,"--film-exit",smooth(.02,.94,p));
    write(stage,"--film-curtain",smooth(.12,.83,p));
    write(stage,"--film-title",smooth(.28,.82,p));
    write(stage,"--departure-depth",smooth(0,.76,p));
    write(stage,"--departure-light",smooth(.18,.90,p));
   }
   // Read all geometry before writing transforms; direct scroll mapping works in both directions.
   for(const el of items){const r=el.getBoundingClientRect();positions.set(el,clamp((h*.99-r.top)/(h*.72)));write(el,"--scene-pass",clamp((h-r.top)/(h+r.height)))}
   for(const group of headings){const p=positions.get(group.el)??1;group.words.forEach((word,i)=>write(word,"--word-reveal",smooth(i*.07,.66+i*.07,p)))}
   for(const el of items){
    const p=positions.get(el)??1;
    write(el,"--scene-reveal",smooth(0,.92,p));
    if(el.classList.contains("exhibit-visual"))write(el,"--poster-in",smooth(0,.85,p));
    if(el.classList.contains("field-stage"))write(el,"--paper-fan",smooth(.03,.90,p));
    if(el.classList.contains("interest-line"))write(el,"--interest-in",smooth(.02,.85,p));
    if(el.classList.contains("home-contact"))write(el,"--finale-write",smooth(.12,.86,p));
    if(el.classList.contains("personal-chapter"))write(el,"--notebook-flow",smooth(.04,.95,p));
   }
  }
  const schedule=requestMotionFrame;
  function mode(){
   main!.classList.toggle("film-pinned-hero",q.matches);
   main!.classList.toggle("film-motion-enabled",!reduced.matches);
   if(reduced.matches){items.forEach(el=>{el.style.removeProperty("--scene-pass");el.style.removeProperty("--scene-reveal");el.style.removeProperty("--interest-in");el.style.removeProperty("--paper-fan");el.style.removeProperty("--finale-write");el.style.removeProperty("--notebook-flow")});headings.forEach(g=>g.words.forEach(word=>word.style.removeProperty("--word-reveal")))}
   schedule();
  }
  const ro=new ResizeObserver(schedule);ro.observe(main);
  const unsubscribe=subscribeMotion(measure);
  q.addEventListener("change",mode);reduced.addEventListener("change",mode);
  mode();measure();
  return()=>{ro.disconnect();unsubscribe();q.removeEventListener("change",mode);reduced.removeEventListener("change",mode);main.classList.remove("film-pinned-hero","film-motion-enabled","film-nav-floating")};
 },[]);
 return <div ref={progress} className={"film-progress"+(visible?" film-visible":"")} aria-hidden="true"><span className="film-progress-label"><b>{String(chapter+1).padStart(2,"0")}</b> / 06 <span>{chapters[chapter].name}</span></span><span className="film-progress-track"><i/></span></div>;
}
