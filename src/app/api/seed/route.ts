import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';
import { syncCatalogToDatabase } from '@/lib/syncCatalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      error:
        'Public GET method disabled for security. Database seeding must be executed via CLI seed script or authenticated admin POST.',
    },
    { status: 403 }
  );
}

export async function POST(req: Request) {
  try {
    // 1. Strict Security Guard: Only authenticated Admin or authorized secret key
    const session = await auth();
    const authHeader = req.headers.get('authorization') || req.headers.get('x-seed-secret');
    const secretKey = process.env.NEXTAUTH_SECRET || process.env.SEED_SECRET;

    const isAdminSession = session?.user && (session.user as any).role === 'admin';
    const isSecretAuthorized =
      secretKey && authHeader && authHeader.replace('Bearer ', '') === secretKey;

    if (!isAdminSession && !isSecretAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication or valid seed token required.' },
        { status: 401 }
      );
    }

    console.log('[SEED] Running authenticated database seed...');

    // 1. Admin account
    const hashedPassword = await bcrypt.hash('Admin@LC2024!', 12);
    await prisma.admin.upsert({
      where: { email: 'admin@laptopcollection.pk' },
      update: {},
      create: {
        email: 'admin@laptopcollection.pk',
        name: 'Super Admin',
        hashedPassword,
      },
    });

    // 2. Site Settings
    const settings = [
      { key: 'whatsapp_number', value: '923134951239' },
      { key: 'phone_number', value: '+92 313 4951239' },
      { key: 'sales_email', value: 'sales@laptopcollection.pk' },
      {
        key: 'store_address',
        value:
          'Shop # 14-B, 2nd Floor, Hafeez Centre, Main Boulevard Gulberg III, Lahore, Pakistan',
      },
      { key: 'operating_hours', value: 'Monday – Saturday: 11:00 AM – 9:00 PM' },
    ];
    for (const s of settings) {
      await prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: s,
      });
    }

    // 3. Branches
    const branches = [
      {
        name: 'Lahore Flagship Branch',
        city: 'Lahore',
        address: 'Shop # 14-B, 2nd Floor, Hafeez Centre, Main Boulevard Gulberg III, Lahore',
        contactNumber: '+92 313 4951239',
        operatingHours: 'Monday – Saturday: 11:00 AM – 9:00 PM',
        sortOrder: 1,
      },
      {
        name: 'Islamabad Display Centre',
        city: 'Islamabad',
        address: 'Office 3, Mezzanine Floor, Beverly Centre, Blue Area, Islamabad',
        contactNumber: '+92 313 4951239',
        operatingHours: 'Monday – Saturday: 11:30 AM – 8:30 PM',
        sortOrder: 2,
      },
    ];
    for (const b of branches) {
      const existing = await prisma.branch.findFirst({ where: { name: b.name } });
      if (!existing) {
        await prisma.branch.create({ data: b });
      }
    }

    // 4. Sync Categories, Brands, Products, Images, and Variants
    const syncResult = await syncCatalogToDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database seeded and synchronized successfully!',
      stats: syncResult,
    });
  } catch (error: any) {
    console.error('[SEED] Error during seeding:', error);
    return NextResponse.json(
      { error: error.message || 'Database seeding failed.' },
      { status: 500 }
    );
  }
}
