import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const baseUrl = process.env.PROTOTYPE_URL || 'http://127.0.0.1:8080/web/prototype-v1/';
const outDir = process.env.AUDIT_OUT || 'artifacts/living-interface-v1';

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function audit(name, viewport, reducedMotion = 'no-preference') {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const response = await page.goto(baseUrl, { waitUntil: 'networkidle' });
  if (!response?.ok()) throw new Error(`${name}: page returned ${response?.status()}`);

  await page.waitForSelector('#main');

  const metrics = await page.evaluate(() => ({
    title: document.title,
    lang: document.documentElement.lang,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    h1Count: document.querySelectorAll('h1').length,
    mainCount: document.querySelectorAll('main').length,
    skipLink: Boolean(document.querySelector('.skip-link')),
  }));

  if (metrics.scrollWidth > metrics.clientWidth + 1) {
    throw new Error(`${name}: horizontal overflow ${metrics.scrollWidth} > ${metrics.clientWidth}`);
  }
  if (metrics.h1Count !== 1) throw new Error(`${name}: expected one h1, got ${metrics.h1Count}`);
  if (metrics.mainCount !== 1) throw new Error(`${name}: expected one main, got ${metrics.mainCount}`);
  if (!metrics.skipLink) throw new Error(`${name}: missing skip link`);
  if (metrics.lang !== 'zh-CN') throw new Error(`${name}: unexpected lang ${metrics.lang}`);

  const toggle = page.locator('[data-world-toggle]');
  await toggle.click();
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
    throw new Error(`${name}: world panel did not open`);
  }

  const firstWorldLink = page.locator('#world-panel a').first();
  await firstWorldLink.waitFor({ state: 'visible' });
  const focusedInsidePanel = await page.evaluate(() => document.activeElement?.closest('#world-panel') !== null);
  if (!focusedInsidePanel) throw new Error(`${name}: focus did not move into world panel`);

  await page.keyboard.press('Escape');
  if ((await toggle.getAttribute('aria-expanded')) !== 'false') {
    throw new Error(`${name}: Escape did not close world panel`);
  }

  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });

  if (consoleErrors.length) throw new Error(`${name}: console errors: ${consoleErrors.join(' | ')}`);
  if (pageErrors.length) throw new Error(`${name}: page errors: ${pageErrors.join(' | ')}`);

  await context.close();
  return { name, ...metrics, reducedMotion };
}

const results = [];
results.push(await audit('desktop-1440', { width: 1440, height: 1000 }));
results.push(await audit('mobile-390', { width: 390, height: 844 }));
results.push(await audit('desktop-reduced-motion', { width: 1440, height: 1000 }, 'reduce'));

await fs.writeFile(`${outDir}/audit.json`, `${JSON.stringify(results, null, 2)}\n`, 'utf8');
await browser.close();

console.log(JSON.stringify(results, null, 2));
