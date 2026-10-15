import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: '/home/kaialan/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => {
  if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
});
await mkdir('verification', { recursive: true });
await page.goto(process.env.VISUAL_PREVIEW_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => Promise.all([...document.images].map(image => image.decode().catch(() => undefined))));
const reports = [];
for (const [width, height] of [[1280,800], [1920,1080], [1920,800], [2560,1080], [768,800], [390,844]]) {
  await page.setViewportSize({ width, height });
  const desktop = width > 700;
  const expectedScale = desktop ? Math.min(width / 1280, height / 800) : width / 390;
  await page.waitForFunction(({ desktop, expectedScale }) => {
    const frame = document.querySelector(desktop ? '#introduction' : '.mobile-layout .design-frame');
    return Math.abs(Number(frame.style.getPropertyValue('--frame-scale')) - expectedScale) < .00001;
  }, { desktop, expectedScale });
  const report = await page.evaluate(desktop => {
    const sections = [...document.querySelectorAll(desktop ? '.desktop-layout .design-frame' : '.mobile-layout > .design-frame')].filter(frame => frame.getBoundingClientRect().width > 0);
    return {
      width: innerWidth, height: innerHeight, documentWidth: document.documentElement.scrollWidth,
      frames: [...sections].map(frame => {
        const canvas = frame.querySelector('.design-canvas');
        const bounds = canvas.getBoundingClientRect();
        const matrix = new DOMMatrix(getComputedStyle(canvas).transform);
        return {
          id: frame.id, scaleX: matrix.a, scaleY: matrix.d,
          referenceHeight: parseFloat(frame.style.getPropertyValue('--frame-height')),
          height: frame.getBoundingClientRect().height, left: bounds.left, width: bounds.width,
        };
      }),
      coverMatrix: getComputedStyle(document.querySelector('[data-cover-material]')).transform,
      brokenImages: [...document.images].filter(image => !image.complete || (!image.naturalWidth && !image.naturalHeight)).map(image => image.src),
    };
  }, desktop);
  assert.equal(report.documentWidth, width, 'No horizontal overflow');
  assert.deepEqual(report.brokenImages, []);
  for (const frame of report.frames) {
    assert.ok(Math.abs(frame.scaleX - expectedScale) < .00001, `${frame.id}: shared scale`);
    assert.equal(frame.scaleX, frame.scaleY, `${frame.id}: uniform scale`);
    assert.ok(Math.abs(frame.height - frame.referenceHeight * expectedScale) < .02, `${frame.id}: document height`);
    assert.ok(Math.abs(frame.left - (width - frame.width) / 2) < .02, `${frame.id}: centered composition`);
    if (frame.referenceHeight === 800) assert.ok(frame.height <= height + .02, `${frame.id}: fits viewport`);
  }
  if (desktop) {
    const cover = report.coverMatrix.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number);
    assert.equal(cover[0], cover[3], 'Background artwork retains its aspect ratio');
    await page.locator('#introduction').screenshot({ path: `verification/scaling-hero-${width}x${height}.png` });
    if (height !== 800 || width === 1280) await page.locator('#manifesto').screenshot({ path: `verification/scaling-manifesto-${width}x${height}.png` });
    if (width === 2560) {
      await page.locator('#company').screenshot({ path: 'verification/scaling-footer-wide.png' });
      const chapterTop = await page.locator('#science').evaluate(element => element.offsetTop);
      await page.evaluate(top => scrollTo(0, top), chapterTop);
      await page.screenshot({ path: 'verification/scaling-research-wide.png' });
    }
  }
  reports.push(report);
}
assert.deepEqual(errors, []);
await writeFile('verification/scaling-report.json', JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports.map(report => ({ viewport: `${report.width}x${report.height}`, scale: report.frames[0].scaleX, sections: report.frames.length, horizontalOverflow: report.documentWidth > report.width })), null, 2));
await browser.close();
