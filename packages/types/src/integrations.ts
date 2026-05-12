// [FIX 8] renamed from CrmLead
export type CrmOpportunity = {
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
  created_at: string;
  updated_at: string;
};
