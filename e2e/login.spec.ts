import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should log in existing user and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'test1@test.com');
    await page.fill('input[name="password"]', 'Test@1234');

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/auth/login') && res.status() === 200),
      page.click('button[type="submit"]'),
    ]);

    expect(response.ok()).toBeTruthy();

    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
