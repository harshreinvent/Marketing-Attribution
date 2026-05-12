import { daysAgo, splitIntoBatches, toISODate, yesterday } from "@repo/utils";
import { describe, it, expect } from "vitest";

describe("dates", () => {
  it("daysAgo returns midnight N days ago", () => expect(daysAgo(1).getHours()).toBe(0));
  it("yesterday is before now", () => expect(yesterday().getTime()).toBeLessThan(Date.now()));
  it("splitIntoBatches chunks correctly", () =>
    expect(splitIntoBatches([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]));
  it("toISODate formats YYYY-MM-DD", () =>
    expect(toISODate(new Date("2024-01-15T00:00:00Z"))).toBe("2024-01-15"));
});
