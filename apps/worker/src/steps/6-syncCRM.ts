import type { DateRange } from "@repo/types";
import { prisma } from "../db/prisma";
import { crmIntegration } from "../integrations/crm.integration";
import { ghlOpportunitiesResponseSchema } from "@repo/validators";
import { crmOpportunityModel } from "../models/crmOpportunity.model";
import { mapSourceUsingClientRules } from "../normalise/sourceMapping";
import { mappingModel } from "../models/mapping.model";
import { syncLogger } from "../logs/syncLogger";

// [FIX 8, 9, 10] polls GHL with crm_last_sync_at, validates opportunity shape, upserts by crm_opportunity_id
export async function syncCRM(clientId: string, dateRange: DateRange) {
  const client = await prisma.client.findUniqueOrThrow({ where: { id: clientId } });
  const since = client.crm_last_sync_at ?? dateRange.from;

  const raw = await crmIntegration.fetchOpportunities(clientId, since);
  const parsed = ghlOpportunitiesResponseSchema.parse(raw);

  const sourceRules = await mappingModel.findSourceRules(clientId);
  let missingSource = 0;

  for (const opp of parsed.opportunities) {
    const source = opp.source
      ? mapSourceUsingClientRules(opp.source, sourceRules)
      : null;
    if (!source) missingSource++;

    await crmOpportunityModel.upsertByOpportunityId(clientId, {
      crm_opportunity_id: opp.id,
      pipeline_id: opp.pipelineId,
      pipeline_stage_id: opp.pipelineStageId,
      pipeline_stage_name: opp.pipelineStageName,
      status: opp.status,
      monetary_value: opp.monetaryValue,
      contact_id: opp.contactId,
      source: source ?? opp.source,
      medium: opp.medium,
      campaign: opp.campaign,
      appointment_status: opp.appointmentStatus,
      created_at: new Date(opp.createdAt),
      updated_at: new Date(opp.updatedAt),
    });
  }

  const missingPct = parsed.opportunities.length > 0
    ? missingSource / parsed.opportunities.length
    : 0;

  if (missingPct > 0.1) {
    syncLogger.warn({ clientId, missingSourcePct: missingPct, step: "6-syncCRM" });
  }
}
