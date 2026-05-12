import { prisma } from "../db/prisma";
import { sendAdminAlert } from "../utils/alerts";

export async function staleSyncAlert() {
  const threshold = new Date(Date.now() - 26 * 60 * 60 * 1000);
  const stale = await prisma.client.findMany({
    where: { last_successful_sync_at: { lt: threshold } },
  });
  for (const c of stale) {
    await sendAdminAlert(`Stale sync: ${c.name} — last sync ${c.last_successful_sync_at?.toISOString()}`);
  }
}
