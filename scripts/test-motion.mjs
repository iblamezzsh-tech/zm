import assert from "node:assert/strict";
import {scrollImpulseTarget,dampImpulse} from "../src/app/motion-impulse.ts";
import {mobilePortraitScale,mobileCreditFrame,approachLook,lookAlpha} from "../src/app/mobile-portrait-geometry.ts";
import {mobileTextEnvelope,kineticEnvelope,advanceMotion} from "../src/app/motion-pacing.ts";
let checks=0;
for(const [w,h] of [[320,568],[360,800],[390,844],[430,932],[768,1024],[899,650]]){
 const frame=mobileCreditFrame(w,h);
 assert.ok(frame.side>=0&&frame.top>=0&&frame.bottom>=0&&frame.scale>0);
 assert.ok(Math.abs(frame.top+frame.height+frame.bottom-h)<.001);
 assert.ok(Math.abs(frame.width+2*frame.side-w)<.001);
 assert.ok(Number.isFinite(mobilePortraitScale(w,h,140)));
 checks+=4;
}
for(const dt of [8,16,33]){
 let value=0;
 for(let i=0;i<30;i++)value=dampImpulse(value,scrollImpulseTarget(50,dt,800),dt);
 assert.ok(value>0&&value<=1);
 for(let i=0;i<30;i++)value=dampImpulse(value,scrollImpulseTarget(-50,dt,800),dt);
 assert.ok(value<0&&value>=-1);
 for(let i=0;i<300;i++)value=dampImpulse(value,0,dt);
 assert.equal(value,0);
 checks+=3;
}
assert.equal(scrollImpulseTarget(2000,16,800),0);checks++;
for(const fn of [mobileTextEnvelope,kineticEnvelope]){
 assert.equal(fn(900,1000,800,false),0);
 assert.equal(fn(0,300,800,false),1);
 assert.equal(fn(-300,-10,800,false),0);checks+=3;
}
let p=0;for(let i=0;i<1500;i++)p=advanceMotion(p,1,16,1200);assert.equal(p,1);
for(let i=0;i<1500;i++)p=advanceMotion(p,0,16,1200);assert.equal(p,0);checks+=2;
for(let i=0;i<100;i++)p=approachLook(p,1,.016);assert.equal(p,1);
for(let i=0;i<100;i++)p=approachLook(p,0,.016);assert.equal(p,0);checks+=2;
for(const x of [0,.5,1])for(const y of [0,.5,1]){assert.equal(lookAlpha(x,y,0),0);assert.equal(lookAlpha(x,y,1),255);checks+=2}
console.log("PASS",checks,"motion assertions");
