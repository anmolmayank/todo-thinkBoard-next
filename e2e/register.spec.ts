import { test, expect } from '@playwright/test';

test.describe('Register Flow', () => {
  test('should register a new user and redirect to dashboard', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'password123');

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/auth/register') && res.status() === 201),
      page.click('button[type="submit"]'),
    ]);

    expect(response.ok()).toBeTruthy();

    // ✅ Wait for redirect to dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
