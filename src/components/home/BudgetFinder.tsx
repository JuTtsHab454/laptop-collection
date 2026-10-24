import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wallet, Sparkles } from 'lucide-react';
import { ProductCardData } from '@/components/product/ProductCard';

interface BudgetRange {
  label: string;
  sublabel: string;
  minPrice?: number;
  maxPrice?: number;
  badge?: string;
}

const BUDGET_RANGES: BudgetRange[] = [
  {
    label: 'Under Rs 50,000',
    sublabel: 'Affordable Everyday Workhorses',
    maxPrice: 50000,
  },
  {
    label: 'Rs 50,000 – 100,000',
    sublabel: 'Mainstream Business & Study Laptops',
    minPrice: 50000,
    maxPrice: 100000,
    badge: 'Most Popular',
  },
  {
    label: 'Rs 100,000 – 150,000',
    sublabel: 'Executive Ultrabooks & High Performance',
    minPrice: 100000,
    maxPrice: 150000,
  },
  {
    label: 'Rs 150,000 – 200,000',
    sublabel: 'Flagship MacBooks & Pro Creator Laptops',
    minPrice: 150000,
    maxPrice: 200000,
    badge: 'Premium Flagships',
  },
  {
    label: 'Above Rs 200,000',
    sublabel: 'Elite Workstations & Cutting-Edge Tech',
    minPrice: 200000,
  },
];

interface BudgetFinderProps {
  products: ProductCardData[];
}

export default function BudgetFinder({ products }: BudgetFinderProps) {
  // STRICTLY filter to only actual laptops
  const laptops = products.filter(
    (p) => !p.category?.slug || p.category.slug === 'laptops'
  );

  // Compute live count of laptops for each range
  const rangesWithCounts = BUDGET_RANGES.map((range) => {
    const count = laptops.filter((laptop) => {
      const price = laptop.basePrice;
      if (range.minPrice !== undefined && price < range.minPrice) return false;
      if (range.maxPrice !== undefined && price > range.maxPrice) return false;
      return true;
    }).length;

    return { ...range, count };
  }).filter((range) => range.count > 0); // HIDE EMPTY RANGES (0 available)

  if (rangesWithCounts.length === 0) return null;

  return (
    <section className="relative py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold tracking-wide">
            <Wallet className="w-3.5 h-3.5" />
            Curated Pricing
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Find Laptops by Your Budget
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Choose your budget bracket to view in-stock laptops matching your exact price range.
          </p>
        </div>

        <Link
          href="/laptops"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors group self-start sm:self-auto"
        >
          View All Laptops ({laptops.length})
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of Available Ranges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rangesWithCounts.map((r, idx) => {
          const queryParams = new URLSearchParams();
          if (r.minPrice !== undefined) queryParams.set('minPrice', r.minPrice.toString());
          if (r.maxPrice !== undefined) queryParams.set('maxPrice', r.maxPrice.toString());
          const link = `/laptops?${queryParams.toString()}`;

          return (
            <Link
              key={idx}
              href={link}
              className="group relative rounded-3xl bg-[#0B0F19] border border-white/[0.08] hover:border-amber-500/40 p-6 sm:p-7 transition-all duration-300 shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    {r.count} {r.count === 1 ? 'Laptop Available' : 'Laptops Available'}
                  </span>
                  {r.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      {r.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  {r.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {r.sublabel}
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-white/[0.06] mt-4">
                <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                  Browse Selection
                </span>
                <div className="w-8 h-8 rounded-full bg-white/[0.04] group-hover:bg-amber-500 group-hover:text-black text-amber-400 flex items-center justify-center transition-all group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
