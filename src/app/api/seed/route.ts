import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/data/catalog';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    { error: 'Public GET method disabled for security. Database seeding must be executed via CLI seed script or authenticated admin POST.' },
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
    const isSecretAuthorized = secretKey && authHeader && authHeader.replace('Bearer ', '') === secretKey;

    if (!isAdminSession && !isSecretAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication or valid seed token required.' },
        { status: 401 }
      );
    }

    console.log('Seeding database via authenticated Admin route...');

    // 1. Admin
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

    // 2. Categories
    const catMap = new Map<string, string>();
    for (let index = 0; index < INITIAL_CATEGORIES.length; index++) {
      const cat = INITIAL_CATEGORIES[index];
      const created = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name },
        create: {
          name: cat.name,
          slug: cat.slug,
          description: `High-quality ${cat.name} with checking warranty in Pakistan`,
          sortOrder: index + 1,
          isFeatured: true,
        },
      });
      catMap.set(cat.slug, created.id);
    }

    // 3. Brands
    const brandMap = new Map<string, string>();
    for (let index = 0; index < INITIAL_BRANDS.length; index++) {
      const b = INITIAL_BRANDS[index];
      const created = await prisma.brand.upsert({
        where: { slug: b.slug },
        update: { name: b.name },
        create: {
          name: b.name,
          slug: b.slug,
          sortOrder: index + 1,
          isActive: true,
        },
      });
      brandMap.set(b.name.toLowerCase(), created.id);
      brandMap.set(b.slug.toLowerCase(), created.id);
    }

    // 4. Site Settings
    const settings = [
      { key: 'whatsapp_number', value: '923134951239' },
      { key: 'phone_number', value: '+92 313 4951239' },
      { key: 'sales_email', value: 'sales@laptopcollection.pk' },
      { key: 'store_address', value: 'Shop # 14-B, 2nd Floor, Hafeez Centre, Main Boulevard Gulberg III, Lahore, Pakistan' },
      { key: 'operating_hours', value: 'Monday – Saturday: 11:00 AM – 9:00 PM' },
    ];
    for (const s of settings) {
      await prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: s,
      });
    }

    // 5. Branches
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

    // 6. Products
    let seededCount = 0;
    const conditionMap: Record<string, 'NEW' | 'USED' | 'REFURBISHED'> = {
      BRAND_NEW: 'NEW',
      NEW: 'NEW',
      REFURBISHED: 'REFURBISHED',
      OPEN_BOX: 'USED',
      USED: 'USED',
    };

    for (const item of INITIAL_PRODUCTS) {
      const catId = item.category?.slug ? catMap.get(item.category.slug) : undefined;
      const brandId = item.brand?.name ? brandMap.get(item.brand.name.toLowerCase()) : undefined;
      const productCondition = conditionMap[item.condition] || 'REFURBISHED';

      const product = await prisma.product.upsert({
        where: { slug: item.slug },
        update: {
          title: item.title,
          basePrice: item.basePrice,
          originalPrice: item.originalPrice,
          stock: item.stock,
          condition: productCondition,
          isFeatured: item.isFeatured ?? false,
          isOnSale: item.isOnSale ?? false,
        },
        create: {
          title: item.title,
          slug: item.slug,
          sku: item.slug.toUpperCase(),
          basePrice: item.basePrice,
          originalPrice: item.originalPrice,
          stock: item.stock,
          condition: productCondition,
          isFeatured: item.isFeatured ?? false,
          isOnSale: item.isOnSale ?? false,
          status: 'PUBLISHED',
          shortDescription: item.shortDescription || item.title,
          description: item.description || item.title,
          warrantyInfo: item.warrantyInfo || '7-Day Checking Warranty & 1-Year Service Support',
          hasChargerOption: !!item.hasChargerOption,
          chargerDeduction: item.chargerDeduction || 2500,
          hasBagOption: !!item.hasBagOption,
          bagPrice: item.bagPrice || 3500,
          colors: item.colors || ['Silver', 'Space Gray'],
          specifications: (item.specifications || {}) as any,
          categoryId: catId || '',
          brandId: brandId || null,
        },
      });

      // Images
      if (item.images && item.images.length > 0) {
        for (let idx = 0; idx < item.images.length; idx++) {
          const img = item.images[idx];
          const imgExists = await prisma.productImage.findFirst({
            where: { productId: product.id, url: img.url },
          });
          if (!imgExists) {
            await prisma.productImage.create({
              data: {
                productId: product.id,
                url: img.url,
                alt: img.alt || item.title,
                isMain: idx === 0,
                sortOrder: idx,
              },
            });
          }
        }
      }

      // Variants
      if (item.variants && item.variants.length > 0) {
        for (let vIdx = 0; vIdx < item.variants.length; vIdx++) {
          const v = item.variants[vIdx];
          const variantExists = await prisma.productVariant.findFirst({
            where: { productId: product.id, label: v.label },
          });
          if (!variantExists) {
            await prisma.productVariant.create({
              data: {
                productId: product.id,
                variantType: v.variantType,
                label: v.label,
                priceAdjustment: v.priceAdjustment,
                isDefault: v.isDefault,
                sortOrder: vIdx,
              },
            });
          }
        }
      }

      // Reviews
      if (item.reviewsList && item.reviewsList.length > 0) {
        for (const r of item.reviewsList) {
          const revExists = await prisma.review.findFirst({
            where: { productId: product.id, authorName: r.authorName },
          });
          if (!revExists) {
            await prisma.review.create({
              data: {
                productId: product.id,
                authorName: r.authorName,
                rating: r.rating,
                title: r.title,
                comment: r.comment,
                isVerified: r.isVerified,
                isApproved: true,
                isDemo: true,
              },
            });
          }
        }
      }

      seededCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Database seeded successfully with ${seededCount} products, categories, brands, settings, and branches.`,
      seededCount,
    });
  } catch (err: any) {
    console.error('API Seed Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to seed database',
      },
      { status: 500 }
    );
  }
}
