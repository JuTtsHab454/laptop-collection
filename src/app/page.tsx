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
  MapPin,
  ChevronRight,
  Cpu,
  HardDrive,
  Zap,
  Mouse,
  Briefcase,
  Wind,
  ExternalLink,
} from 'lucide-react';
import { ProductCardData } from '@/components/product/ProductCard';
import TrustStrip from '@/components/home/TrustStrip';
import LaptopCarousel from '@/components/home/LaptopCarousel';
import BudgetFinder from '@/components/home/BudgetFinder';
import AccessoriesGrid from '@/components/home/AccessoriesGrid';
import FinalCTA from '@/components/home/FinalCTA';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/data/catalog';

export const revalidate = 60;

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
  let categories: any[] = [];
  let dbProducts: any[] = [];
  let branches: any[] = [];
  let whatsappNumber = '923134951239';

  try {
    const results = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        include: { _count: { select: { products: true } } },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.product.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
          reviews: { where: { isApproved: true }, select: { rating: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.branch.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.siteSetting.findUnique({ where: { key: 'whatsapp_number' } }),
    ]);

    categories = results[0];
    dbProducts = results[1];
    branches = results[2];
    if (results[3]?.value) whatsappNumber = results[3].value;
  } catch (err) {
    console.warn('Database query fallback in HomePage:', err);
  }

  // Fallback to memory catalog if DB returned no products
  const rawProducts = dbProducts.length > 0 ? dbProducts : INITIAL_PRODUCTS;
  const allProducts = rawProducts.map(formatProduct);

  // Extract strict laptops list
  const laptopList = allProducts.filter(
    (p) => !p.category?.slug || p.category.slug === 'laptops'
  );

  // Fallback categories if empty
  if (categories.length === 0) {
    categories = INITIAL_CATEGORIES.map((c) => ({
      ...c,
      description: `Flagship ${c.name} with 7-day checking warranty`,
      _count: {
        products: allProducts.filter((p) => p.category?.slug === c.slug).length,
      },
    }));
  }

  // Fallback branches if empty
  if (branches.length === 0) {
    branches = [
      {
        id: 'branch-lhr',
        name: 'Lahore Experience Center',
        city: 'Lahore',
        address: 'Shop # 14-16, 2nd Floor, Hafeez Center, Main Boulevard, Gulberg III, Lahore',
        contactNumber: '+92 313 4951239',
        operatingHours: 'Mon – Sat: 11:00 AM – 9:00 PM',
        mapLink: 'https://maps.google.com/?q=Hafeez+Center+Lahore',
        badge: 'Main Tech Hub',
      },
      {
        id: 'branch-isb',
        name: 'Islamabad Experience Center',
        city: 'Islamabad',
        address: 'Mezzanine Floor, Beverly Centre, Jinnah Avenue, Blue Area, Islamabad',
        contactNumber: '+92 313 4951239',
        operatingHours: 'Mon – Sat: 11:30 AM – 8:30 PM',
        mapLink: 'https://maps.google.com/?q=Beverly+Centre+Blue+Area+Islamabad',
        badge: 'Showroom & Pickup',
      },
    ];
  }

  const categoryIcons: Record<string, any> = {
    laptops: Laptop,
    ram: Cpu,
    ssds: HardDrive,
    chargers: Zap,
    'mice-accessories': Mouse,
    'laptop-bags': Briefcase,
    'cooling-pads': Wind,
  };

  const heroLaptop = laptopList[0] || allProducts[0];
  const cleanWA = whatsappNumber.replace(/[^0-9]/g, '');
  const heroWhatsAppUrl = `https://wa.me/${cleanWA}?text=${encodeURIComponent(
    'Hi Laptop Collection! I would like expert advice on buying a laptop.'
  )}`;

  return (
    <div className="space-y-12 sm:space-y-16 text-slate-100">
      {/* SECTION 1: COMPACT, HIGH-CONTRAST 50/50 HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#090D17] via-[#07090E] to-[#0A0D15] text-white pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-white/[0.08]">
        {/* Subtle geometric grid background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#F59E0B_1px,transparent_1px),linear-gradient(to_bottom,#F59E0B_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/4 -right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left 7 Cols: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Pakistan&apos;s Verified Laptop Destination</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Premium Laptops &amp; Performance Upgrades in{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Pakistan
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
                Business ultrabooks, tested workstations, and original hardware components. Rigorously inspected with 7-day checking warranty and secure nationwide shipping.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/laptops"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-95"
                >
                  <span>Explore Laptops ({laptopList.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={heroWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/10 text-sm font-bold transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Consultation</span>
                </a>
              </div>

              {/* Verified Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/[0.08] text-xs">
                <div>
                  <p className="font-mono font-black text-lg sm:text-xl text-amber-400">100%</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Stress-Tested</p>
                </div>
                <div>
                  <p className="font-mono font-black text-lg sm:text-xl text-emerald-400">2 Stores</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Lahore &amp; Islamabad</p>
                </div>
                <div>
                  <p className="font-mono font-black text-lg sm:text-xl text-amber-400">Pakistan</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Safe Delivery</p>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Flagship Showcase Card */}
            {heroLaptop && (
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl bg-gradient-to-b from-[#111728] to-[#0B0F19] border border-amber-500/30 p-6 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      FEATURED FLAGSHIP
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      In Stock &amp; Ready
                    </span>
                  </div>

                  {/* Device Image */}
                  <Link
                    href={`/products/${heroLaptop.slug}`}
                    className="relative block aspect-[16/10] w-full rounded-2xl bg-[#07090E] p-3 mb-4 overflow-hidden border border-white/[0.05] group"
                  >
                    <Image
                      src={heroLaptop.images[0]?.url || '/placeholder-laptop.svg'}
                      alt={heroLaptop.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Device Title & Quick Specs */}
                  <div className="space-y-2 mb-4">
                    <Link href={`/products/${heroLaptop.slug}`} className="block">
                      <h3 className="text-base font-bold text-white hover:text-amber-400 transition-colors line-clamp-1">
                        {heroLaptop.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-400 font-mono">
                      {heroLaptop.brand?.name || 'Verified Laptop'} · 7-Day Checking Warranty
                    </p>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] py-3 border-y border-white/[0.08]">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Inspected CPU</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Original RAM</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                      <span>High-Speed SSD</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Genuine Battery</span>
                    </div>
                  </div>

                  {/* Card Bottom: Price & Quick View */}
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
                      <span className="text-lg font-black text-amber-400 font-mono">
                        Rs {heroLaptop.basePrice.toLocaleString()}
                      </span>
                    </div>
                    <Link
                      href={`/products/${heroLaptop.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUST STRIP */}
      <TrustStrip />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* SECTION 3: FLAT HORIZONTAL LAPTOP CAROUSEL */}
        <LaptopCarousel
          products={laptopList}
          whatsappNumber={whatsappNumber}
        />

        {/* SECTION 4: SHOP BY CATEGORY (7 CATEGORIES, LAPTOPS EMPHASIZED) */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Full Inventory
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/accessories"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>All Accessories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] || Laptop;
              const isLaptopCat = cat.slug === 'laptops';

              return (
                <Link
                  key={cat.id || cat.slug}
                  href={isLaptopCat ? '/laptops' : `/${cat.slug}`}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                    isLaptopCat
                      ? 'col-span-2 sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#12192D] to-[#0A0E18] border-amber-500/40 shadow-xl shadow-amber-500/5'
                      : 'bg-[#0B0F19] border-white/[0.08] hover:border-amber-500/40'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors">
                        {cat.name}
                      </h3>
                      {isLaptopCat && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-black">
                          Core Catalog
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {cat.description || `Verified ${cat.name} in Pakistan`}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                    <span className="text-amber-400 font-mono font-bold text-[11px]">
                      {cat._count?.products ?? 0} Products
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: BUDGET FINDER (FILTERED TO LAPTOPS ONLY, NO 0-COUNT RANGES) */}
        <BudgetFinder products={laptopList} />

        {/* SECTION 6: ESSENTIAL ACCESSORIES GRID (6 ITEMS) */}
        <AccessoriesGrid products={allProducts} />

        {/* SECTION 7: VISIT OUR EXPERIENCE CENTERS (LAHORE & ISLAMABAD) */}
        <section className="relative rounded-3xl bg-[#090D17] border border-white/[0.08] p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              In-Person Inspection
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Visit Our Experience Centers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Walk into our physical branches in Lahore &amp; Islamabad to check laptop aesthetics, screen quality, and battery health before purchasing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {branches.map((b) => (
              <div
                key={b.id || b.name}
                className="group relative rounded-2xl bg-[#0F1424] border border-white/[0.08] hover:border-amber-500/40 p-6 space-y-4 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-1.5 inline-block">
                        {b.badge || `${b.city} Branch`}
                      </span>
                      <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-amber-400 transition-colors">
                        {b.name}
                      </h3>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-white/[0.06] pt-3">
                    <p className="leading-relaxed">
                      <strong className="text-slate-200">Address:</strong>{' '}
                      {b.address}
                    </p>
                    {b.operatingHours && (
                      <p>
                        <strong className="text-slate-200">Hours:</strong>{' '}
                        {b.operatingHours}
                      </p>
                    )}
                    {b.contactNumber && (
                      <p>
                        <strong className="text-slate-200">Helpline:</strong>{' '}
                        <a href={`tel:${b.contactNumber}`} className="text-amber-400 font-mono font-bold hover:underline">
                          {b.contactNumber}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <Link
                    href="/branches"
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>Branch Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {b.mapLink && (
                    <a
                      href={b.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-medium"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8: FINAL CTA CONVERSION BANNER */}
        <FinalCTA whatsappNumber={whatsappNumber} />
      </div>
    </div>
  );
}
