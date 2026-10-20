// Full-page screenshots of the site (desktop, tablet, phones) into screenshots/.
// Also reports horizontal overflow and console/network errors.
//
//   npm run build && npx astro preview        (in another terminal)
//   NODE_PATH="$APPDATA/npm/node_modules" node scripts/dev/screenshots.cjs [baseUrl] [path,path,...]
//
// Playwright is installed globally on the dev machine, hence NODE_PATH.
const { chromium } = require('playwright');
const fs = require('fs');

const base = process.argv[2] || 'http://localhost:4321/';
const paths = (process.argv[3] || ',mijn-werk/,over-mij/,freelance/,contact/,privacy/').split(',');
// Widths from the design brief's acceptance tests (spec §15). VARIANTS=desktop,mobile picks a subset.
const allVariants = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'tablet', viewport: { width: 768, height: 1024 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
  { name: 'small', viewport: { width: 320, height: 640 } },
];
const wanted = process.env.VARIANTS?.split(',');
const variants = wanted ? allVariants.filter((v) => wanted.includes(v.name)) : allVariants;

(async () => {
  fs.mkdirSync('screenshots', { recursive: true });
  const browser = await chromium.launch();
  const problems = [];
  for (const variant of variants) {
    const ctx = await browser.newContext({ viewport: variant.viewport, reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && problems.push(`${variant.name}: ${m.text()}`));
    // YouTube's player fires tracking requests that fail in headless mode; ignore those.
    page.on('requestfailed', (r) => !r.url().includes('youtube') && problems.push(`${variant.name}: failed ${r.url()}`));
    page.on('response', (r) => r.status() >= 400 && problems.push(`${variant.name}: ${r.status()} ${r.url()}`));
    for (const path of paths) {
      await page.goto(base + path, { waitUntil: 'networkidle' });
      // Scroll through the page so lazy-loaded images are in the screenshot.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState('networkidle');
      const file = `screenshots/${variant.name}-${path.replace(/\/$/, '').replace(/\//g, '_') || 'home'}.png`;
      await page.screenshot({ path: file, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      console.log(file, overflow ? '  <-- HORIZONTAL OVERFLOW' : '');
    }
    await ctx.close();
  }
  await browser.close();
  console.log(problems.length ? problems.join('\n') : 'no console/network errors');
})();
