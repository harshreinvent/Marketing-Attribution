import { buildTenantWhere } from "@repo/db";
import { describe, it, expect } from "vitest";
import type { TenantScope } from "@repo/db";

describe("buildTenantWhere", () => {
  it("AGENCY_ADMIN → empty where (no filter)", () => {
    const scope: TenantScope = { clientId: "c1", role: "AGENCY_ADMIN" };
    expect(buildTenantWhere(scope)).toEqual({});
  });
  it("CLIENT_ADMIN → client_id filter", () => {
    const scope: TenantScope = { clientId: "c1", role: "CLIENT_ADMIN" };
    expect(buildTenantWhere(scope)).toEqual({ client_id: "c1" });
  });
  it("LOCATION_MANAGER → client_id + location_id in", () => {
    const scope: TenantScope = { clientId: "c1", locationIds: ["l1", "l2"], role: "LOCATION_MANAGER" };
    expect(buildTenantWhere(scope)).toEqual({ client_id: "c1", location_id: { in: ["l1", "l2"] } });
  });
  it("VIEWER → same as CLIENT_ADMIN", () => {
    const scope: TenantScope = { clientId: "c1", role: "VIEWER" };
    expect(buildTenantWhere(scope)).toEqual({ client_id: "c1" });
  });
});
