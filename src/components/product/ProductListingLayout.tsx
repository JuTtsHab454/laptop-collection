'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Check,
  Tag,
  Laptop,
  Cpu,
  HardDrive,
  Zap,
  Mouse,
  Briefcase,
  Wind,
  Layers,
} from 'lucide-react';
import ProductCard, { ProductCardData } from './ProductCard';
import Button from '@/components/ui/Button';
import Breadcrumbs, { BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import { formatPKR } from '@/components/ui/PriceDisplay';

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
  const selectedBrands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
  const selectedCondition = searchParams.get('condition') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const inStockOnly = searchParams.get('inStock') === 'true';

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  // Compute active filter count
  let activeFilterCount = 0;
  if (selectedBrands.length > 0) activeFilterCount += selectedBrands.length;
  if (selectedCondition) activeFilterCount += 1;
  if (minPrice || maxPrice) activeFilterCount += 1;
  if (inStockOnly) activeFilterCount += 1;

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

  const handleBudgetShortcut = (max: string) => {
    setLocalMin('');
    setLocalMax(max);
    updateFilters({
      minPrice: null,
      maxPrice: max,
    });
  };

  const handleClearAll = () => {
    setLocalMin('');
    setLocalMax('');
    router.push(pathname);
    setMobileDrawerOpen(false);
  };

  // Fixed categories list for intuitive sidebar navigation
  const catalogCategories = [
    { name: 'All Laptops', slug: 'laptops', icon: Laptop },
    { name: 'RAM Upgrades', slug: 'ram', icon: Cpu },
    { name: 'NVMe & SATA SSDs', slug: 'ssds', icon: HardDrive },
    { name: 'Laptop Chargers', slug: 'chargers', icon: Zap },
    { name: 'Mice & Peripherals', slug: 'accessories/mice', icon: Mouse },
    { name: 'Laptop Bags', slug: 'accessories/bags', icon: Briefcase },
    { name: 'Cooling Pads', slug: 'accessories/cooling-pads', icon: Wind },
  ];

  const budgetBands = [
    { label: 'Under Rs 30,000', max: '30000' },
    { label: 'Under Rs 50,000', max: '50000' },
    { label: 'Under Rs 100,000', max: '100000' },
    { label: 'Under Rs 150,000', max: '150000' },
    { label: 'Under Rs 200,000', max: '200000' },
  ];

  const FilterControls = () => (
    <div className="space-y-6 text-xs text-gray-800">
      {/* Category Navigation */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 border-b pb-1.5 flex items-center justify-between">
          <span>Categories</span>
          <Layers className="w-3.5 h-3.5 text-accent-blue" />
        </h4>
        <div className="space-y-1">
          <Link
            href="/laptops"
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
              pathname === '/laptops'
                ? 'bg-accent-blue/10 text-accent-blue font-bold'
                : 'text-gray-700 hover:bg-surface-light'
            }`}
          >
            <Laptop className="w-4 h-4 text-accent-blue" />
            <span>Laptops</span>
          </Link>
          {catalogCategories.slice(1).map((cat) => {
            const Icon = cat.icon;
            const isCatActive = pathname.includes(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                  isCatActive
                    ? 'bg-accent-blue/10 text-accent-blue font-bold'
                    : 'text-gray-700 hover:bg-surface-light'
                }`}
              >
                <Icon className="w-4 h-4 text-accent-silver" />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Budget Shortcuts */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 border-b pb-1.5 flex items-center justify-between">
          <span>Budget Shortcuts</span>
          <Tag className="w-3.5 h-3.5 text-accent-gold" />
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {budgetBands.map((band) => {
            const isSelected = maxPrice === band.max && !minPrice;
            return (
              <button
                key={band.max}
                type="button"
                onClick={() =>
                  isSelected
                    ? updateFilters({ minPrice: null, maxPrice: null })
                    : handleBudgetShortcut(band.max)
                }
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                  isSelected
                    ? 'bg-accent-blue text-white border-accent-blue shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-accent-blue hover:text-accent-blue'
                }`}
              >
                {band.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Price Range Filter */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 border-b pb-1.5">
          Custom Price (PKR)
        </h4>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-500 font-semibold block mb-0.5">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white font-mono focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-semibold block mb-0.5">Max Price</label>
              <input
                type="number"
                placeholder="200,000+"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white font-mono focus:outline-none focus:border-accent-blue"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-3 rounded-xl bg-accent-blue hover:bg-accent-blue-dark !text-white font-bold text-xs shadow-md shadow-accent-blue/25 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <span>Apply Price Filter</span>
          </button>
        </form>
      </div>

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 border-b pb-1.5">
            Filter by Brand
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {brands.map((b) => {
              const isChecked = selectedBrands.includes(b.slug.toLowerCase());
              return (
                <label
                  key={b.slug}
                  className="flex items-center gap-2 cursor-pointer hover:text-accent-blue py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBrand(b.slug.toLowerCase())}
                    className="rounded text-accent-blue focus:ring-accent-blue w-3.5 h-3.5"
                  />
                  <span className={`font-medium ${isChecked ? 'text-accent-blue font-bold' : ''}`}>
                    {b.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

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
                className="text-accent-blue focus:ring-accent-blue w-3.5 h-3.5"
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

      {/* Reset all button */}
      {activeFilterCount > 0 && (
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1.5 text-xs font-bold text-status-error hover:underline pt-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
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
          {description && <p className="text-xs text-gray-500 mt-1 max-w-2xl">{description}</p>}
          <span className="text-xs font-semibold text-accent-blue mt-1 inline-block">
            Showing {products.length} of {total} Available Products
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Button — Bulletproof Visibility */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-bold text-xs shadow-sm hover:bg-gray-50 active:scale-95 transition-all select-none"
            aria-label="Open product filters"
          >
            <SlidersHorizontal className="w-4 h-4 text-accent-blue flex-shrink-0" />
            <span className="font-bold text-gray-900 whitespace-nowrap">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent-blue text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-medium whitespace-nowrap">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 text-xs font-semibold focus:outline-none focus:border-accent-blue cursor-pointer shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs text-gray-500 font-semibold mr-1">Active Filters:</span>

          {selectedBrands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold"
            >
              <span>Brand: {b.toUpperCase()}</span>
              <button
                type="button"
                onClick={() => toggleBrand(b)}
                className="hover:text-red-500 rounded-full"
                aria-label={`Remove brand ${b}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {maxPrice && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-gold/15 border border-accent-gold/30 text-amber-800 text-xs font-bold">
              <span>Under Rs {formatPKR(parseFloat(maxPrice))}</span>
              <button
                type="button"
                onClick={() => updateFilters({ maxPrice: null })}
                className="hover:text-red-500 rounded-full"
                aria-label="Remove max price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {minPrice && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-gold/15 border border-accent-gold/30 text-amber-800 text-xs font-bold">
              <span>Above Rs {formatPKR(parseFloat(minPrice))}</span>
              <button
                type="button"
                onClick={() => updateFilters({ minPrice: null })}
                className="hover:text-red-500 rounded-full"
                aria-label="Remove min price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCondition && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 border border-gray-300 text-gray-800 text-xs font-bold">
              <span>Condition: {selectedCondition}</span>
              <button
                type="button"
                onClick={() => updateFilters({ condition: null })}
                className="hover:text-red-500 rounded-full"
                aria-label="Remove condition filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
              <span>In Stock Only</span>
              <button
                type="button"
                onClick={() => updateFilters({ inStock: null })}
                className="hover:text-red-500 rounded-full"
                aria-label="Remove in stock filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-status-error hover:underline font-semibold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Two-column layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar (Persistent alongside products) */}
        <aside className="hidden lg:block lg:col-span-1 p-5 rounded-3xl bg-white border border-surface-muted shadow-sm sticky top-24">
          <FilterControls />
        </aside>

        {/* Mobile Slide-Over Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-brand-navy/70 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Slide-in Panel */}
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent-blue" />
                  <h3 className="font-bold text-base text-gray-900">Filters</h3>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-accent-blue text-white text-[10px] font-bold">
                      {activeFilterCount} Active
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Filter Content */}
              <div className="flex-1 overflow-y-auto py-4 pr-1">
                <FilterControls />
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-4 border-t border-gray-200 flex items-center gap-3">
                <button
                  type="button"
                  className="flex-1 py-2.5 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 !text-gray-900 font-bold text-xs transition-colors shadow-sm"
                  onClick={handleClearAll}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-accent-blue hover:bg-accent-blue-dark !text-white font-bold text-xs shadow-md transition-colors"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          {products.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border-2 border-dashed border-surface-muted bg-white space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-base text-gray-900">No products match your filters</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try adjusting your price range, deselecting specific brands, or clearing active filters to see all available hardware.
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={handleClearAll} className="mt-2">
                Reset All Filters
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
            <div className="pt-6 border-t border-surface-muted flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <span>
                Page {currentPage} of {totalPages} ({total} total items)
              </span>
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => updateFilters({ page: String(currentPage - 1) })}
                    className="px-3.5 py-2 rounded-xl border border-gray-300 bg-white font-bold text-gray-800 hover:border-accent-blue transition-colors"
                  >
                    ← Previous
                  </button>
                )}
                <span className="font-mono px-3 py-1 bg-surface-cream rounded-lg font-bold text-gray-900">
                  {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages && (
                  <button
                    onClick={() => updateFilters({ page: String(currentPage + 1) })}
                    className="px-3.5 py-2 rounded-xl border border-gray-300 bg-white font-bold text-gray-800 hover:border-accent-blue transition-colors"
                  >
                    Next →
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
