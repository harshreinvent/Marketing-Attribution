import db from '../config/db'
import { ChannelType, LeadStatus } from '../generated/prisma'
import { toPercent, toFixed } from '../helpers/pagination'
import { FUNNEL_THRESHOLDS } from '../constants'
import {
  ExecutiveSummary, GoogleAdsSummary, MetaAdsSummary, WebsiteSummary, FunnelRoiSummary,
} from '../types'

// ─── Executive Summary ────────────────────────────────────────────────────────

export const getExecutiveSummary = async (
  clientId: string, startDate: Date, endDate: Date
): Promise<ExecutiveSummary> => {
  const dateFilter = { gte: startDate, lte: endDate }

  const [leads, campaignMetrics, funnelGroups] = await Promise.all([
    db.lead.findMany({
      where: { clientId, createdAt: dateFilter },
      include: { campaign: { select: { channel: true } } },
    }),
    db.campaignMetric.findMany({
      where: { campaign: { clientId }, date: dateFilter },
      include: { campaign: { select: { channel: true } } },
    }),
    db.lead.groupBy({
      by: ['status'],
      where: { clientId, createdAt: dateFilter },
      _count: { id: true },
    }),
  ])

  const totalLeads = leads.length
  const totalSpend = campaignMetrics.reduce((sum, m) => sum + m.spend, 0)
  const blendedCpl = totalLeads > 0 ? toFixed(totalSpend / totalLeads) : 0

  const metaLeads = leads.filter(l => l.channel === ChannelType.META_ADS).length
  const metaSpend = campaignMetrics
    .filter(m => m.campaign.channel === ChannelType.META_ADS)
    .reduce((sum, m) => sum + m.spend, 0)
  const metaCpl = metaLeads > 0 ? toFixed(metaSpend / metaLeads) : 0

  const booked = leads.filter(
    l => l.status === LeadStatus.APPOINTMENT_CONFIRMED || l.status === LeadStatus.SHOWED_UP
  ).length
  const bookingRate = toPercent(booked, totalLeads)

  // Channel mix
  const sourceMap: Record<string, number> = {}
  for (const lead of leads) {
    const key = lead.utmSource || lead.source
    sourceMap[key] = (sourceMap[key] || 0) + 1
  }
  const channelMix = Object.entries(sourceMap)
    .sort(([, a], [, b]) => b - a)
    .map(([source, count]) => ({ source, leads: count, percent: toPercent(count, totalLeads) }))

  // Channel performance
  const perfMap: Record<string, { leads: number; spend: number; bookings: number }> = {}
  for (const lead of leads) {
    const ch = lead.channel
    if (!perfMap[ch]) perfMap[ch] = { leads: 0, spend: 0, bookings: 0 }
    perfMap[ch].leads += 1
    if (lead.status === LeadStatus.APPOINTMENT_CONFIRMED) perfMap[ch].bookings += 1
  }
  for (const m of campaignMetrics) {
    const ch = m.campaign.channel
    if (!perfMap[ch]) perfMap[ch] = { leads: 0, spend: 0, bookings: 0 }
    perfMap[ch].spend += m.spend
  }
  const channelPerformance = Object.entries(perfMap).map(([source, d]) => ({
    source, leads: d.leads, percent: toPercent(d.leads, totalLeads),
    spend: d.spend || null,
    cpl: d.leads > 0 && d.spend > 0 ? toFixed(d.spend / d.leads) : null,
    bookings: d.bookings || null,
  }))

  // Daily trend
  const dailyMap: Record<string, number> = {}
  for (const lead of leads) {
    const day = lead.createdAt.toISOString().split('T')[0]
    dailyMap[day] = (dailyMap[day] || 0) + 1
  }
  const dailyLeadTrend = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, leads: count }))

  // Funnel snapshot
  const stageMap: Record<string, number> = {}
  for (const g of funnelGroups) stageMap[g.status] = g._count.id
  const stageOrder = ['NEW', 'APPOINTMENT_CONFIRMED', 'SECOND_CONSULTATION', 'NOT_PICKED', 'TREATMENT_DONE', 'SHOWED_UP']
  const funnelSnapshot = stageOrder.map((stage, i) => {
    const count = stageMap[stage] || 0
    const prevCount = i === 0 ? totalLeads : (stageMap[stageOrder[i - 1]] || 0)
    return {
      stage, count,
      dropFromPrev: i > 0 && prevCount > 0 ? toPercent(prevCount - count, prevCount) : null,
      convFromLeads: toPercent(count, totalLeads),
    }
  })

  const apptRate = toPercent(booked, totalLeads)
  const stageConversionRates = [{
    transition: 'Leads received → Appointment',
    countIn: totalLeads, countOut: booked, rate: apptRate,
    threshold: FUNNEL_THRESHOLDS.LEADS_TO_APPOINTMENT,
    status: apptRate >= FUNNEL_THRESHOLDS.LEADS_TO_APPOINTMENT ? ('GREEN' as const) : ('RED' as const),
  }]

  return {
    totalLeads, totalSpend, blendedCpl, appointmentsBooked: booked,
    metaLeads, metaCpl, bookingRate,
    channelMix, channelPerformance, dailyLeadTrend, funnelSnapshot, stageConversionRates,
  }
}

