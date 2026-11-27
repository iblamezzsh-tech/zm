// Focused regression gate. Run on both local production builds with --label.
// V111 is expected to fail the new browsing/Back assertions. No device or
// field-data claims; use scripts/audit-browser-check.mjs for traces/routes.
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const opt=(k,d)=>process.argv.find(s=>s.startsWith('--'+k+'='))?.slice(k.length+3)??d;
const base=opt('base','http://localhost:3000'),label=opt('label','v112'),out=opt('out',`../zm-v112-evidence/${label}`),executable=opt('executable',undefined);
const browser=await chromium.launch({headless:true,...(executable?{executablePath:executable}:{}),args:['--disable-background-timer-throttling']});
await mkdir(out,{recursive:true});
const report={label,base,kind:'Chromium lab only',completed:false,checks:[],errors:[]};
const EXPECTED_HOME_RECORDS=8,EXPECTED_DOCUMENTS=13;
const validIndex=(v)=>{const m=/^(\d+)\s*\/\s*(\d+)$/.exec(v.trim());return m?{current:Number(m[1]),total:Number(m[2])}:null};
const advances=(a,b,delta)=>Boolean(a&&b&&a.total===EXPECTED_DOCUMENTS&&b.total===a.total&&a.current>=1&&a.current<=a.total&&b.current===((a.current-1+delta+a.total)%a.total)+1);
const viewports=[[1920,900],[1440,900],[1363,936],[1280,900],[1024,900],[768,900],[430,844],[430,640],[390,844],[390,640],[360,844],[360,640]];
const modes=['auto','cinematic','balanced','lite'];
const snap=(page,n)=>page.screenshot({path:join(out,n+'.png'),animations:'allow'});
const check=async(name,fn)=>{try{const evidence=await fn();report.checks.push({name,status:evidence.pass?'PASS':'FAIL',evidence})}catch(error){report.checks.push({name,status:'FAIL',error:String(error)})}};
async function ctx(w,h,mode='auto',reduce='no-preference'){
 const c=await browser.newContext({viewport:{width:w,height:h},isMobile:w<=430,hasTouch:w<=430,deviceScaleFactor:1,reducedMotion:reduce,permissions:['clipboard-read','clipboard-write']});
 await c.addInitScript(mode=>{if(!sessionStorage.getItem('zm-qa-mode-set')){localStorage.setItem('zm-motion-preference',mode);sessionStorage.setItem('zm-qa-mode-set','1')}},mode);return c;
}
const settle=page=>page.waitForTimeout(700);
const geometry=page=>page.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,x:scrollX,y:scrollY}));
const details=page=>page.evaluate(()=>{const active=document.activeElement;const r=active?.getBoundingClientRect();return {id:active?.getAttribute('data-return-record'),y:scrollY,rect:r?{top:r.top,bottom:r.bottom}:null,viewport:innerHeight}});
try{
 for(const [w,h] of viewports){const c=await ctx(w,h),page=await c.newPage();page.on('pageerror',error=>report.errors.push({w,h,error:String(error)}));
  try{await page.goto(base);await settle(page);await snap(page,`${w}x${h}-hero-present`);
   await check(`${w}x${h} root / 30 scene points`,async()=>{
    const samples=[];for(const scene of await page.locator('[data-motion-scene]').all())for(const progress of [.06,.50,.92]){
     const id=await scene.getAttribute('data-motion-scene');await scene.evaluate((n,p)=>window.scrollTo({top:scrollY+n.getBoundingClientRect().top+Math.max(0,n.offsetHeight-innerHeight)*p,behavior:'instant'}),progress);await page.waitForTimeout(220);await page.mouse.wheel(250,0);await page.waitForTimeout(100);samples.push({id,progress,...await geometry(page)});await snap(page,`${w}x${h}-${id}-${progress}`);
    }const distinctScenes=new Set(samples.map(s=>s.id));return {pass:distinctScenes.size>=10&&samples.length>=30&&samples.every(s=>s.width===w&&s.width===s.scrollWidth&&s.x===0),samples,distinctScenes:distinctScenes.size};
   });
   await check(`${w}x${h} finale hit areas`,async()=>{const rects=await page.locator('.finale-nav a').evaluateAll(ns=>ns.filter(n=>n.getClientRects().length).map(n=>({label:n.textContent,height:n.getBoundingClientRect().height,computed:getComputedStyle(n).minHeight})));return {pass:rects.length>0&&(w>899||rects.every(r=>r.height>=43.9)),rects}});
   if(w<=430){await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await settle(page);const look=page.getByRole('button',{name:'Reveal graduation portrait'});await check(`${w}x${h} intentional Future`,async()=>{await look.tap();await settle(page);await snap(page,`${w}x${h}-hero-future`);const a=await page.locator('[data-mobile-look]').getAttribute('data-mobile-look');await page.getByRole('button',{name:'Return to present portrait'}).tap();return {pass:a==='future'&&await page.locator('[data-mobile-look]').getAttribute('data-mobile-look')==='present'}});}
  }finally{await c.close()}
 }
 for(const [w,h] of [[1363,936],[360,640],[390,640],[390,844]]){const c=await ctx(w,h);const page=await c.newPage();try{
  await page.goto(base);await settle(page);const links=await page.locator('.ed-archive-item').evaluateAll(ns=>ns.map(n=>({href:n.getAttribute('href'),id:n.getAttribute('href')?.split('#record-')[1]})));
  await check(`${w}x${h} Home record inventory`,async()=>({pass:links.length===EXPECTED_HOME_RECORDS&&new Set(links.map(x=>x.id)).size===EXPECTED_HOME_RECORDS&&links.every(x=>x.id&&x.href===`/achievements#record-${x.id}`),links}));
  for(const [i,item] of links.entries())await check(`${w}x${h} record ${i+1} reload / browse / Escape / Back`,async()=>{
   await page.goto(base);await settle(page);const card=page.locator('.ed-archive-item').nth(i);await card.scrollIntoViewIfNeeded();await page.waitForTimeout(350);
   // Capture the actual click geometry, not the position before Playwright scrolls the link into view.
   await card.evaluate(n=>{sessionStorage.removeItem('zm-qa-click');n.addEventListener('click',()=>{const r=n.getBoundingClientRect();sessionStorage.setItem('zm-qa-click',JSON.stringify({y:scrollY,top:r.top,height:r.height,id:n.getAttribute('href')?.split('#record-')[1]}))},{capture:true,once:true})});
   if(w<=430)await card.tap();else await card.click();const d=page.locator('dialog.archive-dialog');await d.waitFor({state:'visible',timeout:15000});
   const before=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('zm-qa-click')||'null'));
   const hash=()=>page.evaluate(()=>location.hash);const index=async()=>validIndex(await d.locator('.audit-viewer-nav [aria-live]').innerText({timeout:2500}));
   const initial=await hash();await page.reload();await d.waitFor({state:'visible',timeout:10000});const reloaded=await hash();
   const next=d.getByRole('button',{name:'Next certificate'}),prev=d.getByRole('button',{name:'Previous certificate'});
   const nav={};let browsing=false;let zoomOK=false;
   if(await next.count()===1&&await prev.count()===1&&await next.isEnabled()&&await prev.isEnabled()){
    nav.start=await index();await next.click();nav.nextHash=await hash();nav.next=await index();
    await prev.click();nav.previousHash=await hash();nav.previous=await index();
    await page.keyboard.press('ArrowRight');nav.rightHash=await hash();nav.right=await index();
    await page.keyboard.press('ArrowLeft');nav.leftHash=await hash();nav.left=await index();
    browsing=nav.nextHash.startsWith('#record-')&&nav.nextHash!==initial&&nav.previousHash===initial&&nav.rightHash===nav.nextHash&&nav.leftHash===initial&&advances(nav.start,nav.next,1)&&advances(nav.next,nav.previous,-1)&&advances(nav.previous,nav.right,1)&&advances(nav.right,nav.left,-1);
   }
   await snap(page,`${w}x${h}-record-${i+1}`);const zoom=d.getByRole('button',{name:'Zoom +',exact:true});
   if(await zoom.count()===1){await zoom.click();const zoomed=await d.evaluate(n=>n.classList.contains('is-zoomed'));const beforeArrow=await hash();await page.keyboard.press('ArrowRight');const sameHash=(await hash())===beforeArrow;await d.getByRole('button',{name:'Fit',exact:true}).click();zoomOK=zoomed&&sameHash&&!(await d.evaluate(n=>n.classList.contains('is-zoomed')));}
   await page.keyboard.press('Escape');await d.waitFor({state:'hidden'});await page.goBack({waitUntil:'domcontentloaded'});await page.waitForTimeout(2800);
   const after=await details(page);const box=await page.locator('.ed-archive-item').nth(i).boundingBox();
   const geometryNow=await page.evaluate(()=>({viewport:innerHeight,safe:Math.max(12,document.querySelector('main.home-page>.site-header')?.getBoundingClientRect().bottom??0)+8,maxY:document.documentElement.scrollHeight-innerHeight,pathname:location.pathname}));
   const lo=Math.max(0,Math.min(geometryNow.viewport-1,geometryNow.safe));const hi=box?Math.max(lo,geometryNow.viewport-Math.min(box.height,geometryNow.viewport-lo)-12):lo;
   const desired=before?Math.max(lo,Math.min(hi,before.top)):null;
   const visible=!!box&&box.y<geometryNow.viewport&&box.y+box.height>lo;
   const offsetError=box&&desired!==null?Math.abs(box.y-desired):null;
   const clamped=box&&desired!==null&&((after.y<=2&&box.y<desired)||(after.y>=geometryNow.maxY-2&&box.y>desired));
   const restored=offsetError!==null&&(offsetError<=24||clamped);
   return {pass:before?.id===item.id&&initial===`#record-${item.id}`&&reloaded===initial&&browsing&&zoomOK&&geometryNow.pathname==='/'&&visible&&restored&&after.id===item.id,before,after,visible,browsing,zoomOK,initial,reloaded,box,nav,desired,offsetError,restored,geometryNow};
  });
  await check(`${w}x${h} invalid record`,async()=>{await page.goto(base+'/achievements#record-no-such-record-v112');await settle(page);return {pass:!(await page.locator('dialog.archive-dialog').isVisible())}});
 }finally{await c.close()}}
 // Test a real unseeded app downgrade separately from learned-profile seeding.
 for(const mode of modes){const c=await ctx(390,844,mode);const page=await c.newPage();try{await page.goto(base);await settle(page);await page.evaluate(()=>window.scrollTo({top:Math.min(2800,document.documentElement.scrollHeight-innerHeight),behavior:'instant'}));await settle(page);
  await check(`manual ${mode} mid-page preference / reload`,async()=>{const before=await geometry(page);await page.getByRole('button',{name:'Open navigation menu'}).click();const btn=page.locator('.zm-motion-settings-choices button').filter({hasText:/^Lite$/});if(!await btn.isVisible())throw Error('Menu quality controls not visible; verify actual menu trigger selector');await btn.click();await page.getByRole('button',{name:'Close navigation menu'}).click();await settle(page);const after=await geometry(page);await page.reload();await settle(page);return {pass:Math.abs(after.y-before.y)<=20&&await page.evaluate(()=>localStorage.getItem('zm-motion-preference'))==='lite',before,after}});
 }finally{await c.close()}}
 // Controlled, unseeded Auto downgrade. The deliberately induced load is
 // synthetic and tests the policy wiring, not real phone performance.
 const auto=await ctx(390,844,'auto');try{
  await auto.addInitScript(()=>{Object.defineProperty(navigator,'hardwareConcurrency',{configurable:true,get:()=>8});Object.defineProperty(navigator,'deviceMemory',{configurable:true,get:()=>8});localStorage.removeItem('zm-scene-profile-v109')});
  const page=await auto.newPage();await page.goto(base);await settle(page);
  await check('Unseeded Auto scene downgrade under controlled load',async()=>{
   const opening=page.locator('[data-motion-scene=opening]');const before=await opening.getAttribute('data-scene-tier');
   const result=await page.evaluate(async()=>{const section=document.querySelector('[data-motion-scene=opening]');const start=scrollY+section.getBoundingClientRect().top;const range=Math.max(40,Math.min(170,section.offsetHeight-innerHeight));const samples=[];let previous=0;for(let i=0;i<32;i++){await new Promise(resolve=>requestAnimationFrame(t=>{if(previous)samples.push(t-previous);previous=t;scrollTo({top:start+10+(i%9)*range/10,behavior:'instant'});const end=performance.now()+64;while(performance.now()<end){/* bounded synthetic main-thread work */}resolve()}));}return samples;});
   await page.waitForTimeout(1200);const after=await opening.getAttribute('data-scene-tier');const profile=await page.evaluate(()=>JSON.parse(localStorage.getItem('zm-scene-profile-v109')||'null'));const sorted=result.slice().sort((a,b)=>a-b);return {pass:before==='balanced'&&after==='lite'&&profile?.scenes?.opening==='lite',before,after,profile,independentFrameP90:sorted[Math.ceil(sorted.length*.9)-1],samples:result,kind:'synthetic policy wiring test, not actual device performance'};
  });
 }finally{await auto.close()}
report.completed=true;
}catch(error){report.errors.push({fatal:String(error)});throw error;}finally{await browser.close();await writeFile(join(out,'v112-release.json'),JSON.stringify(report,null,2));console.log('Saved',out);if(!report.completed||report.errors.length||report.checks.length===0||report.checks.some(c=>c.status!=='PASS'))process.exitCode=1;}
