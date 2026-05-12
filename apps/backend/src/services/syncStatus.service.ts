import { prisma } from "@repo/db";
import type { SyncStatusResponse, AdminSyncStatusResponse } from "@repo/types";

// [FIX 4]
export const syncStatusService = {
  async getForClient(clientId: string): Promise<SyncStatusResponse> {
    const client = await prisma.client.findUniqueOrThrow({ where: { id: clientId } });
    return {
      clientId: client.id,
      lastSuccessfulSyncAt: client.last_successful_sync_at?.toISOString() ?? null,
      syncFailureCount: client.sync_failure_count,
      isDataInitialized: client.is_data_initialized,
    };
  },

  async getAll(): Promise<AdminSyncStatusResponse> {
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        last_successful_sync_at: true,
        sync_failure_count: true,
        is_data_initialized: true,
      },
    });
    return clients.map((c) => ({
      clientId: c.id,
      lastSuccessfulSyncAt: c.last_successful_sync_at?.toISOString() ?? null,
      syncFailureCount: c.sync_failure_count,
      isDataInitialized: c.is_data_initialized,
    }));
  },
};