// ─── Google Ads ───────────────────────────────────────────────────────────────

export const getGoogleAdsSummary = async (
  clientId: string, startDate: Date, endDate: Date
): Promise<GoogleAdsSummary> => {
  const integration = await db.integration.findFirst({
    where: { clientId, provider: 'GOOGLE_ADS', isActive: true },
  })

  if (!integration) {
    return {
      hasIntegration: false, cost: 0, impressions: 0, clicks: 0, ctr: 0, avgCpc: 0,
      conversions: 0, costPerConversion: 0, cpm: 0, roas: 0, trueRoi: 0, campaigns: [],
    }
  }

  const metrics = await db.campaignMetric.findMany({
    where: { campaign: { clientId, channel: ChannelType.GOOGLE_ADS }, date: { gte: startDate, lte: endDate } },
    include: { campaign: { select: { id: true, name: true } } },
  })

  const totals = metrics.reduce(
    (acc, m) => ({
      cost: acc.cost + m.spend, impressions: acc.impressions + m.impressions,
      clicks: acc.clicks + m.clicks, conversions: acc.conversions + m.conversions,
    }),
    { cost: 0, impressions: 0, clicks: 0, conversions: 0 }
  )

  const campMap: Record<string, { name: string; spend: number; impressions: number; clicks: number; conversions: number }> = {}
  for (const m of metrics) {
    if (!campMap[m.campaignId]) campMap[m.campaignId] = { name: m.campaign.name, spend: 0, impressions: 0, clicks: 0, conversions: 0 }
    campMap[m.campaignId].spend += m.spend
    campMap[m.campaignId].impressions += m.impressions
    campMap[m.campaignId].clicks += m.clicks
    campMap[m.campaignId].conversions += m.conversions
  }

  return {
    hasIntegration: true,
    cost: toFixed(totals.cost), impressions: totals.impressions, clicks: totals.clicks,
    ctr: toPercent(totals.clicks, totals.impressions, 2),
    avgCpc: totals.clicks > 0 ? toFixed(totals.cost / totals.clicks) : 0,
    conversions: totals.conversions,
    costPerConversion: totals.conversions > 0 ? toFixed(totals.cost / totals.conversions) : 0,
    cpm: totals.impressions > 0 ? toFixed((totals.cost / totals.impressions) * 1000) : 0,
    roas: 0, trueRoi: -100,
    campaigns: Object.values(campMap).sort((a, b) => b.spend - a.spend).map(c => ({
      campaignName: c.name, spend: toFixed(c.spend), impressions: c.impressions,
      clicks: c.clicks, conversions: c.conversions,
      cpa: c.conversions > 0 ? toFixed(c.spend / c.conversions) : null, roas: 0,
    })),
  }
}

