// Cookie banner + Google Analytics check in a real browser. Google is faked: the
// gtag script is replaced by a stub that only sets a _ga cookie, and hits to
// google-analytics.com are answered locally, so no data reaches Google.
//   1. first visit       → banner, nothing requested from Google
//   2. Weigeren          → banner gone, still nothing, also after a reload
//   3. Cookie-instellingen + Accepteren → gtag loads with the site's ID
//   4. next page         → no banner, gtag loads by itself
//   5. withdraw (Weigeren again) → _ga cookies deleted, page reloads without gtag
//   6. phone + desktop screenshots, no sideways scrolling
//
//   npm run build && npx astro preview        (in another terminal)
//   NODE_PATH="$APPDATA/npm/node_modules" node scripts/dev/cookie-consent.cjs [siteUrl]
const { chromium } = require('playwright');
const fs = require('fs');

const site = (process.argv[2] || 'http://localhost:4321/').replace(/\/?$/, '/');

const fail = (msg) => {
  console.error('FAIL:', msg);
  process.exitCode = 1;
};

(async () => {
  fs.mkdirSync('screenshots', { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const gtagLoads = [];
  await context.route('https://www.googletagmanager.com/**', (route) => {
    gtagLoads.push(route.request().url());
    route.fulfill({
      contentType: 'text/javascript',
      body: "document.cookie = '_ga=GA1.1.123.456; path=/'; document.cookie = '_ga_TEST=GS1.1.789; path=/';",
    });
  });
  await context.route(/google-analytics\.com/, (route) => route.fulfill({ status: 204, body: '' }));

  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const banner = page.locator('[data-cookie-consent]');
  const settingsButton = page.locator('footer [data-cookie-settings]');
  const gaCookies = async () => (await context.cookies()).filter((c) => c.name.startsWith('_ga')).map((c) => c.name);

  // 1. First visit.
  await page.goto(site, { waitUntil: 'networkidle' });
  if (!(await banner.isVisible())) fail('banner not shown on the first visit');
  if (gtagLoads.length) fail('Google was contacted before any choice');
  const classes = await banner.locator('[data-consent]').evaluateAll((els) => els.map((el) => el.className));
  if (new Set(classes).size !== 1) fail(`Weigeren and Accepteren look different: ${classes.join(' | ')}`);
  console.log('1. first visit: banner shown, no Google request');

  // 6a. Screenshots while the banner is open.
  await page.screenshot({ path: 'screenshots/cookie-banner-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) fail(`page scrolls sideways on a phone (${overflow}px)`);
  await page.screenshot({ path: 'screenshots/cookie-banner-phone.png' });
  await page.setViewportSize({ width: 1280, height: 900 });

  // 2. Refuse.
  await banner.getByRole('button', { name: 'Weigeren' }).click();
  if (await banner.isVisible()) fail('banner still visible after Weigeren');
  await page.reload({ waitUntil: 'networkidle' });
  if (await banner.isVisible()) fail('banner came back after Weigeren + reload');
  if (gtagLoads.length) fail('Google was contacted after Weigeren');
  console.log('2. Weigeren: banner gone, no Google request after reload');

  // 3. Change the choice from the footer and accept.
  await settingsButton.click();
  if (!(await banner.isVisible())) fail('Cookie-instellingen did not open the banner');
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  if (focused !== 'Weigeren') fail(`focus should move into the banner, got "${focused}"`);
  await banner.getByRole('button', { name: 'Accepteren' }).click();
  await page.waitForLoadState('networkidle');
  if (await banner.isVisible()) fail('banner still visible after Accepteren');
  if (gtagLoads.length !== 1 || !gtagLoads[0].includes('id=G-')) fail(`expected one gtag load with the ID, got ${gtagLoads}`);
  const config = await page.evaluate(() => (window.dataLayer || []).map((args) => Array.from(args)));
  if (!config.some((args) => args[0] === 'config' && /^G-/.test(args[1]))) fail('gtag config call missing');
  if (!(await gaCookies()).length) fail('stub _ga cookie not set');
  console.log('3. Accepteren: gtag loaded', gtagLoads[0].split('?')[1], '| cookies', (await gaCookies()).join(', '));

  // 4. Next page loads analytics without asking.
  await page.goto(`${site}contact/`, { waitUntil: 'networkidle' });
  if (await banner.isVisible()) fail('banner shown again after Accepteren');
  if (gtagLoads.length !== 2) fail('gtag did not load by itself on the next page');
  console.log('4. next page: no banner, gtag loaded by itself');

  // 5. Withdraw consent.
  await settingsButton.click();
  await Promise.all([
    page.waitForEvent('load'),
    banner.getByRole('button', { name: 'Weigeren' }).click(),
  ]);
  await page.waitForLoadState('networkidle');
  const left = await gaCookies();
  if (left.length) fail(`_ga cookies left after withdrawing: ${left.join(', ')}`);
  if (gtagLoads.length !== 2) fail('gtag loaded again after withdrawing');
  if (await banner.isVisible()) fail('banner shown after withdrawing');
  console.log('5. withdraw: cookies deleted, reloaded without gtag');

  if (errors.length) fail(`page errors: ${errors.join('; ')}`);
  await browser.close();
  console.log(process.exitCode ? 'cookie consent: FAILED' : 'cookie consent: all checks passed');
})();
