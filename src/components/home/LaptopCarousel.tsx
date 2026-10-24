'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Cpu,
  HardDrive,
  ShoppingCart,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { ProductCardData } from '@/components/product/ProductCard';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import { generateProductInquiryLink } from '@/lib/whatsapp';

interface LaptopCarouselProps {
  products: ProductCardData[];
  whatsappNumber?: string;
}

export default function LaptopCarousel({
  products,
  whatsappNumber = '923134951239',
}: LaptopCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter to only actual laptops
  const laptopItems = products.filter(
    (p) => !p.category?.slug || p.category.slug === 'laptops'
  );

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [laptopItems.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 320; // approximate card width + gap
    const scrollAmount = direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent, product: ProductCardData) => {
    e.preventDefault();
    e.stopPropagation();

    const specs = (product.specifications || {}) as Record<string, string>;
    const cpu = specs.processorFamily || specs.processor || '';
    const ram = specs.ram || specs.baseRam || '';
    const ssd = specs.ssd || specs.baseSsd || specs.storage || '';

    const config = {
      ...(ram ? { ram } : {}),
      ...(ssd ? { ssd } : {}),
      ...(cpu ? { processor: cpu } : {}),
    };
    const summaryParts = [ram, ssd, cpu].filter(Boolean);
    const configSummary = summaryParts.length > 0 ? summaryParts.join(' • ') : 'Standard Configuration';

    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      image: product.images[0]?.url || '/placeholder-laptop.svg',
      brand: product.brand?.name,
      config,
      configSummary,
      unitPrice: product.basePrice,
      quantity: 1,
      maxStock: product.stock,
    });

    toast.success(`${product.title} added to Cart! 🛒`);
  };

  if (laptopItems.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-12 bg-gradient-to-b from-[#090D17] via-[#0C111F] to-[#080B14] rounded-3xl border border-white/[0.08] shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header with Title and Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Verified In Stock
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Featured Flagship Laptops
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              100% genuine laptops benchmarked and verified with 7-day checking warranty.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/laptops"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 mr-2 transition-colors flex items-center gap-1"
            >
              View All ({laptopItems.length})
              <ChevronRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className={`p-2.5 rounded-xl border transition-all ${
                canScrollLeft
                  ? 'bg-[#121828] border-white/10 text-white hover:border-amber-400/50 hover:bg-amber-500/10 active:scale-95'
                  : 'bg-[#0E1320] border-white/5 text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className={`p-2.5 rounded-xl border transition-all ${
                canScrollRight
                  ? 'bg-[#121828] border-white/10 text-white hover:border-amber-400/50 hover:bg-amber-500/10 active:scale-95'
                  : 'bg-[#0E1320] border-white/5 text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Flat Horizontal Carousel Track */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-none pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {laptopItems.map((product) => {
            const specs = (product.specifications || {}) as Record<string, string>;
            const cpu = specs.processorFamily || specs.processor || '';
            const ram = specs.ram || specs.baseRam || '';
            const ssd = specs.ssd || specs.baseSsd || specs.storage || '';
            const mainImg = product.images[0]?.url || '/placeholder-laptop.svg';
            const isOutOfStock = product.stock <= 0;
            const waInquiryUrl = generateProductInquiryLink(
              product.title,
              product.basePrice,
              [cpu, ram, ssd].filter(Boolean).join(' • '),
              whatsappNumber
            );

            return (
              <div
                key={product.id}
                className="w-[280px] sm:w-[320px] lg:w-[340px] flex-shrink-0 snap-start"
              >
                <div className="group h-full flex flex-col justify-between rounded-3xl bg-[#0B0F19] border border-white/[0.08] hover:border-amber-500/40 p-5 transition-all duration-300 shadow-xl hover:shadow-amber-500/5">
                  <div>
                    {/* Image Box */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative block aspect-[16/10] w-full rounded-2xl bg-[#07090E] p-3 mb-4 overflow-hidden border border-white/[0.05] group-hover:border-amber-500/20 transition-all"
                    >
                      <Image
                        src={mainImg}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 280px, 340px"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Stock / Sale Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        {product.isOnSale && product.originalPrice && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500 text-black uppercase shadow-sm">
                            SALE
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.06] backdrop-blur-md text-amber-300 border border-white/10 uppercase">
                          {product.brand?.name || 'LAPTOP'}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                            isOutOfStock
                              ? 'bg-red-500/10 border-red-500/30 text-red-400'
                              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {isOutOfStock ? 'Sold Out' : 'In Stock'}
                        </span>
                      </div>
                    </Link>

                    {/* Title */}
                    <Link href={`/products/${product.slug}`} className="block">
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 min-h-[40px] leading-snug mb-3">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Hardware Specs Pills */}
                    {(cpu || ram || ssd) && (
                      <div className="grid grid-cols-2 gap-1.5 py-2.5 my-2 border-y border-white/[0.06] text-[10px]">
                        {cpu && (
                          <div
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.05] text-slate-300 truncate"
                            title={cpu}
                          >
                            <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            <span className="truncate">{cpu}</span>
                          </div>
                        )}
                        {ram && (
                          <div
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.05] text-slate-300 truncate"
                            title={ram}
                          >
                            <Cpu className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                            <span className="truncate">{ram}</span>
                          </div>
                        )}
                        {ssd && (
                          <div
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.05] text-slate-300 truncate col-span-2"
                            title={ssd}
                          >
                            <HardDrive className="w-3 h-3 text-purple-400 flex-shrink-0" />
                            <span className="truncate">{ssd}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price & Actions */}
                  <div className="space-y-3 pt-3">
                    <div className="flex items-baseline justify-between">
                      <PriceDisplay
                        price={product.basePrice}
                        originalPrice={product.originalPrice}
                        size="md"
                        showBadge={false}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={isOutOfStock}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                          isOutOfStock
                            ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                            : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/10 active:scale-95'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Cart
                      </button>

                      <a
                        href={waInquiryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
