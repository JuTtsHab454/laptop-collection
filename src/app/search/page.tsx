import React from 'react';
import type { Metadata } from 'next';
import { getFilteredProducts } from '@/lib/products';
import ProductListingLayout from '@/components/product/ProductListingLayout';

export const metadata: Metadata = {
  title: 'Search Results — Laptop Collection',
  description: 'Search results for laptops and accessories in Pakistan.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const query = searchParams.q || '';
  const data = await getFilteredProducts({
    ...searchParams,
    search: query,
  });

  return (
    <ProductListingLayout
      title={query ? `Search Results for "${query}"` : 'Search Products'}
      description={
        query ? `Found ${data.total} matching items.` : 'Enter keywords to find products.'
      }
      breadcrumbs={[{ label: 'Search Results' }]}
      products={data.products}
      total={data.total}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      categories={data.categories}
      brands={data.brands}
    />
  );
}
