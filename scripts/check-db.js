const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function check() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('DATABASE_URL is not set.');
    return;
  }

  try {
    const u = new URL(dbUrl);
    console.log('Target DB Host:', u.host);
    console.log('Target DB Name:', u.pathname.replace('/', ''));
    console.log('Target DB SSL mode:', u.searchParams.get('sslmode') || 'default');
  } catch (err) {
    console.log('Could not parse DATABASE_URL as URL');
  }

  console.log('\n--- Testing SELECT 1 ---');
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('Connectivity Test: SUCCESS! Database is reachable:', result);

    console.log('\n--- Checking Existing Tables ---');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log('Tables found in database:', tables.map(t => t.table_name));

    const productCount = await prisma.product.count().catch(() => null);
    const categoryCount = await prisma.category.count().catch(() => null);
    console.log('Current Product count in DB:', productCount);
    console.log('Current Category count in DB:', categoryCount);
  } catch (err) {
    console.error('Database connection test FAILED:');
    console.error(err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
