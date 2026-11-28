
import assert from "node:assert/strict";
import {deskCamera} from "../src/app/desk-camera.ts";
for(const [w,h] of [[1440,900],[1363,936],[390,844],[360,640]]){
 const a=w/h,phone=a<.9,start=deskCamera(0,a,phone),mid=deskCamera(.5,a,phone),end=deskCamera(1,a,phone);
 assert(start.eye[1]>mid.eye[1]&&mid.eye[1]>end.eye[1]);assert(start.eye[2]<mid.eye[2]&&mid.eye[2]<end.eye[2]);
 assert(start.tan===mid.tan&&mid.tan===end.tan);assert.deepEqual(deskCamera(.5,a,phone),mid);
 assert(Math.abs(mid.forward[2])>Math.abs(start.forward[2]));assert(Math.abs(end.forward[2])>Math.abs(mid.forward[2]));
 for(const cam of [start,mid,end])for(const v of [cam.forward,cam.right,cam.up])assert(Math.abs(Math.hypot(...v)-1)<1e-8);
 console.log(w+"x"+h+" camera path OK");
}
