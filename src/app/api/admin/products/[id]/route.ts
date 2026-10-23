import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { sortOrder: 'asc' } },
      },
    });

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

    if (body.originalPrice && body.originalPrice <= body.basePrice) {
      return NextResponse.json(
        { error: 'Original comparison price must be strictly greater than the base price.' },
        { status: 400 }
      );
    }

    // Check slug collision with other products
    if (body.slug) {
      const existing = await prisma.product.findFirst({
        where: { slug: body.slug, id: { not: params.id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: `Another product with slug "${body.slug}" already exists.` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Re-create images if supplied
      if (Array.isArray(body.images)) {
        await tx.productImage.deleteMany({ where: { productId: params.id } });
        await tx.productImage.createMany({
          data: body.images.map((img: any, idx: number) => ({
            productId: params.id,
            url: img.url,
            alt: img.alt || body.title,
            sortOrder: img.sortOrder ?? idx,
            isMain: img.isMain ?? idx === 0,
          })),
        });
      }

      // Re-create variants if supplied
      if (Array.isArray(body.variants)) {
        await tx.productVariant.deleteMany({ where: { productId: params.id } });
        await tx.productVariant.createMany({
          data: body.variants.map((v: any, idx: number) => ({
            productId: params.id,
            variantType: v.variantType,
            label: v.label,
            priceAdjustment: Number(v.priceAdjustment) || 0,
            stock: v.stock ? Number(v.stock) : null,
            isDefault: !!v.isDefault,
            sortOrder: v.sortOrder ?? idx,
          })),
        });
      }

      const prod = await tx.product.update({
        where: { id: params.id },
        data: {
          title: body.title,
          slug: body.slug,
          sku: body.sku,
          categoryId: body.categoryId,
          brandId: body.brandId || null,
          basePrice: Number(body.basePrice),
          originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
          status: body.status,
          condition: body.condition,
          stock: Number(body.stock),
          lowStockThreshold: Number(body.lowStockThreshold) || 3,
          isFeatured: !!body.isFeatured,
          isOnSale: !!body.isOnSale,
          shortDescription: body.shortDescription,
          description: body.description,
          descriptionEdited: !!body.descriptionEdited,
          specifications: body.specifications || {},
          features: body.features || {},
          colors: Array.isArray(body.colors) ? body.colors : [],
          hasChargerOption: !!body.hasChargerOption,
          chargerDeduction: Number(body.chargerDeduction) || 3000,
          hasBagOption: !!body.hasBagOption,
          bagPrice: Number(body.bagPrice) || 0,
          warrantyInfo: body.warrantyInfo,
          metaTitle: body.metaTitle,
          metaDescription: body.metaDescription,
        },
        include: {
          images: true,
          variants: true,
        },
      });

      return prod;
    });

    return NextResponse.json({ product: updated });
  } catch (error: any) {
    console.error('Admin Product PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // Partial updates like inline stock change
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: body,
    });

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
    await prisma.product.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Product DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
