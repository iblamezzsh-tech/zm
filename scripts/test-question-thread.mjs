import assert from 'node:assert/strict';
import {questionThread} from '../src/app/question-thread.ts';
const source={x:800,y:330,size:15},rail={x:1406,y:423,size:44},dock={x:1100,y:370,size:50};
let n=0;
function check(a,b){assert.deepEqual(a,b);n++}
check(questionThread(source,rail,dock,0,0),{point:source,coin:0,active:false});
check(questionThread(source,rail,dock,1,0),{point:rail,coin:1,active:true});
check(questionThread(source,rail,dock,1,1),{point:dock,coin:1,active:false});
let last=source.x;
for(let i=0;i<=100;i++){
 const t=i/100, f=questionThread(source,rail,dock,t,0);
 assert.ok(f.point.x>=last&&f.point.x<=rail.x);n++;last=f.point.x;
 assert.ok(f.point.size>=source.size&&f.point.size<=rail.size);n++;
 check(questionThread(source,rail,dock,t,0),f);
}
last=rail.x;
for(let i=0;i<=100;i++){
 const f=questionThread(source,rail,dock,1,i/100);
 assert.ok(f.point.x<=last&&f.point.x>=dock.x);n++;last=f.point.x;
 assert.ok(f.point.size>=rail.size&&f.point.size<=dock.size);n++;
}
console.log(`PASS ${n} question thread assertions`);
