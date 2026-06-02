import db from '../../config/db'
import logger from '../../config/logger'
import { fetchSearchAnalytics } from '../gsc.service'

export const syncGsc = async (
  clientId:  string,
  dateRange: { startDate: string; endDate: string }
) => {
  const integration = await db.integration.findFirst({
    where: { clientId, provider: 'GOOGLE_SEARCH_CONSOLE', isActive: true },
  })

  if (!integration) {
    logger.warn(`No GSC integration for client ${clientId}`)
    return
  }

  const siteUrl = integration.accountId || (integration.credentials as any)?.site_url

  if (!siteUrl) {
    logger.warn(`GSC integration for client ${clientId} is missing site URL`)
    return
  }

  const syncLog = await db.syncLog.create({
    data: { clientId, provider: 'GSC', status: 'RUNNING' },
  })

  let totalRows = 0

  try {
    const rows = await fetchSearchAnalytics(siteUrl, dateRange.startDate, dateRange.endDate)

    for (const row of rows) {
      await db.gscSearchMetrics.upsert({
        where: {
          clientId_siteUrl_date_query_page_country_device: {
            clientId,
            siteUrl,
            date:    row.date,
            query:   row.query,
            page:    row.page,
            country: row.country,
            device:  row.device,
          },
        },
        create: { clientId, siteUrl, ...row },
        update: {
          clicks:      row.clicks,
          impressions: row.impressions,
          ctr:         row.ctr,
          position:    row.position,
        },
      })
      totalRows++
    }

    await db.syncLog.update({
      where: { id: syncLog.id },
      data:  { status: 'SUCCESS', completedAt: new Date(), recordsSync: totalRows },
    })

    await db.integration.update({
      where: { id: integration.id },
      data:  { lastSyncAt: new Date() },
    })

    logger.info(`GSC sync done — client: ${clientId}, site: ${siteUrl}, rows: ${totalRows}`)
  } catch (err: any) {
    logger.error(`GSC sync failed — client: ${clientId}: ${err.message}`)
    await db.syncLog.update({
      where: { id: syncLog.id },
      data:  { status: 'FAILED', completedAt: new Date(), errorMsg: err.message },
    })
  }
}
