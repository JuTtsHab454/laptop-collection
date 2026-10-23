import React from 'react';
import type { Metadata } from 'next';
import { getFilteredProducts } from '@/lib/products';
import ProductListingLayout from '@/components/product/ProductListingLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Laptop Cooling Pads in Pakistan — Multi-Fan Laptop Coolers',
  description: 'Prevent laptop thermal throttling with silent multi-fan laptop cooling pads in Pakistan.',
};

export default async function CoolingPadsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const data = await getFilteredProducts({
    ...searchParams,
    category: 'cooling-pads',
  });

  return (
    <ProductListingLayout
      title="Laptop Cooling Pads"
      description="Keep your laptop cool and operating at peak performance during heavy workloads."
      breadcrumbs={[{ label: 'Accessories', href: '/accessories' }, { label: 'Cooling Pads' }]}
      products={data.products}
      total={data.total}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      categories={data.categories}
      brands={data.brands}
      activeCategorySlug="cooling-pads"
    />
  );
}
