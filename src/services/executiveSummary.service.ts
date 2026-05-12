import { prisma } from "@repo/db";
import type { TenantScope } from "@repo/db";
import { buildTenantWhere } from "@repo/db";

export const executiveSummaryService = {
  async getData(scope: TenantScope, filters: Record<string, string>) {
    // TODO: implement
    return {};
  },
};
