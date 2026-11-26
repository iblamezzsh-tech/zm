// Extract only known certificate assets from the owner's uploaded ZIP.
// No external dependency or shell utility is required.
import {existsSync,readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {inflateRawSync} from "node:zlib";
import {join} from "node:path";
const archive="ZM-certificate-images.zip";
const allowed=new Set(["business-studies-2026","fergana-mun","football-second-place","grade-2-commendation-2018","grade-5-academic-award","grade-6-academic-award","grade-6-commendation","handball-first-place-2022","informatics-olympiad-third-place","kamalak-active-member","namangan-mun-2026","school-honor-2026","zakovat-best-player-2024"].map(name=>"public/documents/"+name+".webp"));
if(!existsSync(archive)){console.log("Certificate ZIP not present; using existing assets.");process.exit(0)}
const zip=readFileSync(archive);
let end=-1;for(let p=zip.length-22;p>=Math.max(0,zip.length-65557);p--){if(zip.readUInt32LE(p)===0x06054b50&&p+22+zip.readUInt16LE(p+20)===zip.length){end=p;break}}
if(end<0)throw new Error("Invalid certificate ZIP");
let pos=zip.readUInt32LE(end+16);const count=zip.readUInt16LE(end+10);const found=new Set();
for(let i=0;i<count;i++){if(pos+46>zip.length||zip.readUInt32LE(pos)!==0x02014b50)throw new Error("Invalid ZIP directory");const method=zip.readUInt16LE(pos+10),flags=zip.readUInt16LE(pos+8),packed=zip.readUInt32LE(pos+20),size=zip.readUInt32LE(pos+24),nameLen=zip.readUInt16LE(pos+28),extraLen=zip.readUInt16LE(pos+30),commentLen=zip.readUInt16LE(pos+32),offset=zip.readUInt32LE(pos+42);const name=zip.toString("utf8",pos+46,pos+46+nameLen);pos+=46+nameLen+extraLen+commentLen;if(!allowed.has(name))continue;if(found.has(name)||flags&1||size>8*1024*1024||offset+30>zip.length||zip.readUInt32LE(offset)!==0x04034b50)throw new Error("Invalid certificate entry: "+name);const start=offset+30+zip.readUInt16LE(offset+26)+zip.readUInt16LE(offset+28);if(start+packed>zip.length)throw new Error("Truncated certificate entry");const raw=zip.subarray(start,start+packed);const image=method===0?raw:method===8?inflateRawSync(raw,{maxOutputLength:8*1024*1024}):null;if(!image||image.length!==size||image.length<12||image.toString("ascii",0,4)!=="RIFF"||image.toString("ascii",8,12)!=="WEBP")throw new Error("Invalid WebP: "+name);mkdirSync(join("public","documents"),{recursive:true});writeFileSync(name,image);found.add(name)}
if(found.size!==allowed.size)throw new Error("Certificate ZIP is missing expected images: "+[...allowed].filter(name=>!found.has(name)).join(", "));
console.log("Prepared "+found.size+" certificate images.");
