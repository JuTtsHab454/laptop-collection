'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown, SlidersHorizontal, RotateCcw } from 'lucide-react';
import ProductCard, { ProductCardData } from './ProductCard';
import Button from '@/components/ui/Button';
import Breadcrumbs, { BreadcrumbItem } from '@/components/ui/Breadcrumbs';

interface CategoryFilterItem {
  id: string;
  name: string;
  slug: string;
}

interface BrandFilterItem {
  id: string;
  name: string;
  slug: string;
}

interface ProductListingLayoutProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  products: ProductCardData[];
  total: number;
  currentPage: number;
  totalPages: number;
  categories: CategoryFilterItem[];
  brands: BrandFilterItem[];
  activeCategorySlug?: string;
}

export const ProductListingLayout: React.FC<ProductListingLayoutProps> = ({
  title,
  description,
  breadcrumbs,
  products,
  total,
  currentPage,
  totalPages,
  categories,
  brands,
  activeCategorySlug,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Parse current URL filter state
  const selectedBrands = searchParams.get('brand')?.split(',') || [];
  const selectedCondition = searchParams.get('condition') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const inStockOnly = searchParams.get('inStock') === 'true';

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset to page 1 on filter change

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleBrand = (brandSlug: string) => {
    const current = new Set(selectedBrands);
    if (current.has(brandSlug)) {
      current.delete(brandSlug);
    } else {
      current.add(brandSlug);
    }
    const result = Array.from(current).join(',');
    updateFilters({ brand: result || null });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      minPrice: localMin || null,
      maxPrice: localMax || null,
    });
  };

  const handleClearAll = () => {
    setLocalMin('');
    setLocalMax('');
    router.push(pathname);
    setMobileDrawerOpen(false);
  };

  const FilterControls = () => (
    <div className="space-y-6 text-xs text-gray-800">
      {/* Brands Filter */}
      {brands.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 border-b pb-1.5">
            Brands
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {brands.map((b) => (
              <label
                key={b.slug}
                className="flex items-center gap-2 cursor-pointer hover:text-accent-blue py-0.5"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b.slug.toLowerCase())}
                  onChange={() => toggleBrand(b.slug.toLowerCase())}
                  className="rounded text-accent-blue focus:ring-accent-blue w-3.5 h-3.5"
                />
                <span className="font-medium">{b.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 border-b pb-1.5">
          Price Range (PKR)
        </h4>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min Rs"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              className="w-full px-2 py-1.5 text-xs rounded border border-surface-muted bg-white font-mono"
            />
            <input
              type="number"
              placeholder="Max Rs"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              className="w-full px-2 py-1.5 text-xs rounded border border-surface-muted bg-white font-mono"
            />
          </div>
          <Button type="submit" variant="outline" size="sm" className="w-full text-xs py-1">
            Apply Price
          </Button>
        </form>
      </div>

      {/* Condition Filter */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 border-b pb-1.5">
          Condition
        </h4>
        <div className="space-y-1.5">
          {['', 'NEW', 'USED', 'REFURBISHED'].map((cond) => (
            <label key={cond} className="flex items-center gap-2 cursor-pointer py-0.5">
              <input
                type="radio"
                name="condition"
                checked={selectedCondition === cond}
                onChange={() => updateFilters({ condition: cond || null })}
                className="text-accent-blue focus:ring-accent-blue"
              />
              <span className="font-medium">{cond ? cond : 'All Conditions'}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock Only */}
      <div className="space-y-2 pt-2 border-t">
        <label className="flex items-center gap-2 cursor-pointer py-1 font-semibold text-gray-900">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => updateFilters({ inStock: e.target.checked ? 'true' : null })}
            className="rounded text-accent-blue focus:ring-accent-blue w-3.5 h-3.5"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Reset button */}
      <button
        onClick={handleClearAll}
        className="flex items-center gap-1.5 text-xs text-status-error hover:underline pt-2"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Clear All Filters</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs items={breadcrumbs} />

      {/* Page Header and Sort bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-surface-muted">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {title}
          </h1>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          <span className="text-xs font-semibold text-accent-blue mt-1 inline-block">
            {total} Products Available
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </Button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-medium whitespace-nowrap">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-surface-muted bg-white text-gray-800 text-xs font-semibold focus:outline-none focus:border-accent-blue cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Two-column layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 p-5 rounded-2xl bg-white border border-surface-muted shadow-sm sticky top-24">
          <FilterControls />
        </aside>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="font-bold text-sm text-gray-900">Filters</h3>
                  <button onClick={() => setMobileDrawerOpen(false)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <FilterControls />
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full mt-6"
                onClick={() => setMobileDrawerOpen(false)}
              >
                Apply &amp; View Results
              </Button>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          {products.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border-2 border-dashed border-surface-muted bg-white space-y-3">
              <p className="font-bold text-base text-gray-900">No products match your filters</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your price range, unchecking brands, or clearing active filters.
              </p>
              <Button variant="outline" size="sm" onClick={handleClearAll} className="mt-2">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-surface-muted flex items-center justify-between text-xs text-gray-500">
              <span>
                Page {currentPage} of {totalPages} ({total} items)
              </span>
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => updateFilters({ page: String(currentPage - 1) })}
                    className="px-3 py-1.5 rounded-lg border border-surface-muted bg-white font-semibold hover:border-accent-blue"
                  >
                    Previous
                  </button>
                )}
                {currentPage < totalPages && (
                  <button
                    onClick={() => updateFilters({ page: String(currentPage + 1) })}
                    className="px-3 py-1.5 rounded-lg border border-surface-muted bg-white font-semibold hover:border-accent-blue"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingLayout;
