import { prisma } from "@repo/db";
import { buildTenantWhere } from "@repo/db";
import type { TenantScope } from "@repo/db";

// [FIX 8] was lead.model.ts — queries crm_opportunities table
export const crmOpportunityModel = {
  async findByRange(scope: TenantScope, from: Date, to: Date) {
    return prisma.crmOpportunity.findMany({
      where: {
        ...buildTenantWhere(scope),
        created_at: { gte: from, lte: to },
      },
    });
  },

  async countBySource(scope: TenantScope, from: Date, to: Date) {
    return prisma.crmOpportunity.groupBy({
      by: ["source"],
      where: {
        ...buildTenantWhere(scope),
        created_at: { gte: from, lte: to },
      },
      _count: { id: true },
    });
  },

  async countByStage(scope: TenantScope, from: Date, to: Date) {
    return prisma.crmOpportunity.groupBy({
      by: ["pipeline_stage_name"],
      where: {
        ...buildTenantWhere(scope),
        created_at: { gte: from, lte: to },
      },
      _count: { id: true },
    });
  },
};
