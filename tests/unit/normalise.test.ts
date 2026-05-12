import { normaliseCampaignName, slugifySource, normaliseText } from "@repo/utils";
import { describe, it, expect } from "vitest";

describe("normalise", () => {
  it("normaliseCampaignName strips special chars", () =>
    expect(normaliseCampaignName("Brand Campaign! 2024")).toBe("brand_campaign_2024"));
  it("slugifySource lowercases and underscores", () =>
    expect(slugifySource("Google Ads")).toBe("google_ads"));
  it("normaliseText trims and collapses whitespace", () =>
    expect(normaliseText("  hello   world  ")).toBe("hello world"));
});
