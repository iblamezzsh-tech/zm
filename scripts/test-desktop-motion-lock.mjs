import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {runInNewContext} from 'node:vm';
// Resolve the same extensionless TypeScript imports used by Next.js.
const hook=registerHooks({resolve(specifier, context, next){
 if(context.parentURL?.endsWith('/motion-quality-store.ts')&&/^\.\/(motion-quality-policy|scene-motion-policy)$/.test(specifier))return next(specifier+'.ts',context);
 return next(specifier,context);
}});
const store=await import('../src/app/motion-quality-store.ts');
const {initialReading}=await import('../src/app/scene-motion-policy.ts');
const {desktopMotionBootstrap}=await import('../src/app/motion-quality-policy.ts');
const {getMotionQuality,getMotionTier,getSceneTier,initializeMotionQuality,setMotionPreference,setAutomaticTier,setSceneReading,setSystemReduced,syncMotionViewport,applySceneTiers,desktopMotionQuery}=store;
let width=1366,systemReduced=false,updates=0,assertions=0;
const preferenceKey='zm-motion-preference', profileKey='zm-scene-profile-v109';
const storage=new Map([[preferenceKey,'lite'],[profileKey,JSON.stringify({version:1,savedAt:Date.now(),scenes:{opening:'lite',social:'balanced'}})]]);
Object.defineProperties(globalThis,{
 navigator:{configurable:true,value:{hardwareConcurrency:2,deviceMemory:2,connection:{saveData:true}}},
 document:{configurable:true,value:{documentElement:{dataset:{}}}},
 localStorage:{configurable:true,value:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}},
 window:{configurable:true,value:{dispatchEvent:e=>{if(e.type===store.motionQualityEvent)updates++;return true}}},
 matchMedia:{configurable:true,value:q=>({matches:q===desktopMotionQuery?width>=900:q==='(prefers-reduced-motion: reduce)'?systemReduced:width<900})}
});
function eq(a,b){assert.equal(a,b);assertions++}
// Exercise the exact script emitted in the document head, not a duplicate.
function boot(w,reduce){const root={dataset:{}};runInNewContext(desktopMotionBootstrap,{document:{documentElement:root},window:{matchMedia:q=>({matches:q===desktopMotionQuery?w>=900:reduce})}});return root.dataset.motionTier}
eq(boot(1363,false),'cinematic');eq(boot(900,true),'reduced');eq(boot(899,false),undefined);eq(boot(390,true),undefined);
// Before hydration: desktop getters must already resolve the fixed tier.
eq(getMotionTier(),'cinematic');eq(getSceneTier('opening'),'cinematic');eq(getMotionQuality().desktopLocked,true);
eq(store.getServerMotionQuality().tier,'balanced');systemReduced=true;eq(getMotionTier(),'reduced');systemReduced=false;
initializeMotionQuality();
eq(getMotionQuality().desktopLocked,true);eq(getMotionQuality().preference,'cinematic');eq(getMotionTier(),'cinematic');eq(getSceneTier('opening'),'cinematic');eq(getSceneTier('social'),'cinematic');eq(document.documentElement.dataset.motionTier,'cinematic');
setMotionPreference('balanced');setAutomaticTier('lite');setSceneReading('opening',initialReading('balanced',0));
eq(getMotionTier(),'cinematic');eq(getSceneTier('opening'),'cinematic');eq(storage.get(preferenceKey),'lite');eq(JSON.parse(storage.get(profileKey)).scenes.opening,'lite');
const scenes=[{dataset:{motionScene:'opening'}},{dataset:{motionScene:'social'}}];applySceneTiers({querySelectorAll:()=>scenes});eq(scenes[0].dataset.sceneTier,'cinematic');eq(scenes[1].dataset.sceneTier,'cinematic');
setSystemReduced(true);eq(getMotionTier(),'reduced');eq(getSceneTier('opening'),'reduced');setSystemReduced(false);eq(getMotionTier(),'cinematic');
width=899;syncMotionViewport();eq(getMotionQuality().desktopLocked,false);eq(getMotionQuality().preference,'lite');eq(getMotionTier(),'lite');
setMotionPreference('auto');eq(getSceneTier('opening'),'lite');eq(getSceneTier('social'),'balanced');setMotionPreference('balanced');eq(getMotionTier(),'balanced');eq(storage.get(preferenceKey),'balanced');
width=900;syncMotionViewport();eq(getMotionQuality().desktopLocked,true);eq(getMotionTier(),'cinematic');eq(storage.get(preferenceKey),'balanced');
width=390;syncMotionViewport();eq(getMotionQuality().desktopLocked,false);eq(getMotionTier(),'balanced');
width=1440;syncMotionViewport();systemReduced=true;initializeMotionQuality();eq(getMotionTier(),'reduced');eq(getMotionQuality().desktopLocked,true);
assert.ok(updates>0);assertions++;
hook.deregister();
console.log(`PASS ${assertions} desktop motion lock assertions`);
