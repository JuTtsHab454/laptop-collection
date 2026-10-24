'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Tag,
  Laptop,
  Cpu,
  HardDrive,
  Zap,
  Mouse,
  Briefcase,
  Wind,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import ProductCard, { ProductCardData } from './ProductCard';
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
    params.delete('page');

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
    let next: string[];
    if (selectedBrands.includes(brandSlug)) {
      next = selectedBrands.filter((b) => b !== brandSlug);
    } else {
      next = [...selectedBrands, brandSlug];
    }
    updateFilters({ brand: next.length > 0 ? next.join(',') : null });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      minPrice: localMin ? localMin : null,
      maxPrice: localMax ? localMax : null,
    });
    setMobileDrawerOpen(false);
  };

  const handleBudgetShortcut = (max: string) => {
    setLocalMin('');
    setLocalMax(max);
    updateFilters({ minPrice: null, maxPrice: max });
    setMobileDrawerOpen(false);
  };

  const handleClearAll = () => {
    setLocalMin('');
    setLocalMax('');
    router.push(pathname);
    setMobileDrawerOpen(false);
  };

  const catalogCategories = [
    { name: 'Laptops', slug: 'laptops', icon: Laptop },
    { name: 'RAM Upgrades', slug: 'ram', icon: Cpu },
    { name: 'SSDs & Storage', slug: 'ssds', icon: HardDrive },
    { name: 'Laptop Chargers', slug: 'chargers', icon: Zap },
    { name: 'Mice & Accessories', slug: 'accessories/mice', icon: Mouse },
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

  // ULTRA PREMIUM SIDEBAR CONTROL DECK
  const FilterControls = () => (
    <div className="space-y-6 text-xs text-slate-200">
      {/* Category Navigation */}
      <div className="space-y-2.5">
        <h4 className="font-extrabold text-[11px] uppercase tracking-widest text-slate-400 border-b border-white/[0.08] pb-2 flex items-center justify-between">
          <span>Categories</span>
          <Layers className="w-3.5 h-3.5 text-amber-400" />
        </h4>
        <div className="space-y-1">
          <Link
            href="/laptops"
            className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all font-semibold ${
              pathname === '/laptops'
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-amber-400" />
              <span>All Laptops</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          {catalogCategories.slice(1).map((cat) => {
            const Icon = cat.icon;
            const isCatActive = pathname.includes(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all font-semibold ${
                  isCatActive
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{cat.name}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Budget Shortcuts */}
      <div className="space-y-2.5">
        <h4 className="font-extrabold text-[11px] uppercase tracking-widest text-slate-400 border-b border-white/[0.08] pb-2 flex items-center justify-between">
          <span>Budget Range</span>
          <Tag className="w-3.5 h-3.5 text-amber-400" />
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
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-400 shadow-md shadow-amber-500/25'
                    : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:border-amber-500/40 hover:text-amber-300'
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
        <h4 className="font-extrabold text-[11px] uppercase tracking-widest text-slate-400 border-b border-white/[0.08] pb-2">
          Custom Price (PKR)
        </h4>
        <form onSubmit={handlePriceApply} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/[0.08] bg-[#07090E] text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Max Price</label>
              <input
                type="number"
                placeholder="200,000+"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/[0.08] bg-[#07090E] text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-500 !text-white font-black text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 border border-amber-300/30"
          >
            <span>Apply Price Filter</span>
          </button>
        </form>
      </div>

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="font-extrabold text-[11px] uppercase tracking-widest text-slate-400 border-b border-white/[0.08] pb-2">
            Filter by Brand
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {brands.map((b) => {
              const isChecked = selectedBrands.includes(b.slug.toLowerCase());
              return (
                <label
                  key={b.slug}
                  className="flex items-center gap-2 cursor-pointer hover:text-amber-400 py-1 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBrand(b.slug.toLowerCase())}
                    className="rounded border-white/20 bg-[#07090E] text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
                  />
                  <span className={`font-semibold ${isChecked ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                    {b.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* In Stock Only */}
      <div className="space-y-2 pt-2 border-t border-white/[0.08]">
        <label className="flex items-center gap-2 cursor-pointer py-1 font-semibold text-slate-200">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => updateFilters({ inStock: e.target.checked ? 'true' : null })}
            className="rounded border-white/20 bg-[#07090E] text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5"
          />
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>In Stock Only</span>
          </span>
        </label>
      </div>

      {/* Reset all button */}
      {activeFilterCount > 0 && (
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 hover:underline pt-2"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {title}
          </h1>
          {description && <p className="text-xs text-slate-400 mt-1 max-w-2xl">{description}</p>}
          <span className="text-xs font-bold text-amber-400 mt-1.5 inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>Showing {products.length} of {total} Available Products</span>
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0F1424] border border-amber-500/30 text-white font-bold text-xs shadow-md active:scale-95 transition-all select-none"
            aria-label="Open product filters"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="font-bold text-slate-100 whitespace-nowrap">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] flex items-center justify-center font-black">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap">Sort:</span>
            <select
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="px-3.5 py-2 rounded-xl border border-white/[0.08] bg-[#0E1322] text-slate-100 text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer shadow-md"
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
          <span className="text-xs text-slate-400 font-semibold mr-1">Active:</span>

          {selectedBrands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold"
            >
              <span>Brand: {b.toUpperCase()}</span>
              <button
                type="button"
                onClick={() => toggleBrand(b)}
                className="hover:text-red-400 rounded-full"
                aria-label={`Remove brand ${b}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {maxPrice && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <span>Under Rs {formatPKR(parseFloat(maxPrice))}</span>
              <button
                type="button"
                onClick={() => updateFilters({ maxPrice: null })}
                className="hover:text-red-400 rounded-full"
                aria-label="Remove max price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {minPrice && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <span>Above Rs {formatPKR(parseFloat(minPrice))}</span>
              <button
                type="button"
                onClick={() => updateFilters({ minPrice: null })}
                className="hover:text-red-400 rounded-full"
                aria-label="Remove min price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <span>In Stock Only</span>
              <button
                type="button"
                onClick={() => updateFilters({ inStock: null })}
                className="hover:text-red-400 rounded-full"
                aria-label="Remove in stock filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-red-400 hover:text-red-300 hover:underline font-bold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Two-column layout: Persistent Desktop Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* ULTRA-PREMIUM DESKTOP SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-1 p-5 rounded-3xl bg-[#0D121F]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl sticky top-24">
          <FilterControls />
        </aside>

        {/* ULTRA-PREMIUM MOBILE SLIDEBAR / FILTER DRAWER */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-[#07090E]/80 backdrop-blur-md transition-opacity"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Slide-in Panel */}
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#090D17]/98 backdrop-blur-2xl border-l border-amber-500/25 p-6 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <h3 className="font-black text-base text-white tracking-wide">Filters</h3>
                  {activeFilterCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-black">
                      {activeFilterCount} Active
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08]"
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
              <div className="pt-4 border-t border-white/[0.08] flex items-center gap-3">
                <button
                  type="button"
                  className="flex-1 py-2.5 px-3 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-bold text-xs transition-colors shadow-sm"
                  onClick={handleClearAll}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-500 !text-white font-black text-xs shadow-lg shadow-amber-500/30 transition-colors"
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
            <div className="p-12 text-center rounded-3xl border-2 border-dashed border-white/[0.08] bg-[#0D121F]/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-base text-white">No products match your filters</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your price range or clearing active filters to see all available laptops.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearAll}
                className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs"
              >
                Reset All Filters
              </button>
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
            <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <span>
                Page {currentPage} of {totalPages} ({total} total items)
              </span>
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => updateFilters({ page: String(currentPage - 1) })}
                    className="px-4 py-2 rounded-xl border border-white/[0.08] bg-[#0E1322] font-bold text-slate-200 hover:border-amber-400 transition-colors"
                  >
                    ← Previous
                  </button>
                )}
                <span className="font-mono px-3.5 py-1.5 bg-[#090D17] border border-white/[0.06] rounded-xl font-bold text-amber-400">
                  {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages && (
                  <button
                    onClick={() => updateFilters({ page: String(currentPage + 1) })}
                    className="px-4 py-2 rounded-xl border border-white/[0.08] bg-[#0E1322] font-bold text-slate-200 hover:border-amber-400 transition-colors"
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
