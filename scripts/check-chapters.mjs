import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: '/home/kaialan/.cache/ms-playwright/chromium-1148/chrome-linux/chrome', args: ['--no-sandbox'] });
const reports = [];
for (const [width, height] of [[1280,800], [1920,1080], [768,800], [390,844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(process.env.VISUAL_PREVIEW_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.classList.contains('lenis') && document.querySelector(innerWidth > 700 ? '#science' : '.mobile-layout .design-frame').style.getPropertyValue('--frame-scale'));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map(image => image.decode().catch(() => {}))));
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
  assert.deepEqual(errors, []);
  assert.deepEqual(await page.evaluate(() => [...document.images].filter(image => !image.complete || (!image.naturalWidth && !image.naturalHeight)).map(image => image.src)), []);
  if (width > 700) {
    const counts = {};
    for (const [id, minimum] of [['science',97], ['depth',60], ['audience',57], ['craft',7]]) {
      const frame = page.locator(`#${id}`);
      const copy = await frame.locator('p').evaluateAll(elements => elements.filter(element => element.textContent.trim()).map(element => ({ text: element.textContent.slice(0,60), visible: !!element.getBoundingClientRect().width && !!element.getBoundingClientRect().height })));
      assert.ok(copy.length >= minimum, `${id}: complete reference copy`);
      assert.deepEqual(copy.filter(element => !element.visible), [], `${id}: no chapter content hidden by a material rule`);
      counts[id] = copy.length;
      await frame.evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY));
      await page.waitForTimeout(50);
      await page.screenshot({ path: `verification/chapter-${id}-${width}.png` });
    }
    const grid = page.locator('.research-grid-pin');
    for (const id of ['science','depth','audience']) {
      await page.locator(`#${id}`).evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY + 200));
      await page.waitForTimeout(30);
      assert.ok(Math.abs((await grid.boundingBox()).y) < 1, `${id}: shared grid stays stationary`);
    }
    assert.equal(await page.locator('.research-grid-pin [data-name="golden square"]').count(), 2);
    assert.equal(await page.locator('.research-sequence > .design-frame [data-name="golden square"]').evaluateAll(elements => elements.filter(element => getComputedStyle(element).display !== 'none').length), 0, 'No repeating chapter grid copies');
    const gap = await page.evaluate(() => {
      const last = document.querySelector('[data-node-id="26:1699"]').getBoundingClientRect();
      const next = document.querySelector('[data-node-id="26:1929"]').getBoundingClientRect();
      return (next.top - last.bottom) / Number(document.querySelector('#depth').style.getPropertyValue('--frame-scale'));
    });
    assert.ok(gap > 0 && gap < 500, 'Chapter 2 has no empty artboard tail');
    const finalChart = page.locator('[data-node-id="26:2085"]');
    await finalChart.evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - innerHeight / 2));
    assert.ok((await finalChart.boundingBox()).height > 0, 'Final audience chart label remains visible');
    reports.push({ width, height, counts, chapterGap: gap });
  } else {
    assert.ok(await page.locator('.mobile-layout').isVisible());
    reports.push({ width, height, mobile: true });
  }
  await page.close();
}
await browser.close();
await writeFile('verification/chapter-report.json', JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports, null, 2));
