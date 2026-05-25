import axios from 'axios'
import { google } from 'googleapis'
import db from '../../config/db'
import logger from '../../config/logger'

const GMB_PERF_BASE = 'https://businessprofileperformance.googleapis.com/v1'

const DAILY_METRICS = [
  'BUSINESS_IMPRESSIONS_DESKTOP_MAPS',
  'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH',
  'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
  'BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
  'BUSINESS_DIRECTION_REQUESTS',
  'CALL_CLICKS',
  'WEBSITE_CLICKS',
]

type MetricKey =
  | 'BUSINESS_IMPRESSIONS_DESKTOP_MAPS'
  | 'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH'
  | 'BUSINESS_IMPRESSIONS_MOBILE_MAPS'
  | 'BUSINESS_IMPRESSIONS_MOBILE_SEARCH'
  | 'BUSINESS_DIRECTION_REQUESTS'
  | 'CALL_CLICKS'
  | 'WEBSITE_CLICKS'

type DatedValue = {
  date:  { year: number; month: number; day: number }
  value: string
}

type MetricSeries = {
  dailyMetric: MetricKey
  timeSeries:  { datedValues: DatedValue[] }
}

type GmbPerfResponse = {
  multiDailyMetricTimeSeries: MetricSeries[]
}

// Build date parts from a JS Date
function dateParts(d: Date) {
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
}

// "20260422" from { year, month, day }
function toIsoDate(d: { year: number; month: number; day: number }): string {
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
}

async function fetchListingMetrics(
  accessToken: string,
  gmbLocationId: string,
  startDate: Date,
  endDate: Date
): Promise<GmbPerfResponse> {
  const start = dateParts(startDate)
  const end   = dateParts(endDate)

  // Build query params — dailyMetrics is repeated
  const params = new URLSearchParams()
  DAILY_METRICS.forEach(m => params.append('dailyMetrics', m))
  params.set('dailyRange.startDate.year',  String(start.year))
  params.set('dailyRange.startDate.month', String(start.month))
  params.set('dailyRange.startDate.day',   String(start.day))
  params.set('dailyRange.endDate.year',    String(end.year))
  params.set('dailyRange.endDate.month',   String(end.month))
  params.set('dailyRange.endDate.day',     String(end.day))

  // Strip "locations/" prefix if present — API already includes it in the path
  const locId = gmbLocationId.startsWith('locations/')
    ? gmbLocationId.slice('locations/'.length)
    : gmbLocationId

  const url = `${GMB_PERF_BASE}/locations/${locId}:fetchMultiDailyMetricsTimeSeries?${params.toString()}`

  const res = await axios.get<GmbPerfResponse>(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 30_000,
  })

  return res.data
}

// Flatten API response into a map: isoDate → metric values
function parseResponse(data: GmbPerfResponse): Record<string, Record<MetricKey, number>> {
  const byDate: Record<string, Record<MetricKey, number>> = {}

  for (const series of data.multiDailyMetricTimeSeries || []) {
    for (const dv of series.timeSeries?.datedValues || []) {
      const iso = toIsoDate(dv.date)
      if (!byDate[iso]) byDate[iso] = {} as Record<MetricKey, number>
      byDate[iso][series.dailyMetric] = parseInt(dv.value || '0', 10) || 0
    }
  }

  return byDate
}

// Build an OAuth2 client from the client's GMB integration credentials.
// extraConfig can optionally hold { clientId, clientSecret } for the GBP project.
// Falls back to env vars GMB_CLIENT_ID / GMB_CLIENT_SECRET if not set per-client.
async function getGmbAccessToken(refreshToken: string, extraConfig: any): Promise<string> {
  const clientId     = extraConfig?.clientId     || process.env.GMB_CLIENT_ID     || process.env.GOOGLE_CLIENT_ID
  const clientSecret = extraConfig?.clientSecret || process.env.GMB_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) throw new Error('GMB OAuth credentials not configured (GMB_CLIENT_ID / GMB_CLIENT_SECRET)')

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret)
  oauth2.setCredentials({ refresh_token: refreshToken })
  const { token } = await oauth2.getAccessToken()
  if (!token) throw new Error('Could not obtain GMB access token')
  return token
}

