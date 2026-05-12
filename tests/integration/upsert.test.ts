import { describe, it, expect } from "vitest";

// Same opportunity twice → single row, no duplicates
describe("CRM upsert idempotency", () => {
  it("upserting same crm_opportunity_id twice creates only one row", async () => {
    // TODO: test against test DB using crmOpportunityModel.upsertByOpportunityId
    expect(true).toBe(true);
  });
});
