import axios from 'axios'
import db from '../../config/db'
import logger from '../../config/logger'
import { env } from '../../config/env'

export const syncGoogleAds = async (
  clientId:  string,
  dateRange: { startDate: string; endDate: string }
) => {
  const integration = await db.integration.findFirst({
    where: { clientId, provider: 'GOOGLE_ADS', isActive: true },
  })

  if (!integration) {
    logger.warn(`No Google Ads integration for client ${clientId}`)
    return
  }

  const syncLog = await db.syncLog.create({
    data: { clientId, provider: 'GOOGLE_ADS', status: 'RUNNING' },
  })

  try {
    // Support both new (separate fields) and legacy (credentials blob) storage
    const creds      = (integration.credentials || {}) as any
    const customerId = integration.accountId || creds.customer_id
    const refreshToken = integration.refreshToken || integration.accessToken || creds.refresh_token
    const devToken   = creds.developer_token || env.GOOGLE_ADS_DEVELOPER_TOKEN

    if (!customerId || !refreshToken) {
      throw new Error('Google Ads integration missing customer_id / accountId or refresh_token')
    }

    const response = await axios.post(
      `https://googleads.googleapis.com/v16/customers/${customerId}/googleAds:searchStream`,
      {
        query: `
          SELECT
            campaign.id, campaign.name, campaign.status,
            metrics.cost_micros, metrics.impressions, metrics.clicks,
            metrics.conversions
          FROM campaign
          WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
          AND campaign.status = 'ENABLED'
        `,
      },
      {
        headers: {
          Authorization:     `Bearer ${refreshToken}`,
          'developer-token': devToken,
        },
      }
    )

    let rowsProcessed = 0

    for (const result of response.data || []) {
      for (const row of result.results || []) {
        const { campaign, metrics } = row
        const date = new Date(dateRange.endDate)

        await db.googleAdsDaily.upsert({
          where: {
            clientId_campaignId_date: { clientId, campaignId: String(campaign.id), date },
          },
          create: {
            clientId,
            campaignId:   String(campaign.id),
            campaignName: campaign.name,
            date,
            impressions: metrics.impressions  || 0,
            clicks:      metrics.clicks       || 0,
            cost:        (metrics.costMicros  || 0) / 1_000_000,
            conversions: metrics.conversions  || 0,
          },
          update: {
            campaignName: campaign.name,
            impressions:  metrics.impressions  || 0,
            clicks:       metrics.clicks       || 0,
            cost:         (metrics.costMicros  || 0) / 1_000_000,
            conversions:  metrics.conversions  || 0,
          },
        })
        rowsProcessed++
      }
    }

    await db.syncLog.update({
      where: { id: syncLog.id },
      data:  { status: 'SUCCESS', completedAt: new Date(), recordsSync: rowsProcessed },
    })

    logger.info(`Google Ads sync done — client: ${clientId}, rows: ${rowsProcessed}`)
  } catch (err: any) {
    logger.error(`Google Ads sync failed — client: ${clientId}: ${err.message}`)
    await db.syncLog.update({
      where: { id: syncLog.id },
      data:  { status: 'FAILED', completedAt: new Date(), errorMsg: err.message },
    })
  }
}
