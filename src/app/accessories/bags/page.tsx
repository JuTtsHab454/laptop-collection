import React from 'react';
import type { Metadata } from 'next';
import { getFilteredProducts } from '@/lib/products';
import ProductListingLayout from '@/components/product/ProductListingLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Laptop Bags & Sleeves in Pakistan — Backpacks & Messenger Bags',
  description: 'Durable, protective laptop backpacks, sleeves, and shoulder bags in Pakistan.',
};

export default async function BagsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const data = await getFilteredProducts({
    ...searchParams,
    category: 'laptop-bags',
  });

  return (
    <ProductListingLayout
      title="Laptop Bags & Sleeves"
      description="Protective carry bags, water-resistant backpacks, and padded sleeves for 13 to 17 inch laptops."
      breadcrumbs={[{ label: 'Accessories', href: '/accessories' }, { label: 'Laptop Bags' }]}
      products={data.products}
      total={data.total}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      categories={data.categories}
      brands={data.brands}
      activeCategorySlug="laptop-bags"
    />
  );
}
