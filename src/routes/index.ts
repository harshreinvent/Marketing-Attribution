import { Router } from 'express'
import { authRouter }       from './auth.routes'
import { clientRouter }     from './client.routes'
import { dashboardRouter }  from './dashboard.routes'
import { leadRouter }       from './lead.routes'
import { syncRouter }       from './sync.routes'
import { webhookRouter }    from './webhook.routes'
import { googleAuthRouter } from './googleAuth.routes'
import { healthRouter }     from './health.routes'

export const router: ReturnType<typeof Router> = Router()

// Health check (no auth)
router.use('/health',  healthRouter)

// Auth (login, register, refresh, me)
router.use('/auth',    authRouter)

// Client management + nested resources
router.use('/clients', clientRouter)

// Nested under clients — mergeParams makes :clientId available
router.use('/clients/:clientId/dashboard', dashboardRouter)
router.use('/clients/:clientId/leads',     leadRouter)
router.use('/clients/:clientId/sync',      syncRouter)

// Webhooks (Exotel, GHL) — no auth
router.use('/webhooks', webhookRouter)

// Google OAuth flow
router.use('/google',  googleAuthRouter)
