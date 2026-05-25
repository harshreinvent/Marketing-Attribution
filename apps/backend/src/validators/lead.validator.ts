import { z } from 'zod'

export const createLeadSchema = z.object({
  name:        z.string().optional(),
  phone:       z.string().optional(),
  email:       z.string().email().optional(),
  source:      z.enum(['GOOGLE_ADS', 'META_ADS', 'GBP', 'ORGANIC_SEARCH', 'ORGANIC_SOCIAL', 'WHATSAPP', 'DIRECT', 'REFERRAL', 'FORM', 'UNKNOWN']),
  channel:     z.enum(['GOOGLE_ADS', 'META_ADS', 'SEO_ORGANIC', 'GBP', 'ORGANIC_SOCIAL', 'WHATSAPP', 'DIRECT', 'UNKNOWN']),
  utmSource:   z.string().optional(),
  utmMedium:   z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent:  z.string().optional(),
  utmTerm:     z.string().optional(),
  gclid:       z.string().optional(),
  fbclid:      z.string().optional(),
  keyword:     z.string().optional(),
  landingPage: z.string().optional(),
  campaignId:  z.string().optional(),
  locationId:  z.string().optional(),
  notes:       z.string().optional(),
})

export const updateLeadStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'APPOINTMENT_CONFIRMED', 'SECOND_CONSULTATION', 'TREATMENT_DONE', 'SHOWED_UP', 'NOT_PICKED', 'LOST', 'UNKNOWN']),
  note:   z.string().optional(),
})

export const leadQuerySchema = z.object({
  page:        z.string().optional(),
  limit:       z.string().optional(),
  startDate:   z.string().optional(),
  endDate:     z.string().optional(),
  source:      z.string().optional(),
  channel:     z.string().optional(),
  status:      z.string().optional(),
  locationId:  z.string().optional(),
  campaignId:  z.string().optional(),
  isQualified: z.string().optional(),
})

export type CreateLeadDto        = z.infer<typeof createLeadSchema>
export type UpdateLeadStatusDto  = z.infer<typeof updateLeadStatusSchema>
