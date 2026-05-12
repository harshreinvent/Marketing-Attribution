import { prisma } from "../db/prisma";
import { sendAdminAlert } from "../utils/alerts";

export async function rlsMonitor() {
  const tables: { tablename: string; rowsecurity: boolean }[] = await prisma.$queryRaw`
    SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'
  `;
  for (const t of tables) {
    if (!t.rowsecurity) {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${t.tablename}" ENABLE ROW LEVEL SECURITY`);
      await sendAdminAlert(`CRITICAL: RLS was disabled on ${t.tablename} — auto re-enabled`);
    }
  }
}
