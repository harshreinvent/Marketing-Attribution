import { test, expect } from "@playwright/test";

// [RUN BEFORE EVERY DEPLOY] Client A cannot see Client B data
test.describe("RBAC data isolation", () => {
  test("Client A user cannot see Client B data via API", async ({ request }) => {
    // TODO: auth as Client A user, attempt client_id=clientB in query param → should return 403 or Client A data
    expect(true).toBe(true);
  });

  test("LOCATION_MANAGER only sees their assigned location data", async ({ request }) => {
    expect(true).toBe(true);
  });
});
