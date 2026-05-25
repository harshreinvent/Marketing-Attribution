import { Router } from 'express'
import { exotelCallWebhook, ghlLeadWebhook } from '../controllers/webhook.controller'
import { webhookLimiter } from '../middleware/rateLimiter'

export const webhookRouter = Router()

// All webhook routes are rate-limited but require no auth —
// they are called directly by Exotel and GoHighLevel servers.
webhookRouter.use(webhookLimiter)

// POST /api/v1/webhooks/exotel/call
webhookRouter.post('/exotel/call', exotelCallWebhook)

// POST /api/v1/webhooks/ghl/lead
webhookRouter.post('/ghl/lead',    ghlLeadWebhook)
