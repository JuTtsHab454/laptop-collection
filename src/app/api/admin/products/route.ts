import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const productSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug is required'),
  sku: z.string().optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional().nullable(),
  basePrice: z.number().min(1, 'Base price must be greater than 0'),
  originalPrice: z.number().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']).default('NEW'),
  stock: z.number().min(0, 'Stock cannot be negative').default(0),
  lowStockThreshold: z.number().min(0).default(3),
  isFeatured: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionEdited: z.boolean().default(false),
  specifications: z.record(z.any()).optional().nullable(),
  features: z.record(z.any()).optional().nullable(),
  colors: z.array(z.string()).default([]),
  hasChargerOption: z.boolean().default(false),
  chargerDeduction: z.number().default(3000),
  hasBagOption: z.boolean().default(false),
  bagPrice: z.number().default(0),
  warrantyInfo: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  images: z
    .array(
      z.object({
        url: z.string(),
        alt: z.string().optional().nullable(),
        sortOrder: z.number().default(0),
        isMain: z.boolean().default(false),
      })
    )
    .default([]),
  variants: z
    .array(
      z.object({
        variantType: z.string(),
        label: z.string(),
        priceAdjustment: z.number().default(0),
        stock: z.number().optional().nullable(),
        isDefault: z.boolean().default(false),
        sortOrder: z.number().default(0),
      })
    )
    .default([]),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const where: any = {};

    if (category) where.categoryId = category;
    if (brand) where.brandId = brand;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { sortOrder: 'asc' } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate original price is genuinely higher if set
    if (body.originalPrice && body.originalPrice <= body.basePrice) {
      return NextResponse.json(
        { error: 'Original comparison price must be strictly greater than the base price.' },
        { status: 400 }
      );
    }

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Check unique slug
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: `A product with slug "${data.slug}" already exists. Please choose a different title or slug.` },
        { status: 400 }
      );
    }

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          title: data.title,
          slug: data.slug,
          sku: data.sku,
          categoryId: data.categoryId,
          brandId: data.brandId || null,
          basePrice: data.basePrice,
          originalPrice: data.originalPrice || null,
          status: data.status,
          condition: data.condition,
          stock: data.stock,
          lowStockThreshold: data.lowStockThreshold,
          isFeatured: data.isFeatured,
          isOnSale: data.isOnSale,
          shortDescription: data.shortDescription,
          description: data.description,
          descriptionEdited: data.descriptionEdited,
          specifications: data.specifications || {},
          features: data.features || {},
          colors: data.colors,
          hasChargerOption: data.hasChargerOption,
          chargerDeduction: data.chargerDeduction,
          hasBagOption: data.hasBagOption,
          bagPrice: data.bagPrice,
          warrantyInfo: data.warrantyInfo,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          images: {
            create: data.images.map((img, idx) => ({
              url: img.url,
              alt: img.alt || data.title,
              sortOrder: img.sortOrder ?? idx,
              isMain: img.isMain ?? idx === 0,
            })),
          },
          variants: {
            create: data.variants.map((v, idx) => ({
              variantType: v.variantType,
              label: v.label,
              priceAdjustment: v.priceAdjustment,
              stock: v.stock,
              isDefault: v.isDefault,
              sortOrder: v.sortOrder ?? idx,
            })),
          },
        },
        include: {
          images: true,
          variants: true,
        },
      });

      return created;
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Admin Products POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
