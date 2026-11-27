// Run against a real baseline or local candidate, with Playwright installed in
// the checkout. This is a diagnostic harness, not real-device or field INP data.
// node scripts/audit-browser-check.mjs --base=http://localhost:3000 --label=after
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const opt=(key,fallback)=>process.argv.find(x=>x.startsWith('--'+key+'='))?.slice(key.length+3)??fallback;
const base=opt('base','http://localhost:3000').replace(/\/$/,'');
const label=opt('label','after'),out=opt('out',`../zm-audit-evidence/${label}`);
const widths=opt('widths','1920,1440,1363,1280,1024,768,430,390,360').split(',').map(Number);
const repeats=Number(opt('repeats','3'));const cpu=Number(opt('cpu','4'));
const modes=['auto','cinematic','balanced','lite'];
const routes=['/','/about','/projects','/projects/overthink','/projects/finance4youth','/projects/rezamin','/achievements','/off-the-record','/contact'];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const browser=await chromium.launch({headless:true,args:['--disable-background-timer-throttling']});
const report={base,label,cpu,network:{latency:40,downBps:2e6,upBps:1e6},viewportMatrix:[],traces:[],checks:[],errors:[]};
await mkdir(out,{recursive:true});
const snap=async(page,name)=>{await page.screenshot({path:join(out,name+'.png'),animations:'allow'});};
const geometry=page=>page.evaluate(()=>{
 const w=document.documentElement.clientWidth;
 const offenders=[...document.querySelectorAll('main *')].map(n=>({n,r:n.getBoundingClientRect()})).filter(({r})=>r.width>0&&(r.right>w+1||r.left< -1)).map(({n,r})=>({tag:n.tagName,id:n.id,cls:typeof n.className==='string'?n.className:'svg',left:Math.round(r.left),right:Math.round(r.right),clipAncestor:(()=>{for(let p=n.parentElement;p;p=p.parentElement){const x=getComputedStyle(p).overflowX;if(x==='hidden'||x==='clip'||x==='auto'||x==='scroll')return p.className||p.id||p.tagName}return null})()}));
 return {viewport:w,scrollWidth:document.documentElement.scrollWidth,scrollX:window.scrollX,scrollY:window.scrollY,offenders:offenders.slice(0,40)};
});
const measure=async(page,route,width,mode,iteration)=>{
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:cpu});
 await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:40,downloadThroughput:2e6,uploadThroughput:1e6});
 await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 const chunks=[];cdp.on('Tracing.dataCollected',e=>chunks.push(...e.value));
 await cdp.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing,disabled-by-default-devtools.timeline.frame,loading',transferMode:'ReportEvents'});
 let failure=null,result=null;
 try{
  await page.goto(base+route,{waitUntil:'load',timeout:90000});
  await page.waitForTimeout(700);
  result=await page.evaluate(async()=>{
   const ts=[];let previous=0,active=true;
   function frame(t){if(previous)ts.push(t-previous);previous=t;if(active)requestAnimationFrame(frame)}requestAnimationFrame(frame);
   const max=document.documentElement.scrollHeight-innerHeight;
   for(const fraction of [0,.12,.24,.36,.48,.6,.72,.84,1,.6,.25,0]){
    window.scrollTo({top:max*fraction,behavior:'smooth'});
    await new Promise(r=>setTimeout(r,420));
   }
   active=false;const sorted=ts.filter(t=>t>0).sort((a,b)=>a-b);const q=p=>sorted.length?sorted[Math.min(sorted.length-1,Math.floor(sorted.length*p))]:null;
   return {frameIntervals:{sampleCount:sorted.length,p50:q(.5),p90:q(.9),over25ms:sorted.filter(t=>t>25).length},vitals:window.__zmAuditVitals??null,scrollWidth:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth};
  });
 }catch(e){failure=String(e)}finally{
  const completed=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');await completed;
  const path=`trace-${width}-${mode}-${iteration}.json`;
  await writeFile(join(out,path),JSON.stringify({traceEvents:chunks}));
  report.traces.push({width,mode,iteration,path,result,error:failure,kind:'lab frame trace; not INP or real-device data'});
  await cdp.detach();
 }
};
async function context(width,height,mode,reduced='no-preference'){
 const ctx=await browser.newContext({viewport:{width,height},isMobile:width<=430,hasTouch:width<=430,deviceScaleFactor:1,reducedMotion:reduced});
 await ctx.addInitScript(({mode})=>{
  try{localStorage.setItem('zm-motion-preference',mode)}catch{}
  const v={lcp:null,cls:0,longTasks:[],events:[]};window.__zmAuditVitals=v;
  for(const [type,fn] of [
   ['largest-contentful-paint',e=>{v.lcp=e.startTime}],['layout-shift',e=>{if(!e.hadRecentInput)v.cls+=e.value}],['longtask',e=>v.longTasks.push({start:e.startTime,duration:e.duration})],['event',e=>v.events.push({name:e.name,duration:e.duration,interactionId:e.interactionId})]
  ]){try{new PerformanceObserver(list=>list.getEntries().forEach(fn)).observe({type,buffered:true})}catch{}}
 },{mode});return ctx;
}
async function note(page,name,fn){try{const data=await fn();report.checks.push({name,result:data})}catch(e){report.checks.push({name,error:String(e)});}}
try{
 for(const width of widths){
  const heights=width<=430?[844,640]:[width===1363?936:900];
  for(const height of heights){const ctx=await context(width,height,'auto');const page=await ctx.newPage();page.on('pageerror',err=>report.errors.push({width,height,error:String(err)}));
   try{
    for(const route of routes){await page.goto(base+route,{waitUntil:'load',timeout:90000});await page.waitForTimeout(400);const prefix=`${width}x${height}-${route.replaceAll('/','-')||'home'}`;
     await snap(page,prefix+'-initial');const initial=await geometry(page);const samples=[{phase:'initial',...initial}];
     if(route==='/'){
      const scenes=await page.locator('[data-motion-scene]').evaluateAll(ns=>ns.map(n=>({key:n.getAttribute('data-motion-scene'),y:n.getBoundingClientRect().top+scrollY,h:n.getBoundingClientRect().height})));
      for(const scene of scenes){for(const f of [.05,.5,.95]){await page.evaluate(({y})=>window.scrollTo(0,y),{y:Math.max(0,scene.y+scene.h*f-height*.3)});await page.waitForTimeout(160);await page.mouse.wheel(180,0);await page.waitForTimeout(100);const g=await geometry(page);samples.push({phase:`${scene.key}-${f}`,...g});if(f===.5)await snap(page,prefix+'-'+scene.key);}}
     }
     report.viewportMatrix.push({width,height,route,samples,pass:samples.every(s=>s.scrollWidth===s.viewport&&s.scrollX===0)});
    }
    // Archive deep links use the actual first visible Home record, not a guessed ID.
    await page.goto(base+'/',{waitUntil:'load'});const record=await page.locator('.ed-archive-item').first().getAttribute('href');
    if(record)await note(page,`${width}x${height} archive deep link`,async()=>{await page.goto(new URL(record,base).href);const d=page.locator('dialog.archive-dialog');await d.waitFor({state:'visible',timeout:5000});await snap(page,`${width}x${height}-archive-viewer`);const zoom=d.getByRole('button',{name:'Zoom +',exact:true});if(await zoom.count()){await zoom.click();await d.getByRole('button',{name:'Fit',exact:true}).click();}await page.reload();await d.waitFor({state:'visible',timeout:5000});await page.keyboard.press('Escape');await d.waitFor({state:'hidden'});return {href:record,focus:await page.evaluate(()=>document.activeElement?.id||document.activeElement?.textContent?.trim()),original:await d.getByText('Original',{exact:true}).count()};});
    for(const topic of ['economics','psychology','politics','music','literature'])await note(page,`${width}x${height} topic ${topic}`,async()=>{await page.goto(base+'/off-the-record#'+topic);await page.waitForTimeout(200);return page.locator('#'+topic).evaluate(n=>({open:n instanceof HTMLDetailsElement?n.open:null,top:n.getBoundingClientRect().top,focus:n.contains(document.activeElement)||n===document.activeElement}));});
   }catch(e){report.errors.push({width,height,error:String(e)})}finally{await ctx.close()}
  }
 }
 // Repeat identical CPU/network profiles on representative desktop and phone sizes.
 for(const width of [1363,390])for(const mode of modes)for(let i=1;i<=repeats;i++){
  const ctx=await context(width,width===1363?936:844,mode);const page=await ctx.newPage();try{await measure(page,'/',width,mode,i)}finally{await ctx.close()}
 }
 for(const mode of modes){const ctx=await context(390,844,mode,'reduce');const page=await ctx.newPage();await page.goto(base);await page.waitForTimeout(350);report.checks.push({name:`OS reduced / ${mode}`,result:await page.evaluate(()=>({tier:document.documentElement.dataset.motionTier,scrollWidth:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}))});await ctx.close()}
}finally{await browser.close();await writeFile(join(out,'report.json'),JSON.stringify(report,null,2));console.log('Evidence saved:',out)}
