import React from 'react';
import type { Metadata } from 'next';
import { getFilteredProducts } from '@/lib/products';
import ProductListingLayout from '@/components/product/ProductListingLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Laptops in Pakistan — Shop Premium HP, Dell, Lenovo, Apple',
  description:
    'Browse verified business laptops, student laptops, and high-performance notebooks with warranty across Pakistan.',
};

export default async function LaptopsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const data = await getFilteredProducts({
    ...searchParams,
    category: 'laptops',
  });

  return (
    <ProductListingLayout
      title="Laptops in Pakistan"
      description="Inspected and verified laptops with warranty. Filter by brand, price range, condition, and specs."
      breadcrumbs={[{ label: 'Laptops' }]}
      products={data.products}
      total={data.total}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      categories={data.categories}
      brands={data.brands}
      activeCategorySlug="laptops"
    />
  );
}
