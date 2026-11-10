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
await openAndCheck('/guides/', 'mobile-guides');
await openAndCheck('/guides/50s-surfboard/', 'mobile-guide-50s');
await openAndCheck('/guides/midlength-size/', 'mobile-guide-midlength-size');
await openAndCheck('/guides/fish-vs-twin/', 'mobile-guide-fish-vs-twin');
await openAndCheck('/privacy/', 'mobile-privacy');
await openAndCheck('/advertising-policy/', 'mobile-advertising-policy');

// BOARD TYPES: every board must be fully visible (nose to tail) at every width.
// Past regressions came from CSS sizing (img overflowing a fixed-height wrapper),
// so this measures the rendered <img> box against its wrapper, not the SVG alone.
const boardWidths = [360, 390, 430, 768, 1280];
const boardSvgs = new Map();
for (const width of boardWidths) {
  const boardContext = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
    isMobile: width < 768,
    hasTouch: width < 768,
  });
  const boardPage = await boardContext.newPage();
  boardPage.on('pageerror', (error) => runtimeErrors.push(`pageerror@${width}: ${error.message}`));
  await boardPage.goto(baseURL + '/', { waitUntil: 'networkidle' });
  const grid = boardPage.locator('.board-grid');
  await grid.scrollIntoViewIfNeeded();
  const cards = await boardPage.evaluate(async () => {
    const imgs = [...document.querySelectorAll('.board-card .board-type-img')];
    await Promise.all(imgs.map((img) => (img.complete ? null : img.decode().catch(() => null))));
    return imgs.map((img) => {
      const wrap = img.closest('.board-shape-wrap').getBoundingClientRect();
      const r = img.getBoundingClientRect();
      return {
        title: img.closest('.board-card').querySelector('h3')?.textContent?.trim(),
        src: img.getAttribute('src'),
        loaded: img.complete && img.naturalWidth > 0,
        objectFit: getComputedStyle(img).objectFit,
        inside: r.top >= wrap.top - 1 && r.bottom <= wrap.bottom + 1 && r.left >= wrap.left - 1 && r.right <= wrap.right + 1,
        clips: /hidden|clip/.test(getComputedStyle(img.closest('.board-shape-wrap')).overflow),
        ratio: r.width / r.height,
        natRatio: img.naturalWidth / img.naturalHeight,
        img: [Math.round(r.width), Math.round(r.height)],
        wrap: [Math.round(wrap.width), Math.round(wrap.height)],
      };
    });
  });
  if (cards.length !== 5) throw new Error(`Expected 5 board type cards at ${width}px, found ${cards.length}`);
  for (const card of cards) {
    const label = `${card.title} @${width}px (img ${card.img.join('x')} / wrap ${card.wrap.join('x')})`;
    if (!card.loaded) throw new Error(`Board image failed to load: ${label}`);
    if (card.objectFit === 'cover') throw new Error(`Board image must not use object-fit: cover: ${label}`);
    if (card.clips) throw new Error(`Board wrapper must not clip: ${label}`);
    if (Math.abs(card.ratio - card.natRatio) > 0.05) throw new Error(`Board image aspect distorted: ${label}`);
    if (card.img[1] < 40) throw new Error(`Board image is too small: ${label}`);
    if (!card.inside) throw new Error(`Board image is clipped by its card: ${label}`);
    boardSvgs.set(card.src.split('?')[0], card.title);
  }
  await grid.screenshot({ path: `${outDir}/board-types-${width}.png` });
  await boardContext.close();
}

// Silhouettes use TIGHT per-board viewBoxes (no reserved empty space) and must not bake in a background.
const viewBoxes = new Set();
const boardRatios = new Set();
for (const [src, title] of boardSvgs) {
  const svg = await (await fetch(baseURL + src)).text();
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`Board SVG has no viewBox: ${title} (${src})`);
  viewBoxes.add(viewBox);
  const [, , vw, vh] = viewBox.split(' ').map(Number);
  boardRatios.add((vw / vh).toFixed(2));
  if (/<rect\b/i.test(svg)) throw new Error(`Board SVG must have a transparent background (found <rect>): ${title}`);
}
if (boardSvgs.size !== 5) throw new Error(`Expected 5 distinct board SVGs, found ${boardSvgs.size}`);
if (boardRatios.size !== 5) throw new Error(`Board SVGs must have five distinct proportions, found: ${[...boardRatios].join(', ')}`);

if (runtimeErrors.length) {
  throw new Error(`Runtime browser errors:\n${runtimeErrors.join('\n')}`);
}

await browser.close();
console.log('Visual mobile QA passed.');
