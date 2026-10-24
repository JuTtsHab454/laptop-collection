import React from 'react';
import prisma from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/data/catalog';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  let categories: any[] = [];
  let brands: any[] = [];

  try {
    const results = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, name: true, slug: true },
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, name: true, slug: true },
      }),
    ]);
    categories = results[0];
    brands = results[1];
  } catch (err) {
    console.warn('[NEW PRODUCT PAGE] DB fetch error, using fallback catalog categories/brands:', err);
  }

  if (!categories || categories.length === 0) {
    categories = INITIAL_CATEGORIES;
  }
  if (!brands || brands.length === 0) {
    brands = INITIAL_BRANDS;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-brand-steel pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">Create New Product</h1>
        <p className="text-xs text-slate-400 mt-1">
          Add a new laptop or accessory to the store. Specification fields adjust dynamically based on category.
        </p>
      </div>

      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
