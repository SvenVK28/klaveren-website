// Contact form check in a real browser. The built site has no Web3Forms key yet,
// so the test enables the form in the page, then fakes Web3Forms' reply:
//   1. empty submit      → inline errors, no request
//   2. valid + success   → "Bericht verstuurd", form hidden, request body checked
//   3. valid + failure   → error message, form stays
// With --real the last step talks to the real API with a bogus key instead, which
// checks CORS and Web3Forms' real error reply (no message is delivered).
//
//   npm run build && npx astro preview        (in another terminal)
//   NODE_PATH="$APPDATA/npm/node_modules" node scripts/dev/contact-form.cjs [contactUrl] [--real]
const { chromium } = require('playwright');
const fs = require('fs');

const args = process.argv.slice(2);
const real = args.includes('--real');
const contactUrl = args.find((a) => !a.startsWith('--')) || 'http://localhost:4321/contact/';
const API = 'https://api.web3forms.com/submit';

const fail = (msg) => {
  console.error('FAIL:', msg);
  process.exitCode = 1;
};

(async () => {
  fs.mkdirSync('screenshots', { recursive: true });
  const browser = await chromium.launch();
  // Web3Forms sits behind Cloudflare, which rejects the CORS preflight of the default
  // "HeadlessChrome" user agent. Real browsers pass, so pretend to be one.
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  const requests = [];
  let reply = { status: 200, body: { success: true, message: 'Email sent successfully!' } };
  if (!real) {
    await page.route(API, async (route) => {
      requests.push(JSON.parse(route.request().postData() || '{}'));
      await route.fulfill({
        status: reply.status,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify(reply.body),
      });
    });
  }

  await page.goto(`${contactUrl}?opdracht=Interviews%20afnemen`, { waitUntil: 'networkidle' });
  const inactive = await page.locator('#form-inactive').isVisible();
  console.log('inactive notice shown without key:', inactive);
  if (!inactive) fail('expected the "nog niet actief" notice on a build without key');
  const preselected = await page.locator('#cf-type').inputValue();
  console.log('pre-selected type:', preselected);
  if (preselected !== 'Interviews afnemen') fail('?opdracht= did not pre-select the service');

  // Pretend a key is configured.
  await page.evaluate(() => {
    document.querySelector('[data-contact-form] fieldset').disabled = false;
    document.querySelector('input[name=access_key]').value = '00000000-0000-0000-0000-000000000000';
    document.getElementById('form-inactive')?.remove();
  });

  // 1. Empty submit.
  await page.click('.submit');
  const shownErrors = await page.locator('.error:not([hidden])').allTextContents();
  console.log('errors on empty submit:', shownErrors);
  if (shownErrors.length !== 3) fail('expected 3 inline errors');
  if (requests.length) fail('a request was sent for an invalid form');

  await page.fill('#cf-name', 'Test Persoon');
  await page.fill('#cf-email', 'geen-email');
  await page.click('.submit');
  const emailError = await page.locator('#cf-email-error').textContent();
  if (!/geldig/.test(emailError || '')) fail('no "geldig e-mailadres" error for a bad address');
  await page.fill('#cf-email', 'test@example.com');
  await page.fill('#cf-topic', 'Testonderwerp');
  await page.fill('#cf-message', 'Dit is een testbericht.');

  if (!real) {
    // 2. Success.
    await page.click('.submit');
    await page.waitForSelector('.result--success');
    const body = requests.at(-1);
    console.log('request body:', body);
    if (body.name !== 'Test Persoon' || body.email !== 'test@example.com' || !body.message) fail('request body incomplete');
    if (!/Testonderwerp/.test(body.subject)) fail('subject does not include the topic');
    if ('redirect' in body) fail('redirect should not be sent with fetch');
    if (await page.locator('fieldset').isVisible()) fail('form should be hidden after success');
    await page.screenshot({ path: 'screenshots/contact-success.png' });
    console.log('success state: ok');

    // 3. Failure: reload, fill again, fake an API error.
    reply = { status: 400, body: { success: false, message: 'Spam detected' } };
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.querySelector('[data-contact-form] fieldset').disabled = false;
      document.querySelector('input[name=access_key]').value = 'x';
    });
    await page.fill('#cf-name', 'Test Persoon');
    await page.fill('#cf-email', 'test@example.com');
    await page.fill('#cf-message', 'Nog een test.');
  }

  await page.click('.submit');
  await page.waitForSelector('.result--error', { timeout: 15000 });
  const text = await page.locator('.result--error').textContent();
  console.log('error state:', text.replace(/\s+/g, ' ').trim());
  if (!(await page.locator('fieldset').isVisible())) fail('form should stay visible after an error');
  if (await page.locator('.result--success').count()) fail('success shown after a failure');
  await page.screenshot({ path: `screenshots/contact-error${real ? '-real' : ''}.png` });

  if (errors.length) fail(`page errors: ${errors.join('; ')}`);
  await browser.close();
  console.log(process.exitCode ? 'contact form: FAILED' : 'contact form: all checks passed');
})();
