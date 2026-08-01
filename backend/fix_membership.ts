import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Set ALL events to is_membership = true for testing
  const events = await prisma.events.findMany({ where: { deleted_at: null } });
  console.log(`Found ${events.length} events`);
  for (const e of events) {
    await prisma.events.update({
      where: { id: e.id },
      data: { is_membership: true },
    });
    console.log(`Updated: ${e.title} -> is_membership=true`);
  }
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
