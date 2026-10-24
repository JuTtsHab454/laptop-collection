import React from 'react';
import Link from 'next/link';
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
  Cpu,
  HardDrive,
  Zap,
  Mouse,
  Briefcase,
  Wind,
} from 'lucide-react';
import ProductCard, { ProductCardData } from '@/components/product/ProductCard';
import { formatPKR } from '@/components/ui/PriceDisplay';
import NewArrivalsCarousel from '@/components/home/NewArrivalsCarousel';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/data/catalog';

export const dynamic = 'force-dynamic';

function formatProduct(p: any): ProductCardData {
  const revs = p.reviews || [];
  const count = p.reviewCount !== undefined ? p.reviewCount : revs.length;
  const avg =
    p.rating !== undefined
      ? p.rating
      : count > 0
      ? parseFloat((revs.reduce((sum: number, r: any) => sum + r.rating, 0) / count).toFixed(1))
      : null;

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    basePrice: p.basePrice,
    originalPrice: p.originalPrice,
    stock: p.stock,
    condition: p.condition as any,
    isFeatured: p.isFeatured,
    isOnSale: p.isOnSale,
    category: p.category,
    brand: p.brand,
    specifications: (p.specifications || {}) as Record<string, any>,
    images: (p.images || []).map((img: any) => ({ url: img.url, alt: img.alt })),
    hasChargerOption: p.hasChargerOption,
    hasBagOption: p.hasBagOption,
    rating: avg,
    reviewCount: count,
  };
}

