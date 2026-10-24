'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye, Star, Zap, Cpu, HardDrive, Laptop, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

export interface ProductCardData {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  originalPrice?: number | null;
  stock: number;
  condition: 'NEW' | 'USED' | 'REFURBISHED';
  isFeatured?: boolean;
  isOnSale?: boolean;
  category: { name: string; slug: string };
  brand?: { name: string } | null;
  specifications?: Record<string, string | number | boolean> | null;
  images: { url: string; alt?: string | null }[];
  hasChargerOption?: boolean;
  hasBagOption?: boolean;
  rating?: number | null;
  reviewCount?: number | null;
}

export const ProductCard: React.FC<{ product: ProductCardData }> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock <= 0;
  const isLaptop = product.category?.slug === 'laptops';
  const mainImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80';

  // Extract key laptop specs for high-tech spec tags
  const specs = (product.specifications || {}) as Record<string, string>;
  const cpu = specs.processorFamily || specs.processor || '';
  const ram = specs.ram || specs.baseRam || '';
  const ssd = specs.ssd || specs.baseSsd || specs.storage || '';
  const display = specs.screenSize ? `${specs.screenSize}" ${specs.resolution || ''}`.trim() : specs.display || '';

  const hasDiscount = !!product.originalPrice && product.originalPrice > product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.basePrice) / product.originalPrice!) * 100)
    : 0;

  // Ultra-responsive Add to Cart and navigate directly to /cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error('This product is currently out of stock.');
      return;
    }

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
      image: mainImage,
      brand: product.brand?.name,
      config,
      configSummary,
      unitPrice: product.basePrice,
      quantity: 1,
      maxStock: product.stock,
    });

    toast.success(`${product.title} added to Cart! Opening checkout...`);
    window.location.href = '/cart';
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#101524]/90 via-[#0D121F]/95 to-[#090D17] border border-white/[0.08] hover:border-amber-500/50 p-4 transition-all duration-400 hover:shadow-[0_12px_35px_-5px_rgba(245,158,11,0.18)] hover:-translate-y-1.5 ${
        isOutOfStock ? 'opacity-70' : ''
      }`}
    >
      <div>
        {/* Top Product Image Frame with Radial Amber Backlight */}
        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#161D2E]/80 to-[#0A0D15] p-3 mb-3.5 border border-white/[0.05]">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_70%)] pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <Link href={`/products/${product.slug}`} className="block relative w-full h-full">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-110 drop-shadow-md"
            />
          </Link>

          {/* Badges Stack Left */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.isOnSale && hasDiscount && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/30">
                {discountPercent}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-md shadow-amber-400/20">
                FEATURED
              </span>
            )}
          </div>

          {/* Brand New Badge Right */}
          <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Brand New
            </span>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-[#07090E]/80 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="bg-red-500/90 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg border border-red-400/40">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Brand & Stock Status Header */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
          <span className="tracking-wide uppercase text-[10px] font-bold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
            {product.brand?.name || product.category?.name || 'LAPTOP'}
          </span>

          <span className="flex items-center gap-1.5 text-[11px]">
            <span
              className={`w-2 h-2 rounded-full ${
                isOutOfStock
                  ? 'bg-red-500'
                  : 'bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse'
              }`}
            />
            <span className={isOutOfStock ? 'text-red-400' : 'text-emerald-400 font-medium'}>
              {isOutOfStock ? 'Sold Out' : 'In Stock'}
            </span>
          </span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block group/title">
          <h3 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2 group-hover/title:text-amber-400 transition-colors mb-2 min-h-[38px] leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5 text-xs mb-2.5">
          <div className="flex items-center text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-extrabold text-slate-200 text-xs">
            {product.rating ? product.rating.toFixed(1) : '5.0'}
          </span>
          <span className="text-[11px] text-slate-400">
            ({product.reviewCount ?? 8} reviews)
          </span>
        </div>

        {/* High-Tech Spec Pills for Laptops */}
        {isLaptop && (cpu || ram || ssd) && (
          <div className="grid grid-cols-2 gap-1.5 py-2.5 my-2 border-y border-white/[0.07] text-[10px] font-medium">
            {cpu && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300 truncate" title={cpu}>
                <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="truncate">{cpu}</span>
              </div>
            )}
            {ram && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300 truncate" title={ram}>
                <Cpu className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{ram}</span>
              </div>
            )}
            {ssd && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300 truncate" title={ssd}>
                <HardDrive className="w-3 h-3 text-purple-400 flex-shrink-0" />
                <span className="truncate">{ssd}</span>
              </div>
            )}
            {display && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300 truncate" title={display}>
                <Laptop className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{display}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pricing & Interactive Action Buttons */}
      <div className="pt-3 mt-2 border-t border-white/[0.07] space-y-3">
        {/* Luxury Gold Pricing */}
        <div className="flex items-baseline flex-wrap gap-2">
          <span className="text-amber-400 font-mono text-base sm:text-lg font-black tracking-tight drop-shadow-[0_0_10px_rgba(245,158,11,0.25)]">
            <span className="text-xs mr-0.5 text-amber-300/80">Rs</span>
            {Math.round(product.basePrice).toLocaleString('en-PK')}
          </span>

          {hasDiscount && (
            <span className="line-through text-slate-400 text-xs font-mono">
              Rs {Math.round(product.originalPrice!).toLocaleString('en-PK')}
            </span>
          )}
        </div>

        {/* Buttons Grid: Details + Cart */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2.5 text-xs font-bold rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-amber-400/40 text-slate-200 hover:text-white transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
            <span>Details</span>
          </Link>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-2.5 text-xs font-black rounded-xl text-white transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-700/50 cursor-not-allowed opacity-50 border border-white/5'
                : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95 border border-amber-300/30'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
