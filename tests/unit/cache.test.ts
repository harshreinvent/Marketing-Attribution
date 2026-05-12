import { describe, it, expect, vi } from "vitest";

describe("cache: Redis-down → non-fatal", () => {
  it("getCached returns null when Redis throws", async () => {
    vi.mock("@repo/config", () => ({
      redis: { get: vi.fn().mockRejectedValue(new Error("Redis down")) },
      env: { NODE_ENV: "test", PORT: "3001" },
    }));
    const { cacheService } = await import("../../apps/backend/src/services/cache.service");
    expect(await cacheService.getCached("key")).toBeNull();
  });
});
