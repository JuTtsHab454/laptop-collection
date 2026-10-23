import React from 'react';
import type { Metadata } from 'next';
import { getFilteredProducts } from '@/lib/products';
import ProductListingLayout from '@/components/product/ProductListingLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Laptop Accessories in Pakistan — RAM, SSD, Chargers, Bags, Mice',
  description:
    'Complete selection of premium laptop accessories, upgrades, and peripherals delivered across Pakistan.',
};

export default async function AccessoriesPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const data = await getFilteredProducts(searchParams);

  return (
    <ProductListingLayout
      title="Laptop Accessories & Upgrades"
      description="RAM memory, SSD solid state drives, chargers, protective bags, mice, and cooling pads."
      breadcrumbs={[{ label: 'Accessories' }]}
      products={data.products}
      total={data.total}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      categories={data.categories}
      brands={data.brands}
    />
  );
}
