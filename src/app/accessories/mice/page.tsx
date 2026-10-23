import React from 'react';
import type { Metadata } from 'next';
import { getFilteredProducts } from '@/lib/products';
import ProductListingLayout from '@/components/product/ProductListingLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mice & Peripherals in Pakistan — Wireless & Bluetooth Mice',
  description: 'Precision wireless, Bluetooth, and wired computer mice for work and gaming in Pakistan.',
};

export default async function MicePage({ searchParams }: { searchParams: Record<string, string> }) {
  const data = await getFilteredProducts({
    ...searchParams,
    category: 'mice-accessories',
  });

  return (
    <ProductListingLayout
      title="Mice & Peripherals"
      description="Reliable wireless, dual-mode, and ergonomic mice for laptops."
      breadcrumbs={[{ label: 'Accessories', href: '/accessories' }, { label: 'Mice' }]}
      products={data.products}
      total={data.total}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      categories={data.categories}
      brands={data.brands}
      activeCategorySlug="mice-accessories"
    />
  );
}
