import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.VISUAL_PREVIEW_URL || 'http://localhost:3000';
const browser = await chromium.launch({
  executablePath: '/home/kaialan/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
  headless: true,
  args: ['--no-sandbox'],
});
await mkdir('verification', { recursive: true });
const results = [];
for (const width of [1280, 390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(origin, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => {
    const frame = document.querySelector(innerWidth > 700 ? '#introduction' : '.mobile-layout .design-frame');
    return !!frame?.style.getPropertyValue('--frame-scale');
  });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map(image => image.decode().catch(() => undefined))));
  await page.screenshot({ path: `verification/hero-${width}.png` });
  if (width === 1280) {
    for (const id of ['manifesto','research-cover','science','depth','craft','dissection','proof','results','company']) {
      await page.locator(`#${id}`).screenshot({ path: `verification/${id}-1280.png` });
    }
    await page.screenshot({ path: 'verification/desktop-full.png', fullPage: true });
  }
  if (width === 390) await page.screenshot({ path: 'verification/mobile-full.png', fullPage: true });
  const report = await page.evaluate(() => ({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    pageHeight: document.documentElement.scrollHeight,
    imageCount: document.images.length,
    brokenImages: [...document.images].filter(i => !i.complete || (i.naturalWidth === 0 && i.naturalHeight === 0)).map(i => i.getAttribute('src')),
    fonts: [...document.fonts].filter(f => f.status === 'error').map(f => f.family),
    visibleSections: [...document.querySelectorAll('section')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({label:e.getAttribute('aria-label'),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),
  }));
  results.push({ width, errors, ...report });
  await page.close();
}
await browser.close();
await writeFile('verification/report.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results.map(({width,errors,documentWidth,pageHeight,brokenImages,fonts})=>({width,errors,documentWidth,pageHeight,brokenImages,fonts})),null,2));
if (results.some(r=>r.errors.length || r.brokenImages.length || r.fonts.length || r.documentWidth>r.width)) process.exitCode=1;
