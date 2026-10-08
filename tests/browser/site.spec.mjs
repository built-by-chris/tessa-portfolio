import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/about/', '/resume/', '/contact/', '/writing/', '/projects/'];

for (const route of routes) {
  test(route + ' stays within viewport', async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    const widths = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(widths.document, route + ' should not overflow horizontally').toBeLessThanOrEqual(widths.viewport + 1);
  });
}

test('mobile menu opens and closes with Escape', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only interaction');
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Close navigation menu');
  await expect(page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Contact' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
});

test('lilac brand bar stays visible above a pale full-width mobile dropdown', async ({ page }, testInfo) => {
  await page.goto('/');
  const header = page.locator('.site-header');
  const background = async (element) => element.evaluate((node) => getComputedStyle(node).backgroundColor);

  expect(await background(header)).toBe('rgb(231, 222, 237)');

  if (testInfo.project.name === 'mobile') {
    await page.locator('.menu-toggle').click();
    await expect(header).toHaveAttribute('data-menu-open', 'true');

    const nav = header.getByRole('navigation', { name: 'Primary navigation' });
    await expect(nav).toBeVisible();
    expect(await background(header)).toBe('rgb(231, 222, 237)');
    const dropdown = await nav.evaluate((element) => {
      const style = getComputedStyle(element, '::before');
      return {
        background: style.backgroundColor,
        width: Number.parseFloat(style.width),
        viewport: window.innerWidth,
      };
    });
    expect(dropdown.background).toBe('rgb(248, 246, 250)');
    expect(dropdown.width).toBeCloseTo(dropdown.viewport, 0);
  }
});

for (const route of ['/', '/about/', '/resume/', '/contact/']) {
  test(route + ' has no automated WCAG A/AA violations', async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
