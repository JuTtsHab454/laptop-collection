import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import {
  Laptop,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  MessageCircle,
  Headphones,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import PriceDisplay, { formatPKR } from '@/components/ui/PriceDisplay';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featuredCategories: any[] = [];
  let featuredProducts: any[] = [];
  let latestArrivals: any[] = [];
  let saleProducts: any[] = [];
  let latestPosts: any[] = [];
  let branches: any[] = [];
  let under30kCount = 0;
  let from30to50Count = 0;
  let from50to100Count = 0;
  let from100to150Count = 0;
  let from150to200Count = 0;
  let above200kCount = 0;

  try {
    const results = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        include: { _count: { select: { products: true } } },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.product.findMany({
        where: { status: 'PUBLISHED', isFeatured: true },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        where: { status: 'PUBLISHED', isOnSale: true },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        take: 3,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.branch.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.product.count({ where: { status: 'PUBLISHED', basePrice: { lt: 30000 } } }),
      prisma.product.count({
        where: { status: 'PUBLISHED', basePrice: { gte: 30000, lt: 50000 } },
      }),
      prisma.product.count({
        where: { status: 'PUBLISHED', basePrice: { gte: 50000, lt: 100000 } },
      }),
      prisma.product.count({
        where: { status: 'PUBLISHED', basePrice: { gte: 100000, lt: 150000 } },
      }),
      prisma.product.count({
        where: { status: 'PUBLISHED', basePrice: { gte: 150000, lt: 200000 } },
      }),
      prisma.product.count({ where: { status: 'PUBLISHED', basePrice: { gte: 200000 } } }),
    ]);

    featuredCategories = results[0];
    featuredProducts = results[1];
    latestArrivals = results[2];
    saleProducts = results[3];
    latestPosts = results[4];
    branches = results[5];
    under30kCount = results[6];
    from30to50Count = results[7];
    from50to100Count = results[8];
    from100to150Count = results[9];
    from150to200Count = results[10];
    above200kCount = results[11];
  } catch (err) {
    console.warn('Database not available for HomePage query:', err);
  }

  const budgetBands = [
    { label: 'Under Rs 30,000', minPrice: '0', maxPrice: '30000', count: under30kCount },
    { label: 'Rs 30,000 – Rs 50,000', minPrice: '30000', maxPrice: '50000', count: from30to50Count },
    { label: 'Rs 50,000 – Rs 100,000', minPrice: '50000', maxPrice: '100000', count: from50to100Count },
    { label: 'Rs 100,000 – Rs 150,000', minPrice: '100000', maxPrice: '150000', count: from100to150Count },
    { label: 'Rs 150,000 – Rs 200,000', minPrice: '150000', maxPrice: '200000', count: from150to200Count },
    { label: 'Above Rs 200,000', minPrice: '200000', maxPrice: '', count: above200kCount },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* SECTION A: HERO */}
      <section className="relative overflow-hidden bg-brand-navy text-white pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-brand-steel/50">
        {/* Subtle geometric grid background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3B82F6_1px,transparent_1px),linear-gradient(to_bottom,#3B82F6_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-blue/15 border border-accent-blue/30 text-accent-blue text-xs font-bold tracking-wide animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pakistan&apos;s Premium Laptop Destination</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Verified Laptops & Accessories Delivered Nationwide
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed font-normal max-w-2xl">
              Shop high-performance business laptops, student notebooks, RAM upgrades, and NVMe SSDs. Inspected hardware, full checking warranty, and direct delivery across Pakistan.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/laptops"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-accent-blue hover:bg-accent-blue-dark text-white font-bold text-sm shadow-lg shadow-accent-blue/30 transition-all active:scale-95"
              >
                <span>Shop All Laptops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/deals"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-charcoal hover:bg-brand-slate text-accent-gold border border-brand-steel font-bold text-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Today&apos;s Special Deals</span>
              </Link>
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-brand-steel/60 text-xs sm:text-sm">
              <div>
                <p className="font-mono font-black text-xl sm:text-2xl text-accent-blue">100%</p>
                <p className="text-gray-400 text-xs mt-0.5">Tested Hardware</p>
              </div>
              <div>
                <p className="font-mono font-black text-xl sm:text-2xl text-accent-gold">Lahore &amp; ISB</p>
                <p className="text-gray-400 text-xs mt-0.5">Physical Branches</p>
              </div>
              <div>
                <p className="font-mono font-black text-xl sm:text-2xl text-emerald-400">All Pakistan</p>
                <p className="text-gray-400 text-xs mt-0.5">Secure Courier</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* SECTION B: CATEGORY CARDS */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">Explore</span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
            </div>
            <Link href="/accessories" className="text-xs font-bold text-accent-blue hover:underline flex items-center gap-1">
              <span>View Accessories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.slug === 'laptops' ? '/laptops' : `/${cat.slug}`}
                className="group relative p-5 rounded-2xl bg-white border border-surface-muted hover:border-accent-blue shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-accent-blue transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{cat.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-muted flex items-center justify-between text-xs text-gray-500">
                  <span>{cat._count.products} Products</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent-blue group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION C: FEATURED PRODUCTS */}
        {featuredProducts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">Handpicked</span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Featured Laptops</h2>
              </div>
              <Link href="/laptops" className="text-xs font-bold text-accent-blue hover:underline flex items-center gap-1">
                <span>View All Laptops</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION D: BUDGET DISCOVERY */}
        <section className="p-8 sm:p-10 rounded-3xl bg-brand-navy text-white relative overflow-hidden space-y-8">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-gold">Custom Budget</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Shop by Price Band</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Select your budget to view curated laptops matching your exact price range.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {budgetBands.map((band) => (
              <Link
                key={band.label}
                href={`/laptops?minPrice=${band.minPrice}${band.maxPrice ? `&maxPrice=${band.maxPrice}` : ''}`}
                className="group p-4 rounded-xl bg-brand-charcoal border border-brand-steel hover:border-accent-blue transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] text-accent-silver font-semibold uppercase tracking-wider block">
                    Range
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-accent-blue transition-colors mt-1">
                    {band.label}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-brand-steel text-[11px] text-accent-gold font-mono font-semibold">
                  {band.count} Available
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION E: LATEST ARRIVALS */}
        {latestArrivals.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">Fresh Stock</span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Latest Arrivals</h2>
              </div>
              <Link href="/laptops" className="text-xs font-bold text-accent-blue hover:underline flex items-center gap-1">
                <span>Browse Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {latestArrivals.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION F: SPECIAL DEALS */}
        {saleProducts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent-gold">Discounted</span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Today&apos;s Special Deals 🔥</h2>
              </div>
              <Link href="/deals" className="text-xs font-bold text-accent-gold hover:underline flex items-center gap-1">
                <span>All Deals</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {saleProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION G: TRUST & SERVICES */}
        <section className="p-8 sm:p-10 rounded-3xl bg-white border border-surface-muted shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-accent-blue/10 text-accent-blue flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Nationwide Delivery</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Fast and secure courier delivery across Lahore, Karachi, Islamabad, and all cities in Pakistan.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Advance Bank Payment</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Transparent payments with verified official bank transfer and instant WhatsApp receipts.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-accent-gold/10 text-accent-gold flex-shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Direct WhatsApp Ordering</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Generate exact itemized WhatsApp quotes with RAM, SSD, and charger options included.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Expert Support</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Direct phone &amp; WhatsApp guidance to help pick the right specs for programming, office, or gaming.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION H: BLOG PREVIEW */}
        {latestPosts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">Knowledge</span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Buying Guides &amp; Insights</h2>
              </div>
              <Link href="/blog" className="text-xs font-bold text-accent-blue hover:underline flex items-center gap-1">
                <span>Visit Blog</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl bg-white border border-surface-muted overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-accent-blue/10 text-accent-blue">
                      {post.category || 'Guide'}
                    </span>
                    <h3 className="font-bold text-base text-gray-900 group-hover:text-accent-blue transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {post.excerpt || post.content.substring(0, 150)}
                    </p>
                  </div>

                  <div className="px-6 py-4 border-t border-surface-muted flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
                    </span>
                    <span className="font-bold text-accent-blue group-hover:underline">Read Guide →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SECTION I: PHYSICAL BRANCHES */}
        {branches.length > 0 && (
          <section className="p-8 sm:p-10 rounded-3xl bg-surface-light border border-surface-muted space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">Locations</span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Visit Our Branches</h2>
              <p className="text-xs text-gray-500">
                Inspect laptops in person or collect orders directly from our branches in Lahore &amp; Islamabad.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {branches.map((b) => (
                <div key={b.id} className="p-6 rounded-2xl bg-white border border-surface-muted shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-accent-blue">
                    <MapPin className="w-5 h-5" />
                    <h3 className="font-bold text-gray-900 text-base">{b.name}</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    <strong>City:</strong> {b.city}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Address:</strong> {b.address || 'Address details coming soon. Call support for branch visit.'}
                  </p>
                  {b.contactNumber && (
                    <p className="text-xs text-gray-600">
                      <strong>Phone:</strong> {b.contactNumber}
                    </p>
                  )}
                  {b.operatingHours && (
                    <p className="text-xs text-gray-600">
                      <strong>Hours:</strong> {b.operatingHours}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
