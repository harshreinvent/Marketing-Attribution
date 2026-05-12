import cron from "node-cron";
import { syncQueue } from "../queue/syncQueue";
import { prisma } from "../db/prisma";

export const syncSchedule = cron.schedule(
  "0 2 * * *",
  async () => {
    const clients = await prisma.client.findMany({ where: { sync_failure_count: { lt: 5 } } });
    for (const client of clients) {
      await syncQueue.add("sync", { clientId: client.id, triggeredBy: "schedule" });
    }
  },
  { scheduled: false }
);
