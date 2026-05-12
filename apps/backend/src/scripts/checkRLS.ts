import { prisma } from "@repo/db";

async function main() {
  const tables: { tablename: string; rowsecurity: boolean }[] = await prisma.$queryRaw`
    SELECT tablename, rowsecurity FROM pg_tables
    WHERE schemaname = 'public'
  `;

  for (const t of tables) {
    if (!t.rowsecurity) {
      console.warn(`RLS disabled on: ${t.tablename} — enabling`);
      await prisma.$executeRawUnsafe(`ALTER TABLE "${t.tablename}" ENABLE ROW LEVEL SECURITY`);
    }
  }
  console.log("RLS check complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());
