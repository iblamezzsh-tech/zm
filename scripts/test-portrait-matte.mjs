import assert from "node:assert/strict";
import {refinePortraitRGBA} from "./portrait-matte.mjs";
const w=1070,h=850,src=Buffer.alloc(w*h*4);
function put(x,y,r,g,b,a=255){const i=(y*w+x)*4;src.set([r,g,b,a],i);return i}
const fringe=put(400,110,235,234,232);
const dark=put(401,110,45,39,34);
const mixed=put(402,110,185,184,180);
const skin=put(530,270,206,158,131);
const shirt=put(500,800,237,236,234);
const gold=put(780,370,222,170,57);
const clear=put(200,110,220,220,220,0);
const r=refinePortraitRGBA(src,w,h).data;
assert.equal(r[fringe+3],0);
assert.deepEqual(r.subarray(dark,dark+4),src.subarray(dark,dark+4));
assert.ok(r[mixed+3]>0&&r[mixed+3]<255);
assert.ok(r[mixed]<src[mixed]);
for(const p of [skin,shirt,gold,clear])assert.deepEqual(r.subarray(p,p+4),src.subarray(p,p+4));
assert.equal(src[fringe+3],255);
console.log("PASS 9 portrait matte assertions");
