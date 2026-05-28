import { PrismaClient, UserRole } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // ── Agency ──────────────────────────────────────────────────────────────────
  const agency = await prisma.agency.upsert({
    where:  { slug: 'reinvent-digital' },
    update: {},
    create: { name: 'Reinvent Digital', slug: 'reinvent-digital' },
  })

  // ── Admin user ──────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Admin@123!', 10)
  await prisma.user.upsert({
    where:  { email: 'admin@reinventdigital.com' },
    update: {},
    create: {
      email:     'admin@reinventdigital.com',
      password:  passwordHash,
      firstName: 'Agency',
      lastName:  'Admin',
      role:      UserRole.AGENCY_ADMIN,
      agencyId:  agency.id,
    },
  })

  // ── Test clients ─────────────────────────────────────────────────────────────
  const clientA = await prisma.client.upsert({
    where:  { slug: 'test-client-a' },
    update: {},
    create: {
      name:     'Test Client A',
      slug:     'test-client-a',
      agencyId: agency.id,
    },
  })

  const clientB = await prisma.client.upsert({
    where:  { slug: 'test-client-b' },
    update: {},
    create: {
      name:     'Test Client B',
      slug:     'test-client-b',
      agencyId: agency.id,
    },
  })

  // ── Locations for Client A ───────────────────────────────────────────────────
  await prisma.location.createMany({
    data: [
      { clientId: clientA.id, name: 'Mumbai',    slug: 'mumbai',    city: 'Mumbai' },
      { clientId: clientA.id, name: 'Delhi',     slug: 'delhi',     city: 'Delhi' },
      { clientId: clientA.id, name: 'Bangalore', slug: 'bangalore', city: 'Bangalore' },
    ],
    skipDuplicates: true,
  })

  // ── Locations for Client B ───────────────────────────────────────────────────
  await prisma.location.createMany({
    data: [
      { clientId: clientB.id, name: 'Chennai',   slug: 'chennai',   city: 'Chennai' },
      { clientId: clientB.id, name: 'Hyderabad', slug: 'hyderabad', city: 'Hyderabad' },
    ],
    skipDuplicates: true,
  })

  // ── Sample CRM opportunities for Client A ───────────────────────────────────
  for (let i = 1; i <= 10; i++) {
    const crmTs = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    await prisma.crmOpportunity.upsert({
      where: {
        clientId_crmOpportunityId: {
          clientId:         clientA.id,
          crmOpportunityId: `opp-seed-${i}`,
        },
      },
      update: {},
      create: {
        clientId:          clientA.id,
        crmOpportunityId:  `opp-seed-${i}`,
        pipelineStageName: i % 2 === 0 ? 'New Lead' : 'Contacted',
        status:            'open',
        monetaryValue:     5000 + i * 1000,
        source:            i % 3 === 0 ? 'google' : i % 3 === 1 ? 'meta' : 'organic',
        crmCreatedAt:      crmTs,
        crmUpdatedAt:      crmTs,
      },
    })
  }

  console.log('✅ Seed complete:', { agencyId: agency.id, clientA: clientA.id, clientB: clientB.id })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
