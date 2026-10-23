import React from 'react';
import type { Metadata } from 'next';
import { getFilteredProducts } from '@/lib/products';
import ProductListingLayout from '@/components/product/ProductListingLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Special Deals & Discounts — Laptop Collection Pakistan",
  description:
    'Exclusive discounted prices on laptops, SSDs, and RAM in Pakistan. Genuine savings with warranty.',
};

export default async function DealsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const data = await getFilteredProducts({
    ...searchParams,
    dealsOnly: true,
  });

  return (
    <ProductListingLayout
      title="Special Deals & Promotions 🔥"
      description="Products with active discount pricing. Genuine hardware savings across Pakistan."
      breadcrumbs={[{ label: 'Special Deals' }]}
      products={data.products}
      total={data.total}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      categories={data.categories}
      brands={data.brands}
    />
  );
}
