import React from 'react';
import type { Metadata } from 'next';
import { getFilteredProducts } from '@/lib/products';
import ProductListingLayout from '@/components/product/ProductListingLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SSDs in Pakistan — Fast NVMe M.2 & SATA Solid State Drives',
  description:
    'Upgrade your system speed with NVMe PCIe and SATA SSDs. Capacities from 256GB to 2TB available across Pakistan.',
};

export default async function SsdsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const data = await getFilteredProducts({
    ...searchParams,
    category: 'ssds',
  });

  return (
    <ProductListingLayout
      title="Solid State Drives (SSDs)"
      description="Blazing-fast NVMe M.2 PCIe and 2.5-inch SATA internal SSD storage drives."
      breadcrumbs={[{ label: 'Accessories', href: '/accessories' }, { label: 'SSDs' }]}
      products={data.products}
      total={data.total}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      categories={data.categories}
      brands={data.brands}
      activeCategorySlug="ssds"
    />
  );
}
