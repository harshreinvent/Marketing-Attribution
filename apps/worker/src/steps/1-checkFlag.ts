import { prisma } from "../db/prisma";
import { daysAgo, yesterday } from "@repo/utils";
import type { DateRange } from "@repo/types";

export async function checkFlag(clientId: string): Promise<{ dateRange: DateRange; isFirstRun: boolean }> {
  const client = await prisma.client.findUniqueOrThrow({ where: { id: clientId } });
  const isFirstRun = !client.is_data_initialized;
  return {
    dateRange: {
      from: isFirstRun ? daysAgo(90) : (client.last_successful_sync_at ?? daysAgo(2)),
      to: yesterday(),
    },
    isFirstRun,
  };
}
