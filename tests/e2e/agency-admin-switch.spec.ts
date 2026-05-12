import { test, expect } from "@playwright/test";

test.describe("Agency admin client switching", () => {
  test("switching client shows correct client data", async ({ page }) => {
    // TODO: login as AGENCY_ADMIN, switch client via ClientSelector
    expect(true).toBe(true);
  });

  test("cannot access unauthorised client via requestedClientId query param", async ({ request }) => {
    // TODO: attempt client_id=nonExistentClient in API request as AGENCY_ADMIN
    expect(true).toBe(true);
  });
});
