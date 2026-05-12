import { prisma } from "../db/prisma";
import { logger } from "../logs/logger";

export async function handleSyncError(clientId: string, error: unknown) {
  logger.error({ clientId, error });
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) return;

  const newCount = client.sync_failure_count + 1;
  await prisma.client.update({
    where: { id: clientId },
    data: {
      sync_failure_count: newCount,
      // Pause further syncs at 5 consecutive failures
    },
  });
}
