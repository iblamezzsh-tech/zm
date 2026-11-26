"use client";
import {useLayoutEffect,useRef,type ReactNode} from "react";
import {subscribeMotion,requestMotionFrame,scrollToFilm} from "./motion-clock";
const clamp=(x:number)=>Math.min(1,Math.max(0,x));
const ease=(a:number,b:number,x:number)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const write=(el:HTMLElement,key:string,value:number)=>el.style.setProperty(key,value.toFixed(5));
export default function EditorialFlow({children}:{children:ReactNode}){
 const root=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const el=root.current,main=el?.closest<HTMLElement>("main");
  if(!el||!main){document.dispatchEvent(new CustomEvent("zm-film-ready",{detail:{ok:false}}));return;}
  const scenes=Array.from(el.querySelectorAll<HTMLElement>("[data-ed-scene]"));
  const reveals=Array.from(el.querySelectorAll<HTMLElement>("[data-ed-reveal],[data-ed-line]"));
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const desktop=matchMedia("(min-width: 900px) and (min-height: 500px) and (pointer: fine)");
  const collage=el.querySelector<HTMLElement>(".ed-collage"),rail=el.querySelector<HTMLElement>(".ed-collage-grid");
  const collageWindow=el.querySelector<HTMLElement>(".ed-collage-sticky");
  let manual=false,enabled=false,cinema=false,railDistance=0,alive=true;
  function layout(){
   if(!alive||!collage||!rail||!collageWindow)return;
   railDistance=cinema?Math.max(0,rail.scrollWidth-collageWindow.clientWidth):0;
   collage.style.setProperty("--rail-distance",railDistance+"px");
  }
  function render(){
   if(!alive)return;
   const h=window.innerHeight,w=window.innerWidth,anchor=Math.min(70,h*.12);
   const bounds=scenes.map(s=>({s,r:s.getBoundingClientRect()}));
   const at=bounds.filter(({r})=>r.top<=anchor&&r.bottom>anchor).at(-1);
   main!.classList.toggle("ed-dark-header",at?.s.dataset.edTheme==="dark"||Boolean(at?.s.id==="film-present"&&-at.r.top>h*.13));
   main!.classList.toggle("film-at-finale",at?.s.id==="next-chapter");
   if(!enabled)return;
   for(const {s,r} of bounds){
    // Always update offscreen endpoints too; a fast wheel or deep link cannot leave a stale frame.
    const pass=clamp((h-r.top)/(h+r.height)),enter=ease(0,1,clamp((h-r.top)/(h*.75)));
    const local=clamp(-r.top/Math.max(1,r.height-h));
    const edge=clamp((h-r.top)/h);
    write(s,"--ed-pass",pass);write(s,"--ed-enter",enter);write(s,"--ed-travel",(pass-.5)*2);
    write(s,"--ed-local",local);write(s,"--ed-edge",edge);
    if(s.id==="film-present"){
     write(s,"--ed-hero-exit",ease(.06,.79,local));write(s,"--ed-credit",ease(.26,.68,local));write(s,"--ed-hero-depart",ease(.79,1,local));
    }
    if(s===collage&&cinema){
     const t=clamp(-r.top/Math.max(1,r.height-h));
     s.style.setProperty("--rail-x",(-railDistance*ease(.04,.97,t)).toFixed(2)+"px");
     write(s,"--rail-p",t);
    }
    if(s.classList.contains("ed-manifesto"))write(s,"--ed-manifesto-pass",clamp((h-r.top)/(r.height+h*.5)));
    if(s.classList.contains("ed-social")){write(s,"--fan-open",cinema?ease(.04,.64,local):enter);write(s,"--fan-away",cinema?ease(.82,1,local):0);}
   }
   for(const node of reveals){
    // Horizontal gallery uses viewport x; ordinary scenes use stationary vertical bounds.
    const r=node.getBoundingClientRect();
    const horizontal=cinema&&node.closest(".ed-collage-grid");
    const p=horizontal?ease(0,1,clamp((w-r.left)/(w*.36))):ease(0,1,clamp((h*.99-r.top)/Math.min(h*.62,Math.max(h*.30,r.height*.7))));
    write(node,"--ed-reveal",p);
   }
   for(const node of el!.querySelectorAll<HTMLElement>(".ed-archive-item")){
    const r=node.getBoundingClientRect();
    const p=clamp((h-r.top)/(h+r.height));
    write(node,"--record-pass",p);
   }
  }
  function mode(){
   enabled=!manual&&!reduced.matches;cinema=enabled&&desktop.matches;
   el!.dataset.edMotion=String(enabled);el!.dataset.edCinema=String(cinema);
   layout();render();requestMotionFrame();
  }
  function change(){manual=!manual;mode()}
  function resize(){layout();requestMotionFrame()}
  // Keyboard focus in the rail must move the native scroll position to the visible item.
  function focus(e:FocusEvent){
   if(!cinema||!collage||!rail||!(e.target instanceof HTMLElement)||!rail.contains(e.target))return;
   const r=e.target.getBoundingClientRect();if(r.left>=0&&r.right<=innerWidth)return;
   const delta=Math.max(0,Math.min(railDistance,e.target.offsetLeft-innerWidth*.2));
   const top=window.scrollY+collage.getBoundingClientRect().top;
   const target=railDistance?delta/railDistance:0;
   // Invert the eased rail trajectory to align a keyboard-selected link.
   let lo=0,hi=1;for(let i=0;i<16;i++){const m=(lo+hi)/2;if(ease(.04,.97,m)<target)lo=m;else hi=m}
   scrollToFilm(top+(collage.offsetHeight-innerHeight)*(lo+hi)/2,true);
  }
  const unsub=subscribeMotion(render),ro=new ResizeObserver(resize);ro.observe(el);if(rail)ro.observe(rail);
  reduced.addEventListener("change",mode);desktop.addEventListener("change",mode);window.addEventListener("zm-film-mode",change);el.addEventListener("focusin",focus);
  document.addEventListener("zm-boot-prepare",resize);
  mode();document.fonts.ready.then(()=>{if(alive)resize()});
  document.dispatchEvent(new CustomEvent("zm-film-ready",{detail:{ok:true}}));
  return()=>{alive=false;unsub();ro.disconnect();reduced.removeEventListener("change",mode);desktop.removeEventListener("change",mode);window.removeEventListener("zm-film-mode",change);el.removeEventListener("focusin",focus);document.removeEventListener("zm-boot-prepare",resize);main.classList.remove("ed-dark-header","film-at-finale");delete el.dataset.edMotion;delete el.dataset.edCinema};
 },[]);
 return <div ref={root} className="editorial-flow" id="main-content" tabIndex={-1}>{children}</div>
}
