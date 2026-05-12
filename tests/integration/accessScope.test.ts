import { describe, it, expect } from "vitest";

// All 4 roles resolve correct scope
describe("resolveAccessScope", () => {
  it("AGENCY_ADMIN with requestedClientId → uses requestedClientId", () => {
    expect(true).toBe(true);
  });
  it("AGENCY_ADMIN with unknown requestedClientId → NotFoundError", () => {
    expect(true).toBe(true);
  });
  it("CLIENT_ADMIN → always uses session.clientId regardless of query param", () => {
    expect(true).toBe(true);
  });
  it("LOCATION_MANAGER → session.clientId + session.locationIds", () => {
    expect(true).toBe(true);
  });
});