// ─── Meta Ads ─────────────────────────────────────────────────────────────────

export const getMetaAdsSummary = async (
  clientId: string, startDate: Date, endDate: Date
): Promise<MetaAdsSummary> => {
  const integration = await db.integration.findFirst({
    where: { clientId, provider: 'META_ADS', isActive: true },
  })

  if (!integration) {
    return {
      hasIntegration: false, hasAdsTable: false,
      metaSpend: 0, impressions: 0, clicks: 0, ctr: 0, cpl: 0, leads: 0,
      campaigns: [], locations: [], ads: [],
    }
  }

  const dateFilter  = { gte: startDate, lte: endDate }
  const metaChannel = { clientId, channel: ChannelType.META_ADS }

  const [campaignMetrics, adSetMetrics, adMetrics, leadsCount] = await Promise.all([
    db.campaignMetric.findMany({
      where: { campaign: metaChannel, date: dateFilter },
      include: { campaign: { select: { id: true, name: true } } },
    }),
    db.adSetMetric.findMany({
      where: { adSet: { campaign: metaChannel }, date: dateFilter },
      include: { adSet: { select: { id: true, name: true } } },
    }),
    db.adMetric.findMany({
      where: { ad: { adSet: { campaign: metaChannel } }, date: dateFilter },
      include: { ad: { select: { id: true, name: true } } },
    }),
    db.lead.count({ where: { clientId, channel: ChannelType.META_ADS, createdAt: dateFilter } }),
  ])

  const totals = campaignMetrics.reduce(
    (acc, m) => ({ spend: acc.spend + m.spend, impressions: acc.impressions + m.impressions, clicks: acc.clicks + m.clicks }),
    { spend: 0, impressions: 0, clicks: 0 }
  )

  const campMap: Record<string, { name: string; spend: number; impressions: number; clicks: number; leads: number }> = {}
  for (const m of campaignMetrics) {
    if (!campMap[m.campaignId]) campMap[m.campaignId] = { name: m.campaign.name, spend: 0, impressions: 0, clicks: 0, leads: 0 }
    campMap[m.campaignId].spend += m.spend; campMap[m.campaignId].impressions += m.impressions
    campMap[m.campaignId].clicks += m.clicks; campMap[m.campaignId].leads += m.leads
  }

  const asMap: Record<string, { name: string; spend: number; impressions: number; clicks: number; leads: number }> = {}
  for (const m of adSetMetrics) {
    if (!asMap[m.adSetId]) asMap[m.adSetId] = { name: m.adSet.name, spend: 0, impressions: 0, clicks: 0, leads: 0 }
    asMap[m.adSetId].spend += m.spend; asMap[m.adSetId].impressions += m.impressions
    asMap[m.adSetId].clicks += m.clicks; asMap[m.adSetId].leads += m.leads
  }

  const adMap: Record<string, { name: string; spend: number; impressions: number; clicks: number; postEngagement: number }> = {}
  for (const m of adMetrics) {
    if (!adMap[m.adId]) adMap[m.adId] = { name: m.ad.name, spend: 0, impressions: 0, clicks: 0, postEngagement: 0 }
    adMap[m.adId].spend += m.spend; adMap[m.adId].impressions += m.impressions
    adMap[m.adId].clicks += m.clicks; adMap[m.adId].postEngagement += m.postEngagement || 0
  }

  return {
    hasIntegration: true, hasAdsTable: adMetrics.length > 0,
    metaSpend: toFixed(totals.spend), impressions: totals.impressions, clicks: totals.clicks,
    ctr: toPercent(totals.clicks, totals.impressions, 2),
    cpl: leadsCount > 0 ? toFixed(totals.spend / leadsCount) : 0, leads: leadsCount,
    campaigns: Object.values(campMap).sort((a, b) => b.spend - a.spend).map(c => ({
      campaignName: c.name, spend: toFixed(c.spend), impressions: c.impressions,
      clicks: c.clicks, cpc: c.clicks > 0 ? toFixed(c.spend / c.clicks) : 0,
      cpl: c.leads > 0 ? toFixed(c.spend / c.leads) : 0,
    })),
    locations: Object.values(asMap).sort((a, b) => b.spend - a.spend).map(a => ({
      adsetName: a.name, spend: toFixed(a.spend), impressions: a.impressions, clicks: a.clicks,
      ctr: toPercent(a.clicks, a.impressions, 2),
      costPerMessage: a.clicks > 0 ? toFixed(a.spend / a.clicks) : 0,
    })),
    ads: Object.values(adMap).sort((a, b) => b.spend - a.spend).map(a => ({
      adName: a.name, spend: toFixed(a.spend), impressions: a.impressions, clicks: a.clicks,
      ctr: toPercent(a.clicks, a.impressions, 2),
      costPerLinkClick: a.clicks > 0 ? toFixed(a.spend / a.clicks) : 0,
      postEngagement: a.postEngagement,
    })),
  }
}

