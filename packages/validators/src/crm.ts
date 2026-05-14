import { z } from "zod";

// ── GHL Contacts ──────────────────────────────────────────────────────────────

const ghlAttributionSourceSchema = z.object({
  url:        z.string().optional(),
  campaign:   z.string().nullable().optional(),
  utmSource:  z.string().nullable().optional(),
  utmMedium:  z.string().nullable().optional(),
  utmContent: z.string().nullable().optional(),
  referrer:   z.string().nullable().optional(),
  campaignId: z.string().nullable().optional(),
  medium:     z.string().nullable().optional(),
  fbclid:     z.string().nullable().optional(),
  gclid:      z.string().nullable().optional(),
}).optional();

export const ghlContactSchema = z.object({
  id:                z.string(),
  dateAdded:         z.string(),
  dateUpdated:       z.string().optional(),
  source:            z.string().nullable().optional(),
  attributionSource: ghlAttributionSourceSchema,
});

export const ghlContactsResponseSchema = z.object({
  contacts: z.array(ghlContactSchema),
  count:    z.number().optional(),
  total:    z.number().optional(),
  meta: z.object({
    total:        z.number().optional(),
    startAfterId: z.string().nullable().optional(),  // contact ID — used with startAfter to get next page
    startAfter:   z.number().nullable().optional(),  // ms timestamp — used with startAfterId to get next page
  }).optional(),
});

export type GhlContact = z.infer<typeof ghlContactSchema>;
export type GhlContactsResponse = z.infer<typeof ghlContactsResponseSchema>;

// ── GHL Opportunities ────────────────────────────────────────────────────────

export const ghlOpportunitySchema = z.object({
  id:                  z.string(),
  pipelineId:          z.string().nullable().optional(),
  pipelineStageId:     z.string().nullable().optional(),
  pipelineStageName:   z.string().nullable().optional(),
  status:              z.string().nullable().optional(),
  monetaryValue:       z.number().nullable().optional(),
  contactId:           z.string().nullable().optional(),
  source:              z.string().nullable().optional(),
  medium:              z.string().nullable().optional(),
  campaign:            z.string().nullable().optional(),
  appointmentStatus:   z.string().nullable().optional(),
  createdAt:           z.string(),
  updatedAt:           z.string(),
});

export const ghlOpportunitiesResponseSchema = z.object({
  opportunities: z.array(ghlOpportunitySchema),
  meta: z.object({
    total:        z.number().optional(),
    nextPageUrl:  z.string().nullable().optional(),
    startAfter:   z.number().nullable().optional(),
    startAfterId: z.string().nullable().optional(),
  }).optional(),
});

export type GhlOpportunity = z.infer<typeof ghlOpportunitySchema>;
export type GhlOpportunitiesResponse = z.infer<typeof ghlOpportunitiesResponseSchema>;
