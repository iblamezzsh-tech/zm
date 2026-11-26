"use client";

import Link from "next/link";
import {useEffect,useRef,useState,useId} from "react";
import "./site-menu.css";

const pages=[
 {href:"/",label:"Home",number:"01",note:"The present"},
 {href:"/about",label:"My story",number:"02",note:"Where it began"},
 {href:"/projects",label:"Projects",number:"03",note:"Ideas in action"},
 {href:"/achievements",label:"Milestones",number:"04",note:"The journey"},
 {href:"/off-the-record",label:"Off the record",number:"05",note:"Beyond the portfolio"},
 {href:"/contact",label:"Let's connect",number:"06",note:"Say hello"},
];

export default function SiteHeader({about=false,projects=false,achievements=false,personal=false,contact=false}:{about?:boolean;projects?:boolean;achievements?:boolean;personal?:boolean;contact?:boolean}){
 const current=about?"/about":projects?"/projects":achievements?"/achievements":personal?"/off-the-record":contact?"/contact":"/";
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement>(null);
 const [open,setOpen]=useState(false);
 const menuId=useId();
 function show(){const el=dialog.current;if(el&&!el.open){el.showModal();setOpen(true)}}
 function close(){dialog.current?.close()}
 useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=previous}},[open]);
 return <>
 <a className="skip-link" href="#main-content">Skip to content</a>
 <header className="site-header minimal-header">
  <Link className="identity minimal-identity" href="/" aria-label="ZiyoMuhammad home"><img src="/icon.svg" alt="" width="50" height="50"/></Link>
  <div className="minimal-actions">
   <Link className="minimal-connect" href="/contact" aria-current={contact?"page":undefined}>Let's Connect <span className="minimal-arrow" aria-hidden="true">↗</span></Link>
   <button ref={trigger} className="minimal-menu-trigger" type="button" onClick={show} aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={open} aria-controls={menuId}><span className="minimal-menu-glyph" aria-hidden="true"><i/><i/></span></button>
  </div>
 </header>
 <dialog ref={dialog} id={menuId} className="zm-menu-dialog" aria-label="Navigation menu" onClose={()=>{setOpen(false);trigger.current?.focus({preventScroll:true})}}>
  <div className="zm-menu-shell">
   <div className="zm-menu-top"><Link href="/" onClick={close} aria-label="ZiyoMuhammad home"><img src="/icon.svg" alt="" width="50" height="50"/></Link><span>ZIYOMUHAMMAD / INDEX</span><button className="zm-menu-close" type="button" aria-label="Close navigation menu" onClick={close} autoFocus><span aria-hidden="true">×</span></button></div>
   <div className="zm-menu-body">
    <aside className="zm-menu-aside" aria-hidden="true"><div className="zm-menu-monogram">Z<span>M</span></div><p>The distance<br/>between now &amp; next.</p></aside>
    <nav className="zm-menu-links" aria-label="Primary navigation">{pages.map(page=><Link key={page.href} href={page.href} onClick={close} aria-current={current===page.href?"page":undefined}><span className="zm-menu-num">{page.number}</span><span className="zm-menu-label">{page.label}</span><span className="zm-menu-note">{page.note}</span><span className="zm-menu-link-arrow" aria-hidden="true">↗</span></Link>)}</nav>
   </div>
   <div className="zm-menu-bottom"><span>PERSONAL PORTFOLIO</span><span>UZBEKISTAN / NOW &amp; NEXT</span></div>
  </div>
 </dialog>
 <div id="main-content" tabIndex={-1}/>
 </>;
}
