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
await page.waitForFunction(() => Math.abs(scrollY - 240) < 2);
await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-scrolling'));
const bounds = await page.locator('#manifesto').evaluate(element => ({ top: element.offsetTop, distance: element.offsetHeight - innerHeight }));
const samples = [];
for (const progress of [0, .25, .45, .69, .9, .45, 0]) {
  await page.evaluate(y => scrollTo(0, y), bounds.top + bounds.distance * progress);
  await page.waitForFunction(y => Math.abs(scrollY - y) < 1, bounds.top + bounds.distance * progress);
  await page.waitForTimeout(180);
  const sample = await page.evaluate(() => {
    const panels = [...document.querySelectorAll('.manifesto-pin [data-manifesto-state]')].map(element => ({
      state: Number(element.dataset.manifestoState), opacity: Number(getComputedStyle(element).opacity),
      transform: getComputedStyle(element).transform, hidden: element.getAttribute('aria-hidden'),
    }));
    const opacity = name => Number(getComputedStyle(document.querySelector(`.manifesto-pin [data-grid-part='${name}']`)).opacity);
    return {
      panels, pinTop: document.querySelector('.manifesto-pin').getBoundingClientRect().top,
      titleTop: document.querySelector('.manifesto-pin .manifesto-title').getBoundingClientRect().top,
      topDivider: opacity('top-divider'), middleDivider: opacity('middle-divider'),
      imageGridVisible: [...document.querySelectorAll('.manifesto-pin img[src$="26-470-imgImage621.png"]')].some(image => image.getBoundingClientRect().width > 0),
    };
  });
  assert.ok(Math.abs(sample.pinTop) < 1, 'Manifesto remains pinned');
  assert.ok(Math.abs(sample.titleTop - 335) < 1, 'Title stays stationary');
  assert.equal(sample.imageGridVisible, false, 'Grid is drawn with vectors');
  if (progress === 0) {
    assert.equal(sample.panels[0].opacity, 1); assert.equal(sample.topDivider, 1); assert.equal(sample.middleDivider, 1);
  }
  if (progress === .45) {
    assert.equal(sample.panels[1].opacity, 1); assert.equal(sample.topDivider, 0); assert.equal(sample.middleDivider, 1);
  }
  if (progress === .9) {
    assert.equal(sample.panels[2].opacity, 1); assert.equal(sample.topDivider, 0); assert.equal(sample.middleDivider, 0);
  }
  if (progress === .25 || progress === .69) {
    assert.equal(sample.panels.filter(panel => panel.opacity > 0 && panel.opacity < 1).length, 1, 'New copy fades in after old copy fades away');
    assert.equal(sample.panels[progress === .25 ? 0 : 1].opacity, 0, 'No dense overlapping text during the reveal');
  }
  await page.screenshot({ path: `verification/manifesto-progress-${progress}.png` });
  samples.push({ progress, ...sample });
}
await page.evaluate(y => scrollTo(0, y), bounds.top + bounds.distance + 300);
await page.waitForTimeout(180);
assert.ok(await page.locator('.manifesto-pin').evaluate(element => element.getBoundingClientRect().top < -250), 'Pinned sequence releases into the next section');
assert.ok(await page.locator('[data-name="golden square"]').evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === '0.08')), 'All chapter background grids are faint');
await page.locator('#science').evaluate(element => scrollTo(0, element.offsetTop));
await page.waitForTimeout(100);
await page.screenshot({ path: 'verification/background-lines-softened.png' });
await page.setViewportSize({ width: 1920, height: 1080 });
await page.waitForFunction(() => document.querySelector('#manifesto-composition').style.getPropertyValue('--frame-scale') === '1.35');
await page.locator('#manifesto').evaluate(element => scrollTo(0, element.offsetTop + (element.offsetHeight - innerHeight) * .45));
await page.waitForTimeout(200);
await page.screenshot({ path: 'verification/manifesto-1920.png' });
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 1920);
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.waitForFunction(() => !document.documentElement.classList.contains('lenis'));
assert.equal(await page.locator('.manifesto-reduced .design-frame:visible').count(), 3);
await page.setViewportSize({ width: 390, height: 844 });
assert.equal(await page.locator('.manifesto-story:visible').count(), 0);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
assert.deepEqual(errors, []);
await writeFile('verification/manifesto-report.json', JSON.stringify({ earlyScroll, samples, errors, reducedMotion: 'passed', mobile: 'passed', resize: 'passed' }, null, 2));
console.log('Passed: Lenis wheel smoothing, both reversible transitions, vector grid states, pin/release, faint background grids, desktop resize, reduced motion, mobile, and browser errors.');
await browser.close();
