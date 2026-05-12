import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 2 test clients
  const clientA = await prisma.client.upsert({
    where: { slug: "test-client-a" },
    update: {},
    create: {
      name: "Test Client A",
      slug: "test-client-a",
    },
  });

  const clientB = await prisma.client.upsert({
    where: { slug: "test-client-b" },
    update: {},
    create: {
      name: "Test Client B",
      slug: "test-client-b",
    },
  });

  // Locations for Client A
  await prisma.location.createMany({
    data: [
      { client_id: clientA.id, name: "Mumbai", slug: "mumbai" },
      { client_id: clientA.id, name: "Delhi", slug: "delhi" },
      { client_id: clientA.id, name: "Bangalore", slug: "bangalore" },
    ],
    skipDuplicates: true,
  });

  // Locations for Client B
  await prisma.location.createMany({
    data: [
      { client_id: clientB.id, name: "Chennai", slug: "chennai" },
      { client_id: clientB.id, name: "Hyderabad", slug: "hyderabad" },
    ],
    skipDuplicates: true,
  });

  // Sample opportunities for Client A
  const locations = await prisma.location.findMany({ where: { client_id: clientA.id } });

  for (let i = 1; i <= 10; i++) {
    const location = locations[i % locations.length];
    await prisma.crmOpportunity.upsert({
      where: {
        client_id_crm_opportunity_id: {
          client_id: clientA.id,
          crm_opportunity_id: `opp-seed-${i}`,
        },
      },
      update: {},
      create: {
        client_id: clientA.id,
        location_id: location.id,
        crm_opportunity_id: `opp-seed-${i}`,
        pipeline_stage_name: i % 2 === 0 ? "New Lead" : "Contacted",
        status: "open",
        monetary_value: 5000 + i * 1000,
        source: i % 3 === 0 ? "google" : i % 3 === 1 ? "meta" : "organic",
        created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        updated_at: new Date(),
      },
    });
  }

  console.log("Seed complete:", { clientA: clientA.id, clientB: clientB.id });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
