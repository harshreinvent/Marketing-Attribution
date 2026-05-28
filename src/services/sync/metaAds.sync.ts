import axios from 'axios'
import db from '../../config/db'
import logger from '../../config/logger'

const META_URL = 'https://graph.facebook.com/v19.0'

export const syncMetaAds = async (
  clientId:  string,
  dateRange: { startDate: string; endDate: string }
) => {
  const integration = await db.integration.findFirst({
    where: { clientId, provider: 'META_ADS', isActive: true },
  })

  if (!integration) {
    logger.warn(`No Meta Ads integration for client ${clientId}`)
    return
  }

  const syncLog = await db.syncLog.create({
    data: { clientId, provider: 'META_ADS', status: 'RUNNING' },
  })

  try {
    const creds       = (integration.credentials || {}) as any
    const adAccountId = integration.accountId   || creds.ad_account_id
    const accessToken = integration.accessToken || creds.access_token

    if (!adAccountId || !accessToken) {
      throw new Error('Meta Ads integration missing ad_account_id or access_token')
    }

    const timeRange = JSON.stringify({ since: dateRange.startDate, until: dateRange.endDate })

    const campaignsRes = await axios.get(`${META_URL}/act_${adAccountId}/campaigns`, {
      params: { fields: 'id,name,status', access_token: accessToken },
    })

    let rowsProcessed = 0

    for (const camp of campaignsRes.data.data || []) {
      const insightsRes = await axios.get(`${META_URL}/${camp.id}/insights`, {
        params: {
          fields:       'spend,impressions,clicks,actions',
          access_token: accessToken,
          time_range:   timeRange,
        },
      })

      for (const insight of insightsRes.data.data || []) {
        const leads = parseInt(
          (insight.actions || []).find((a: any) => a.action_type === 'lead')?.value || '0'
        )
        const date = new Date(dateRange.endDate)

        await db.metaAdsDaily.upsert({
          where: {
            clientId_campaignId_date: { clientId, campaignId: camp.id, date },
          },
          create: {
            clientId,
            campaignId:   camp.id,
            campaignName: camp.name,
            date,
            impressions: parseInt(insight.impressions || '0'),
            clicks:      parseInt(insight.clicks      || '0'),
            spend:       parseFloat(insight.spend     || '0'),
            leads,
          },
          update: {
            campaignName: camp.name,
            impressions:  parseInt(insight.impressions || '0'),
            clicks:       parseInt(insight.clicks      || '0'),
            spend:        parseFloat(insight.spend     || '0'),
            leads,
          },
        })
        rowsProcessed++
      }
    }

    await db.syncLog.update({
      where: { id: syncLog.id },
      data:  { status: 'SUCCESS', completedAt: new Date(), recordsSync: rowsProcessed },
    })

    logger.info(`Meta Ads sync done — client: ${clientId}, rows: ${rowsProcessed}`)
  } catch (err: any) {
    logger.error(`Meta Ads sync failed — client: ${clientId}: ${err.message}`)
    await db.syncLog.update({
      where: { id: syncLog.id },
      data:  { status: 'FAILED', completedAt: new Date(), errorMsg: err.message },
    })
  }
}