// ─── Website / Organic ────────────────────────────────────────────────────────

export const getWebsiteSummary = async (
  clientId: string, startDate: Date, endDate: Date, _locationId?: string
): Promise<WebsiteSummary> => {
  const integration = await db.integration.findFirst({
    where: { clientId, provider: 'GOOGLE_ANALYTICS', isActive: true },
  })

  if (!integration) {
    return {
      hasIntegration: false, formLeads: 0, organicSessions: 0,
      engagedSessions: 0, activeUsers30d: 0, leadConvRate: 0,
      landingPages: [], channelPerformance: [],
    }
  }

  const dateFilter = { gte: startDate, lte: endDate }

  // ── Totals from daily overview ────────────────────────────────────────────
  const overviewRows = await db.ga4DailyOverview.findMany({
    where: { clientId, date: dateFilter },
  })

  const totals = overviewRows.reduce(
    (acc, r) => ({
      sessions:        acc.sessions        + r.sessions,
      engagedSessions: acc.engagedSessions + r.engagedSessions,
      activeUsers:     acc.activeUsers     + r.activeUsers,
      keyEvents:       acc.keyEvents       + r.keyEvents,
    }),
    { sessions: 0, engagedSessions: 0, activeUsers: 0, keyEvents: 0 }
  )

  // ── Channel breakdown ─────────────────────────────────────────────────────
  const channelRows = await db.ga4ChannelMetrics.findMany({
    where: { clientId, date: dateFilter },
  })

  const chMap: Record<string, { sessions: number; users: number; keyEvents: number }> = {}
  for (const r of channelRows) {
    const key = r.channelGroup || 'Unknown'
    if (!chMap[key]) chMap[key] = { sessions: 0, users: 0, keyEvents: 0 }
    chMap[key].sessions  += r.sessions
    chMap[key].users     += r.activeUsers
    chMap[key].keyEvents += r.keyEvents
  }

  // ── Landing pages ─────────────────────────────────────────────────────────
  const landingRows = await db.ga4LandingPageMetrics.findMany({
    where: { clientId, date: dateFilter },
  })

  const pageMap: Record<string, { sessions: number; users: number; keyEvents: number }> = {}
  for (const r of landingRows) {
    const pg = r.landingPage || '/'
    if (!pageMap[pg]) pageMap[pg] = { sessions: 0, users: 0, keyEvents: 0 }
    pageMap[pg].sessions  += r.sessions
    pageMap[pg].users     += r.activeUsers
    pageMap[pg].keyEvents += r.keyEvents
  }

  return {
    hasIntegration:  true,
    formLeads:       totals.keyEvents,
    organicSessions: totals.sessions,
    engagedSessions: totals.engagedSessions,
    activeUsers30d:  totals.activeUsers,
    leadConvRate:    toPercent(totals.keyEvents, totals.sessions, 2),
    landingPages: Object.entries(pageMap)
      .sort(([, a], [, b]) => b.sessions - a.sessions)
      .slice(0, 20)
      .map(([page, d]) => ({
        landingPage:    page,
        sessions:       d.sessions,
        activeUsers30d: d.users,
        leads:          d.keyEvents,
        leadConvRate:   toPercent(d.keyEvents, d.sessions, 2),
        bounceRate:     0,
      })),
    channelPerformance: Object.entries(chMap)
      .sort(([, a], [, b]) => b.sessions - a.sessions)
      .map(([channelGroup, d]) => ({
        channelGroup,
        deviceCategory: 'all',
        sessions:       d.sessions,
        activeUsers30d: d.users,
        leads:          d.keyEvents,
      })),
  }
}

