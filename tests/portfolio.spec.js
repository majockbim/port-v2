const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

async function expectNoOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

const projects = {
  physio: 'https://github.com/majockbim/physio',
  spectrum: 'https://github.com/majockbim/spectrum',
  lodestone: 'https://github.com/majockbim/lodestone',
};

test('profile, resume, assets, and exact reference font load correctly', async ({ page, request }) => {
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Majock Bim');
  await expect(page.getByRole('link', { name: 'Email Majock' })).toHaveAttribute('href', 'mailto:bmajock@gmail.com');
  const resume = await request.get(await page.getByRole('link', { name: /resume/ }).getAttribute('href'));
  expect(resume.ok()).toBe(true);
  expect((await resume.body()).subarray(0, 5).toString()).toBe('%PDF-');
  const references = await page.locator('[src], link[href]').evaluateAll(elements => elements.map(el => el.getAttribute('src') || el.getAttribute('href')).filter(url => !/^(https?:|mailto:|#)/.test(url)));
  for (const reference of new Set(references)) expect((await request.get(reference)).ok(), reference).toBe(true);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [...document.fonts].some(font => font.family.includes('Minecraft') && font.status === 'loaded'))).toBe(true);
  expect(failures).toEqual([]);
});

test('project rows link directly to source and keep descriptions visible', async ({ page }) => {
  await page.goto('/');
  for (const [id, url] of Object.entries(projects)) {
    const row = page.locator(`#${id}`);
    await expect(row).toHaveAttribute('href', url);
    await expect(row).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(row.locator('p')).toBeVisible();
    expect((await row.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
  await expect(page.locator('details')).toHaveCount(0);
});

test('Spectrum restores its GIF and rainbow focus effect with a pause control', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.spectrum-animated img')).toHaveAttribute('src', /spectrum-small\.gif$/);
  await expect(page.locator('.spectrum-animated')).toBeVisible();
  await page.keyboard.press('Tab');
  await page.locator('#spectrum').focus();
  const name = page.locator('.spectrum-rainbow');
  expect(await name.evaluate(el => getComputedStyle(el).backgroundImage)).toContain('linear-gradient');
  expect(await name.evaluate(el => getComputedStyle(el).animationName)).toBe('rainbow-move');
  await page.getByRole('checkbox', { name: 'Pause animation' }).check();
  await expect(page.locator('.spectrum-animated')).toBeHidden();
  await expect(page.locator('.spectrum-still')).toBeVisible();
  await page.locator('#spectrum').focus();
  expect(await name.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
  await page.getByRole('checkbox', { name: 'Pause animation' }).uncheck();
  await expect(page.locator('.spectrum-animated')).toBeVisible();
});

test('compact layout and hover previews reflow from phones to desktop', async ({ page, isMobile }) => {
  await page.goto('/');
  for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [852, 393], [1280, 900], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    await expectNoOverflow(page);
    if (!isMobile && width >= 1280) {
      await page.locator('#spectrum').hover();
      await expect(page.locator('#spectrum .row-preview')).toBeVisible();
      expect(await page.locator('.spectrum-rainbow').evaluate(el => getComputedStyle(el).animationName)).toBe('rainbow-move');
      await expectNoOverflow(page);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => { document.body.style.zoom = '2'; });
  await expectNoOverflow(page);
});

test('no JavaScript, reduced motion, and unavailable font remain usable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width: 320, height: 740 } });
  const page = await context.newPage();
  const gifRequests = [];
  page.on('request', request => { if (request.url().endsWith('.gif')) gifRequests.push(request.url()); });
  await page.route('**/*.otf', route => route.abort());
  await page.goto(baseURL);
  await expect(page.locator('#physio')).toBeVisible();
  await expect(page.locator('.spectrum-still')).toBeVisible();
  await expect(page.locator('.spectrum-animated')).toBeHidden();
  expect(gifRequests).toEqual([]);
  expect(await page.locator('.bit-field').evaluate(el => getComputedStyle(el, '::before').animationName)).toBe('none');
  await page.locator('#spectrum').focus();
  expect(await page.locator('.spectrum-rainbow').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await expectNoOverflow(page);
  await expect(page.locator('script')).toHaveCount(0);
  await context.close();
});

test('skip link, keyboard focus, and content pass accessibility checks', async ({ page, browserName }) => {
  await page.goto('/');
  // WebKit link tabbing depends on the platform's full-keyboard-access setting.
  if (browserName === 'webkit') await page.getByRole('link', { name: 'Skip to content' }).focus();
  else await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const scan = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect((await scan()).violations).toEqual([]);
  await page.locator('#spectrum').focus();
  await expect(page.locator('.spectrum-white')).toHaveCSS('opacity', '0');
  expect((await scan()).violations).toEqual([]);
});


test('role, hackathon, sponsor, and background reflect the requested hierarchy', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work .project')).toHaveCount(3);
  await expect(page.locator('section[aria-labelledby="now-title"]')).toContainText('McMaster Exoskeleton');
  await expect(page.locator('section[aria-labelledby="previous-title"]')).toContainText('LA Hacks 2026');
  await expect(page.locator('section[aria-labelledby="previous-title"]')).toContainText('UCLA');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.getByRole('link', { name: 'Physio PCB manufacturing sponsored by PCBWay' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.sponsor-callout')).toBeHidden();
  expect(await page.locator('.bit-field').evaluate(el => getComputedStyle(el, '::before').animationPlayState)).toBe('running');
  await page.getByRole('checkbox', { name: 'Pause animation' }).check();
  expect(await page.locator('.bit-field').evaluate(el => getComputedStyle(el, '::before').animationPlayState)).toBe('paused');
});

test('Spectrum blends from white into color rather than switching instantly', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const mid = await page.locator('.spectrum-white').evaluate(el => {
    // Trigger and sample within one browser task so remote-call latency cannot
    // consume the short transition (especially in Firefox).
    getComputedStyle(el).opacity;
    document.querySelector('#spectrum').focus();
    getComputedStyle(el).opacity;
    const transition = el.getAnimations().find(animation => animation.transitionProperty === 'opacity');
    if (!transition) return null;
    transition.pause();
    transition.currentTime = Number(transition.effect.getTiming().duration) / 2;
    return Number(getComputedStyle(el).opacity);
  });
  expect(mid).not.toBeNull();
  expect(mid).toBeGreaterThan(0);
  expect(mid).toBeLessThan(1);
});
