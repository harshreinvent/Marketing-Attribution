import cron from 'node-cron'
import db from '../config/db'
import logger from '../config/logger'
import { env } from '../config/env'
import { syncGoogleAds } from '../services/sync/googleAds.sync'
import { syncMetaAds }   from '../services/sync/metaAds.sync'
import { syncGA4 }       from '../services/sync/ga4.sync'
import { syncGmb }       from '../services/sync/gmb.sync'
import { yesterday, toISODate } from '../utils/dates'

const yesterdayRange = () => ({
  startDate: toISODate(yesterday()),
  endDate:   toISODate(new Date()),
})

const runAllClients = async () => {
  logger.info('Sync job started')

  const clients = await db.client.findMany({
    where:   { isActive: true },
    include: { integrations: { where: { isActive: true }, select: { provider: true } } },
  })

  for (const client of clients) {
    const providers = client.integrations.map(i => i.provider as string)
    await triggerSync(client.id, providers, yesterdayRange())
  }

  logger.info('Sync job completed')
}

export const triggerSync = async (
  clientId:  string,
  providers?: string[],
  dateRange?: { startDate: string; endDate: string }
) => {
  const range  = dateRange || yesterdayRange()
  const toSync = providers || ['GOOGLE_ADS', 'META_ADS', 'GA4', 'GMB']

  await Promise.allSettled([
    toSync.includes('GOOGLE_ADS') && syncGoogleAds(clientId, range),
    toSync.includes('META_ADS')   && syncMetaAds(clientId, range),
    toSync.includes('GA4')        && syncGA4(clientId, range),
    toSync.includes('GMB')        && syncGmb(clientId, range),
  ])
}

export const startCronJobs = () => {
  const schedule = env.SYNC_CRON_SCHEDULE
  if (!cron.validate(schedule)) {
    logger.error(`Invalid cron schedule: ${schedule}`)
    return
  }
  cron.schedule(schedule, runAllClients, { timezone: 'Asia/Kolkata' })
  logger.info(`Sync cron scheduled: ${schedule}`)
}
