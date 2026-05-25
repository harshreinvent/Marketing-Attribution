import db from '../../config/db'
import logger from '../../config/logger'
import {
  fetchDailyOverview,
  fetchChannelMetrics,
  fetchLandingPageMetrics,
  fetchEventMetrics,
} from '../ga4.service'

export const syncGA4 = async (
  clientId:  string,
  dateRange: { startDate: string; endDate: string }
) => {
  const integration = await db.integration.findFirst({
    where: { clientId, provider: 'GOOGLE_ANALYTICS', isActive: true },
  })

  if (!integration) {
    logger.warn(`No GA4 integration for client ${clientId}`)
    return
  }

  const creds      = (integration.credentials || {}) as any
  const propertyId = creds.property_id || integration.accountId

  if (!propertyId) {
    logger.warn(`GA4 integration for client ${clientId} is missing property_id`)
    return
  }

  const syncLog = await db.syncLog.create({
    data: { clientId, provider: 'GA4', status: 'RUNNING' },
  })

  let totalRows = 0

  try {
    // ── 1. Daily overview ─────────────────────────────────────────────────────
    const overviewRows = await fetchDailyOverview(propertyId, dateRange.startDate, dateRange.endDate)
    for (const row of overviewRows) {
      await db.ga4DailyOverview.upsert({
        where: { clientId_propertyId_date: { clientId, propertyId, date: row.date } },
        create: { clientId, propertyId, ...row },
        update: {
          sessions:        row.sessions,
          activeUsers:     row.activeUsers,
          newUsers:        row.newUsers,
          engagedSessions: row.engagedSessions,
          engagementRate:  row.engagementRate,
          eventCount:      row.eventCount,
          keyEvents:       row.keyEvents,
        },
      })
      totalRows++
    }

    // ── 2. Channel metrics ────────────────────────────────────────────────────
    const channelRows = await fetchChannelMetrics(propertyId, dateRange.startDate, dateRange.endDate)
    for (const row of channelRows) {
      await db.ga4ChannelMetrics.upsert({
        where: {
          clientId_propertyId_date_channelGroup_source_medium_campaign: {
            clientId, propertyId, date: row.date,
            channelGroup: row.channelGroup, source: row.source,
            medium: row.medium, campaign: row.campaign,
          },
        },
        create: { clientId, propertyId, ...row },
        update: {
          sessions:        row.sessions,
          activeUsers:     row.activeUsers,
          newUsers:        row.newUsers,
          engagedSessions: row.engagedSessions,
          engagementRate:  row.engagementRate,
          eventCount:      row.eventCount,
          keyEvents:       row.keyEvents,
        },
      })
      totalRows++
    }

    // ── 3. Landing page metrics ───────────────────────────────────────────────
    const landingRows = await fetchLandingPageMetrics(propertyId, dateRange.startDate, dateRange.endDate)
    for (const row of landingRows) {
      await db.ga4LandingPageMetrics.upsert({
        where: { clientId_propertyId_date_landingPage: { clientId, propertyId, date: row.date, landingPage: row.landingPage } },
        create: { clientId, propertyId, ...row },
        update: {
          sessions:        row.sessions,
          activeUsers:     row.activeUsers,
          engagedSessions: row.engagedSessions,
          engagementRate:  row.engagementRate,
          eventCount:      row.eventCount,
          keyEvents:       row.keyEvents,
        },
      })
      totalRows++
    }

    // ── 4. Event metrics ──────────────────────────────────────────────────────
    const eventRows = await fetchEventMetrics(propertyId, dateRange.startDate, dateRange.endDate)
    for (const row of eventRows) {
      await db.ga4EventMetrics.upsert({
        where: { clientId_propertyId_date_eventName: { clientId, propertyId, date: row.date, eventName: row.eventName } },
        create: { clientId, propertyId, ...row },
        update: { eventCount: row.eventCount, activeUsers: row.activeUsers, keyEvents: row.keyEvents },
      })
      totalRows++
    }

    await db.syncLog.update({
      where: { id: syncLog.id },
      data:  { status: 'SUCCESS', completedAt: new Date(), recordsSync: totalRows },
    })

    logger.info(`GA4 sync done — client: ${clientId}, property: ${propertyId}, rows: ${totalRows}`)
  } catch (err: any) {
    logger.error(`GA4 sync failed — client: ${clientId}: ${err.message}`)
    await db.syncLog.update({
      where: { id: syncLog.id },
      data:  { status: 'FAILED', completedAt: new Date(), errorMsg: err.message },
    })
  }
}
