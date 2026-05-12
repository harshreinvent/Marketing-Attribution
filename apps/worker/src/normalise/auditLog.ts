import { prisma } from "../db/prisma";

export async function auditLog(entry: {
  clientId: string;
  table: string;
  original: string;
  normalised: string;
}) {
  await prisma.normalisationAudit.create({
    data: {
      client_id: entry.clientId,
      table_name: entry.table,
      original: entry.original,
      normalised: entry.normalised,
    },
  });
}
