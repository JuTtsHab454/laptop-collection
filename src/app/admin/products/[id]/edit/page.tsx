import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/data/catalog';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  let product: any = null;
  let categories: any[] = [];
  let brands: any[] = [];

  try {
    let productResult = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!productResult) {
      productResult = await prisma.product.findUnique({
        where: { slug: params.id },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { sortOrder: 'asc' } },
        },
      });
    }

    if (!productResult) {
      const fallback = INITIAL_PRODUCTS.find((p) => p.id === params.id || p.slug === params.id);
      if (fallback) {
        try {
          const { syncCatalogToDatabase } = await import('@/lib/syncCatalog');
          await syncCatalogToDatabase();
          productResult = await prisma.product.findUnique({
            where: { slug: fallback.slug },
            include: {
              images: { orderBy: { sortOrder: 'asc' } },
              variants: { orderBy: { sortOrder: 'asc' } },
            },
          });
        } catch (e) {}
      }
    }

    const results = await Promise.all([
      Promise.resolve(productResult),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, name: true, slug: true },
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, name: true, slug: true },
      }),
    ]);
    product = results[0];
    categories = results[1];
    brands = results[2];
  } catch (err) {
    console.warn('[EDIT PRODUCT PAGE] DB fetch error, falling back to static catalog:', err);
  }

  // Fallback to static catalog item if database returned null or threw
  if (!product) {
    const fallback = INITIAL_PRODUCTS.find((p) => p.id === params.id || p.slug === params.id);
    if (!fallback) {
      notFound();
    }
    product = {
      ...fallback,
      brandId: fallback.brand?.name || '',
      categoryId: fallback.category?.slug || '',
      images: fallback.images.map((img, idx) => ({
        id: `img-${idx}`,
        url: img.url,
        alt: img.alt || fallback.title,
        isMain: idx === 0,
        sortOrder: idx,
      })),
      variants: (fallback.variants || []).map((v, idx) => ({
        variantType: v.variantType,
        label: v.label,
        priceAdjustment: v.priceAdjustment,
        isDefault: v.isDefault,
        stock: 5,
        sortOrder: idx,
      })),
    };
  }

  if (!categories || categories.length === 0) {
    categories = INITIAL_CATEGORIES;
  }
  if (!brands || brands.length === 0) {
    brands = INITIAL_BRANDS;
  }

  const formattedProduct = {
    ...product,
    brandId: product.brandId || '',
    specifications: (product.specifications || {}) as Record<string, any>,
    features: (product.features || {}) as Record<string, any>,
    images: (product.images || []).map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || undefined,
      isMain: img.isMain,
      sortOrder: img.sortOrder,
    })),
    variants: (product.variants || []).map((v: any) => ({
      variantType: v.variantType,
      label: v.label,
      priceAdjustment: v.priceAdjustment,
      isDefault: v.isDefault,
      stock: v.stock || undefined,
    })),
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-brand-steel pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">Edit Product</h1>
        <p className="text-xs text-slate-400 mt-1">
          Modify specifications, pricing adjustments, image gallery, or stock.
        </p>
      </div>

      <ProductForm
        initialData={formattedProduct as any}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
