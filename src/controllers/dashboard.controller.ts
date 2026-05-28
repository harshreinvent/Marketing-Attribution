import { Response, NextFunction } from 'express'
import { AuthRequest } from '../types'
import { sendSuccess } from '../helpers/response'
import { parseDateRange } from '../helpers/pagination'
import * as dashboardService from '../services/dashboard.service'

// GET /api/v1/clients/:clientId/dashboard/executive?startDate=&endDate=
export const executiveSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const { startDate, endDate } = parseDateRange(req.query as any)
    const data = await dashboardService.getExecutiveSummary(clientId, startDate, endDate)
    return sendSuccess(res, data)
  } catch (error) {
    return next(error)
  }
}

// GET /api/v1/clients/:clientId/dashboard/google-ads?startDate=&endDate=
export const googleAdsSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const { startDate, endDate } = parseDateRange(req.query as any)
    const data = await dashboardService.getGoogleAdsSummary(clientId, startDate, endDate)
    return sendSuccess(res, data)
  } catch (error) {
    return next(error)
  }
}

// GET /api/v1/clients/:clientId/dashboard/meta-ads?startDate=&endDate=
export const metaAdsSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const { startDate, endDate } = parseDateRange(req.query as any)
    const data = await dashboardService.getMetaAdsSummary(clientId, startDate, endDate)
    return sendSuccess(res, data)
  } catch (error) {
    return next(error)
  }
}

// GET /api/v1/clients/:clientId/dashboard/website?startDate=&endDate=&locationId=
export const websiteSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const { startDate, endDate } = parseDateRange(req.query as any)
    const locationId = req.query.locationId as string | undefined
    const data = await dashboardService.getWebsiteSummary(clientId, startDate, endDate, locationId)
    return sendSuccess(res, data)
  } catch (error) {
    return next(error)
  }
}

// GET /api/v1/clients/:clientId/dashboard/gmb?startDate=&endDate=
export const gmbSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const { startDate, endDate } = parseDateRange(req.query as any)
    const data = await dashboardService.getGmbSummary(clientId, startDate, endDate)
    return sendSuccess(res, data)
  } catch (error) {
    return next(error)
  }
}

// GET /api/v1/clients/:clientId/dashboard/funnel-roi?startDate=&endDate=
export const funnelRoi = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const { startDate, endDate } = parseDateRange(req.query as any)
    const data = await dashboardService.getFunnelRoi(clientId, startDate, endDate)
    return sendSuccess(res, data)
  } catch (error) {
    return next(error)
  }
}
