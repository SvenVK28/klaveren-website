// Smoke test of the admin UI without touching GitHub: serves public/admin/config.yml
// with Sveltia's in-memory `test-repo` backend, signs in, opens a new "Werk" entry
// and takes screenshots (desktop + phone). Reports CMS console warnings, which is
// where Sveltia reports config mistakes and deprecated options.
//
//   npm run build && npx astro preview        (in another terminal)
//   NODE_PATH="$APPDATA/npm/node_modules" node scripts/dev/cms-smoke.cjs [adminUrl]
const { chromium } = require('playwright');
const fs = require('fs');

const adminUrl = process.argv[2] || 'http://localhost:4321/klaveren-website/admin/';
const yaml = fs
  .readFileSync('public/admin/config.yml', 'utf8')
  .replace(/backend:\n  name: github/, 'backend:\n  name: test-repo');

(async () => {
  fs.mkdirSync('screenshots', { recursive: true });
  const browser = await chromium.launch();
  const logs = [];
  for (const [name, options] of [
    ['desktop', { viewport: { width: 1440, height: 900 } }],
    ['mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
  ]) {
    const ctx = await browser.newContext({ ...options, locale: 'nl-NL' });
    const page = await ctx.newPage();
    page.on('console', (m) => ['error', 'warning'].includes(m.type()) && logs.push(`${name} ${m.type()}: ${m.text()}`));
    page.on('pageerror', (e) => logs.push(`${name} pageerror: ${e.message}`));
    await page.route(/config\.yml/, (route) => route.fulfill({ body: yaml, contentType: 'application/yaml' }));

    await page.goto(adminUrl, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /testrepository/i }).click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `screenshots/cms-${name}-collection.png` });
    await page.goto(adminUrl + '#/collections/work/new', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `screenshots/cms-${name}-new-entry.png`, fullPage: true });
    console.log(`${name}: screenshots/cms-${name}-*.png`);
    await ctx.close();
  }
  await browser.close();
  // The test backend ignores GitHub-only options; those warnings are expected.
  const relevant = logs.filter((l) => !/backend\.(repo|branch|auth_methods|commit_messages|base_url)/.test(l));
  console.log(relevant.length ? relevant.join('\n') : 'no relevant console errors/warnings');
})();