// ─── GMB ─────────────────────────────────────────────────────────────────────

export const getGmbSummary = async (clientId: string, startDate: Date, endDate: Date) => {
  const dateFilter = { gte: startDate, lte: endDate }

  const rows = await db.gmbDaily.findMany({
    where:   { clientId, date: dateFilter },
    include: { listing: { include: { location: { select: { name: true, city: true } } } } },
  })

  if (rows.length === 0) {
    return {
      hasData:          false,
      totalImpressions: 0,
      totalCalls:       0,
      totalDirections:  0,
      totalWebsiteClicks: 0,
      byListing: [],
      dailyTrend: [],
    }
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  const totals = rows.reduce(
    (acc, r) => ({
      impressions: acc.impressions +
        r.impressionsDesktopMaps + r.impressionsDesktopSearch +
        r.impressionsMobileMaps  + r.impressionsMobileSearch,
      calls:         acc.calls         + r.callClicks,
      directions:    acc.directions    + r.directionRequests,
      websiteClicks: acc.websiteClicks + r.websiteClicks,
    }),
    { impressions: 0, calls: 0, directions: 0, websiteClicks: 0 }
  )

  // ── Per-listing breakdown ─────────────────────────────────────────────────
  const listingMap: Record<string, {
    listingId: string; name: string; location: string
    impressions: number; calls: number; directions: number; websiteClicks: number
  }> = {}

  for (const r of rows) {
    const key = r.listingId
    if (!listingMap[key]) {
      listingMap[key] = {
        listingId:     r.listing.listingId,
        name:          r.listing.name,
        location:      r.listing.location.name,
        impressions:   0, calls: 0, directions: 0, websiteClicks: 0,
      }
    }
    listingMap[key].impressions   += r.impressionsDesktopMaps + r.impressionsDesktopSearch + r.impressionsMobileMaps + r.impressionsMobileSearch
    listingMap[key].calls         += r.callClicks
    listingMap[key].directions    += r.directionRequests
    listingMap[key].websiteClicks += r.websiteClicks
  }

  // ── Daily trend (aggregate all listings) ─────────────────────────────────
  const trendMap: Record<string, { impressions: number; calls: number; directions: number; websiteClicks: number }> = {}
  for (const r of rows) {
    const iso = r.date.toISOString().split('T')[0]
    if (!trendMap[iso]) trendMap[iso] = { impressions: 0, calls: 0, directions: 0, websiteClicks: 0 }
    trendMap[iso].impressions   += r.impressionsDesktopMaps + r.impressionsDesktopSearch + r.impressionsMobileMaps + r.impressionsMobileSearch
    trendMap[iso].calls         += r.callClicks
    trendMap[iso].directions    += r.directionRequests
    trendMap[iso].websiteClicks += r.websiteClicks
  }

  return {
    hasData:            true,
    totalImpressions:   totals.impressions,
    totalCalls:         totals.calls,
    totalDirections:    totals.directions,
    totalWebsiteClicks: totals.websiteClicks,
    byListing: Object.values(listingMap).sort((a, b) => b.impressions - a.impressions),
    dailyTrend: Object.entries(trendMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, d]) => ({ date, ...d })),
  }
}

