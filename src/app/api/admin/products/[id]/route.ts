import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/data/catalog';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: params.id },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { sortOrder: 'asc' } },
        },
      });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Admin Product GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    if (body.originalPrice && Number(body.originalPrice) <= Number(body.basePrice)) {
      return NextResponse.json(
        { error: 'Original comparison price must be strictly greater than the base price.' },
        { status: 400 }
      );
    }

    // 1. Locate existing product in DB by ID or slug
    let existing = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      existing = await prisma.product.findUnique({
        where: { slug: params.id },
      });
    }

    if (!existing) {
      return NextResponse.json(
        {
          error: `Product with ID/slug "${params.id}" does not exist in the database. Please add it as a new product first.`,
        },
        { status: 404 }
      );
    }

    const targetProductId = existing.id;

    // Check slug collision with other products
    if (body.slug && body.slug !== existing.slug) {
      const slugCollision = await prisma.product.findFirst({
        where: { slug: body.slug, id: { not: targetProductId } },
      });
      if (slugCollision) {
        return NextResponse.json(
          { error: `Another product with slug "${body.slug}" already exists.` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 2. Resolve category safely
      let resolvedCategoryId = body.categoryId || existing.categoryId;
      const catExists = await tx.category.findUnique({
        where: { id: resolvedCategoryId },
      });

      if (!catExists) {
        const catBySlug = await tx.category.findUnique({
          where: { slug: resolvedCategoryId },
        });

        if (catBySlug) {
          resolvedCategoryId = catBySlug.id;
        } else {
          const initCat = INITIAL_CATEGORIES.find(
            (c) => c.id === resolvedCategoryId || c.slug === resolvedCategoryId
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
            resolvedCategoryId = provisionedCat.id;
          } else {
            resolvedCategoryId = existing.categoryId;
          }
        }
      }

      // 3. Resolve brand safely
      let resolvedBrandId = body.brandId !== undefined ? body.brandId : existing.brandId;
      if (resolvedBrandId && typeof resolvedBrandId === 'string' && resolvedBrandId.trim() !== '') {
        const brandKey = resolvedBrandId.trim();
        const brandKeyLower = brandKey.toLowerCase();
        const brandExists = await tx.brand.findUnique({
          where: { id: brandKey },
        });

        if (brandExists) {
          resolvedBrandId = brandExists.id;
        } else {
          const brandBySlug = await tx.brand.findFirst({
            where: {
              OR: [
                { slug: brandKeyLower },
                { name: { equals: brandKey, mode: 'insensitive' } },
              ],
            },
          });

          if (brandBySlug) {
            resolvedBrandId = brandBySlug.id;
          } else {
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
              resolvedBrandId = provisionedBrand.id;
            } else {
              resolvedBrandId = null;
            }
          }
        }
      } else {
        resolvedBrandId = null;
      }

      // 4. Update the Product record FIRST
      const prod = await tx.product.update({
        where: { id: targetProductId },
        data: {
          title: body.title !== undefined ? body.title : existing.title,
          slug: body.slug !== undefined ? body.slug : existing.slug,
          sku: body.sku !== undefined ? body.sku : existing.sku,
          categoryId: resolvedCategoryId,
          brandId: resolvedBrandId,
          basePrice: body.basePrice !== undefined ? Number(body.basePrice) : existing.basePrice,
          originalPrice:
            body.originalPrice !== undefined
              ? body.originalPrice
                ? Number(body.originalPrice)
                : null
              : existing.originalPrice,
          status: body.status || existing.status,
          condition: body.condition || existing.condition,
          stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
          lowStockThreshold:
            body.lowStockThreshold !== undefined
              ? Number(body.lowStockThreshold)
              : existing.lowStockThreshold,
          isFeatured: body.isFeatured !== undefined ? !!body.isFeatured : existing.isFeatured,
          isOnSale: body.isOnSale !== undefined ? !!body.isOnSale : existing.isOnSale,
          shortDescription:
            body.shortDescription !== undefined
              ? body.shortDescription
              : existing.shortDescription,
          description: body.description !== undefined ? body.description : existing.description,
          descriptionEdited:
            body.descriptionEdited !== undefined
              ? !!body.descriptionEdited
              : existing.descriptionEdited,
          specifications: body.specifications || existing.specifications || {},
          features: body.features || existing.features || {},
          colors: Array.isArray(body.colors) ? body.colors : existing.colors,
          hasChargerOption:
            body.hasChargerOption !== undefined
              ? !!body.hasChargerOption
              : existing.hasChargerOption,
          chargerDeduction:
            body.chargerDeduction !== undefined
              ? Number(body.chargerDeduction)
              : existing.chargerDeduction,
          hasBagOption:
            body.hasBagOption !== undefined ? !!body.hasBagOption : existing.hasBagOption,
          bagPrice: body.bagPrice !== undefined ? Number(body.bagPrice) : existing.bagPrice,
          warrantyInfo:
            body.warrantyInfo !== undefined ? body.warrantyInfo : existing.warrantyInfo,
          metaTitle: body.metaTitle !== undefined ? body.metaTitle : existing.metaTitle,
          metaDescription:
            body.metaDescription !== undefined
              ? body.metaDescription
              : existing.metaDescription,
        },
      });

      // 5. Replace Images safely using the confirmed targetProductId
      if (Array.isArray(body.images)) {
        await tx.productImage.deleteMany({ where: { productId: targetProductId } });

        const validImages = body.images.filter(
          (img: any) => img && typeof img.url === 'string' && img.url.trim() !== ''
        );

        for (let idx = 0; idx < validImages.length; idx++) {
          const img = validImages[idx];
          await tx.productImage.create({
            data: {
              productId: targetProductId,
              url: img.url.trim(),
              alt: img.alt || prod.title,
              sortOrder: img.sortOrder ?? idx,
              isMain: img.isMain ?? idx === 0,
            },
          });
        }
      }

      // 6. Replace Variants safely using the confirmed targetProductId
      if (Array.isArray(body.variants)) {
        await tx.productVariant.deleteMany({ where: { productId: targetProductId } });

        const validVariants = body.variants.filter(
          (v: any) => v && typeof v.label === 'string' && v.label.trim() !== ''
        );

        for (let idx = 0; idx < validVariants.length; idx++) {
          const v = validVariants[idx];
          await tx.productVariant.create({
            data: {
              productId: targetProductId,
              variantType: v.variantType || 'spec',
              label: v.label.trim(),
              priceAdjustment: Number(v.priceAdjustment) || 0,
              stock: v.stock ? Number(v.stock) : null,
              isDefault: !!v.isDefault,
              sortOrder: v.sortOrder ?? idx,
            },
          });
        }
      }

      // Return fully populated updated product
      return await tx.product.findUnique({
        where: { id: targetProductId },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { sortOrder: 'asc' } },
        },
      });
    });

    // Revalidate paths
    try {
      revalidatePath('/admin');
      revalidatePath('/admin/products');
      if (updated?.slug) {
        revalidatePath(`/products/${updated.slug}`);
      }
    } catch (e) {
      // Revalidation warning
    }

    return NextResponse.json({ product: updated });
  } catch (error: any) {
    console.error('Admin Product PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    let existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      existing = await prisma.product.findUnique({ where: { slug: params.id } });
    }

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: body,
    });

    try {
      revalidatePath('/admin');
      revalidatePath('/admin/products');
    } catch (e) {}

    return NextResponse.json({ product: updated });
  } catch (error: any) {
    console.error('Admin Product PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Failed to patch product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      existing = await prisma.product.findUnique({ where: { slug: params.id } });
    }

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id: existing.id },
    });

    try {
      revalidatePath('/admin');
      revalidatePath('/admin/products');
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Product DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
