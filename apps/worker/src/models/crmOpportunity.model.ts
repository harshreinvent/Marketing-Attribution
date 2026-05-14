import { prisma } from "../db/prisma";

export const crmOpportunityModel = {
  async upsertByOpportunityId(clientId: string, data: {
    crm_opportunity_id: string;
    pipeline_id?: string | null;
    pipeline_stage_id?: string | null;
    pipeline_stage_name?: string | null;
    status?: string | null;
    monetary_value?: number | null;
    contact_id?: string | null;
    source?: string | null;
    medium?: string | null;
    campaign?: string | null;
    appointment_status?: string | null;
    crm_created_at: Date;
    crm_updated_at: Date;
  }) {
    return prisma.crmOpportunity.upsert({
      where: {
        client_id_crm_opportunity_id: {
          client_id: clientId,
          crm_opportunity_id: data.crm_opportunity_id,
        },
      },
      update: {
        pipeline_stage_name: data.pipeline_stage_name,
        status:              data.status,
        monetary_value:      data.monetary_value,
        source:              data.source,
        medium:              data.medium,
        campaign:            data.campaign,
        appointment_status:  data.appointment_status,
        crm_updated_at:      data.crm_updated_at,
      },
      create: {
        client_id:           clientId,
        crm_opportunity_id:  data.crm_opportunity_id,
        pipeline_id:         data.pipeline_id,
        pipeline_stage_id:   data.pipeline_stage_id,
        pipeline_stage_name: data.pipeline_stage_name,
        status:              data.status,
        monetary_value:      data.monetary_value,
        contact_id:          data.contact_id,
        source:              data.source,
        medium:              data.medium,
        campaign:            data.campaign,
        appointment_status:  data.appointment_status,
        crm_created_at:      data.crm_created_at,
        crm_updated_at:      data.crm_updated_at,
      },
    });
  },
};
