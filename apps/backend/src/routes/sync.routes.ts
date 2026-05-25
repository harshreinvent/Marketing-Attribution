import { Router } from 'express'
import { manualSync, getSyncLogs } from '../controllers/sync.controller'
import { authenticate } from '../middleware/authenticate'
import { authorize } from '../middleware/authorize'

export const syncRouter = Router({ mergeParams: true })

syncRouter.use(authenticate, authorize('SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENCY_MEMBER'))

// POST /api/v1/clients/:clientId/sync/trigger
syncRouter.post('/trigger', manualSync)

// GET  /api/v1/clients/:clientId/sync/logs
syncRouter.get('/logs',     getSyncLogs)