export const syncGmb = async (
  clientId:  string,
  dateRange: { startDate: string; endDate: string }
) => {
  // Get all active GMB listings for this client (via locations)
  const listings = await db.gmbListing.findMany({
    where:   { isActive: true, location: { clientId, isActive: true } },
    include: { location: { select: { name: true } } },
  })

  if (listings.length === 0) {
    logger.warn(`[GMB] No active listings for client ${clientId}`)
    return
  }

  // Look up the client's GMB integration for credentials
  const integration = await db.integration.findUnique({
    where: { clientId_provider: { clientId, provider: 'GMB' } },
  })

  if (!integration?.refreshToken) {
    logger.warn(`[GMB] No GMB integration/refresh token for client ${clientId} — skipping`)
    return
  }

  const syncLog = await db.syncLog.create({
    data: { clientId, provider: 'GMB', status: 'RUNNING' },
  })

  let totalRows = 0

  try {
    const accessToken = await getGmbAccessToken(integration.refreshToken, integration.extraConfig)

    // Log which OAuth project is being used so we can confirm in server console
    const extra = integration.extraConfig as any
    const oauthClientLabel = extra?.clientId ? extra.clientId.slice(0, 25) + '...' : 'env fallback'
    logger.info(`[GMB] Using OAuth client: ${oauthClientLabel} for client ${clientId}`)

    const start = new Date(dateRange.startDate)
    const end   = new Date(dateRange.endDate)

    const listingErrors: string[] = []

    for (const listing of listings) {
      try {
        const data    = await fetchListingMetrics(accessToken, listing.listingId, start, end)
        const byDate  = parseResponse(data)

        for (const [isoDate, metrics] of Object.entries(byDate)) {
          await db.gmbDaily.upsert({
            where: { listingId_date: { listingId: listing.id, date: new Date(isoDate) } },
            create: {
              clientId,
              listingId:                listing.id,
              date:                     new Date(isoDate),
              impressionsDesktopMaps:   metrics.BUSINESS_IMPRESSIONS_DESKTOP_MAPS   ?? 0,
              impressionsDesktopSearch: metrics.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH ?? 0,
              impressionsMobileMaps:    metrics.BUSINESS_IMPRESSIONS_MOBILE_MAPS    ?? 0,
              impressionsMobileSearch:  metrics.BUSINESS_IMPRESSIONS_MOBILE_SEARCH  ?? 0,
              directionRequests:        metrics.BUSINESS_DIRECTION_REQUESTS         ?? 0,
              callClicks:               metrics.CALL_CLICKS                         ?? 0,
              websiteClicks:            metrics.WEBSITE_CLICKS                      ?? 0,
            },
            update: {
              impressionsDesktopMaps:   metrics.BUSINESS_IMPRESSIONS_DESKTOP_MAPS   ?? 0,
              impressionsDesktopSearch: metrics.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH ?? 0,
              impressionsMobileMaps:    metrics.BUSINESS_IMPRESSIONS_MOBILE_MAPS    ?? 0,
              impressionsMobileSearch:  metrics.BUSINESS_IMPRESSIONS_MOBILE_SEARCH  ?? 0,
              directionRequests:        metrics.BUSINESS_DIRECTION_REQUESTS         ?? 0,
              callClicks:               metrics.CALL_CLICKS                         ?? 0,
              websiteClicks:            metrics.WEBSITE_CLICKS                      ?? 0,
            },
          })
          totalRows++
        }

        logger.info(`[GMB] Synced ${Object.keys(byDate).length} days for listing ${listing.name} (${listing.listingId})`)
      } catch (listingErr: any) {
        const errMsg = listingErr.response?.data?.error?.message || listingErr.message
        logger.error(`[GMB] Failed listing ${listing.listingId}: ${errMsg}`)
        listingErrors.push(`${listing.name} (${listing.listingId}): ${errMsg}`)
      }
    }

    // Mark FAILED if every listing errored, SUCCESS otherwise (with errors in errorMsg)
    const allFailed = listingErrors.length === listings.length && listings.length > 0
    await db.syncLog.update({
      where: { id: syncLog.id },
      data:  {
        status:      allFailed ? 'FAILED' : 'SUCCESS',
        completedAt: new Date(),
        recordsSync: totalRows,
        errorMsg:    listingErrors.length > 0 ? listingErrors.join(' | ') : null,
      },
    })

    logger.info(`[GMB] Sync done — client: ${clientId}, listings: ${listings.length}, rows: ${totalRows}, errors: ${listingErrors.length}`)
  } catch (err: any) {
    logger.error(`[GMB] Sync failed — client: ${clientId}: ${err.message}`)
    await db.syncLog.update({
      where: { id: syncLog.id },
      data:  { status: 'FAILED', completedAt: new Date(), errorMsg: err.message },
    })
  }
}
