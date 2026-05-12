import { prisma } from "@repo/db";

async function main() {
  const integrations = await prisma.integration.findMany({
    where: { token_expiry: { not: null } },
    include: { client: { select: { name: true } } },
  });

  const now = new Date();
  for (const intg of integrations) {
    if (!intg.token_expiry) continue;
    const daysLeft = Math.ceil((intg.token_expiry.getTime() - now.getTime()) / 86_400_000);
    console.log(`${intg.client.name} / ${intg.platform}: ${daysLeft} days until expiry`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
