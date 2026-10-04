import { test, expect } from '@playwright/test';

const routes = ['/', '/about', '/privacy', '/terms', '/delete-account', '/login', '/register', '/forgot-password', '/dashboard', '/billing', '/checkout', '/upgrade/session/test-session', '/payment-success', '/payment-failure', '/missing-page'];
const user = { id: 'test-owner', name: 'Tailor With A Long Shop Name', email: 'longshopowneremail@example.com', phone: '9705116606', role: 'owner' };
async function mockApi(page, signedIn = false) {
  if (signedIn) await page.addInitScript(user => {
    sessionStorage.setItem('stitchbook_auth_token', 'test-access-token');
    localStorage.setItem('stitchbook_user', JSON.stringify(user));
  }, user);
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const headers = { 'access-control-allow-origin': 'http://127.0.0.1:4173', 'access-control-allow-credentials': 'true' };
    if (path.endsWith('/auth/profile')) return route.fulfill({ headers, json: { data: user } });
    if (path.endsWith('/subscription/status')) return route.fulfill({ headers, json: { data: { isActive: true, status: 'active', planType: 'team', daysRemaining: 20 } } });
    return route.fulfill({ headers, status: 400, json: { message: 'This test link has expired. Please start again.' } });
  });
  await page.route('https://accounts.google.com/**', route => route.abort());
}

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`all routes fit a ${width}px viewport and expose metadata`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await mockApi(page);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const path of routes) {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
      await expect(page).toHaveTitle(/StitchBook \| .+/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S.{25,}/);
      const overflow = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
      expect(overflow.document, `${path}: document overflow`).toBeLessThanOrEqual(width + 1);
      expect(overflow.body, `${path}: body overflow`).toBeLessThanOrEqual(width + 1);
      for (const image of await page.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      }
    }
    expect(errors).toEqual([]);
  });
  test(`signed-in account and billing fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await mockApi(page, true);
    for (const path of ['/dashboard', '/billing']) {
      await page.goto(path);
      await expect(page.getByText('Active plan', { exact: true }).first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      await expect(page.getByRole('link', { name: 'StitchBook home' }).first()).toHaveAttribute('href', '/');
    }
  });
}

test('mobile navigation, preview tabs, footer anchors and 404 recovery work', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockApi(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.locator('#mobile-navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Pricing' }).click();
  await expect(page).toHaveURL(/#plans$/);
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await page.getByRole('tab', { name: 'Payments', exact: true }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Balance remaining');
  await expect(page.locator('footer a[href^="tel:"]')).toHaveAttribute('href', 'tel:+919705116606');
  await expect(page.locator('footer a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:stitchbook3@gmail.com');
  await expect(page.locator('footer')).toContainText(String(new Date().getFullYear()));
  const anchors = await page.locator('a[href*="#"]').evaluateAll(links => links.map(link => link.hash.slice(1)).filter(Boolean));
  for (const id of anchors) expect(await page.locator(`[id="${id}"]`).count(), id).toBeGreaterThan(0);
  await page.goto('/missing-page');
  await expect(page).toHaveTitle('StitchBook | Page Not Found');
  await page.getByRole('link', { name: 'Back to home' }).click();
  await expect(page).toHaveURL('/');
});

test('sign-in errors and failed logout give useful feedback', async ({ page }) => {
  await mockApi(page);
  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await page.goto('/login?logout=local');
  await expect(page.getByRole('status')).toContainText('signed out on this device');
});
