import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath:'/home/kaialan/.cache/ms-playwright/chromium-1148/chrome-linux/chrome', args:['--no-sandbox'] });
const page = await browser.newPage({viewport:{width:1280,height:800}});
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if(response.status()>=400 && !response.url().endsWith('/favicon.ico'))errors.push(`${response.status()} ${response.url()}`); });
await mkdir('verification',{recursive:true});
await page.goto(process.env.VISUAL_PREVIEW_URL || 'http://localhost:3000',{waitUntil:'networkidle'});
await page.waitForFunction(()=>document.documentElement.classList.contains('lenis') && document.querySelector('#dissection-composition').style.getPropertyValue('--frame-scale'));
await page.evaluate(()=>document.fonts.ready);
await page.evaluate(()=>Promise.all([...document.images].map(image=>image.decode().catch(()=>undefined))));
assert.equal(await page.locator('.site-header').evaluate(element=>getComputedStyle(element).position),'relative');
assert.equal(await page.locator('.site-header').evaluate(element=>getComputedStyle(element).backgroundColor),'rgba(0, 0, 0, 0)');
assert.equal(await page.locator('.site-header').count(),1);
await page.evaluate(()=>scrollTo(0,200));
await page.waitForTimeout(120);
assert.ok(await page.locator('.site-header').evaluate(element=>element.getBoundingClientRect().bottom<0),'Header scrolls away');
const track = await page.locator('#dissection').evaluate(element=>({top:element.offsetTop,range:element.offsetHeight-innerHeight}));
const samples=[];
for (const progress of [0,.04,.22,.44,.66,.88,.44,0]) {
  await page.evaluate(y=>scrollTo(0,y),track.top+track.range*progress);
  await page.waitForTimeout(120);
  const sample=await page.locator('.dissection-pin').evaluate(element=>({
    pin:element.getBoundingClientRect().toJSON(),
    focus:Number(element.querySelector('[data-dissection-focus]').dataset.dissectionFocus),
    tweets:element.querySelectorAll('.tweet-card').length,
    tweet:element.querySelector('.tweet-card').getBoundingClientRect().toJSON(),
    active:[...element.querySelectorAll('[data-stamp][aria-current="step"]')].map(card=>Number(card.dataset.stamp)),
    stampTop:element.querySelector('.dissection-stamp').getBoundingClientRect().top,
    font:getComputedStyle(element.querySelector('.tweet-card')).fontFamily,
  }));
  assert.ok(Math.abs(sample.pin.top)<1 && Math.abs(sample.pin.height-800)<1,'One pinned viewport');
  assert.equal(sample.tweets,1,'Same single tweet card');
  if(progress===0){assert.equal(sample.focus,-1);assert.ok(Math.abs(sample.stampTop-709)<1);assert.deepEqual(sample.active,[]);}
  if(progress===.04){assert.ok(sample.tweet.top>118 && sample.tweet.top<365,'Tweet moves continuously upward');}
  if([.22,.44,.66,.88].includes(progress)){
    const index=[.22,.44,.66,.88].indexOf(progress);
    assert.equal(sample.focus,index);
    assert.deepEqual(sample.active,[index+1]);
    assert.ok(Math.abs(sample.stampTop-469)<1);
    const openingBlur=await page.locator('.dissection-pin [data-tweet-opening]').evaluate(element=>getComputedStyle(element).filter);
    assert.equal(openingBlur,'blur(4px)');
  }
  await page.screenshot({path:`verification/dissection-${progress}.png`});
  samples.push({progress,...sample});
}
const sweep=await page.evaluate(async track=>{
  const failures=[];
  const values=[...Array.from({length:61},(_,i)=>i/60),.1,.95,.33,.77,...Array.from({length:61},(_,i)=>1-i/60)];
  for(const value of values){scrollTo(0,track.top+track.range*value);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));if(document.querySelectorAll('.dissection-pin .tweet-card').length!==1 || document.querySelectorAll('.dissection-pin [data-stamp][aria-current="step"]').length>1)failures.push(value);}
  return {frames:values.length,failures};
},track);
assert.deepEqual(sweep.failures,[]);
await page.evaluate(y=>scrollTo(0,y),track.top+track.range+240);
await page.waitForTimeout(100);
assert.ok(await page.locator('.dissection-pin').evaluate(element=>element.getBoundingClientRect().top<-200),'Sequence releases after all four stamps');
// Material/content registration and pause joins have dedicated pixel checks in check-paper.mjs.
assert.equal(await page.locator('#proof').evaluate(element=>getComputedStyle(element).mixBlendMode),'multiply');
await page.locator('#proof').evaluate(element=>scrollTo(0,element.offsetTop));
await page.screenshot({path:'verification/proof-material.png'});
for(const [width,height] of [[1920,1080],[1920,800],[768,800]]){
  await page.setViewportSize({width,height});
  await page.waitForFunction(scale=>Math.abs(Number(document.querySelector('#dissection-composition').style.getPropertyValue('--frame-scale'))-scale)<.00001,Math.min(width/1280,height/800));
  await page.locator('#dissection').evaluate(element=>scrollTo(0,element.offsetTop+(element.offsetHeight-innerHeight)*.74));
  await page.waitForTimeout(150);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
  assert.equal(await page.locator('.dissection-pin').evaluate(element=>element.getBoundingClientRect().height),height);
  await page.screenshot({path:`verification/dissection-${width}x${height}.png`});
}
await page.emulateMedia({reducedMotion:'reduce'});
await page.waitForFunction(()=>!document.documentElement.classList.contains('lenis'));
assert.equal(await page.locator('.dissection-reduced .design-frame:visible').count(),5);
await page.setViewportSize({width:390,height:844});
assert.equal(await page.locator('.dissection-story:visible').count(),0);
assert.equal(await page.locator('.site-header:visible').count(),1);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
assert.deepEqual(errors,[]);
await writeFile('verification/dissection-report.json',JSON.stringify({samples,sweep,errors,header:'normal and transparent',responsive:'passed',reducedMotion:'passed',mobile:'passed'},null,2));
console.log(`Passed: ${sweep.frames} scroll samples, one tweet, four synchronized Figma annotations, move-up transition, pin/release, shared paper motion, normal transparent header, responsive sizes, reduced motion, and mobile.`);
await browser.close();
