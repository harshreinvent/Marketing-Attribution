import { KpiCard, ChartData, FilterState } from "./dashboard";

export type DashboardFilters = FilterState & {
  clientId?: string;
};

export type ExecutiveSummaryResponse = {
  kpis: KpiCard[];
  dailyTrend: ChartData[];
  channelMix: { channel: string; leads: number; spend: number }[];
  channelTable: ChannelRow[];
  funnelSnapshot: FunnelStage[];
};

export type ChannelRow = {
  channel: string;
  spend: number;
  leads: number;
  cpl: number;
  roas: number;
};

export type FunnelStage = {
  stage: string;
  count: number;
  conversionRate?: number;
};

export type GoogleAdsResponse = {
  kpis: KpiCard[];
  dailyTrend: ChartData[];
  campaigns: CampaignRow[];
};

export type CampaignRow = {
  campaignName: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  leads: number;
  cpl: number;
  roas: number;
};

export type MetaAdsResponse = {
  kpis: KpiCard[];
  dailyTrend: ChartData[];
  campaigns: CampaignRow[];
  byLocation: LocationRow[];
};

export type LocationRow = {
  locationName: string;
  spend: number;
  leads: number;
  cpl: number;
  bookingRate?: number;
};

export type WebsiteOrganicResponse = {
  kpis: KpiCard[];
  dailyTrend: ChartData[];
  landingPages: LandingPageRow[];
  byChannel: ChannelRow[];
};

export type LandingPageRow = {
  page: string;
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate?: number;
};

export type FunnelRoiResponse = {
  kpis: KpiCard[];
  funnelStages: FunnelStage[];
  bySource: FunnelSourceRow[];
  byCampaign: FunnelCampaignRow[];
};

export type FunnelSourceRow = {
  source: string;
  leads: number;
  appointments: number;
  closed: number;
  revenue: number;
  roi: number;
};

export type FunnelCampaignRow = {
  campaign: string;
  spend: number;
  leads: number;
  revenue: number;
  roi: number;
};

export type GmbResponse = {
  kpis: KpiCard[];
  dailyTrend: ChartData[];
  byLocation: GmbLocationRow[];
};

export type GmbLocationRow = {
  locationName: string;
  views: number;
  searches: number;
  calls: number;
  directionRequests: number;
  websiteClicks: number;
};

export type SyncStatusResponse = {
  clientId: string;
  lastSuccessfulSyncAt: string | null;
  syncFailureCount: number;
  isDataInitialized: boolean;
};

export type AdminSyncStatusResponse = SyncStatusResponse[];
