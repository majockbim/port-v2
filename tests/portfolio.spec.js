const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

async function expectNoOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test('navigation, resume, local assets, and font load without errors', async ({ page, request }) => {
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) failures.push(`${response.status()}: ${response.url()}`);
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Majock Bim_');
  await page.getByRole('navigation').getByRole('link', { name: 'work', exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await page.getByRole('navigation').getByRole('link', { name: 'contact', exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  const resumePath = await page.getByRole('link', { name: /resume/ }).getAttribute('href');
  const resume = await request.get(resumePath);
  expect(resume.status()).toBe(200);
  expect((await resume.body()).subarray(0, 5).toString()).toBe('%PDF-');
  const references = await page.locator('[src], link[href]').evaluateAll(elements => elements.map(el => el.getAttribute('src') || el.getAttribute('href')).filter(url => !/^(https?:|mailto:|#)/.test(url)));
  for (const reference of new Set(references)) expect((await request.get(reference)).ok(), reference).toBe(true);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [...document.fonts].some(font => font.family.includes('VT323') && font.status === 'loaded'))).toBe(true);
  expect(failures).toEqual([]);
});

test('project details support pointer and keyboard interaction', async ({ page, isMobile }) => {
  await page.goto('/');
  for (const id of ['exoskeleton', 'physio', 'spectrum', 'lodestone']) {
    const details = page.locator(`#${id} details`);
    const summary = details.locator('summary');
    await expect(details).not.toHaveAttribute('open');
    if (isMobile) await summary.tap();
    else {
      await summary.focus();
      await page.keyboard.press('Enter');
    }
    await expect(details).toHaveAttribute('open', '');
    await expect(details.locator('.project-detail')).toBeVisible();
    for (const img of await details.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await expectNoOverflow(page);
    await summary.click();
    await expect(details).not.toHaveAttribute('open');
  }
});

test('reflows at narrow, landscape, tablet, and desktop widths', async ({ page }) => {
  await page.goto('/');
  for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [852, 393], [1440, 900], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    await expectNoOverflow(page);
    // Interaction is covered separately; set state directly for the layout sweep.
    await page.locator('details').evaluateAll(elements => elements.forEach(el => { el.open = true; }));
    await expectNoOverflow(page);
    await page.locator('details').evaluateAll(elements => elements.forEach(el => { el.open = false; }));
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => { document.body.style.zoom = '2'; });
  await expectNoOverflow(page);
});

test('works with JavaScript disabled, reduced motion, and unavailable font', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width: 320, height: 740 } });
  const page = await context.newPage();
  await page.route('**/*.ttf', route => route.abort());
  await page.goto(baseURL);
  await page.locator('#physio summary').click();
  await expect(page.locator('#physio .project-detail')).toBeVisible();
  await expectNoOverflow(page);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await expect(page.locator('script')).toHaveCount(0);
  await context.close();
});

test('keyboard entry and closed/expanded content pass accessibility checks', async ({ page, browserName }) => {
  await page.goto('/');
  // WebKit's link tabbing follows platform preferences. Verify activation from
  // explicit focus there, and the first Tab stop in Chromium and Firefox.
  if (browserName === 'webkit') await page.getByRole('link', { name: 'Skip to content' }).focus();
  else await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('main')).toBeFocused();
  const scan = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect((await scan()).violations).toEqual([]);
  for (const summary of await page.locator('summary').all()) await summary.click();
  expect((await scan()).violations).toEqual([]);
});
