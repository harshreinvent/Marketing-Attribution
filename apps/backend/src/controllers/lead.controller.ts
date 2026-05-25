import { Response, NextFunction } from 'express'
import { AuthRequest } from '../types'
import { sendSuccess, sendCreated, sendPaginated } from '../helpers/response'
import { parseDateRange } from '../helpers/pagination'
import * as leadService from '../services/lead.service'

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const { leads, total, page, limit } = await leadService.getLeads(clientId, req.query as any)
    return sendPaginated(res, leads, total, page, limit)
  } catch (error) {
    return next(error)
  }
}

export const getLeadById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, leadId } = req.params
    const lead = await leadService.getLeadById(leadId, clientId)
    return sendSuccess(res, lead)
  } catch (error) {
    return next(error)
  }
}

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const lead = await leadService.createLead(clientId, req.body)
    return sendCreated(res, lead, 'Lead created')
  } catch (error) {
    return next(error)
  }
}

export const updateLeadStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, leadId } = req.params
    const lead = await leadService.updateLeadStatus(leadId, clientId, req.body)
    return sendSuccess(res, lead, 'Lead status updated')
  } catch (error) {
    return next(error)
  }
}

export const leadStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params
    const { startDate, endDate } = parseDateRange(req.query as any)
    const stats = await leadService.getLeadStats(clientId, startDate, endDate)
    return sendSuccess(res, stats)
  } catch (error) {
    return next(error)
  }
}
