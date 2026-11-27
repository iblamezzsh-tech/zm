import sharp from "sharp";
import {readFile,writeFile} from "node:fs/promises";
import {refinePortraitRGBA} from "./portrait-matte.mjs";
const root="assets/portrait-source",out="public/images";
async function prepare(name,kind){
 const raw=await sharp(root+"/"+name).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const {width,height,channels}=raw.info;
 if(width!==1070||height!==850||channels!==4)throw new Error("Portrait registration changed: "+name);
 const refined=refinePortraitRGBA(raw.data,width,height,{kind});
 const encoded=await sharp(refined.data,{raw:{width,height,channels:4}}).webp({quality:93,alphaQuality:100,effort:5,smartSubsample:true}).toBuffer();
 await writeFile(out+"/"+name,encoded);
 console.log("Portrait matte "+name+": "+refined.changed+" pixels refined, "+refined.removed+" cleared; "+encoded.length+" bytes.");
 return encoded;
}
await prepare("portrait-present.webp","present");
const future=await prepare("portrait-future.webp","future");
const template=await readFile(root+"/portrait-academic-attire.svg","utf8");
const embedded=/data:image\/webp;base64,[A-Za-z0-9+/=]+/;
if(!embedded.test(template))throw new Error("Academic attire source missing embedded WebP");
await writeFile(out+"/portrait-academic-attire.svg",template.replace(embedded,"data:image/webp;base64,"+future.toString("base64")));
console.log("Prepared registered present, future and academic attire assets.");
