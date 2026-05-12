import { describe, it, expect, vi, beforeAll } from "vitest";

// Supertest against Hono: all 6 dashboard endpoints
describe("dashboard API endpoints", () => {
  const endpoints = [
    "/api/dashboard/executive-summary",
    "/api/dashboard/google-ads",
    "/api/dashboard/meta-ads",
    "/api/dashboard/website-organic",
    "/api/dashboard/funnel-roi",
    "/api/dashboard/gmb",
  ];

  it.each(endpoints)("GET %s requires auth", async (endpoint) => {
    // TODO: import app and use supertest/hono testClient
    expect(endpoint).toBeTruthy();
  });
});
