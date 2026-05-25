import db from '../config/db'
import { Prisma } from '../generated/prisma'
import { AppError } from '../helpers/AppError'
import { parsePagination, parseDateRange } from '../helpers/pagination'
import { CreateLeadDto, UpdateLeadStatusDto } from '../validators/lead.validator'

export const getLeads = async (clientId: string, query: Record<string, string | undefined>) => {
  const { page, limit, skip, take } = parsePagination(query)
  const { startDate, endDate }      = parseDateRange(query)

  const where: Prisma.LeadWhereInput = {
    clientId,
    createdAt: { gte: startDate, lte: endDate },
    ...(query.source     && { source:     query.source     as any }),
    ...(query.channel    && { channel:    query.channel    as any }),
    ...(query.status     && { status:     query.status     as any }),
    ...(query.locationId && { locationId: query.locationId }),
    ...(query.campaignId && { campaignId: query.campaignId }),
    ...(query.isQualified !== undefined && { isQualified: query.isQualified === 'true' }),
  }

  const [total, leads] = await Promise.all([
    db.lead.count({ where }),
    db.lead.findMany({
      where, skip, take,
      orderBy: { createdAt: 'desc' },
      include: {
        location: { select: { id: true, name: true, city: true } },
        campaign: { select: { id: true, name: true, channel: true } },
      },
    }),
  ])

  return { leads, total, page, limit }
}

export const getLeadById = async (leadId: string, clientId: string) => {
  const lead = await db.lead.findFirst({
    where: { id: leadId, clientId },
    include: {
      location:     true,
      campaign:     true,
      callLogs:     { orderBy: { callAt: 'desc' } },
      appointments: { orderBy: { scheduledAt: 'desc' } },
      stageHistory: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!lead) throw new AppError('Lead not found', 404)
  return lead
}

export const createLead = async (clientId: string, dto: CreateLeadDto) => {
  return db.lead.create({
    data: { clientId, ...dto },
    include: { location: { select: { id: true, name: true, city: true } } },
  })
}

export const updateLeadStatus = async (leadId: string, clientId: string, dto: UpdateLeadStatusDto) => {
  const lead = await db.lead.findFirst({ where: { id: leadId, clientId } })
  if (!lead) throw new AppError('Lead not found', 404)

  const [updated] = await db.$transaction([
    db.lead.update({
      where: { id: leadId },
      data: {
        status: dto.status,
        ...(dto.status === 'APPOINTMENT_CONFIRMED' && { isQualified: true, qualifiedAt: new Date() }),
      },
    }),
    db.leadStageHistory.create({
      data: { leadId, stage: dto.status as any, note: dto.note },
    }),
  ])

  return updated
}

export const getLeadStats = async (clientId: string, startDate: Date, endDate: Date) => {
  const where = { clientId, createdAt: { gte: startDate, lte: endDate } }

  const [total, bySource, byStatus, byChannel] = await Promise.all([
    db.lead.count({ where }),
    db.lead.groupBy({ by: ['source'], where, _count: { id: true } }),
    db.lead.groupBy({ by: ['status'], where, _count: { id: true } }),
    db.lead.groupBy({ by: ['channel'], where, _count: { id: true } }),
  ])

  return { total, bySource, byStatus, byChannel }
}
