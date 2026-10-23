import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { INITIAL_PRODUCTS } from '@/data/catalog';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { brand: true, category: true, images: { take: 1 } },
    });

    if (product) {
      const title = product.metaTitle || `${product.title} — Laptop Collection Pakistan`;
      const description =
        product.metaDescription ||
        product.shortDescription ||
        `Buy ${product.title} in Pakistan at Laptop Collection. Fast delivery and checking warranty.`;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: product.images[0] ? [{ url: product.images[0].url }] : [],
        },
      };
    }
  } catch (err) {
    // DB offline, fall through to fallback
  }

  // Fallback to in-memory catalog
  const sample = INITIAL_PRODUCTS.find((p) => p.slug === params.slug);
  if (sample) {
    return {
      title: `${sample.title} — Laptop Collection Pakistan`,
      description: sample.shortDescription || `Buy ${sample.title} with warranty across Pakistan.`,
      openGraph: {
        title: sample.title,
        description: sample.shortDescription || '',
        images: sample.images[0] ? [{ url: sample.images[0].url }] : [],
      },
    };
  }

  return { title: 'Product Not Found — Laptop Collection' };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: any = null;
  let whatsappSetting: any = null;
  let relatedProducts: any[] = [];

  try {
    const results = await Promise.all([
      prisma.product.findUnique({
        where: { slug: params.slug },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { sortOrder: 'asc' } },
          reviews: {
            where: { isApproved: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.siteSetting.findUnique({ where: { key: 'whatsapp_number' } }),
    ]);

    product = results[0];
    whatsappSetting = results[1];

    if (product && product.status === 'PUBLISHED') {
      relatedProducts = await prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          categoryId: product.categoryId,
          id: { not: product.id },
        },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch (err) {
    console.warn('Database not available for product page, falling back to catalog:', err);
  }

  // Fallback to sample catalog if not in database
  if (!product || product.status !== 'PUBLISHED') {
    const sample = INITIAL_PRODUCTS.find((p) => p.slug === params.slug);
    if (!sample) {
      notFound();
    }

    product = {
      id: sample.id,
      title: sample.title,
      slug: sample.slug,
      sku: sample.slug.toUpperCase(),
      basePrice: sample.basePrice,
      originalPrice: sample.originalPrice || null,
      condition: sample.condition,
      stock: sample.stock,
      shortDescription: sample.shortDescription || null,
      description: sample.description || null,
      warrantyInfo: sample.warrantyInfo || '7-Day Checking Warranty & 1-Year Service Support',
      hasChargerOption: !!sample.hasChargerOption,
      chargerDeduction: sample.chargerDeduction || 2500,
      hasBagOption: !!sample.hasBagOption,
      bagPrice: sample.bagPrice || 3500,
      colors: sample.colors || ['Silver', 'Space Gray'],
      specifications: sample.specifications || {},
      category: {
        id: sample.category?.slug || 'cat',
        name: sample.category?.name || 'Laptops',
        slug: sample.category?.slug || 'laptops',
      },
      brand: sample.brand ? { name: sample.brand.name } : null,
      images: sample.images.map((img, idx) => ({
        id: `img-${idx}`,
        url: img.url,
        alt: img.alt || sample.title,
        isMain: idx === 0,
      })),
      variants: (sample.variants || []).map((v, idx) => ({
        id: v.id || `var-${idx}`,
        variantType: v.variantType,
        label: v.label,
        priceAdjustment: v.priceAdjustment,
        isDefault: v.isDefault,
      })),
      reviews: (sample.reviewsList || []).map((r) => ({
        id: r.id,
        authorName: r.authorName,
        rating: r.rating,
        title: r.title || null,
        comment: r.comment,
        isVerified: r.isVerified,
        isDemo: r.isDemo,
        createdAt: r.createdAt,
      })),
    };

    relatedProducts = INITIAL_PRODUCTS.filter(
      (p) => p.category?.slug === sample.category?.slug && p.id !== sample.id
    ).slice(0, 4);
  }

  const breadcrumbs = [
    { label: product.category.name, href: `/${product.category.slug}` },
    { label: product.title },
  ];

  // Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription || product.title,
    image: (product.images || []).map((img: any) => img.url),
    brand: product.brand ? { '@type': 'Brand', name: product.brand.name } : undefined,
    sku: product.sku || undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: product.basePrice,
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Laptop Collection',
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <ProductDetailClient
        product={product}
        whatsappNumber={whatsappSetting?.value || '923134951239'}
      />

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-surface-muted space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Related {product.category.name}
            </h2>
            <span className="text-xs font-semibold text-accent-blue">You might also like</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
