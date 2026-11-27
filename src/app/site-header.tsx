"use client";
import ArrowIcon from "./arrow-icon";
import Link from "next/link";
import {useEffect,useRef,useState,useId} from "react";
import Signature from "./signature";
import ProjectEdition from "./project-edition";
import {projects as portfolioProjects} from "./projects/data";
import "./site-menu.css";

const pages=[
 {href:"/",label:"Home",number:"01",note:"The present",visual:"present"},
 {href:"/about",label:"My story",number:"02",note:"Where it began",visual:"story"},
 {href:"/projects",label:"Projects",number:"03",note:"Ideas in action",visual:"project"},
 {href:"/achievements",label:"Milestones",number:"04",note:"The journey",visual:"mun"},
 {href:"/off-the-record",label:"Off the record",number:"05",note:"Beyond the portfolio",visual:"notebook"},
 {href:"/contact",label:"Let's connect",number:"06",note:"Say hello",visual:"signature"},
] as const;
type Tile={id:string;label:string;image?:string;kind:"portrait"|"future"|"document"|"project"|"signature"|"notebook"};
const columns:Tile[][]=[
 [
 {id:"present",label:"01 / The present",image:"/images/portrait-present.webp",kind:"portrait"},
 {id:"story",label:"02 / Around the table",image:"/documents/zakovat-best-player-2024.webp",kind:"document"},
 {id:"project",label:"03 / OverThink",kind:"project"},
 ],
 [
 {id:"mun",label:"04 / Original records",image:"/documents/namangan-mun-2026.webp",kind:"document"},
 {id:"notebook",label:"05 / Off the record",kind:"notebook"},
 {id:"signature",label:"06 / Z.M.",kind:"signature"},
 ]
];
function GalleryTile({tile,active}:{tile:Tile;active:boolean}){
 const [unavailable,setUnavailable]=useState(false);
 return <div className={"zm-gallery-tile tile-"+tile.kind+(active?" is-highlighted":"")}>
  {tile.image&&!unavailable&&<img src={tile.image} alt="" draggable={false} onError={()=>setUnavailable(true)}/>}
  {tile.kind==="document"&&unavailable&&<div className="zm-menu-record-fallback"><span>ZM / PERSONAL ARCHIVE</span><strong>{tile.id==="story"?"My story.":"Milestones."}</strong><small>Document unavailable</small></div>}
  {tile.kind==="future"&&<img className="tile-attire" src="/images/portrait-academic-attire.svg" alt="" draggable={false}/>}
  {tile.kind==="project"&&<ProjectEdition project={portfolioProjects[0]}/>}
  {tile.kind==="notebook"&&<div className="tile-notebook-mark"><span>FIELD NOTES</span><b>Stay<br/><em>curious.</em></b><span>ZM / PERSONAL NOTEBOOK</span></div>}{tile.kind==="signature"&&<div className="tile-signature-mark"><Signature/></div>}
  <span className="zm-tile-label">{tile.label}</span>
 </div>
}
export default function SiteHeader({about=false,projects=false,achievements=false,personal=false,contact=false}:{about?:boolean;projects?:boolean;achievements?:boolean;personal?:boolean;contact?:boolean}){
 const current=about?"/about":projects?"/projects":achievements?"/achievements":personal?"/off-the-record":contact?"/contact":"/";
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const [open,setOpen]=useState(false);
 const [closing,setClosing]=useState(false);
 const [hovered,setHovered]=useState<string|null>(null);
 const menuId=useId();
 const selected=hovered??pages.find(p=>p.href===current)?.visual??"present";
 function show(){const el=dialog.current;if(el&&!el.open){setClosing(false);setHovered(null);el.showModal();setOpen(true)}}
 function finish(){if(timer.current){clearTimeout(timer.current);timer.current=null}dialog.current?.close()}
 function close(animated=true){if(!dialog.current?.open)return;if(!animated||matchMedia("(prefers-reduced-motion: reduce)").matches){finish();return}if(timer.current)return;setClosing(true);timer.current=setTimeout(finish,320)}
 useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=previous}},[open]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 return <>
 <a className="skip-link" href="#main-content">Skip to content</a>
 <header className="site-header minimal-header">
  <Link className="identity minimal-identity" href="/" aria-label="ZiyoMuhammad home"><img src="/icon.svg" alt="" width="50" height="50"/></Link>
  <div className="minimal-actions">
   <Link className="minimal-connect" href="/contact" aria-current={contact?"page":undefined}>Let's Connect <span className="minimal-arrow" aria-hidden="true"><ArrowIcon direction="up-right"/></span></Link>
   <button ref={trigger} className="minimal-menu-trigger" type="button" onClick={show} aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={open} aria-controls={menuId}><span className="minimal-menu-glyph" aria-hidden="true"><i/><i/></span></button>
  </div>
 </header>
 <dialog data-lenis-prevent ref={dialog} id={menuId} className={"zm-menu-dialog"+(closing?" is-closing":"")} aria-label="Navigation menu" onCancel={e=>{e.preventDefault();close()}} onClose={()=>{setOpen(false);setClosing(false);setHovered(null);trigger.current?.focus({preventScroll:true})}}>
  <div className="zm-menu-shell">
   <div className="zm-menu-top">
    <Link className="zm-menu-logo" href="/" onClick={()=>close(false)} aria-label="ZiyoMuhammad home"><img src="/icon.svg" alt="" width="50" height="50"/></Link>
    <div className="minimal-actions"><Link className="minimal-connect zm-menu-connect" href="/contact" onClick={()=>close(false)}>Let's Connect <span aria-hidden="true"><ArrowIcon direction="up-right"/></span></Link><button className="zm-menu-close" type="button" aria-label="Close navigation menu" onClick={()=>close()} autoFocus><span aria-hidden="true">×</span></button></div>
   </div>
   <div className="zm-menu-gallery zm-menu-contact-sheet" aria-hidden="true">
    {open&&<><div className="zm-menu-feature">{columns.flat().map(tile=><div className={"zm-menu-feature-frame"+(selected===tile.id?" is-selected":"")} key={tile.id}><GalleryTile tile={tile} active={selected===tile.id}/></div>)}</div><div className="zm-menu-filmstrip">{columns.flat().map(tile=><div className={"zm-menu-filmstrip-item"+(selected===tile.id?" is-selected":"")} key={tile.id}><GalleryTile tile={tile} active={selected===tile.id}/></div>)}</div><div className="zm-menu-gallery-caption"><span>THE PORTFOLIO / CONTACT SHEET</span><span>{pages.find(p=>p.visual===selected)?.note??"The present"}</span></div></>}
   </div>
   <div className="zm-menu-right">
    <div className="zm-menu-index"><span>ZM / INDEX</span><span>01—06</span></div>
    <nav className="zm-menu-links" aria-label="Primary navigation" onMouseLeave={()=>setHovered(null)}>{pages.map((page,i)=><Link key={page.href} href={page.href} onClick={()=>close(false)} onMouseEnter={()=>setHovered(page.visual)} onFocus={()=>setHovered(page.visual)} onBlur={()=>setHovered(null)} aria-current={current===page.href?"page":undefined} style={{"--item":i} as React.CSSProperties}><span className="zm-menu-number" aria-hidden="true">{page.number}</span><span className="zm-menu-label" aria-label={page.label}>{Array.from(page.label).map((ch,index)=><span key={index} aria-hidden="true" className="zm-menu-letter" style={{"--letter":index} as React.CSSProperties}>{ch===" "?"\u00a0":ch}</span>)}<svg className="zm-menu-strike" viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0 10H45Q52 10 58 15H101Q108 15 115 5H163Q170 5 178 15H240" fill="none" stroke="currentColor" strokeWidth="2.8" vectorEffect="non-scaling-stroke" pathLength="1"/></svg></span><span className="zm-menu-link-arrow" aria-hidden="true"><ArrowIcon direction="up-right"/></span></Link>)}</nav>
    <div className="zm-menu-signoff"><Signature/><span>Curious by nature. / Uzbekistan</span></div>
    <div className="zm-menu-social">{current==="/"&&<button type="button" className="zm-reading-option" onClick={()=>{close(false);window.dispatchEvent(new Event("zm-film-mode"))}}>Switch reading mode</button>}<Link href="/contact" onClick={()=>close(false)}>Get in touch <ArrowIcon direction="up-right"/></Link><div><a href="https://t.me/Shoxruxbekovich" target="_blank" rel="noreferrer">Telegram</a><a href="https://www.instagram.com/the_zzsh/" target="_blank" rel="noreferrer">Instagram</a><a href="https://github.com/iblamezzsh-tech/zm" target="_blank" rel="noreferrer">GitHub</a></div></div>
   </div>
  </div>
 </dialog>
 {current!=="/"&&<div id="main-content" tabIndex={-1}/>}
 </>;
}
