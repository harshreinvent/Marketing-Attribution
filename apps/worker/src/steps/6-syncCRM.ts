import { prisma } from "../db/prisma";
import { daysAgo } from "@repo/utils";
import { crmIntegration } from "../integrations/crm.integration";
import { crmOpportunityModel } from "../models/crmOpportunity.model";
import { syncLogger } from "../logs/syncLogger";

export async function syncCRM(clientId: string) {
  // Determine date range: first ever sync = 30 days; subsequent = yesterday only
  const existingCount = await prisma.crmOpportunity.count({ where: { client_id: clientId } });
  const isFirstSync = existingCount === 0;

  const from = isFirstSync ? daysAgo(30) : daysAgo(1);
  // Use start of today as exclusive upper bound so we get all of yesterday
  const to = new Date();
  to.setHours(0, 0, 0, 0);

  syncLogger.info({ clientId, step: "6-syncCRM", isFirstSync, from, to });

  const contacts = await crmIntegration.fetchContacts(clientId, from, to);

  syncLogger.info({ clientId, step: "6-syncCRM", contactsFetched: contacts.length });

  for (const contact of contacts) {
    const attr = contact.attributionSource;
    await crmOpportunityModel.upsertByOpportunityId(clientId, {
      crm_opportunity_id: contact.id,
      contact_id:         contact.id,
      source:   attr?.utmSource  ?? contact.source ?? null,
      medium:   attr?.utmMedium  ?? attr?.medium   ?? null,
      campaign: attr?.campaign   ?? null,
      crm_created_at: new Date(contact.dateAdded),
      crm_updated_at: new Date(contact.dateUpdated ?? contact.dateAdded),
    });
  }

  // Record when CRM was last synced on the client row
  await prisma.client.update({
    where: { id: clientId },
    data: { crm_last_sync_at: new Date() },
  });

  syncLogger.info({ clientId, step: "6-syncCRM", status: "complete", upserted: contacts.length });
}
