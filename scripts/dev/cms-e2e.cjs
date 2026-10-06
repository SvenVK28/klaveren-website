// End-to-end test of the REAL admin against the GitHub repo. It creates actual commits,
// so run `create`, check the result, then `delete` to clean up.
//
//   create: signs in with a token, creates "E2E test: verwijder mij" with a large JPEG
//           cover and some body text, and saves. Expect one commit
//           `Nieuw: productie "e2e-test-verwijder-mij"` with index.md + a resized .webp.
//   delete: signs in and deletes that entry (and its media) through the UI.
//
//   CMS_TOKEN="$(gh auth token)" NODE_PATH="$APPDATA/npm/node_modules" \
//     node scripts/dev/cms-e2e.cjs create|delete [adminUrl]
//
// The token only lives in a throwaway browser context.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const mode = process.argv[2];
const adminUrl = process.argv[3] || 'https://sven-vh.github.io/klaveren-website/admin/';
const token = process.env.CMS_TOKEN;
const TITLE = 'E2E test: verwijder mij';
if (!['create', 'delete'].includes(mode) || !token) {
  console.error('usage: CMS_TOKEN=... node scripts/dev/cms-e2e.cjs create|delete [adminUrl]');
  process.exit(2);
}

async function makeTestPhoto(file) {
  const sharp = require('sharp');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="2000">
    <rect width="100%" height="100%" fill="#16596b"/>
    <text x="1500" y="1050" font-size="220" text-anchor="middle" fill="#fff">E2E testfoto</text></svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(file);
}

(async () => {
  fs.mkdirSync('screenshots', { recursive: true });
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'nl-NL' })).newPage();
  const logs = [];
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && logs.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
  const text = async () => (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 500);
  const shot = (name) => page.screenshot({ path: `screenshots/e2e-${mode}-${name}.png` });

  try {
    await page.goto(adminUrl, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /toegangstoken/i }).click();
    await page.locator('input[type="password"], dialog input, [role="dialog"] input').first().fill(token);
    await page.getByRole('button', { name: /^inloggen$/i }).click();
    await page.waitForTimeout(5000);

    if (mode === 'create') {
      const photo = path.resolve('screenshots/E2E Test Foto.jpg'); // screenshots/ is gitignored
      await makeTestPhoto(photo);
      await page.goto(adminUrl + '#/collections/work/new', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2500);
      await page.getByRole('textbox', { name: /^Titel/ }).fill(TITLE);
      await page.getByRole('textbox', { name: /^Korte samenvatting/ }).fill('Automatische test van het beheerpaneel.');
      // "Bladeren" opens Sveltia's media dialog; "Uploaden" in there opens the file picker.
      await page.getByRole('button', { name: /^Bladeren$/ }).first().click();
      await page.waitForTimeout(1000);
      const [chooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.getByRole('button', { name: /Uploaden/ }).click(),
      ]);
      await chooser.setFiles(photo);
      await page.waitForTimeout(4000);
      const insert = page.getByRole('button', { name: /^Invoegen$/ });
      if (await insert.count()) {
        if (await insert.isDisabled()) await page.getByText(/e2e-test-foto/i).first().click();
        await insert.click();
        await page.waitForTimeout(1500);
      }
      await page.locator('[contenteditable="true"]').first().click();
      await page.keyboard.type('Dit is een automatische test. Dit stuk mag weg.');
      await shot('filled');
      await page.getByRole('button', { name: /^Opslaan$/ }).click();
    } else {
      await page.getByText(TITLE).first().click();
      await page.waitForTimeout(2500);
      await page
        .getByRole('button', { name: /meer opties|more|opties/i })
        .first()
        .click()
        .catch(() => page.locator('header button:has-text("more_vert")').last().click());
      await page.waitForTimeout(800);
      await page.getByRole('menuitem', { name: /verwijder/i }).click();
      await page
        .locator('[role=alertdialog], [role=dialog], dialog')
        .filter({ hasText: 'Item verwijderen' })
        .getByRole('button', { name: /^Verwijderen$/ })
        .click();
    }
    await page.waitForTimeout(7000);
    await shot('done');
    console.log(`AFTER ${mode.toUpperCase()}:`, await text());
  } catch (error) {
    await shot('error');
    console.log('ERROR:', error.message, '\nPAGE:', await text());
    process.exitCode = 1;
  } finally {
    await browser.close();
    console.log(logs.length ? logs.join('\n') : 'no console errors');
  }
})();
