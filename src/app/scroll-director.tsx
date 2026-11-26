"use client";
import {useEffect,useRef,useState} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

const chapters=[
 {selector:".home-hero",name:"The present",href:"#top"},
 {selector:"#introduction",name:"My journey",href:"#introduction"},
 {selector:"#projects",name:"Ideas into action",href:"#projects"},
 {selector:"#milestone-preview",name:"Milestones",href:"#milestone-preview"},
 {selector:"#interests",name:"Off the record",href:"#interests"},
 {selector:"#next-chapter",name:"The next chapter",href:"#next-chapter"}
];
export default function ScrollDirector(){
 const progress=useRef<HTMLDivElement>(null);
 const [chapter,setChapter]=useState(0);
 const current=useRef(0);
 const [visible,setVisible]=useState(false);
 const shown=useRef(false);
 useEffect(()=>{
  const main=document.querySelector<HTMLElement>(".home-page");if(!main)return;
  const parts=chapters.map(c=>main.querySelector<HTMLElement>(c.selector));
  const hero=parts[0],bar=main.querySelector<HTMLElement>(".site-header");
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let raf=0;
  function measure(){
   raf=0;
   const y=window.scrollY,h=window.innerHeight;
   const max=Math.max(1,document.documentElement.scrollHeight-h);
   progress.current?.style.setProperty("--film-progress",String(Math.min(1,Math.max(0,y/max))));
   let active=0;
   parts.forEach((el,i)=>{if(el&&el.getBoundingClientRect().top<=h*.42)active=i});
   if(active!==current.current){current.current=active;setChapter(active)}
   const past=!!hero&&hero.getBoundingClientRect().bottom<76;
   if(past!==shown.current){shown.current=past;setVisible(past)}
   main!.classList.toggle("film-nav-floating",past);
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(measure)}
  const ro=new ResizeObserver(schedule);ro.observe(main);
  window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule,{passive:true});measure();
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add("(min-width: 850px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",()=>{
   const scrub=.32;
   const heroStage=main.querySelector<HTMLElement>(".hero-composition");
   if(heroStage)gsap.to(heroStage,{"--hero-departure":1,ease:"none",scrollTrigger:{trigger:heroStage,start:"top top",end:"bottom 28%",scrub}});
   const reveal=(selector:string,from:string="top 94%",to:string="top 36%")=>{
    main.querySelectorAll<HTMLElement>(selector).forEach(el=>gsap.fromTo(el,{"--scene-reveal":0},{"--scene-reveal":1,ease:"none",scrollTrigger:{trigger:el,start:from,end:to,scrub}}));
   };
   reveal(".work-heading,.field-heading,.personal-grid,.home-contact-grid");
   const archive=main.querySelector<HTMLElement>(".field-stage");
   if(archive)gsap.fromTo(archive,{"--paper-fan":0},{"--paper-fan":1,ease:"none",scrollTrigger:{trigger:archive,start:"top 92%",end:"top 20%",scrub}});
   const interests=main.querySelectorAll<HTMLElement>(".interest-line");
   interests.forEach((el,i)=>gsap.fromTo(el,{"--interest-in":0},{"--interest-in":1,ease:"none",scrollTrigger:{trigger:el,start:"top 94%",end:"top 56%",scrub:.28+i*.035}}));
   const finale=main.querySelector<HTMLElement>(".home-contact");
   if(finale)gsap.fromTo(finale,{"--finale-write":0},{"--finale-write":1,ease:"none",scrollTrigger:{trigger:finale,start:"top 80%",end:"center 45%",scrub}});
   // Resync after sticky layouts and document images have settled, without polling.
   const refresh=()=>ScrollTrigger.refresh();
   document.fonts.ready.then(()=>{if(main.isConnected)refresh()});
   const resizeObserver=new ResizeObserver(()=>{schedule();ScrollTrigger.refresh()});
   // Observe only the stage whose height changes, not animated descendants.
   const exhibit=main.querySelector<HTMLElement>(".project-exhibition");
   if(exhibit)resizeObserver.observe(exhibit);
   return()=>resizeObserver.disconnect();
  });
  return()=>{mm.revert();ro.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);if(raf)cancelAnimationFrame(raf);main.classList.remove("film-nav-floating");bar?.removeAttribute("data-film");};
 },[]);
 return <div ref={progress} className={"film-progress"+(visible?" film-visible":"")} aria-hidden="true"><span className="film-progress-label"><b>{String(chapter+1).padStart(2,"0")}</b> / 06 <span>{chapters[chapter].name}</span></span><span className="film-progress-track"><i/></span></div>;
}
