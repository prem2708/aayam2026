import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function seed() {
  const password = process.argv[2] || 'Admin@123456';
  const hash = await bcrypt.hash(password, 12);

  try {
    const data = await prisma.admin_users.upsert({
      where: { email: 'admin@aayamtechfest.com' },
      update: {
        password_hash: hash,
        name: 'Super Admin',
        role: 'super_admin',
        totp_enabled: false,
      },
      create: {
        email: 'admin@aayamtechfest.com',
        password_hash: hash,
        name: 'Super Admin',
        role: 'super_admin',
        totp_enabled: false,
      },
    });

    console.log('✅ Super admin seeded:', data);
    console.log('   Email: admin@aayamtechfest.com');
    console.log('   Password:', password);
  } catch (error: any) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
