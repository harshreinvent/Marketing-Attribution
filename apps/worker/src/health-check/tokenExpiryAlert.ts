import { prisma } from "../db/prisma";
import { sendAdminAlert } from "../utils/alerts";

export async function tokenExpiryAlert() {
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const expiring = await prisma.integration.findMany({
    where: { token_expiry: { lte: in7Days } },
    include: { client: { select: { name: true } } },
  });
  for (const intg of expiring) {
    await sendAdminAlert(`Token expiry: ${intg.client.name} / ${intg.platform} expires ${intg.token_expiry?.toISOString()}`);
  }
}
