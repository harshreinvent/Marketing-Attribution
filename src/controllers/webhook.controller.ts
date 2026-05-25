import { Request, Response, NextFunction } from 'express'
import db from '../config/db'
import logger from '../config/logger'
import { QUALIFIED_CALL_SECONDS } from '../constants'
import { ExotelCallPayload, GhlLeadPayload } from '../types'

// ─── Exotel Call Webhook ───────────────────────────────────────────────────────
// POST /api/v1/webhooks/exotel/call
// Exotel calls this when a call completes. Logs the call and marks it qualified
// if status is "completed" and duration >= QUALIFIED_CALL_SECONDS.

export const exotelCallWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload  = req.body as ExotelCallPayload
    const duration = parseInt(payload.Duration || '0')
    const isQualified = payload.Status === 'completed' && duration >= QUALIFIED_CALL_SECONDS

    // Parse UTM / tracking data stored in CustomField as JSON
    let trackingData: Record<string, string> = {}
    try { trackingData = JSON.parse(payload.CustomField || '{}') } catch { /* ignore */ }

    // Find location by tracking phone number
    const location = await db.location.findFirst({
      where: { trackingPhone: payload.To },
    })

    if (!location) {
      logger.warn(`Exotel webhook: no location found for number ${payload.To}`)
      return res.status(200).json({ received: true })
    }

    await db.callLog.create({
      data: {
        externalId:     payload.CallSid,
        direction:      payload.Direction || 'inbound',
        duration,
        status:         payload.Status,
        recordingUrl:   payload.RecordingUrl,
        callerNumber:   payload.From,
        receiverNumber: payload.To,
        isQualified,
        gclid:          trackingData.gclid,
        fbclid:         trackingData.fbclid,
        keyword:        trackingData.keyword,
        utmSource:      trackingData.utm_source,
        utmCampaign:    trackingData.utm_campaign,
        callAt:         new Date(),
        clientId:       location.clientId,
        locationId:     location.id,
      },
    })

    return res.status(200).json({ received: true })
  } catch (error) {
    return next(error)
  }
}

// ─── GHL Lead Webhook ─────────────────────────────────────────────────────────
// POST /api/v1/webhooks/ghl/lead
// GoHighLevel calls this when a new lead comes in. Upserts the lead using
// contactId as the stable external identifier.

export const ghlLeadWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as GhlLeadPayload
    const cf      = payload.customFields || {}

    // Map GHL source strings to our LeadSource enum
    const sourceMap: Record<string, string> = {
      facebook:  'META_ADS',
      instagram: 'META_ADS',
      google:    'GOOGLE_ADS',
      organic:   'ORGANIC_SEARCH',
      direct:    'DIRECT',
      whatsapp:  'WHATSAPP',
    }
    const rawSource = (cf.utm_source || payload.source || '').toLowerCase()
    const source    = sourceMap[rawSource] || 'UNKNOWN'

    // Find location by the GHL sub-account id stored in location.crmLocationId
    const location = await db.location.findFirst({
      where: { crmLocationId: payload.locationId },
    })

    if (!location) {
      logger.warn(`GHL webhook: no location found for locationId ${payload.locationId}`)
      return res.status(200).json({ received: true })
    }

    await db.lead.upsert({
      where:  { id: payload.contactId },
      create: {
        id:          payload.contactId,
        externalId:  payload.contactId,
        name:        `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || undefined,
        phone:       payload.phone,
        email:       payload.email,
        source:      source as any,
        channel:     source as any,
        utmSource:   cf.utm_source,
        utmMedium:   cf.utm_medium,
        utmCampaign: cf.utm_campaign,
        gclid:       cf.gclid,
        fbclid:      cf.fbclid,
        keyword:     cf.keyword,
        landingPage: cf.landing_page,
        clientId:    location.clientId,
        locationId:  location.id,
      },
      update: {
        name:  `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || undefined,
        phone: payload.phone,
      },
    })

    return res.status(200).json({ received: true })
  } catch (error) {
    return next(error)
  }
}
