import db from '../config/db'
import { AppError } from '../helpers/AppError'

const GHL_BASE_URL     = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION  = '2021-07-28'
const PAGE_LIMIT       = 100
const INITIAL_SYNC_DAYS = 30

type GhlOpportunity = {
  id:                 string
  pipelineId?:        string
  pipelineStageId?:   string
  pipelineStageName?: string
  status?:            string
  monetaryValue?:     number
  contactId?:         string
  source?:            string
  medium?:            string
  campaign?:          string
  appointmentStatus?: string
  createdAt:          string
  updatedAt:          string
}

type PageCursor = { startAfterId: string; startAfter: number } | undefined

async function fetchOpportunitiesPage(
  token:      string,
  locationId: string,
  cursor?:    PageCursor
): Promise<{ opportunities: GhlOpportunity[]; nextCursor: PageCursor }> {
  const url = new URL(`${GHL_BASE_URL}/opportunities/search`)
  url.searchParams.set('location_id', locationId)
  url.searchParams.set('limit', String(PAGE_LIMIT))
  if (cursor) {
    url.searchParams.set('startAfterId', cursor.startAfterId)
    url.searchParams.set('startAfter', String(cursor.startAfter))
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization:   `Bearer ${token}`,
      Accept:          'application/json',
      'Content-Type':  'application/json',
      Version:         GHL_API_VERSION,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GHL API ${res.status}: ${body}`)
  }

  const data: any = await res.json()
  const meta       = data.meta
  const nextCursor: PageCursor =
    meta?.startAfterId && meta?.startAfter
      ? { startAfterId: meta.startAfterId, startAfter: meta.startAfter }
      : undefined

  return { opportunities: data.opportunities || [], nextCursor }
}

async function fetchAllOpportunities(
  token:      string,
  locationId: string,
  from:       Date,
  to:         Date
): Promise<GhlOpportunity[]> {
  const all: GhlOpportunity[] = []
  let cursor: PageCursor

  do {
    const { opportunities, nextCursor } = await fetchOpportunitiesPage(token, locationId, cursor)
    const inRange = opportunities.filter(opp => {
      const created = new Date(opp.createdAt)
      return created >= from && created <= to
    })
    all.push(...inRange)

    const allBeforeRange = opportunities.every(opp => new Date(opp.createdAt) < from)
    if (allBeforeRange) break

    cursor = nextCursor
  } while (cursor)

  return all
}

export type CrmSyncResult = {
  clientId:    string
  isFirstSync: boolean
  dateRange:   { from: Date; to: Date }
  upserted:    number
}

export const crmSyncService = {
  async syncClient(clientId: string): Promise<CrmSyncResult> {
    const integration = await db.integration.findUnique({
      where: { clientId_provider: { clientId, provider: 'GOHIGHLEVEL' } },
    })
    if (!integration) throw new AppError(`No CRM integration found for client ${clientId}`, 404)

    // Support both extraConfig blob and direct fields
    const config = (integration.extraConfig || integration.credentials || {}) as any
    const apiKey     = integration.accessToken  || config.api_key
    const locationId = integration.accountId    || config.location_id

    if (!apiKey)     throw new AppError('CRM integration is missing api_key / accessToken', 400)
    if (!locationId) throw new AppError('CRM integration is missing location_id / accountId', 400)

    const client      = await db.client.findUnique({ where: { id: clientId } })
    const isFirstSync = !client?.crmLastSyncAt

    const to   = new Date()
    const from = new Date()
    if (isFirstSync) {
      from.setDate(from.getDate() - INITIAL_SYNC_DAYS)
    } else {
      from.setTime(client!.crmLastSyncAt!.getTime())
    }
    from.setHours(0, 0, 0, 0)
    to.setHours(23, 59, 59, 999)

    const opportunities = await fetchAllOpportunities(apiKey, locationId, from, to)

    for (const opp of opportunities) {
      await db.crmOpportunity.upsert({
        where:  { clientId_crmOpportunityId: { clientId, crmOpportunityId: opp.id } },
        update: {
          pipelineId:        opp.pipelineId        ?? null,
          pipelineStageId:   opp.pipelineStageId   ?? null,
          pipelineStageName: opp.pipelineStageName ?? null,
          status:            opp.status            ?? null,
          monetaryValue:     opp.monetaryValue     ?? null,
          contactId:         opp.contactId         ?? null,
          source:            opp.source            ?? null,
          medium:            opp.medium            ?? null,
          campaign:          opp.campaign          ?? null,
          appointmentStatus: opp.appointmentStatus ?? null,
          crmUpdatedAt:      new Date(opp.updatedAt),
        },
        create: {
          clientId,
          crmOpportunityId:  opp.id,
          pipelineId:        opp.pipelineId        ?? null,
          pipelineStageId:   opp.pipelineStageId   ?? null,
          pipelineStageName: opp.pipelineStageName ?? null,
          status:            opp.status            ?? null,
          monetaryValue:     opp.monetaryValue     ?? null,
          contactId:         opp.contactId         ?? null,
          source:            opp.source            ?? null,
          medium:            opp.medium            ?? null,
          campaign:          opp.campaign          ?? null,
          appointmentStatus: opp.appointmentStatus ?? null,
          crmCreatedAt:      new Date(opp.createdAt),
          crmUpdatedAt:      new Date(opp.updatedAt),
        },
      })
    }

    await db.client.update({ where: { id: clientId }, data: { crmLastSyncAt: new Date() } })

    return { clientId, isFirstSync, dateRange: { from, to }, upserted: opportunities.length }
  },
}
