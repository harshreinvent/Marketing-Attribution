import { Response, NextFunction } from 'express'
import { AuthRequest } from '../types'
import { sendSuccess } from '../helpers/response'
import { triggerSync } from '../jobs/sync.job'
import db from '../config/db'

// POST /api/v1/clients/:clientId/sync/trigger
export const manualSync = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const { providers, startDate, endDate } = req.body

    // Fire and forget — don't block the HTTP response
    triggerSync(clientId, providers, startDate && endDate ? { startDate, endDate } : undefined)
      .catch(err => console.error('Sync failed:', err))

    return sendSuccess(res, { queued: true }, 'Sync started in background')
  } catch (error) {
    return next(error)
  }
}

// GET /api/v1/clients/:clientId/sync/logs
export const getSyncLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const logs = await db.syncLog.findMany({
      where:   { clientId },
      orderBy: { startedAt: 'desc' },
      take:    50,
    })
    return sendSuccess(res, logs)
  } catch (error) {
    return next(error)
  }
}
