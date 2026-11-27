import assert from 'node:assert/strict';
import {signatureQuestionScore as score} from '../src/app/signature-question-score.ts';
let n=0;
const eq=(a,b)=>{assert.equal(a,b);n++};
const ok=v=>{assert.ok(v);n++};
for(const k of ['enter','rule','action']){eq(score(-1)[k],0);eq(score(2)[k],1);let prior=0;for(let i=0;i<=100;i++){const now=score(i/100)[k];ok(now>=prior&&now<=1);prior=now}}
eq(score(.34).enter,1);eq(score(.34).rule,1);eq(score(.34).action,0);eq(score(.42).action,0);eq(score(.8).action,1);
for(const x of [.1,.25,.4,.6,.9]){const a=score(x);score(1);assert.deepEqual(score(x),a);n++}
console.log(`PASS ${n} signature question assertions`);
