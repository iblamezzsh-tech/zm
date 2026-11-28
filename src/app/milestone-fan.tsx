"use client";
import Link from "next/link";
import {useState} from "react";
import type {RecordEntry} from "./achievements/data";
import ArrowIcon from "./arrow-icon";
export default function MilestoneFan({records}:{records:RecordEntry[]}){
 const [active,setActive]=useState(0);
 if(!records.length)return null;
 const indices=[(active+2)%records.length,(active+1)%records.length,active].filter((n,i,a)=>a.indexOf(n)===i);
 return <div className="ed-gutter zm-milestone-fan"><div className="zm-milestone-stack" aria-hidden="true">{records.map((r,i)=>r.document&&<div key={r.id} className="zm-milestone-paper" data-position={indices.includes(i)?indices.indexOf(i)-indices.length+3:0}><img src={r.document.src} alt="" loading={i<3?"eager":"lazy"} decoding="async"/></div>)}<span className="zm-milestone-stack-label">ORIGINAL RECORD / {String(active+1).padStart(2,"0")}</span></div><div className="zm-milestone-index" aria-label="Milestone index">{records.map((r,i)=><Link key={r.id} href={"/achievements#record-"+r.id} data-return-record={r.id} onPointerEnter={e=>{if(e.pointerType!=="touch")setActive(i)}} onFocus={()=>setActive(i)} data-front={active===i}><span className="zm-milestone-number">{String(i+1).padStart(2,"0")}</span><span className="zm-milestone-meta"><strong>{r.title}</strong><span>{r.organization}</span><small>{r.period?.match(/(?:19|20)\d{2}/g)?.join("–")??"Undated"}</small></span><span aria-hidden="true"><ArrowIcon direction="up-right"/></span></Link>)}</div></div>;
}
