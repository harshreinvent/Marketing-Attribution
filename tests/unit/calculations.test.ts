import { calculateCPL, calculateROAS, calculateROI, calculateBookingRate } from "@repo/utils";
import { describe, it, expect } from "vitest";

describe("calculations", () => {
  it("calculateCPL: spend/leads", () => expect(calculateCPL(10000, 5)).toBe(2000));
  it("calculateCPL: 0 leads → null", () => expect(calculateCPL(10000, 0)).toBeNull());
  it("calculateROAS: revenue/spend", () => expect(calculateROAS(50000, 10000)).toBe(5));
  it("calculateROAS: 0 spend → null", () => expect(calculateROAS(50000, 0)).toBeNull());
  it("calculateROI: (revenue-spend)/spend", () => expect(calculateROI(50000, 10000)).toBe(4));
  it("calculateBookingRate: appts/leads", () => expect(calculateBookingRate(3, 10)).toBe(0.3));
});
