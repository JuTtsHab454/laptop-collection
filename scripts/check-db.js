const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Check .env.local, .env.production, then .env
const envLocal = path.resolve(process.cwd(), '.env.local');
const envProd = path.resolve(process.cwd(), '.env.production');
if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal });
} else if (fs.existsSync(envProd)) {
  dotenv.config({ path: envProd });
} else {
  dotenv.config();
}

const prisma = new PrismaClient();

async function check() {
  const dbUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  console.log('--- Database Target Configuration ---');
  if (!dbUrl) {
    console.log('DATABASE_URL is NOT set.');
  } else {
    try {
      const u = new URL(dbUrl);
      console.log('DATABASE_URL Host:', u.host);
      console.log('DATABASE_URL Database:', u.pathname.replace('/', ''));
      console.log('DATABASE_URL SSL:', u.searchParams.get('sslmode') || 'default');
      console.log('Is Neon Host:', u.host.includes('neon.tech') ? 'YES (Neon Cloud)' : 'NO (Local/Other)');
    } catch {
      console.log('DATABASE_URL is set but could not be parsed as a URL');
    }
  }

  if (directUrl) {
    try {
      const du = new URL(directUrl);
      console.log('DIRECT_URL Host:', du.host);
      console.log('Is Direct Neon Host:', !du.host.includes('-pooler') && du.host.includes('neon.tech') ? 'YES (Direct unpooled)' : 'Unpooled/Direct');
    } catch {
      console.log('DIRECT_URL is set.');
    }
  } else {
    console.log('DIRECT_URL is NOT set (Prisma will fall back to DATABASE_URL).');
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
