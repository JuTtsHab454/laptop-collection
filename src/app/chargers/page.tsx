import React from 'react';
import type { Metadata } from 'next';
import { getFilteredProducts } from '@/lib/products';
import ProductListingLayout from '@/components/product/ProductListingLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Laptop Chargers & Adapters in Pakistan — Original & Compatible',
  description:
    'HP, Dell, Lenovo, Apple USB-C and Pin chargers. Safe, genuine power adapters with nationwide delivery.',
};

export default async function ChargersPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const data = await getFilteredProducts({
    ...searchParams,
    category: 'chargers',
  });

  return (
    <ProductListingLayout
      title="Laptop Chargers & Power Adapters"
      description="Replacement and original chargers for HP, Dell, Lenovo, ASUS, and Apple MacBook."
      breadcrumbs={[{ label: 'Accessories', href: '/accessories' }, { label: 'Chargers' }]}
      products={data.products}
      total={data.total}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      categories={data.categories}
      brands={data.brands}
      activeCategorySlug="chargers"
    />
  );
}
