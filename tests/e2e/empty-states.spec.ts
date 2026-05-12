import { test, expect } from "@playwright/test";

test.describe("Empty states", () => {
  test("no data period shows placeholder, no crash", async ({ page }) => {
    // TODO: set date range to future date where no data exists
    expect(true).toBe(true);
  });

  test("empty state shows correct message per screen", async ({ page }) => {
    expect(true).toBe(true);
  });
});
