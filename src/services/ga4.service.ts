import { google } from 'googleapis'
import { googleOAuthService } from './googleOAuth.service'
import { parseGa4Rows, parseGa4Date, cleanDimension } from '../utils/parseGa4Rows'

const analyticsdata = google.analyticsdata('v1beta')

async function runReport(
  propertyId: string,
  startDate:  string,
  endDate:    string,
  dimensions: string[],
  metrics:    string[]
) {
  const auth     = await googleOAuthService.getAuthenticatedClient()
  const response = await analyticsdata.properties.runReport({
    property: `properties/${propertyId}`,
    auth,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: dimensions.map(name => ({ name })),
      metrics:    metrics.map(name => ({ name })),
    },
  })

  const dimHeaders = (response.data.dimensionHeaders || []).map(h => h.name!)
  const metHeaders = (response.data.metricHeaders   || []).map(h => h.name!)

  return parseGa4Rows(response.data.rows || [], dimHeaders, metHeaders)
}

export async function fetchDailyOverview(propertyId: string, startDate: string, endDate: string) {
  const rows = await runReport(propertyId, startDate, endDate,
    ['date'],
    ['sessions', 'activeUsers', 'newUsers', 'engagedSessions', 'engagementRate', 'eventCount', 'keyEvents']
  )
  return rows.map(r => ({
    date:            parseGa4Date(r.dimensions.date),
    sessions:        Math.round(r.metrics.sessions),
    activeUsers:     Math.round(r.metrics.activeUsers),
    newUsers:        Math.round(r.metrics.newUsers),
    engagedSessions: Math.round(r.metrics.engagedSessions),
    engagementRate:  r.metrics.engagementRate,
    eventCount:      Math.round(r.metrics.eventCount),
    keyEvents:       Math.round(r.metrics.keyEvents),
  }))
}

export async function fetchChannelMetrics(propertyId: string, startDate: string, endDate: string) {
  const rows = await runReport(propertyId, startDate, endDate,
    ['date', 'sessionDefaultChannelGroup', 'sessionSource', 'sessionMedium', 'sessionCampaignName'],
    ['sessions', 'activeUsers', 'newUsers', 'engagedSessions', 'engagementRate', 'eventCount', 'keyEvents']
  )
  return rows.map(r => ({
    date:            parseGa4Date(r.dimensions.date),
    channelGroup:    cleanDimension(r.dimensions.sessionDefaultChannelGroup),
    source:          cleanDimension(r.dimensions.sessionSource),
    medium:          cleanDimension(r.dimensions.sessionMedium),
    campaign:        cleanDimension(r.dimensions.sessionCampaignName),
    sessions:        Math.round(r.metrics.sessions),
    activeUsers:     Math.round(r.metrics.activeUsers),
    newUsers:        Math.round(r.metrics.newUsers),
    engagedSessions: Math.round(r.metrics.engagedSessions),
    engagementRate:  r.metrics.engagementRate,
    eventCount:      Math.round(r.metrics.eventCount),
    keyEvents:       Math.round(r.metrics.keyEvents),
  }))
}

export async function fetchLandingPageMetrics(propertyId: string, startDate: string, endDate: string) {
  const rows = await runReport(propertyId, startDate, endDate,
    ['date', 'landingPage'],
    ['sessions', 'activeUsers', 'engagedSessions', 'engagementRate', 'eventCount', 'keyEvents']
  )
  return rows.map(r => ({
    date:            parseGa4Date(r.dimensions.date),
    landingPage:     cleanDimension(r.dimensions.landingPage).substring(0, 500),
    sessions:        Math.round(r.metrics.sessions),
    activeUsers:     Math.round(r.metrics.activeUsers),
    engagedSessions: Math.round(r.metrics.engagedSessions),
    engagementRate:  r.metrics.engagementRate,
    eventCount:      Math.round(r.metrics.eventCount),
    keyEvents:       Math.round(r.metrics.keyEvents),
  }))
}

export async function fetchEventMetrics(propertyId: string, startDate: string, endDate: string) {
  const rows = await runReport(propertyId, startDate, endDate,
    ['date', 'eventName'],
    ['eventCount', 'activeUsers', 'keyEvents']
  )
  return rows.map(r => ({
    date:        parseGa4Date(r.dimensions.date),
    eventName:   cleanDimension(r.dimensions.eventName),
    eventCount:  Math.round(r.metrics.eventCount),
    activeUsers: Math.round(r.metrics.activeUsers),
    keyEvents:   Math.round(r.metrics.keyEvents),
  }))
}
