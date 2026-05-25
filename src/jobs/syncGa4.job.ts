/**
 * Standalone GA4 sync job — use this to run GA4 sync for all clients
 * (called by cron or manual trigger). The per-client logic lives in
 * services/sync/ga4.sync.ts and is also used by sync.job.ts.
 */
import db from '../config/db'
import logger from '../config/logger'
import { syncGA4 } from '../services/sync/ga4.sync'

export async function syncAllClientsGa4(startDate: string, endDate: string): Promise<void> {
  const integrations = await db.integration.findMany({
    where:  { provider: 'GOOGLE_ANALYTICS', isActive: true },
    select: { clientId: true },
  })

  logger.info(`[GA4 Sync] Starting sync for ${integrations.length} clients`)

  for (const { clientId } of integrations) {
    await syncGA4(clientId, { startDate, endDate })
  }
}
