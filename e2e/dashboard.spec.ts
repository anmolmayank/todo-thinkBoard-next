import { test, expect } from "@playwright/test";

test.describe("Dashboard Authentication", () => {
  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/login|register/);
  });
  test("allows logged-in user to view dashboard", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });

    await page.fill('input[placeholder="username"]', "test1@test.com");
    await page.fill('input[placeholder="password"]', "Test@1234");
    await page.click('button:has-text("Login")');

    // Wait for navigation to dashboard
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Confirm dashboard content
    await expect(page.locator("h1")).toHaveText(/dashboard/i);
  });
});
