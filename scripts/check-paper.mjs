import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { chromium } from 'playwright';
const browser = await chromium.launch({executablePath:'/home/kaialan/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',args:['--no-sandbox']});
const page = await browser.newPage({viewport:{width:1280,height:800}});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.VISUAL_PREVIEW_URL || 'http://localhost:3000',{waitUntil:'networkidle'});
await page.waitForFunction(()=>document.documentElement.classList.contains('lenis') && document.querySelector('.paper-sheet').style.height);
await page.evaluate(()=>document.fonts.ready);
await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
const read=()=>page.evaluate(()=>({scroll:scrollY,paper:Number(document.querySelector('.paper-backdrop').style.getPropertyValue('--paper-position')),transform:new DOMMatrix(getComputedStyle(document.querySelector('.paper-sheet')).transform).f}));
const move=async y=>{await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(60);return read();};
const top=selector=>page.locator(selector).evaluate(e=>e.getBoundingClientRect().top+scrollY);
const hash=async (y=180)=>createHash('sha256').update(await sharp(await page.screenshot()).extract({left:0,top:y,width:12,height:300}).raw().toBuffer()).digest('hex');
const ordinary=[];
for(const selector of ['#introduction','#science','#depth','#craft','#proof']){
  const start=await top(selector);
  const a=await move(start+20);
  const pixels=await hash();
  const b=await move(start+60);
  assert.equal(b.paper-a.paper,40,`${selector}: paper moves one-to-one with content`);
  assert.equal(b.transform-a.transform,-40);
  assert.equal(await hash(140),pixels,`${selector}: same physical paper pixels travel with the content`);
  ordinary.push({selector,paperDelta:b.paper-a.paper});
}
const joins=[];
for(const selector of ['#manifesto','#dissection']){
  const bounds=await page.locator(selector).evaluate(e=>({start:e.getBoundingClientRect().top+scrollY,end:e.getBoundingClientRect().top+scrollY+e.offsetHeight-innerHeight}));
  const pauseStart=bounds.start+(selector==='#dissection'?240:0);
  const a=await move(pauseStart+100);const pixels=await hash();
  const b=await move(bounds.end-100);
  assert.equal(a.paper,b.paper,`${selector}: paper rests with the complete pinned scene`);
  assert.equal(await hash(),pixels,`${selector}: material is stationary during ink changes`);
  for(const join of [pauseStart,bounds.end]){
    const samples=[];
    for(const offset of [-2,-1,0,1,2]) samples.push(await move(join+offset));
    for(let i=1;i<samples.length;i++)assert.ok(Math.abs(samples[i].paper-samples[i-1].paper)<=1.01,'No texture jump at pause boundary');
    joins.push({selector,join,samples});
  }
}
// Tweet, stamp artwork, and the paper share the same initial document travel.
const dissectionTop=await top('#dissection');
await move(dissectionTop+40);
const before=await page.evaluate(()=>({tweet:document.querySelector('.dissection-pin .tweet-card').getBoundingClientRect().top,stamp:document.querySelector('.dissection-pin .dissection-stamp').getBoundingClientRect().top}));
await move(dissectionTop+120);
const after=await page.evaluate(()=>({tweet:document.querySelector('.dissection-pin .tweet-card').getBoundingClientRect().top,stamp:document.querySelector('.dissection-pin .dissection-stamp').getBoundingClientRect().top}));
assert.ok(Math.abs(after.tweet-before.tweet+80)<1);
assert.ok(Math.abs(after.stamp-before.stamp+80)<1,'Stamp and tweet stay attached to one paper composition');
for(const [width,height] of [[1920,1080],[2560,1080],[768,800],[390,844]]){
  await page.setViewportSize({width,height});
  await move(0);
  await page.waitForTimeout(60);
  const cover=await page.locator('.paper-opening-wash').boundingBox();
  assert.ok(Math.abs(cover.x)<1 && Math.abs(cover.width-width)<1,'Hero texture covers both margins');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
  const a=await move(20),b=await move(60);assert.equal(b.paper-a.paper,40,'Responsive paper registration');
  await move(0);await page.screenshot({path:`verification/paper-hero-${width}.png`});
}
await page.emulateMedia({reducedMotion:'reduce'});
await page.setViewportSize({width:1280,height:800});
await move(1000);await page.waitForTimeout(100);
const reducedA=await read(),reducedB=await move(1040);
assert.equal(reducedB.paper-reducedA.paper,40,'Reduced motion uses ordinary scrolling paper');
assert.equal(await page.locator('.manifesto-reduced .design-frame:visible').count(),3);
assert.equal(await page.locator('.dissection-reduced .design-frame:visible').count(),5);
assert.deepEqual(errors,[]);
await writeFile('verification/paper-report.json',JSON.stringify({ordinary,joins,errors,texture:'registered pixels verified',margins:'four sizes verified',reducedMotion:'passed'},null,2));
await browser.close();
console.log('Passed: paper/content pixel registration, both pause joins in both directions, complete tweet/stamp travel, full-width hero texture, responsive scaling, reduced motion, and browser errors.');
