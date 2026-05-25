import { Request } from 'express'
import { UserRole } from '../generated/prisma'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId:   string
  email:    string
  role:     UserRole
  agencyId?: string
  clientId?: string
}

export interface AuthRequest extends Request {
  user?: JwtPayload
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?:   T
  meta?:   PaginationMeta
}

export interface PaginationMeta {
  total:      number
  page:       number
  limit:      number
  totalPages: number
  hasNext:    boolean
  hasPrev:    boolean
}

// ─── Query helpers ────────────────────────────────────────────────────────────

export interface DateRangeQuery {
  startDate?: string
  endDate?:   string
}

export interface PaginationQuery extends DateRangeQuery {
  page?:  string
  limit?: string
}

// ─── Client Capabilities ──────────────────────────────────────────────────────

export interface ClientCapabilities {
  hasGoogleAds:          boolean
  hasMetaAds:            boolean
  hasWebsiteOrganic:     boolean
  hasGmb:                boolean
  hasWhatsApp:           boolean
  hasSeo:                boolean
  websiteSplitByLocation: boolean
  services:              string[]
  locations: {
    id:           string
    name:         string
    city:         string
    hasGmb:       boolean
    gmbListings:  { id: string; listingId: string; name: string; trackingPhone: string | null }[]
  }[]
  locationCount:    number
  totalGmbListings: number
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface ExecutiveSummary {
  totalLeads:         number
  totalSpend:         number
  blendedCpl:         number
  appointmentsBooked: number
  metaLeads:          number
  metaCpl:            number
  bookingRate:        number
  channelMix: { source: string; leads: number; percent: number }[]
  channelPerformance: {
    source:   string
    leads:    number
    percent:  number
    spend:    number | null
    cpl:      number | null
    bookings: number | null
  }[]
  dailyLeadTrend:    { date: string; leads: number }[]
  funnelSnapshot: {
    stage:         string
    count:         number
    dropFromPrev:  number | null
    convFromLeads: number
  }[]
  stageConversionRates: {
    transition: string
    countIn:    number
    countOut:   number
    rate:       number
    threshold:  number
    status:     'GREEN' | 'RED' | 'YELLOW'
  }[]
}

export interface GoogleAdsSummary {
  hasIntegration:    boolean
  cost:              number
  impressions:       number
  clicks:            number
  ctr:               number
  avgCpc:            number
  conversions:       number
  costPerConversion: number
  cpm:               number
  roas:              number
  trueRoi:           number
  campaigns: {
    campaignName: string
    spend:        number
    impressions:  number
    clicks:       number
    conversions:  number
    cpa:          number | null
    roas:         number
  }[]
}

export interface MetaAdsSummary {
  hasIntegration: boolean
  hasAdsTable:    boolean
  metaSpend:      number
  impressions:    number
  clicks:         number
  ctr:            number
  cpl:            number
  leads:          number
  campaigns: { campaignName: string; spend: number; impressions: number; clicks: number; cpc: number; cpl: number }[]
  locations: { adsetName: string; spend: number; impressions: number; clicks: number; ctr: number; costPerMessage: number }[]
  ads: { adName: string; spend: number; impressions: number; clicks: number; ctr: number; costPerLinkClick: number; postEngagement: number }[]
}

export interface WebsiteSummary {
  hasIntegration:  boolean
  locationName?:   string
  formLeads:       number
  organicSessions: number
  engagedSessions: number
  activeUsers30d:  number
  leadConvRate:    number
  landingPages: {
    landingPage:   string
    sessions:      number
    activeUsers30d: number
    leads:         number
    leadConvRate:  number
    bounceRate:    number
  }[]
  channelPerformance: {
    channelGroup:  string
    deviceCategory: string
    sessions:      number
    activeUsers30d: number
    leads:         number
  }[]
}

export interface FunnelRoiSummary {
  totalLeads:              number
  leadsReceived:           number
  appointmentsConfirmed:   number
  secondConsultations:     number
  notContacted:            number
  funnelTable:             { stageName: string; totalRecords: number }[]
  channelGroupPie:         { channelGroup: string; leads: number; percentage: number }[]
  sourceTable:             { source: string; pipelineStageName: string; leads: number; campaigns: number }[]
  campaignPerformance:     { channelGroup: string; campaign: string; medium: string; totalLeads: number }[]
  roiBlend:                { source: string; pipelineLeads: number; totalContacts: number }[]
}

// ─── Webhook payloads ─────────────────────────────────────────────────────────

export interface ExotelCallPayload {
  CallSid:        string
  From:           string
  To:             string
  Direction:      string
  Status:         string
  Duration:       string
  RecordingUrl?:  string
  CustomField?:   string  // JSON: { utm_source, gclid, fbclid, keyword }
}

export interface GhlLeadPayload {
  contactId:     string
  firstName?:    string
  lastName?:     string
  phone?:        string
  email?:        string
  source?:       string
  customFields?: Record<string, string>
  locationId?:   string
}
