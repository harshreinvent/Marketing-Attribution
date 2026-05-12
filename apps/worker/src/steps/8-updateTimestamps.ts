import { prisma } from "../db/prisma";

export async function updateTimestamps(clientId: string, isFirstRun: boolean) {
  await prisma.client.update({
    where: { id: clientId },
    data: {
      last_successful_sync_at: new Date(),
      sync_failure_count: 0,
      ...(isFirstRun ? { is_data_initialized: true } : {}),
    },
  });
}
