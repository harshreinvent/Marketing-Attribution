import { z } from "zod";

// [FIX 9] GHL Opportunity payload — opportunity_id is the dedupe key
export const ghlOpportunitySchema = z.object({
  id: z.string(),                          // crm_opportunity_id — dedupe key
  pipelineId: z.string().optional(),
  pipelineStageId: z.string().optional(),
  pipelineStageName: z.string().optional(),
  status: z.string().optional(),
  monetaryValue: z.number().optional(),
  contactId: z.string().optional(),
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  appointmentStatus: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ghlOpportunitiesResponseSchema = z.object({
  opportunities: z.array(ghlOpportunitySchema),
  meta: z.object({
    total: z.number().optional(),
    nextPageUrl: z.string().nullable().optional(),
    startAfter: z.number().optional(),
    startAfterId: z.string().optional(),
  }).optional(),
});

export type GhlOpportunity = z.infer<typeof ghlOpportunitySchema>;
export type GhlOpportunitiesResponse = z.infer<typeof ghlOpportunitiesResponseSchema>;
