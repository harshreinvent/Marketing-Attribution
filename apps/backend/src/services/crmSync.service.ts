import { prisma } from "@repo/db";
import { ghlOpportunitiesResponseSchema } from "@repo/validators";
import type { GhlOpportunity } from "@repo/validators";
import { SyncError } from "../error/errors";

const GHL_BASE_URL = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const PAGE_LIMIT = 100;
const INITIAL_SYNC_DAYS = 30;

// ── GHL API ───────────────────────────────────────────────────────────────────

type PageCursor = { startAfterId: string; startAfter: number } | undefined;

async function fetchOpportunitiesPage(
  token: string,
  locationId: string,
  cursor?: PageCursor
): Promise<{ opportunities: GhlOpportunity[]; nextCursor: PageCursor }> {
  const url = new URL(`${GHL_BASE_URL}/opportunities/search`);
  url.searchParams.set("location_id", locationId);
  url.searchParams.set("limit", String(PAGE_LIMIT));
  if (cursor) {
    url.searchParams.set("startAfterId", cursor.startAfterId);
    url.searchParams.set("startAfter", String(cursor.startAfter));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      Version: GHL_API_VERSION,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GHL API ${res.status}: ${body}`);
  }

  const parsed = ghlOpportunitiesResponseSchema.parse(await res.json());
  const meta = parsed.meta;

  const nextCursor: PageCursor =
    meta?.startAfterId && meta?.startAfter
      ? { startAfterId: meta.startAfterId, startAfter: meta.startAfter }
      : undefined;

  return { opportunities: parsed.opportunities, nextCursor };
}

// GHL /opportunities/search does not support date filtering — fetch pages and
// filter client-side. Stop early once all items on a page fall before `from`
// (GHL returns oldest-first via cursor, so once a page is fully before `from`
// there is nothing newer left to fetch).
async function fetchAllOpportunities(
  token: string,
  locationId: string,
  from: Date,
  to: Date
): Promise<GhlOpportunity[]> {
  const all: GhlOpportunity[] = [];
  let cursor: PageCursor;

  do {
    const { opportunities, nextCursor } = await fetchOpportunitiesPage(token, locationId, cursor);

    const inRange = opportunities.filter((opp) => {
      const created = new Date(opp.createdAt);
      return created >= from && created <= to;
    });

    all.push(...inRange);

    // If every record on this page is older than `from`, no older pages will match
    const allBeforeRange = opportunities.every((opp) => new Date(opp.createdAt) < from);
    if (allBeforeRange) break;

    cursor = nextCursor;
  } while (cursor);

  return all;
}

// ── DB ────────────────────────────────────────────────────────────────────────

async function upsertOpportunity(clientId: string, opp: GhlOpportunity) {
  return prisma.crmOpportunity.upsert({
    where: {
      client_id_crm_opportunity_id: {
        client_id: clientId,
        crm_opportunity_id: opp.id,
      },
    },
    update: {
      pipeline_id:         opp.pipelineId       ?? null,
      pipeline_stage_id:   opp.pipelineStageId   ?? null,
      pipeline_stage_name: opp.pipelineStageName ?? null,
      status:              opp.status            ?? null,
      monetary_value:      opp.monetaryValue     ?? null,
      contact_id:          opp.contactId         ?? null,
      source:              opp.source            ?? null,
      medium:              opp.medium            ?? null,
      campaign:            opp.campaign          ?? null,
      appointment_status:  opp.appointmentStatus ?? null,
      crm_updated_at:      new Date(opp.updatedAt),
    },
    create: {
      client_id:           clientId,
      crm_opportunity_id:  opp.id,
      pipeline_id:         opp.pipelineId       ?? null,
      pipeline_stage_id:   opp.pipelineStageId   ?? null,
      pipeline_stage_name: opp.pipelineStageName ?? null,
      status:              opp.status            ?? null,
      monetary_value:      opp.monetaryValue     ?? null,
      contact_id:          opp.contactId         ?? null,
      source:              opp.source            ?? null,
      medium:              opp.medium            ?? null,
      campaign:            opp.campaign          ?? null,
      appointment_status:  opp.appointmentStatus ?? null,
      crm_created_at:      new Date(opp.createdAt),
      crm_updated_at:      new Date(opp.updatedAt),
    },
  });
}

// ── Service ───────────────────────────────────────────────────────────────────

export type CrmSyncResult = {
  clientId:    string;
  isFirstSync: boolean;
  dateRange:   { from: Date; to: Date };
  upserted:    number;
};

export const crmSyncService = {
  async syncClient(clientId: string): Promise<CrmSyncResult> {
    const integration = await prisma.integration.findUnique({
      where: { client_id_platform: { client_id: clientId, platform: "CRM" } },
    });
    if (!integration) throw new Error(`No CRM integration found for client ${clientId}`);

    const creds = integration.credentials as { api_key?: string; location_id?: string };
    if (!creds.api_key)     throw new Error("CRM integration is missing api_key");
    if (!creds.location_id) throw new Error("CRM integration is missing location_id");

    const client = await prisma.client.findUnique({ where: { id: clientId } });
    const isFirstSync = !client?.crm_last_sync_at;

    const to = new Date();
    const from = new Date();
    if (isFirstSync) {
      from.setDate(from.getDate() - INITIAL_SYNC_DAYS);
    } else {
      from.setTime(client!.crm_last_sync_at!.getTime());
    }
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    let opportunities;
    try {
      opportunities = await fetchAllOpportunities(creds.api_key, creds.location_id, from, to);
    } catch (e) {
      console.error("[crmSync] fetchAllOpportunities failed:", e);
      throw new SyncError(`GHL API fetch failed: ${(e as Error).message}`);
    }

    for (const opp of opportunities) {
      await upsertOpportunity(clientId, opp);
    }

    await prisma.client.update({
      where: { id: clientId },
      data: { crm_last_sync_at: new Date() },
    });

    return { clientId, isFirstSync, dateRange: { from, to }, upserted: opportunities.length };
  },
};
