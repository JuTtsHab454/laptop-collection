'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  Eye,
  MessageCircle,
  Cpu,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { ProductCardData } from '@/components/product/ProductCard';
import PriceDisplay, { formatPKR } from '@/components/ui/PriceDisplay';
import Badge from '@/components/ui/Badge';
import { generateProductInquiryLink } from '@/lib/whatsapp';

interface NewArrivalsCarouselProps {
  products: ProductCardData[];
  whatsappNumber?: string;
}

export const NewArrivalsCarousel: React.FC<NewArrivalsCarouselProps> = ({
  products,
  whatsappNumber = '923134951239',
}) => {
  // Ensure we have at least 1 and up to 5 products
  const items = products.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = items.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  if (total === 0) return null;

  return (
    <section className="relative overflow-hidden py-8 sm:py-12 bg-gradient-to-b from-brand-charcoal via-brand-navy to-brand-charcoal rounded-3xl text-white border border-brand-steel/60">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent-blue/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/15 border border-accent-blue/30 text-accent-blue text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Latest Laptops &amp; New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Freshly inspected, benchmarked business laptops and ultrabooks with 7-day checking warranty and advance payment nationwide delivery.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-brand-navy border border-brand-steel hover:border-accent-blue hover:bg-brand-slate text-white shadow-md active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue"
              aria-label="Previous laptop"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-brand-navy border border-brand-steel hover:border-accent-blue hover:bg-brand-slate text-white shadow-md active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue"
              aria-label="Next laptop"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Perspective Carousel Stage */}
        <div
          className="relative min-h-[480px] sm:min-h-[520px] flex items-center justify-center [perspective:1200px] overflow-hidden py-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((product, idx) => {
            // Calculate relative offset from activeIndex: -2, -1, 0, 1, 2
            let offset = idx - activeIndex;
            if (offset < -2) offset += total;
            if (offset > 2) offset -= total;

            const isCenter = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;
            const isHidden = Math.abs(offset) > 1;

            const specs = (product.specifications || {}) as Record<string, string>;
            const cpu = specs.processorFamily || specs.processor || '';
            const ram = specs.ram || specs.baseRam || '';
            const ssd = specs.ssd || specs.baseSsd || specs.storage || '';
            const display = specs.screenSize ? `${specs.screenSize}" ${specs.resolution || ''}` : '';
            const mainImg = product.images[0]?.url || '/placeholder-laptop.svg';

            return (
              <div
                key={product.id}
                onClick={() => {
                  if (!isCenter) setActiveIndex(idx);
                }}
                className={`absolute w-full max-w-[340px] sm:max-w-[400px] transition-all duration-500 ease-out select-none ${
                  isCenter
                    ? 'z-30 scale-100 opacity-100 translate-x-0 shadow-2xl cursor-default'
                    : isLeft
                    ? 'z-10 scale-[0.88] opacity-60 -translate-x-[55%] sm:-translate-x-[65%] [transform:rotateY(16deg)] cursor-pointer hover:opacity-80'
                    : isRight
                    ? 'z-10 scale-[0.88] opacity-60 translate-x-[55%] sm:translate-x-[65%] [transform:rotateY(-16deg)] cursor-pointer hover:opacity-80'
                    : 'z-0 scale-75 opacity-0 pointer-events-none'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="relative rounded-3xl bg-brand-charcoal border-2 border-brand-steel p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
                  {/* Subtle top spotlight border */}
                  {isCenter && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent-blue via-accent-gold to-accent-blue" />
                  )}

                  <div>
                    {/* Top Badges & Product Image */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl bg-brand-navy/80 p-3 mb-4 overflow-hidden flex items-center justify-center">
                      <Image
                        src={mainImg}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 340px, 400px"
                        className="object-contain p-2"
                        priority={isCenter}
                      />

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        {product.isOnSale && product.originalPrice && (
                          <Badge variant="sale" size="sm">
                            SALE
                          </Badge>
                        )}
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-accent-blue/20 text-accent-blue border border-accent-blue/40 uppercase">
                          NEW ARRIVAL
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-steel text-white uppercase">
                          {product.condition}
                        </span>
                      </div>
                    </div>

                    {/* Brand & Stock */}
                    <div className="flex items-center justify-between text-xs font-semibold text-accent-silver mb-1.5">
                      <span>{product.brand?.name || 'Laptop'}</span>
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        In Stock ({product.stock} units)
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3 className="text-base sm:text-lg font-black text-white line-clamp-1 hover:text-accent-blue transition-colors">
                      {product.title}
                    </h3>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-2 text-xs mt-1.5">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              product.rating && s <= Math.round(product.rating)
                                ? 'fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-white text-xs">
                        {product.rating ? product.rating.toFixed(1) : '5.0'}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        ({product.reviewCount || 4} reviews)
                      </span>
                    </div>

                    {/* Key Specs Pills */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-brand-steel/60 text-xs text-gray-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <Cpu className="w-3.5 h-3.5 text-accent-blue flex-shrink-0" />
                        <span className="truncate">{cpu || 'Intel / AMD'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <HardDrive className="w-3.5 h-3.5 text-accent-gold flex-shrink-0" />
                        <span className="truncate">{ram || '16GB'} • {ssd || '512GB'}</span>
                      </div>
                      {display && (
                        <div className="col-span-2 text-[11px] text-gray-400 truncate">
                          🖥️ Screen: {display}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-brand-steel space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-accent-silver font-semibold uppercase">
                        Price (PKR):
                      </span>
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-black font-mono text-accent-gold">
                          Rs {formatPKR(product.basePrice)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.basePrice && (
                          <span className="block text-xs line-through text-gray-500 font-mono">
                            Rs {formatPKR(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-accent-blue hover:bg-accent-blue-dark text-white font-bold text-xs shadow-md transition-all active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Laptop</span>
                      </Link>

                      <a
                        href={generateProductInquiryLink(
                          product.title,
                          product.basePrice,
                          `${cpu || ''} ${ram || ''} ${ssd || ''}`.trim(),
                          whatsappNumber
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide Indicator Dots (1 to 5) */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {items.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                idx === activeIndex
                  ? 'w-8 bg-accent-blue shadow-md shadow-accent-blue/50'
                  : 'w-2.5 bg-brand-steel hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}: ${p.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsCarousel;
