import React from 'react';
import prisma from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
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
