"use client";
import {useState} from "react";
export default function CopyEmail({email}:{email:string}){
 const [status,setStatus]=useState("");
 async function copy(){try{await navigator.clipboard.writeText(email);setStatus("Email copied.")}catch{setStatus("Could not copy. Select and copy the email address below.")}}
 return <div className="zm-email-copy"><button type="button" onClick={copy}>Copy email</button><span role="status" aria-live="polite">{status}</span></div>;
}
