import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/data/catalog';

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
    if (body.originalPrice && Number(body.originalPrice) <= Number(body.basePrice)) {
      return NextResponse.json(
        { error: 'Original comparison price must be strictly greater than the base price.' },
        { status: 400 }
      );
    }

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = parsed.data;

    // Check unique slug with fallback auto-unique suffix
    let targetSlug = data.slug.trim().toLowerCase();
    const existing = await prisma.product.findUnique({
      where: { slug: targetSlug },
    });
    if (existing) {
      targetSlug = `${targetSlug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.$transaction(async (tx) => {
      // 1. Resolve or provision Category safely
      let realCategoryId = data.categoryId;
      const categoryExists = await tx.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!categoryExists) {
        // Try looking up by slug
        const categoryBySlug = await tx.category.findUnique({
          where: { slug: data.categoryId },
        });

        if (categoryBySlug) {
          realCategoryId = categoryBySlug.id;
        } else {
          // Look up in INITIAL_CATEGORIES and auto-provision in DB
          const initCat = INITIAL_CATEGORIES.find(
            (c) => c.id === data.categoryId || c.slug === data.categoryId
          );
          if (initCat) {
            const provisionedCat = await tx.category.upsert({
              where: { slug: initCat.slug },
              update: { name: initCat.name },
              create: {
                name: initCat.name,
                slug: initCat.slug,
                description: `${initCat.name} collection`,
                isActive: true,
                isFeatured: true,
              },
            });
            realCategoryId = provisionedCat.id;
          } else {
            // Default fallback to first category in DB or provision 'laptops'
            let fallbackCat = await tx.category.findFirst();
            if (!fallbackCat) {
              fallbackCat = await tx.category.create({
                data: {
                  name: 'Laptops',
                  slug: 'laptops',
                  description: 'Laptop collection',
                  isActive: true,
                  isFeatured: true,
                },
              });
            }
            realCategoryId = fallbackCat.id;
          }
        }
      }

      // 2. Resolve or provision Brand safely
      let realBrandId: string | null = null;
      if (data.brandId && data.brandId.trim() !== '') {
        const brandKey = data.brandId.trim();
        const brandKeyLower = brandKey.toLowerCase();
        const brandExists = await tx.brand.findUnique({
          where: { id: brandKey },
        });

        if (brandExists) {
          realBrandId = brandExists.id;
        } else {
          // Try lookup by slug or name
          const brandBySlug = await tx.brand.findFirst({
            where: {
              OR: [
                { slug: brandKeyLower },
                { name: { equals: brandKey, mode: 'insensitive' } },
              ],
            },
          });

          if (brandBySlug) {
            realBrandId = brandBySlug.id;
          } else {
            // Try lookup in INITIAL_BRANDS and auto-provision
            const initBrand = INITIAL_BRANDS.find(
              (b) =>
                b.id === brandKey ||
                b.slug === brandKeyLower ||
                b.name.toLowerCase() === brandKeyLower
            );

            if (initBrand) {
              const provisionedBrand = await tx.brand.upsert({
                where: { slug: initBrand.slug },
                update: { name: initBrand.name },
                create: {
                  name: initBrand.name,
                  slug: initBrand.slug,
                  isActive: true,
                },
              });
              realBrandId = provisionedBrand.id;
            }
          }
        }
      }

      // 3. Create the Product record FIRST
      const newProduct = await tx.product.create({
        data: {
          title: data.title,
          slug: targetSlug,
          sku: data.sku || `LC-${Date.now().toString().slice(-6)}`,
          categoryId: realCategoryId,
          brandId: realBrandId,
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
        },
      });

      // 4. Create ProductImages explicitly using the verified newProduct.id
      if (Array.isArray(data.images) && data.images.length > 0) {
        const validImages = data.images.filter(
          (img) => img && typeof img.url === 'string' && img.url.trim() !== ''
        );

        for (let idx = 0; idx < validImages.length; idx++) {
          const img = validImages[idx];
          await tx.productImage.create({
            data: {
              productId: newProduct.id,
              url: img.url.trim(),
              alt: img.alt || newProduct.title,
              sortOrder: img.sortOrder ?? idx,
              isMain: img.isMain ?? idx === 0,
            },
          });
        }
      }

      // 5. Create ProductVariants explicitly using the verified newProduct.id
      if (Array.isArray(data.variants) && data.variants.length > 0) {
        const validVariants = data.variants.filter(
          (v) => v && typeof v.label === 'string' && v.label.trim() !== ''
        );

        for (let idx = 0; idx < validVariants.length; idx++) {
          const v = validVariants[idx];
          await tx.productVariant.create({
            data: {
              productId: newProduct.id,
              variantType: v.variantType || 'spec',
              label: v.label.trim(),
              priceAdjustment: Number(v.priceAdjustment) || 0,
              stock: v.stock !== undefined && v.stock !== null ? Number(v.stock) : null,
              isDefault: !!v.isDefault,
              sortOrder: v.sortOrder ?? idx,
            },
          });
        }
      }

      // Return the newly created product with relations populated
      return await tx.product.findUnique({
        where: { id: newProduct.id },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { sortOrder: 'asc' } },
        },
      });
    });

    // Revalidate affected Next.js routes
    try {
      revalidatePath('/admin');
      revalidatePath('/admin/products');
      revalidatePath('/');
      revalidatePath('/laptops');
    } catch (e) {
      // Revalidation warning silently captured in API routes
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Admin Products POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product in database.' },
      { status: 500 }
    );
  }
}
