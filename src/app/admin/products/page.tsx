import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { PlusCircle, Search, Filter, Edit, Eye, Trash2, Copy, AlertTriangle } from 'lucide-react';
import { formatPKR } from '@/components/ui/PriceDisplay';
import AdminProductRow from '@/components/admin/AdminProductRow';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string; status?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 20;
  const search = searchParams.search || '';
  const categoryId = searchParams.category;
  const status = searchParams.status;

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }

  let total = 0;
  let products: any[] = [];
  let categories: any[] = [];
  let brands: any[] = [];

  try {
    let initialCount = await prisma.product.count({ where });
    if (initialCount === 0 && !search && !categoryId && !status) {
      console.log('[ADMIN PRODUCTS] Empty database detected. Syncing catalog to database...');
      try {
        const { syncCatalogToDatabase } = await import('@/lib/syncCatalog');
        await syncCatalogToDatabase();
      } catch (syncErr) {
        console.warn('[ADMIN PRODUCTS] Auto-sync warning:', syncErr);
      }
    }

    const results = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.brand.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);

    total = results[0];
    products = results[1];
    categories = results[2];
    brands = results[3];
  } catch (err) {
    console.warn('[ADMIN PRODUCTS] DB error, using catalog fallback:', err);
  }

  // Fallback to sample catalog if database is unseeded
  if (products.length === 0 && !search && !categoryId && !status) {
    const { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } = await import('@/data/catalog');
    total = INITIAL_PRODUCTS.length;
    products = INITIAL_PRODUCTS.map((p) => ({
      ...p,
      sku: p.slug.toUpperCase(),
      status: 'PUBLISHED',
      lowStockThreshold: 3,
      images: p.images.slice(0, 1),
    }));
    categories = INITIAL_CATEGORIES as any;
    brands = INITIAL_BRANDS as any;
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6 text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-steel">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Products Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Total {total} items in catalog. Manage specs, pricing, and stock levels.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-blue text-white text-xs font-bold hover:bg-accent-blue-dark shadow-md shadow-accent-blue/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-brand-charcoal border border-brand-steel flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form className="flex-1 flex gap-2 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by title or SKU..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-brand-navy border border-brand-steel text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-slate hover:bg-brand-steel text-white text-xs font-semibold rounded-lg"
          >
            Filter
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/admin/products"
            className="text-xs font-medium text-slate-400 hover:text-white px-2 py-1"
          >
            Reset Filters
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-brand-charcoal border border-brand-steel overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-navy text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-brand-steel">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Product Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-steel/50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <AdminProductRow key={p.id} product={p as any} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-brand-steel flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing Page {page} of {totalPages} ({total} total products)
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/products?page=${page - 1}&search=${encodeURIComponent(
                    search
                  )}`}
                  className="px-3 py-1.5 rounded bg-brand-slate text-white"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/products?page=${page + 1}&search=${encodeURIComponent(
                    search
                  )}`}
                  className="px-3 py-1.5 rounded bg-brand-slate text-white"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
