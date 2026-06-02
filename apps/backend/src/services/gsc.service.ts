import { google } from 'googleapis'
import { googleOAuthService } from './googleAuth.service'

const searchconsole = google.searchconsole('v1')

export async function fetchSearchAnalytics(
  siteUrl:   string,
  startDate: string,
  endDate:   string
) {
  const auth = await googleOAuthService.getAuthenticatedClient()

  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    auth,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['date', 'query', 'page', 'country', 'device'],
      rowLimit: 25000,
    },
  })

  const rows = response.data.rows || []

  return rows.map(row => {
    const [date, query, page, country, device] = row.keys || []
    return {
      date:        new Date(date),
      query:       query       ?? '',
      page:        (page       ?? '').substring(0, 1000),
      country:     country     ?? '',
      device:      device      ?? '',
      clicks:      Math.round(row.clicks      ?? 0),
      impressions: Math.round(row.impressions ?? 0),
      ctr:         row.ctr      ?? 0,
      position:    row.position ?? 0,
    }
  })
}
