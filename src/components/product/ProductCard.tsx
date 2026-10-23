'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Badge from '@/components/ui/Badge';
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
  const isLaptop = product.category.slug === 'laptops';
  const mainImage = product.images[0]?.url || '/placeholder-laptop.svg';

  // Extract key laptop specs
  const specs = (product.specifications || {}) as Record<string, string>;
  const cpu = specs.processorFamily || specs.processor || '';
  const ram = specs.ram || specs.baseRam || '';
  const ssd = specs.ssd || specs.baseSsd || specs.storage || '';
  const display = specs.screenSize ? `${specs.screenSize}" ${specs.resolution || ''}` : '';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error('This product is currently out of stock.');
      return;
    }

    if (isLaptop) {
      // Configurable products need configuration on detail page
      window.location.href = `/products/${product.slug}`;
      return;
    }

    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      image: mainImage,
      brand: product.brand?.name,
      config: {},
      configSummary: 'Standard Configuration',
      unitPrice: product.basePrice,
      quantity: 1,
      maxStock: product.stock,
    });

    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-brand-charcoal border border-surface-muted dark:border-brand-steel p-4 transition-all duration-300 hover:shadow-xl hover:border-accent-blue/50 ${
        isOutOfStock ? 'opacity-75' : ''
      }`}
    >
      <div>
        {/* Top Badges & Image */}
        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-surface-cream/50 dark:bg-brand-navy/50 mb-3.5">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2.5 transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges Stack */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {product.isOnSale && product.originalPrice && product.originalPrice > product.basePrice && (
              <Badge variant="sale" size="sm">
                SALE
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="featured" size="sm">
                FEATURED
              </Badge>
            )}
          </div>

          <div className="absolute top-2 right-2 z-10">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              Brand New
            </span>
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-status-error text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Brand & Category */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-accent-silver mb-1">
          <span>{product.brand?.name || product.category.name}</span>
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isOutOfStock ? 'bg-status-error' : 'bg-status-success animate-pulse'
              }`}
            />
            {isOutOfStock ? 'Out of stock' : 'In Stock'}
          </span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-accent-blue transition-colors mb-1.5 min-h-[36px]">
            {product.title}
          </h3>
        </Link>

        {/* Rating Stars (when present) */}
        {product.rating ? (
          <div className="flex items-center gap-1.5 text-xs mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount !== undefined && product.reviewCount !== null && (
              <span className="text-[11px] text-gray-400">
                ({product.reviewCount})
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-2">
            <Star className="w-3 h-3 text-gray-300" />
            <span>New arrival</span>
          </div>
        )}

        {/* Key Specs for Laptops */}
        {isLaptop && (cpu || ram || ssd || display) && (
          <div className="py-2 my-1 border-t border-b border-surface-muted dark:border-brand-steel text-[11px] text-gray-600 dark:text-gray-300 space-y-0.5 font-medium">
            {cpu && <p className="truncate">⚡ CPU: {cpu}</p>}
            <p className="truncate">
              {ram && <span>💾 {ram}</span>}
              {ram && ssd && <span> • </span>}
              {ssd && <span>🚀 {ssd}</span>}
            </p>
            {display && <p className="truncate text-gray-500 text-[10px]">🖥️ {display}</p>}
          </div>
        )}
      </div>

      {/* Pricing & Actions */}
      <div className="pt-3 mt-2 border-t border-surface-muted dark:border-brand-steel space-y-3">
        <PriceDisplay price={product.basePrice} originalPrice={product.originalPrice} size="sm" />

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-lg border border-brand-steel hover:bg-surface-light dark:hover:bg-brand-slate text-gray-800 dark:text-gray-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            className={`inline-flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-lg text-white transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                : 'bg-accent-blue hover:bg-accent-blue-dark active:scale-95 shadow-accent-blue/20'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isLaptop ? 'Options' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