// ─── Funnel & ROI ─────────────────────────────────────────────────────────────

export const getFunnelRoi = async (
  clientId: string, startDate: Date, endDate: Date
): Promise<FunnelRoiSummary> => {
  const dateFilter = { gte: startDate, lte: endDate }

  const [leads, roiBlendData] = await Promise.all([
    db.lead.findMany({
      where: { clientId, createdAt: dateFilter },
      include: { campaign: { select: { id: true, name: true } } },
    }),
    db.roiBlend.findMany({ where: { clientId, date: dateFilter } }),
  ])

  const totalLeads = leads.length

  const stageGroups: Record<string, number> = {}
  for (const l of leads) stageGroups[l.status] = (stageGroups[l.status] || 0) + 1
  const funnelTable = Object.entries(stageGroups)
    .sort(([, a], [, b]) => b - a)
    .map(([stageName, totalRecords]) => ({ stageName, totalRecords }))

  const channelMap: Record<string, number> = {}
  for (const l of leads) channelMap[l.channel] = (channelMap[l.channel] || 0) + 1
  const channelGroupPie = Object.entries(channelMap).map(([channelGroup, count]) => ({
    channelGroup, leads: count, percentage: toPercent(count, totalLeads),
  }))

  const sourceStageMap: Record<string, Record<string, number>> = {}
  for (const l of leads) {
    const src = l.utmSource || l.source
    if (!sourceStageMap[src]) sourceStageMap[src] = {}
    sourceStageMap[src][l.status] = (sourceStageMap[src][l.status] || 0) + 1
  }
  const sourceTable = Object.entries(sourceStageMap).flatMap(([source, stages]) =>
    Object.entries(stages).map(([pipelineStageName, count]) => ({
      source, pipelineStageName, leads: count, campaigns: 1,
    }))
  )

  const campMap: Record<string, { channel: string; name: string; medium: string; leads: number }> = {}
  for (const l of leads) {
    if (!l.campaign || !l.campaignId) continue
    if (!campMap[l.campaignId]) campMap[l.campaignId] = {
      channel: l.channel, name: l.campaign.name, medium: l.utmMedium || 'unknown', leads: 0,
    }
    campMap[l.campaignId].leads += 1
  }

  const roiMap: Record<string, { pipelineLeads: number; totalContacts: number }> = {}
  for (const r of roiBlendData) {
    if (!roiMap[r.channel]) roiMap[r.channel] = { pipelineLeads: 0, totalContacts: 0 }
    roiMap[r.channel].pipelineLeads += r.qualifiedLeads
    roiMap[r.channel].totalContacts += r.totalLeads
  }

  return {
    totalLeads,
    leadsReceived:         leads.filter(l => l.status !== LeadStatus.UNKNOWN).length,
    appointmentsConfirmed: leads.filter(l => l.status === LeadStatus.APPOINTMENT_CONFIRMED).length,
    secondConsultations:   leads.filter(l => l.status === LeadStatus.SECOND_CONSULTATION).length,
    notContacted:          leads.filter(l => l.status === LeadStatus.NOT_PICKED).length,
    funnelTable, channelGroupPie, sourceTable,
    campaignPerformance: Object.values(campMap).sort((a, b) => b.leads - a.leads).map(c => ({
      channelGroup: c.channel, campaign: c.name, medium: c.medium, totalLeads: c.leads,
    })),
    roiBlend: Object.entries(roiMap).map(([source, d]) => ({
      source, pipelineLeads: d.pipelineLeads, totalContacts: d.totalContacts,
    })),
  }
}
