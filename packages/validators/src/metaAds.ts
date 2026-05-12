import { z } from "zod";

export const metaAdsCampaignSchema = z.object({
  campaign_id: z.string(),
  campaign_name: z.string(),
  date_start: z.string(),
  date_stop: z.string(),
  spend: z.string(),
  impressions: z.string(),
  clicks: z.string(),
  leads: z.string().optional(),
  actions: z
    .array(
      z.object({
        action_type: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export const metaAdsResponseSchema = z.object({
  data: z.array(metaAdsCampaignSchema),
  paging: z
    .object({
      cursors: z.object({ before: z.string(), after: z.string() }).optional(),
      next: z.string().optional(),
    })
    .optional(),
});

export type MetaAdsCampaign = z.infer<typeof metaAdsCampaignSchema>;
