// ─── Auth ────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'AGENCY_MEMBER' | 'CLIENT_ADMIN' | 'CLIENT_MEMBER'
  agencyId?: string
  clientId?: string
  agency?: { id: string; name: string; slug: string }
  client?: { id: string; name: string; slug: string }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: User
}

// ─── Client ──────────────────────────────────────────────────────────

export interface Client {
  id: string
  name: string
  slug: string
  industry: string
  isActive: boolean
  websiteSplitByLocation: boolean
  agencyId: string
  createdAt: string
  services?: { service: string }[]
  _count?: { leads: number; locations: number }
}

export interface Location {
  id: string
  name: string
  city: string
  address?: string
  trackingPhone?: string
  realPhone?: string
  isActive: boolean
  clientId: string
  gmbListings?: GmbListing[]
}

export interface GmbListing {
  id: string
  listingId: string
  name: string
  trackingPhone?: string
  locationId: string
}

export interface ClientCapabilities {
  hasGoogleAds: boolean
  hasMetaAds: boolean
  hasWebsiteOrganic: boolean
  hasGmb: boolean
  hasWhatsApp: boolean
  hasSeo: boolean
  websiteSplitByLocation: boolean
  services: string[]
  locations: {
    id: string
    name: string
    city: string
    hasGmb: boolean
    gmbListings: GmbListing[]
  }[]
  locationCount: number
  totalGmbListings: number
}

// ─── Dashboard ───────────────────────────────────────────────────────

export interface ExecutiveSummary {
  totalLeads: number
  totalSpend: number
  blendedCpl: number
  appointmentsBooked: number
  metaLeads: number
  metaCpl: number
  bookingRate: number
  channelMix: { source: string; leads: number; percent: number }[]
  channelPerformance: {
    source: string
    leads: number
    percent: number
    spend: number | null
    cpl: number | null
    bookings: number | null
  }[]
  dailyLeadTrend: { date: string; leads: number }[]
  funnelSnapshot: {
    stage: string
    count: number
    dropFromPrev: number | null
    convFromLeads: number
  }[]
  stageConversionRates: {
    transition: string
    countIn: number
    countOut: number
    rate: number
    threshold: number
    status: 'GREEN' | 'RED' | 'YELLOW'
  }[]
}

export interface GoogleAdsSummary {
  hasIntegration: boolean
  cost: number
  impressions: number
  clicks: number
  ctr: number
  avgCpc: number
  conversions: number
  costPerConversion: number
  cpm: number
  roas: number
  trueRoi: number
  campaigns: {
    campaignName: string
    spend: number
    impressions: number
    clicks: number
    conversions: number
    cpa: number | null
    roas: number
  }[]
}

export interface MetaAdsSummary {
  hasIntegration: boolean
  hasAdsTable: boolean  
  metaSpend: number
  impressions: number
  clicks: number
  ctr: number
  cpl: number
  leads: number
  campaigns: { campaignName: string; spend: number; impressions: number; clicks: number; cpc: number; cpl: number }[]
  locations: { adsetName: string; spend: number; impressions: number; clicks: number; ctr: number; costPerMessage: number }[]
  ads: { adName: string; spend: number; impressions: number; clicks: number; ctr: number; costPerLinkClick: number; postEngagement: number }[]
}

export interface WebsiteSummary {
  hasIntegration: boolean
  locationName?: string
  formLeads: number
  organicSessions: number
  engagedSessions: number
  activeUsers30d: number
  leadConvRate: number
  landingPages: { landingPage: string; sessions: number; activeUsers30d: number; leads: number; leadConvRate: number; bounceRate: number }[]
  channelPerformance: { channelGroup: string; deviceCategory: string; sessions: number; activeUsers30d: number; leads: number }[]
}

export interface FunnelRoiSummary {
  totalLeads: number
  leadsReceived: number
  appointmentsConfirmed: number
  secondConsultations: number
  notContacted: number
  funnelTable: { stageName: string; totalRecords: number }[]
  channelGroupPie: { channelGroup: string; leads: number; percentage: number }[]
  sourceTable: { source: string; pipelineStageName: string; leads: number; campaigns: number }[]
  campaignPerformance: { channelGroup: string; campaign: string; medium: string; totalLeads: number }[]
  roiBlend: { source: string; pipelineLeads: number; totalContacts: number }[]
}

export interface GbpSummary {
  hasIntegration: boolean
  callClicks: number
  websiteClicks: number
  directionRequests: number
  totalProfileViews: number
  callCtr: number
  websiteCtr: number
  totalEngagement: number
  locations: {
    name: string
    callClicks: number
    websiteClicks: number
    directionRequests: number
    profileViews: number
    callCtr: number
    websiteCtr: number
    totalEngagement: number
  }[]
  dailyTrend: {
    date: string
    calls: number
    directions: number
    websiteClicks: number
  }[]
  impressionBreakdown: {
    location: string
    desktopMaps: number
    desktopSearch: number
    mobileMaps: number
    mobileSearch: number
  }[]
}

// ─── API Response ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface DateRange {
  startDate: string
  endDate: string
}