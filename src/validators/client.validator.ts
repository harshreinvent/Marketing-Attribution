import { z } from 'zod'

export const createClientSchema = z.object({
  name:                  z.string().min(1, 'Name required'),
  slug:                  z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug: lowercase, numbers, hyphens only'),
  industry:              z.string().default('healthcare'),
  agencyId:              z.string().optional(),
  websiteSplitByLocation: z.boolean().default(false),
})

export const updateClientSchema = z.object({
  name:                  z.string().min(1).optional(),
  industry:              z.string().optional(),
  isActive:              z.boolean().optional(),
  websiteSplitByLocation: z.boolean().optional(),
})

export const createLocationSchema = z.object({
  name:          z.string().min(1, 'Location name required'),
  city:          z.string().default(''),
  address:       z.string().optional(),
  trackingPhone: z.string().optional(),
  realPhone:     z.string().optional(),
  slug:          z.string().optional(),
})

export const createGmbListingSchema = z.object({
  listingId:     z.string().min(1, 'Google Business Profile listing ID required'),
  name:          z.string().min(1, 'GMB listing name required'),
  address:       z.string().optional(),
  trackingPhone: z.string().optional(),
  realPhone:     z.string().optional(),
})

export const configureServicesSchema = z.object({
  services: z
    .array(z.enum(['GOOGLE_ADS', 'META_ADS', 'WEBSITE_ORGANIC', 'GMB', 'WHATSAPP', 'SEO']))
    .min(1, 'At least one service required'),
})

export const toggleServiceSchema = z.object({
  isActive: z.boolean(),
  notes:    z.string().optional(),
})

export const createIntegrationSchema = z.object({
  provider: z.enum([
    'GOOGLE_ADS', 'META_ADS', 'GOOGLE_ANALYTICS',
    'GOOGLE_SEARCH_CONSOLE', 'GMB', 'CRM',
    'CALLHIPPO', 'EXOTEL', 'GOHIGHLEVEL',
  ]),
  accessToken:  z.string().optional(),
  refreshToken: z.string().optional(),
  accountId:    z.string().optional(),
  extraConfig:  z.record(z.unknown()).optional(),
})

export type CreateClientDto       = z.infer<typeof createClientSchema>
export type UpdateClientDto       = z.infer<typeof updateClientSchema>
export type CreateLocationDto     = z.infer<typeof createLocationSchema>
export type CreateGmbListingDto   = z.infer<typeof createGmbListingSchema>
export type ConfigureServicesDto  = z.infer<typeof configureServicesSchema>
export type CreateIntegrationDto  = z.infer<typeof createIntegrationSchema>
