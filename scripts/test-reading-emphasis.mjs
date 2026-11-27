import assert from 'node:assert/strict';
import {readingEmphasis as score} from '../src/app/reading-emphasis.ts';
assert.deepEqual(score(0),[0,0,0]);
assert.deepEqual(score(1),[0,0,0]);
assert.deepEqual(score(-1),score(0));
assert.deepEqual(score(2),score(1));
assert.deepEqual(score(NaN),score(0));
for (const [i,p] of [.22,.5,.82].entries()) {assert.equal(score(p)[i],1);assert.equal(score(p).filter(v=>v===1).length,1);}
const samples=Array.from({length:101},(_,i)=>i/100);const forwards=samples.map(score);assert.deepEqual([...samples].reverse().map(score),[...forwards].reverse());
assert.ok(forwards.flat().every(x=>x>=0&&x<=1));
console.log('PASS 13 reading-emphasis assertions');
