import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

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

    if (!product) return { title: 'Product Not Found' };

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
  } catch (err) {
    return { title: 'Laptop Collection Pakistan' };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [product, whatsappSetting] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { sortOrder: 'asc' } },
      },
    }),
    prisma.siteSetting.findUnique({ where: { key: 'whatsapp_number' } }),
  ]);

  if (!product || product.status !== 'PUBLISHED') {
    notFound();
  }

  // Related products
  const relatedProducts = await prisma.product.findMany({
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
    image: product.images.map((img) => img.url),
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
        product={product as any}
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
