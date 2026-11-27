"use client";
import {useEffect} from "react";
export default function TopicAnchor(){
 useEffect(()=>{
  let raf=0;
  function follow(){
   const id=location.hash.slice(1);
   if(!["economics","psychology","politics","music","literature"].includes(id))return;
   const node=document.getElementById(id);
   if(!node)return;
   if(node instanceof HTMLDetailsElement)node.open=true;
   cancelAnimationFrame(raf);
   raf=requestAnimationFrame(()=>{
    node.scrollIntoView({block:"start",behavior:"instant"});
    (node instanceof HTMLDetailsElement?node.querySelector("summary"):node)?.focus({preventScroll:true});
   });
  }
  follow();window.addEventListener("hashchange",follow);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener("hashchange",follow)};
 },[]);
 return null;
}
