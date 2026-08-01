import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Show admin users
  const admins = await prisma.admin_users.findMany({
    select: { email: true, name: true, role: true }
  });
  console.log('\nAdmin users:', admins);
  
  // Show all events
  const events = await prisma.events.findMany({
    select: { id: true, title: true, slug: true, is_membership: true, status: true }
  });
  console.log('\nEvents:', events.map(e => `${e.title} | ${e.slug} | is_membership=${e.is_membership}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
