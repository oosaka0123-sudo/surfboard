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

await page.locator('label.board-family-card:has(input[name="boardFamily"][value="retro-fish"])').click();
await page.waitForLoadState('networkidle');

let routedUrl = new URL(page.url());
if (routedUrl.pathname !== '/retro-fish/' || routedUrl.searchParams.get('issue') !== 'paddle-hard') {
  throw new Error(`Retro Fish family did not route to its category top with issue preserved: ${page.url()}`);
}

await page.locator('[data-category-diagnosis]').first().click();
await page.waitForLoadState('networkidle');

routedUrl = new URL(page.url());
if (
  !routedUrl.pathname.startsWith('/diagnosis') ||
  routedUrl.searchParams.get('family') !== 'retro-fish' ||
  routedUrl.searchParams.get('issue') !== 'paddle-hard'
) {
  throw new Error(`Category diagnosis CTA did not preserve family/issue: ${page.url()}`);
}
if ((await page.locator('[data-step-label]').textContent())?.trim() !== '2') {
  throw new Error('Prefilled Retro Fish diagnosis did not start at step 2');
}
if (!(await page.locator('input[name="boardFamily"][value="retro-fish"]').isChecked())) {
  throw new Error('Retro Fish family prefill was not preserved');
}
if (!(await page.locator('input[name="issue"][value="paddle-hard"]').isChecked())) {
  throw new Error('Issue prefill was lost after category top routing');
}

await page.locator('input[name="heightCm"]').fill('999');
await page.locator('input[name="weightKg"]').fill('68');
await page.locator('input[name="frequency"][value="2-4"]').check();
await page.locator('[data-next]').click();

if ((await page.locator('[data-step-label]').textContent())?.trim() !== '2') {
  throw new Error('Out-of-range height was allowed to advance from the body-input step');
}
if (!(await page.locator('[data-error]').textContent())?.includes('130〜210cm')) {
  throw new Error('Out-of-range height did not show the expected range error');
}

await page.locator('input[name="heightCm"]').fill('170');
await page.locator('[data-next]').click();

await page.locator('input[name="skill"][value="ups-downs"]').check();
await page.locator('input[name="takeoffRate"][value="6-8"]').check();
await page.locator('[data-next]').click();

await page.locator('[data-next]').click();

await page.locator('input[name="waveSize"][value="waist-chest"]').check();
await page.locator('input[name="goal"][value="more-waves"]').check();
await page.locator('[data-submit]').click();

const contextSummary = await page.locator('[data-context]').textContent();
if (!contextSummary?.includes('レトロフィッシュ') || !contextSummary.includes('170cm') || !contextSummary.includes('68kg')) {
  throw new Error('Diagnosis result did not preserve the entered body context');
}

const matches = page.locator('.match-card');
if ((await matches.count()) < 1) {
  throw new Error('Diagnosis completed but returned no match cards');
}

const matchedCategories = await matches.evaluateAll((cards) =>
  cards.map((card) => card.getAttribute('data-board-category')),
);
if (matchedCategories.some((category) => !['fish', 'twin'].includes(category ?? ''))) {
  throw new Error(`Retro-fish selection returned another family: ${matchedCategories.join(', ')}`);
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

await openAndCheck('/shortboard/', 'mobile-shortboard');
await openAndCheck('/retro-fish/', 'mobile-retro-fish');
await openAndCheck('/midlength/', 'mobile-midlength');
await openAndCheck('/boards/', 'mobile-boards');
await openAndCheck('/method/', 'mobile-method');
await openAndCheck('/privacy/', 'mobile-privacy');
await openAndCheck('/advertising-policy/', 'mobile-advertising-policy');

if (runtimeErrors.length) {
  throw new Error(`Runtime browser errors:\n${runtimeErrors.join('\n')}`);
}

await browser.close();
console.log('Visual mobile QA passed.');
