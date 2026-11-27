// Full-app paired visual evidence. Use equivalent local production builds for performance.
// node scripts/v113-design-check.mjs --baseline=https://ziyomuhammaduz.vercel.app --candidate=http://localhost:3000
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const opt=(k,d)=>process.argv.find(x=>x.startsWith(`--${k}=`))?.slice(k.length+3)??d;
const out=opt('out','../v113-evidence'),base=opt('baseline','https://ziyomuhammaduz.vercel.app'),candidate=opt('candidate','http://localhost:3000'),executable=opt('executable',undefined);
const sizes=[[1920,1080],[1440,900],[1363,936],[768,1024],[430,932],[390,844],[360,640],[390,640]];
const modes=['auto','lite','reduced'],routes=['/projects/overthink','/projects/finance4youth','/projects/rezamin','/achievements'];
const browser=await chromium.launch({headless:true,...(executable?{executablePath:executable}:{})});
const report={baseline:base,candidate,viewports:sizes,frames:[],errors:[],complete:false};
await mkdir(out,{recursive:true});
async function capture(side,url,w,h,mode){
 const dir=join(out,side,`${w}x${h}`,mode);await mkdir(dir,{recursive:true});
 const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:w<=430,hasTouch:w<=430,reducedMotion:mode==='reduced'?'reduce':'no-preference'});
 await context.addInitScript(m=>{localStorage.setItem('zm-motion-preference',m==='reduced'?'auto':m)},mode);
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push({side,w,h,mode,error:String(e)}));
 const go=async path=>{const r=await page.goto(new URL(path,url).href,{waitUntil:'load',timeout:45000});if(!r?.ok())throw Error(`HTTP ${r?.status()} at ${path}`);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(550)};
 async function frame(name,scene){await page.screenshot({path:join(dir,name+'.png'),animations:'allow'});const details=await page.evaluate(key=>{
  const root=document.documentElement;const section=key?document.querySelector(`[data-motion-scene="${key}"]`):document.querySelector('main');
  const box=n=>{const r=n.getBoundingClientRect();const s=getComputedStyle(n);return {text:n.textContent?.trim().slice(0,140),rect:[r.x,r.y,r.width,r.height],opacity:s.opacity,clip:s.clipPath,visibility:s.visibility}};
  return {width:root.clientWidth,scrollWidth:root.scrollWidth,scrollX:window.scrollX,y:scrollY,targets:[...(section?.querySelectorAll('h1,h2,h3,a,button')??[])].map(box),portraitScale:getComputedStyle(document.querySelector('.hero-composition')??root).getPropertyValue('--portrait-scale')};
 },scene);report.frames.push({side,w,h,mode,name,scene,...details});}
 try{
  await go('/');await frame('hero-present','opening');
  if(w<=430){const b=page.getByRole('button',{name:'Reveal graduation portrait'});await b.tap();await page.waitForTimeout(850);await frame('hero-future','opening');await page.getByRole('button',{name:'Return to present portrait'}).tap()}
  const scenes=await page.locator('[data-motion-scene]').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-motion-scene')));
  for(const key of scenes){const node=page.locator(`[data-motion-scene="${key}"]`).first();
   const position=async p=>node.evaluate((n,p)=>Math.max(0,scrollY+n.getBoundingClientRect().top+Math.max(0,n.getBoundingClientRect().height-innerHeight)*p),p);
   for(const [label,p] of [['entry',.06],['hold',.50],['exit',.92],['reverse',.50]]){
    const target=await position(p);await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),target);await page.waitForTimeout(220);await frame(`${key}-${label}`,key);
   }
   const start=await position(.06),end=await position(.92);await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start);
   for(let i=1;i<=8;i++){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+(end-start)*i/8);await page.waitForTimeout(85)}await frame(`${key}-slow-stop`,key);
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start);await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),end);await frame(`${key}-fast-stop`,key);
  }
  if(mode==='auto')for(const route of routes){await go(route);await frame(route.replaceAll('/','-')+'-opening',null);const demo=page.locator('#project-demo');if(await demo.count()){await demo.scrollIntoViewIfNeeded();await page.waitForTimeout(220);await frame(route.replaceAll('/','-')+'-demo',null)}}
 }catch(e){report.errors.push({side,w,h,mode,error:String(e)})}finally{await context.close()}
}
try{for(const [w,h] of sizes)for(const mode of modes)for(const [side,url] of [['before',base],['after',candidate]])await capture(side,url,w,h,mode);report.complete=true}finally{await browser.close();report.overflow=report.frames.filter(f=>f.scrollWidth>f.width+1||f.scrollX!==0).map(({side,w,h,mode,name,scrollWidth,width})=>({side,w,h,mode,name,scrollWidth,width}));await writeFile(join(out,'paired-report.json'),JSON.stringify(report,null,2));}
if(report.errors.length||report.overflow.length||!report.frames.length)process.exitCode=1;
