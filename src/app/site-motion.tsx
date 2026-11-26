"use client";
import {useEffect,useRef} from "react";
import {usePathname} from "next/navigation";
import {subscribeMotion,requestMotionFrame} from "./motion-clock";

const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(a:number,b:number,v:number)=>{const x=clamp((v-a)/(b-a));return x*x*(3-2*x)};
// All progress is measured against stationary layout parents, never the animated child.
const groups=[
 {selector:".story-opening,.projects-opening,.case-opening,.milestone-hero,.personal-opening,.contact-opening",kind:"opening"},
 {selector:".story-entry",kind:"story"},
 {selector:".exhibit-scene",kind:"project"},
 {selector:".case-introduction,.case-details,.case-future,.case-experience",kind:"case"},
 {selector:".field-notes",kind:"field"},
 {selector:".archive-heading",kind:"heading"},
 {selector:".archive-desk",kind:"desk"},
 {selector:".personal-note",kind:"note"},
 {selector:".contact-channel",kind:"channel"},
 {selector:".personal-questions,.personal-music,.personal-books",kind:"personal"},
 {selector:".contact-letter",kind:"letter"},
 {selector:".story-ending,.projects-ending,.archive-ending,.personal-end,.contact-ending,.case-next",kind:"ending"},
];
const assetSelector=".story-portrait,.entry-art,.exhibit-visual,.case-opening .project-art,.archive-emblem,.music-art,.book-stack,.letter-paper";
export default function SiteMotion(){
 const path=usePathname();
 const indicator=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const main=document.querySelector<HTMLElement>("main");if(!main||main.classList.contains("home-page"))return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const fine=matchMedia("(pointer: fine)");
  const nodes=groups.flatMap(g=>Array.from(main.querySelectorAll<HTMLElement>(g.selector)).map(el=>({el,kind:g.kind,words:Array.from(el.querySelectorAll<HTMLElement>("[data-motion-word]"))})));
  const assets=Array.from(main.querySelectorAll<HTMLElement>(assetSelector));
  const decorated=new Set<HTMLElement>();
  let enabled=false,disposed=false;
  const precise=matchMedia("(min-width: 850px) and (min-height: 540px) and (prefers-reduced-motion: no-preference)");
  const visualNodes=Array.from(main.querySelectorAll<HTMLElement>(".entry-spread,.case-feature-art,.exhibit-scene,.music-layout,.books-layout,.contact-letter-grid,.field-stage"));
  const rootNodes=new Set<HTMLElement>([...visualNodes,...nodes.map(n=>n.el)]);
  function mark(el:HTMLElement,k:string){el.dataset.motionKind=k;decorated.add(el)}
  function write(el:HTMLElement,k:string,v:number){el.style.setProperty(k,v.toFixed(4))}
  nodes.forEach(({el,kind})=>mark(el,kind));
  // Use an observer to avoid continually measuring every archive card.
  const cards=new Set<HTMLElement>();
  const cardObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){(e.target as HTMLElement).dataset.cardSeen="true";cardObserver.unobserve(e.target)}}},{threshold:.13});
  function scanCards(){for(const old of cards){if(!old.isConnected){cardObserver.unobserve(old);cards.delete(old)}}main!.querySelectorAll<HTMLElement>(".archive-record,.personal-note,.contact-channel").forEach(el=>{if(cards.has(el))return;cards.add(el);cardObserver.observe(el)})}
  const mutations=new MutationObserver(()=>{scanCards();requestMotionFrame()});
  mutations.observe(main,{childList:true,subtree:true});scanCards();
  // The actual linework is authored SVG, not generic stock animation.
  const strokes=Array.from(main.querySelectorAll<SVGGeometryElement>(".entry-art svg path,.music-art svg path")).filter(el=>el.getAttribute("fill")!=="currentColor"&&el.getAttribute("fill")!=="#fff");
  strokes.forEach(el=>el.setAttribute("pathLength","1"));
  function update(){
   if(disposed)return;
   const h=window.innerHeight,y=window.scrollY,max=Math.max(1,document.documentElement.scrollHeight-h);
   indicator.current?.style.setProperty("--site-reading",String(clamp(y/max)));
   main!.classList.toggle("site-controls-floating",y>Math.min(140,h*.22));
   if(!enabled)return;
   const geometry=new Map(Array.from(rootNodes,el=>[el,el.getBoundingClientRect()] as const));
   const values=nodes.map(node=>({node,r:geometry.get(node.el)!}));
   for(const {node,r} of values){
    const {el,kind,words}=node;
    const start=h*(kind==="opening"?1.18:.97);
    const travel=Math.min(h*.8,Math.max(h*.34,r.height*.64));
    const p=clamp((start-r.top)/travel);
    const draw=ease(.03,.88,p);
    write(el,"--site-in",draw);
    write(el,"--site-draw",ease(.06,.94,p));
    write(el,"--site-passage",clamp((h-r.top)/(h+r.height)));
    write(el,"--studio-arrival",ease(.02,.92,clamp((h*.98-r.top)/(h*.64))));
    words.forEach((word,i)=>write(word,"--word-reveal",kind==="opening"?1:ease(Math.min(.32,i*.055),Math.min(.98,.62+i*.055),p)));
   }
   for(const el of visualNodes){
    const r=geometry.get(el)!;
    const pass=clamp((h-r.top)/(h+r.height));
    const arrival=ease(0,1,clamp((h*.98-r.top)/(h*.68)));
    write(el,"--studio-travel",pass);write(el,"--studio-unfold",arrival);
   }
  }
  function mode(){enabled=!reduced.matches;main!.classList.toggle("site-motion-ready",enabled);main!.classList.toggle("studio-scroll",precise.matches);if(!enabled)nodes.forEach(({words})=>words.forEach(word=>word.style.removeProperty("--word-reveal")));requestMotionFrame()}
  function pointer(e:PointerEvent){
    if(!enabled||!fine.matches||e.pointerType!=="mouse")return;
    const target=e.currentTarget as HTMLElement,r=target.getBoundingClientRect();
    write(target,"--art-x",clamp((e.clientX-r.left)/Math.max(1,r.width))*2-1);
    write(target,"--art-y",clamp((e.clientY-r.top)/Math.max(1,r.height))*2-1);
  }
  function leave(e:PointerEvent){const el=e.currentTarget as HTMLElement;write(el,"--art-x",0);write(el,"--art-y",0)}
  assets.forEach(el=>{el.addEventListener("pointermove",pointer,{passive:true});el.addEventListener("pointerleave",leave)});
  const unsubscribe=subscribeMotion(update),ro=new ResizeObserver(requestMotionFrame);ro.observe(main);
  reduced.addEventListener("change",mode);precise.addEventListener("change",mode);mode();update();
  return()=>{disposed=true;unsubscribe();ro.disconnect();mutations.disconnect();cardObserver.disconnect();reduced.removeEventListener("change",mode);precise.removeEventListener("change",mode);main.classList.remove("site-motion-ready","site-controls-floating","studio-scroll");decorated.forEach(el=>{delete el.dataset.motionKind;el.style.removeProperty("--site-in");el.style.removeProperty("--site-draw");el.style.removeProperty("--site-passage")});assets.forEach(el=>{el.removeEventListener("pointermove",pointer);el.removeEventListener("pointerleave",leave)});};
 },[path]);
 return <div ref={indicator} className="site-reading-rail" aria-hidden="true" hidden={path==="/"}><i/></div>;
}
