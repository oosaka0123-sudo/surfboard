import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const baseURL = 'http://127.0.0.1:4173';
const outDir = 'visual-qa-artifacts';
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

const runtimeErrors = [];
page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') runtimeErrors.push(`console: ${msg.text()}`);
});

async function openAndCheck(path, screenshotName) {
  const response = await page.goto(baseURL + path, { waitUntil: 'networkidle' });
  if (!response || !response.ok()) {
    throw new Error(`Failed to load ${path}: ${response?.status()}`);
  }

  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    hasH1: Boolean(document.querySelector('h1')),
  }));

  if (!layout.hasH1) throw new Error(`${path} is missing an h1`);
  if (layout.scrollWidth > layout.viewport + 2) {
    throw new Error(`${path} horizontally overflows: ${layout.scrollWidth}px > ${layout.viewport}px`);
  }

  await page.screenshot({
    path: `${outDir}/${screenshotName}.png`,
    fullPage: true,
  });
}

await openAndCheck('/', 'mobile-home');

const issueLink = page.locator('a.trouble-chip[href*="issue=paddle-hard"]').first();
await issueLink.scrollIntoViewIfNeeded();
await issueLink.click();
await page.waitForLoadState('networkidle');

const diagnosisUrl = new URL(page.url());
if (
  !diagnosisUrl.pathname.startsWith('/diagnosis') ||
  diagnosisUrl.searchParams.get('issue') !== 'paddle-hard'
) {
  throw new Error(`Home issue chip did not carry its diagnosis parameter: ${page.url()}`);
}
if (!(await page.locator('input[name="issue"][value="paddle-hard"]').isChecked())) {
  throw new Error('Diagnosis issue prefill did not select paddle-hard');
}

await page.locator('input[name="heightCm"]').fill('170');
await page.locator('input[name="weightKg"]').fill('68');
await page.locator('input[name="frequency"][value="2-4"]').check();
await page.locator('[data-next]').click();

await page.locator('input[name="skill"][value="ups-downs"]').check();
await page.locator('input[name="takeoffRate"][value="6-8"]').check();
await page.locator('[data-next]').click();

await page.locator('input[name="volumeL"]').fill('30.5');
await page.locator('[data-next]').click();

await page.locator('input[name="waveSize"][value="waist-chest"]').check();
await page.locator('input[name="goal"][value="more-waves"]').check();
await page.locator('[data-submit]').click();

const matches = page.locator('.match-card');
if ((await matches.count()) < 1) {
  throw new Error('Diagnosis completed but returned no match cards');
}

const routeLabels = await page.locator('.match-route strong').allTextContents();
if (new Set(routeLabels).size !== routeLabels.length) {
  throw new Error(`Duplicate route labels rendered: ${routeLabels.join(', ')}`);
}

const resultLayout = await page.evaluate(() => ({
  viewport: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
}));
if (resultLayout.scrollWidth > resultLayout.viewport + 2) {
  throw new Error('Diagnosis result horizontally overflows on mobile');
}
await page.screenshot({ path: `${outDir}/mobile-diagnosis-result.png`, fullPage: true });

await openAndCheck('/boards/', 'mobile-boards');
await openAndCheck('/method/', 'mobile-method');
await openAndCheck('/privacy/', 'mobile-privacy');
await openAndCheck('/advertising-policy/', 'mobile-advertising-policy');

if (runtimeErrors.length) {
  throw new Error(`Runtime browser errors:\n${runtimeErrors.join('\n')}`);
}

await browser.close();
console.log('Visual mobile QA passed.');
