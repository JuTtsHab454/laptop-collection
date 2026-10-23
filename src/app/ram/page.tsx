import React from 'react';
import type { Metadata } from 'next';
import { getFilteredProducts } from '@/lib/products';
import ProductListingLayout from '@/components/product/ProductListingLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'RAM Upgrades in Pakistan — DDR4 & DDR5 Laptop Memory',
  description:
    'Shop 8GB, 16GB, and 32GB high-speed DDR4 and DDR5 laptop RAM modules with fast delivery across Pakistan.',
};

export default async function RamPage({ searchParams }: { searchParams: Record<string, string> }) {
  const data = await getFilteredProducts({
    ...searchParams,
    category: 'ram',
  });

  return (
    <ProductListingLayout
      title="Laptop RAM Upgrades"
      description="High-speed laptop RAM modules (DDR4, DDR5, SODIMM) to accelerate your laptop multitasking."
      breadcrumbs={[{ label: 'Accessories', href: '/accessories' }, { label: 'RAM' }]}
      products={data.products}
      total={data.total}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      categories={data.categories}
      brands={data.brands}
      activeCategorySlug="ram"
    />
  );
}
