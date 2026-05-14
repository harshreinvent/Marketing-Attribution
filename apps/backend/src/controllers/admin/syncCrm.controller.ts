import type { Context } from "hono";
import { z } from "zod";
import { crmSyncService } from "../../services/crmSync.service";
import { ValidationError, NotFoundError } from "../../error/errors";

const schema = z.object({
  clientId: z.string().min(1),
});

export const syncCrmController = {
  async trigger(c: Context) {
    const body = await c.req.json().catch(() => null);
    const result = schema.safeParse(body);
    if (!result.success) throw new ValidationError(result.error.errors[0].message);

    let syncResult;
    try {
      syncResult = await crmSyncService.syncClient(result.data.clientId);
    } catch (e: any) {
      if (e.message?.includes("No CRM integration")) throw new NotFoundError(e.message);
      throw e;
    }

    return c.json({
      clientId:    syncResult.clientId,
      isFirstSync: syncResult.isFirstSync,
      dateRange: {
        from: syncResult.dateRange.from.toISOString(),
        to:   syncResult.dateRange.to.toISOString(),
      },
      upserted: syncResult.upserted,
    });
  },
};
