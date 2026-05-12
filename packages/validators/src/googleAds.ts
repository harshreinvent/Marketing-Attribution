import { z } from "zod";

export const googleAdsCampaignSchema = z.object({
  campaign: z.object({
    id: z.string(),
    name: z.string(),
    status: z.string(),
  }),
  metrics: z.object({
    impressions: z.string(),
    clicks: z.string(),
    cost_micros: z.string(),
    conversions: z.string(),
  }),
  segments: z.object({
    date: z.string(),
  }),
});

export const googleAdsResponseSchema = z.array(googleAdsCampaignSchema);
export type GoogleAdsCampaign = z.infer<typeof googleAdsCampaignSchema>;
