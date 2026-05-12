import { formatCurrency, formatNumber, formatPercent } from "@repo/utils";
import { describe, it, expect } from "vitest";

describe("format", () => {
  it("formatCurrency uses INR locale", () => expect(formatCurrency(50000)).toContain("50,000"));
  it("formatCurrency null → —", () => expect(formatCurrency(null)).toBe("—"));
  it("formatPercent multiplies by 100", () => expect(formatPercent(0.25)).toBe("25.0%"));
  it("formatNumber null → —", () => expect(formatNumber(null)).toBe("—"));
});
