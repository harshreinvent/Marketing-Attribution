import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "@repo/config";

// Transaction pooling mode, connection_limit: 5 for worker
export const prisma = new PrismaClient({
  datasources: { db: { url: getDatabaseUrl("worker") } },
});
