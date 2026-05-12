import { prisma } from "../db/prisma";

export const crmOpportunityModel = {
  // [FIX 8] unique constraint: (client_id, crm_opportunity_id)
  async upsertByOpportunityId(clientId: string, data: {
    crm_opportunity_id: string;
    pipeline_id?: string;
    pipeline_stage_id?: string;
    pipeline_stage_name?: string;
    status?: string;
    monetary_value?: number;
    contact_id?: string;
    source?: string;
    medium?: string;
    campaign?: string;
    appointment_status?: string;
    created_at: Date;
    updated_at: Date;
  }) {
    return prisma.crmOpportunity.upsert({
      where: {
        client_id_crm_opportunity_id: {
          client_id: clientId,
          crm_opportunity_id: data.crm_opportunity_id,
        },
      },
      update: { ...data },
      create: { client_id: clientId, location_id: "", ...data },
    });
  },
};
