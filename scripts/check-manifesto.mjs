import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: '/home/kaialan/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) errors.push(`${response.status()} ${response.url()}`); });
await mkdir('verification', { recursive: true });
await page.goto(process.env.VISUAL_PREVIEW_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => Promise.all([...document.images].map(image => image.decode().catch(() => undefined))));
await page.mouse.wheel(0, 240);
await page.waitForTimeout(80);
const earlyScroll = await page.evaluate(() => scrollY);
assert.ok(earlyScroll > 0 && earlyScroll < 240, `Lenis interpolates wheel input: ${earlyScroll}`);
await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-scrolling'));
const bounds = await page.locator('#manifesto').evaluate(element => ({ top: element.offsetTop, distance: element.offsetHeight - innerHeight }));
const samples = [];
for (const progress of [0, .21, .27, .34, .45, .64, .71, .78, .9, .45, 0]) {
  await page.evaluate(y => scrollTo(0, y), bounds.top + bounds.distance * progress);
  await page.waitForFunction(y => Math.abs(scrollY - y) < 1, bounds.top + bounds.distance * progress);
  await page.waitForTimeout(120);
  const sample = await page.evaluate(() => {
    const panel = document.querySelector('.manifesto-panel');
    const matrix = new DOMMatrix(getComputedStyle(panel).transform);
    const opacity = name => Number(getComputedStyle(document.querySelector(`.manifesto-pin [data-grid-part='${name}']`)).opacity);
    return {
      state: Number(panel.dataset.manifestoState), opacity: Number(getComputedStyle(panel).opacity),
      x: matrix.e, y: matrix.f,
      copyCount: panel.querySelectorAll('.manifesto-state').length,
      panelCount: document.querySelectorAll('.manifesto-pin [data-manifesto-state]').length,
      pinTop: document.querySelector('.manifesto-pin').getBoundingClientRect().top,
      titleTop: document.querySelector('.manifesto-pin .manifesto-title').getBoundingClientRect().top,
      topDivider: opacity('top-divider'), middleDivider: opacity('middle-divider'),
    };
  });
  assert.equal(sample.panelCount, 1, 'Only one text panel exists');
  assert.equal(sample.copyCount, 1, 'Only one copy state exists');
  assert.equal(sample.x, 0, 'Motion is vertical');
  assert.ok(Math.abs(sample.y) <= 24.01, 'Movement stays restrained');
  assert.ok(Math.abs(sample.pinTop) < 1, 'Manifesto remains pinned');
  assert.ok(Math.abs(sample.titleTop - 335) < 1, 'Title stays stationary');
  if ([0,.45,.9].includes(progress)) {
    assert.equal(sample.opacity, 1);
    assert.equal(sample.state, progress === 0 ? 1 : progress === .45 ? 2 : 3);
    assert.equal(sample.topDivider, progress === 0 ? 1 : 0);
    assert.equal(sample.middleDivider, progress === .9 ? 0 : 1);
  }
  if ([.27,.71].includes(progress)) assert.equal(sample.opacity, 0, 'Exit finishes before entrance begins');
  if ([.21,.64].includes(progress)) assert.ok(sample.y < 0 && sample.opacity > 0 && sample.opacity < 1, 'Old copy moves upward and fades');
  if ([.34,.78].includes(progress)) assert.ok(sample.y > 0 && sample.opacity > 0 && sample.opacity < 1, 'New copy enters from below');
  await page.screenshot({ path: `verification/manifesto-progress-${progress}.png` });
  samples.push({ progress, ...sample });
}
// Observe every frame during continuous movement, abrupt jumps, and reversal.
const sweep = await page.evaluate(async bounds => {
  const positions = [...Array.from({length:81},(_,index)=>index/80), .15,.9,.24,.74, .1, ...Array.from({length:81},(_,index)=>1-index/80)];
  const failures = [];
  for (const progress of positions) {
    scrollTo(0, bounds.top + bounds.distance * progress);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const panel = document.querySelector('.manifesto-panel');
    if (document.querySelectorAll('.manifesto-pin [data-manifesto-state]').length !== 1 || panel.querySelectorAll('.manifesto-state').length !== 1) failures.push(progress);
    if (new DOMMatrix(getComputedStyle(panel).transform).e !== 0) failures.push(progress);
  }
  return { frames: positions.length, failures };
}, bounds);
assert.deepEqual(sweep.failures, [], 'No overlap or horizontal movement at any sampled frame');
const terminal = await page.locator('.manifesto-pin .manifesto-grid circle').evaluateAll(dots => dots.filter(dot => Number(dot.getAttribute('cx')) >= 1222 && Number(dot.getAttribute('cy')) >= 768).map(dot => [Number(dot.getAttribute('cx')), Number(dot.getAttribute('cy'))]));
assert.deepEqual(terminal, [[1234,780]], 'One terminal dot, no dense corner cluster');
const repeatedHeaderIds = ['2346','2347','2348','546','547','548','561','562','563','583','584','585','610','611','612','655','656','657'];
for (const id of repeatedHeaderIds) assert.equal(await page.locator(`[data-node-id='26:${id}']`).count(), 0, 'Repeated headers removed');
assert.equal(await page.locator('[data-node-id="26:2449"]:visible').count(), 1, 'Hero branding remains');
assert.equal(await page.locator('.manifesto-pin .manifesto-grid').evaluate(element => getComputedStyle(element).userSelect), 'none');
assert.equal(await page.locator('.manifesto-title').first().evaluate(element => getComputedStyle(element).userSelect), 'text');
await page.evaluate(y => scrollTo(0, y), bounds.top + bounds.distance + 300);
await page.waitForTimeout(120);
assert.ok(await page.locator('.manifesto-pin').evaluate(element => element.getBoundingClientRect().top < -250), 'Sequence releases into next section');
assert.ok(await page.locator('[data-name="golden square"]').evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === '0.08')));
await page.locator('#science').evaluate(element => scrollTo(0, element.offsetTop));
await page.waitForTimeout(100);
await page.screenshot({ path: 'verification/background-lines-softened.png' });
for (const [width,height] of [[1920,1080],[1920,800],[768,800]]) {
  await page.setViewportSize({width,height});
  await page.waitForFunction(scale => Number(document.querySelector('#manifesto-composition').style.getPropertyValue('--frame-scale')) === scale, Math.min(width/1280,height/800));
  await page.locator('#manifesto').evaluate(element => scrollTo(0, element.offsetTop + (element.offsetHeight - innerHeight) * .45));
  await page.waitForTimeout(120);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
  const geometry = await page.locator('#manifesto-composition').evaluate(element => element.getBoundingClientRect().toJSON());
  assert.ok(geometry.top >= -.1 && geometry.bottom <= height + .1, 'Composition fits viewport');
  await page.screenshot({path:`verification/manifesto-${width}x${height}.png`});
}
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.waitForFunction(() => !document.documentElement.classList.contains('lenis'));
assert.equal(await page.locator('.manifesto-reduced .design-frame:visible').count(), 3);
await page.setViewportSize({ width: 390, height: 844 });
assert.equal(await page.locator('.manifesto-story:visible').count(), 0);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
assert.deepEqual(errors, []);
await writeFile('verification/manifesto-report.json', JSON.stringify({earlyScroll,samples,sweep,terminal,errors,reducedMotion:'passed',mobile:'passed',resize:'passed',headers:'passed',selection:'passed'},null,2));
console.log(`Passed: ${sweep.frames} motion samples without overlapping copy, vertical eased movement, exit/entry gap, reversible grid, one terminal dot, one hero header, text-only selection, resizing, reduced motion, mobile, and browser errors.`);
await browser.close();
