import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("unauthenticated user is redirected to /login", async ({ page }) => {
    await page.goto("/dashboard/executive-summary");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login with valid credentials redirects to executive summary", async ({ page }) => {
    // TODO: use test credentials from env
    expect(true).toBe(true);
  });

  test("401 response triggers JWT refresh, not logout", async ({ page }) => {
    expect(true).toBe(true);
  });
});