export default async function HomePage() {
  let featuredCategories: any[] = [];
  let featuredProducts: any[] = [];
  let latestArrivals: any[] = [];
  let carouselLaptops: any[] = [];
  let saleProducts: any[] = [];
  let latestPosts: any[] = [];
  let branches: any[] = [];
  let under30kCount = 0;
  let from30to50Count = 0;
  let from50to100Count = 0;
  let from100to150Count = 0;
  let from150to200Count = 0;
  let above200kCount = 0;
  let whatsappNumber = '923134951239';

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
          reviews: { where: { isApproved: true }, select: { rating: true } },
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
          reviews: { where: { isApproved: true }, select: { rating: true } },
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
          reviews: { where: { isApproved: true }, select: { rating: true } },
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
      prisma.product.findMany({
        where: { status: 'PUBLISHED', category: { slug: 'laptops' } },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
          reviews: { where: { isApproved: true }, select: { rating: true } },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.siteSetting.findUnique({ where: { key: 'whatsapp_number' } }),
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
    carouselLaptops = results[12];
    if (results[13]?.value) whatsappNumber = results[13].value;
  } catch (err) {
    console.warn('Database not available for HomePage query, using fallback catalog:', err);
  }

  // Fallback to sample catalog if database has not yet been seeded
  if (featuredCategories.length === 0) {
    featuredCategories = INITIAL_CATEGORIES.map((c) => ({
      ...c,
      description: `Flagship ${c.name} with 7-day checking warranty`,
      _count: {
        products: INITIAL_PRODUCTS.filter((p) => p.category?.slug === c.slug).length,
      },
    }));
  }

  if (carouselLaptops.length === 0) {
    carouselLaptops = INITIAL_PRODUCTS.filter((p) => p.category?.slug === 'laptops').slice(0, 5);
  }

  if (featuredProducts.length === 0) {
    featuredProducts = INITIAL_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);
  }

  if (latestArrivals.length === 0) {
    latestArrivals = INITIAL_PRODUCTS.slice(0, 8);
  }

  if (saleProducts.length === 0) {
    saleProducts = INITIAL_PRODUCTS.filter((p) => p.isOnSale).slice(0, 8);
  }

  if (under30kCount === 0 && from30to50Count === 0 && from50to100Count === 0) {
    under30kCount = INITIAL_PRODUCTS.filter((p) => p.basePrice < 30000).length;
    from30to50Count = INITIAL_PRODUCTS.filter((p) => p.basePrice >= 30000 && p.basePrice < 50000).length;
    from50to100Count = INITIAL_PRODUCTS.filter((p) => p.basePrice >= 50000 && p.basePrice < 100000).length;
    from100to150Count = INITIAL_PRODUCTS.filter((p) => p.basePrice >= 100000 && p.basePrice < 150000).length;
    from150to200Count = INITIAL_PRODUCTS.filter((p) => p.basePrice >= 150000 && p.basePrice < 200000).length;
    above200kCount = INITIAL_PRODUCTS.filter((p) => p.basePrice >= 200000).length;
  }

  if (branches.length === 0) {
    branches = [
      {
        id: 'branch-lhr',
        name: 'Lahore Flagship Branch',
        city: 'Lahore',
        address: 'Shop # 14-B, 2nd Floor, Hafeez Centre, Main Boulevard Gulberg III, Lahore',
        contactNumber: '+92 313 4951239',
        operatingHours: 'Monday – Saturday: 11:00 AM – 9:00 PM',
      },
      {
        id: 'branch-isb',
        name: 'Islamabad Display Centre',
        city: 'Islamabad',
        address: 'Office 3, Mezzanine Floor, Beverly Centre, Blue Area, Islamabad',
        contactNumber: '+92 313 4951239',
        operatingHours: 'Monday – Saturday: 11:30 AM – 8:30 PM',
      },
    ];
  }

  const formattedCarouselLaptops = carouselLaptops.map(formatProduct);
  const formattedFeaturedProducts = featuredProducts.map(formatProduct);
  const formattedSaleProducts = saleProducts.map(formatProduct);

  const budgetBands = [
    { label: 'Under Rs 30,000', minPrice: '0', maxPrice: '30000', count: under30kCount },
    { label: 'Rs 30,000 – Rs 50,000', minPrice: '30000', maxPrice: '50000', count: from30to50Count },
    { label: 'Rs 50,000 – Rs 100,000', minPrice: '50000', maxPrice: '100000', count: from50to100Count },
    { label: 'Rs 100,000 – Rs 150,000', minPrice: '100000', maxPrice: '150000', count: from100to150Count },
    { label: 'Rs 150,000 – Rs 200,000', minPrice: '150000', maxPrice: '200000', count: from150to200Count },
    { label: 'Above Rs 200,000', minPrice: '200000', maxPrice: '', count: above200kCount },
  ];

  const categoryIcons: Record<string, any> = {
    laptops: Laptop,
    ram: Cpu,
    ssds: HardDrive,
    chargers: Zap,
    'mice-accessories': Mouse,
    'laptop-bags': Briefcase,
    'cooling-pads': Wind,
  };

  return (
    <div className="space-y-16 sm:space-y-24 text-slate-100">
      {/* SECTION A: ULTRA-PREMIUM OBSIDIAN & AMBER HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0E18] via-[#07090E] to-[#0A0D15] text-white pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-amber-500/20">
        {/* Subtle geometric grid background pattern with ambient glow */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#F59E0B_1px,transparent_1px),linear-gradient(to_bottom,#F59E0B_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Pakistan&apos;s #1 Flagship Laptop Destination</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Verified Laptops &amp; Accessories Delivered Across Pakistan
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
              High-performance business laptops, student ultrabooks, RAM upgrades, and NVMe SSDs. Inspected hardware, full 7-day checking warranty, and direct nationwide delivery.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/laptops"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm shadow-xl shadow-amber-500/30 transition-all active:scale-95 border border-amber-300/30"
              >
                <span>Shop All Laptops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/deals"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 border border-amber-500/30 hover:border-amber-400 font-bold text-sm transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Today&apos;s Special Deals 🔥</span>
              </Link>
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.08] text-xs sm:text-sm">
              <div>
                <p className="font-mono font-black text-xl sm:text-2xl text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">100%</p>
                <p className="text-slate-400 text-xs mt-0.5">Tested Hardware</p>
              </div>
              <div>
                <p className="font-mono font-black text-xl sm:text-2xl text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">Lahore &amp; ISB</p>
                <p className="text-slate-400 text-xs mt-0.5">Physical Branches</p>
              </div>
              <div>
                <p className="font-mono font-black text-xl sm:text-2xl text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">All Pakistan</p>
                <p className="text-slate-400 text-xs mt-0.5">Secure Courier</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* SECTION B: ULTRA-LUXURY CATEGORY CARDS */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">Explore Catalog</span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Shop by Category</h2>
            </div>
            <Link href="/accessories" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
              <span>View Accessories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {featuredCategories.map((cat) => {
              const Icon = categoryIcons[cat.slug] || Laptop;
              return (
                <Link
                  key={cat.id}
                  href={cat.slug === 'laptops' ? '/laptops' : `/${cat.slug}`}
                  className="group relative p-5 rounded-2xl bg-[#0D121F]/90 backdrop-blur-xl border border-white/[0.08] hover:border-amber-500/50 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{cat.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                    <span className="text-amber-400 font-mono font-bold text-[11px]">{cat._count?.products || 0} Products</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION C: HANDPICKED FEATURED PRODUCTS (REVAMPED CARDS) */}
        {formattedFeaturedProducts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">Handpicked</span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Featured Laptops</h2>
              </div>
              <Link href="/laptops" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                <span>View All Laptops</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {formattedFeaturedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION D: BUDGET RANGE DISCOVERY */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0F1424] to-[#0A0D15] text-white relative overflow-hidden space-y-8 border border-amber-500/20 shadow-2xl">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">Custom Budget</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Shop by Price Band</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select your budget to view curated laptops matching your exact price range.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {budgetBands.map((band) => (
              <Link
                key={band.label}
                href={`/laptops?minPrice=${band.minPrice}${band.maxPrice ? `&maxPrice=${band.maxPrice}` : ''}`}
                className="group p-4 rounded-xl bg-[#090D17] border border-white/[0.08] hover:border-amber-500/50 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Range
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors mt-1">
                    {band.label}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-white/[0.08] text-[11px] text-amber-400 font-mono font-bold">
                  {band.count} Available
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION E: 5-LAPTOP NEW ARRIVALS 3D CAROUSEL */}
        {formattedCarouselLaptops.length > 0 && (
          <NewArrivalsCarousel
            products={formattedCarouselLaptops}
            whatsappNumber={whatsappNumber}
          />
        )}

        {/* SECTION F: SPECIAL DEALS */}
        {formattedSaleProducts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">Discounted</span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Today&apos;s Special Deals 🔥</h2>
              </div>
              <Link href="/deals" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                <span>All Deals</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {formattedSaleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION G: TRUST & SERVICES (DARK LUXURY) */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#0E1322]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Nationwide Delivery</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Fast and secure courier delivery across Lahore, Karachi, Islamabad, and all cities in Pakistan.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Advance Bank Payment</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Transparent payments with verified official bank transfer and instant WhatsApp receipts.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Direct WhatsApp Ordering</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Generate exact itemized WhatsApp quotes with RAM, SSD, and charger options included.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Expert Support</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Direct phone &amp; WhatsApp guidance to help pick the right specs for programming, office, or gaming.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION H: PHYSICAL BRANCHES */}
        {branches.length > 0 && (
          <section className="p-8 sm:p-10 rounded-3xl bg-[#090D17] border border-amber-500/20 shadow-2xl space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">Locations</span>
              <h2 className="text-2xl font-black text-white tracking-tight">Visit Our Branches</h2>
              <p className="text-xs text-slate-400">
                Inspect laptops in person or collect orders directly from our branches in Lahore &amp; Islamabad.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {branches.map((b) => (
                <div key={b.id} className="p-6 rounded-2xl bg-[#0F1424] border border-white/[0.08] hover:border-amber-500/40 shadow-xl space-y-3 transition-colors">
                  <div className="flex items-center gap-2 text-amber-400">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-white text-base">{b.name}</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-amber-400">City:</strong> {b.city}
                  </p>
                  <p className="text-xs text-slate-300">
                    <strong className="text-amber-400">Address:</strong> {b.address}
                  </p>
                  {b.contactNumber && (
                    <p className="text-xs text-slate-300">
                      <strong className="text-amber-400">Phone:</strong> {b.contactNumber}
                    </p>
                  )}
                  {b.operatingHours && (
                    <p className="text-xs text-slate-300">
                      <strong className="text-amber-400">Hours:</strong> {b.operatingHours}
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
