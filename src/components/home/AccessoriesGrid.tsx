'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import { ProductCardData } from '@/components/product/ProductCard';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

interface AccessoriesGridProps {
  products: ProductCardData[];
}

export default function AccessoriesGrid({ products }: AccessoriesGridProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Filter to only non-laptop accessories and take up to 6 diverse items
  const nonLaptops = products.filter((p) => p.category?.slug && p.category.slug !== 'laptops');

  // Try to pick one from each category for diversity
  const categoryOrder = ['ram', 'ssds', 'chargers', 'mice-accessories', 'laptop-bags', 'cooling-pads'];
  const diverseList: ProductCardData[] = [];

  for (const cat of categoryOrder) {
    const item = nonLaptops.find(
      (p) => p.category?.slug === cat && !diverseList.some((d) => d.id === p.id)
    );
    if (item) diverseList.push(item);
  }

  // Fill remaining slots if fewer than 6
  if (diverseList.length < 6) {
    for (const item of nonLaptops) {
      if (!diverseList.some((d) => d.id === item.id)) {
        diverseList.push(item);
      }
      if (diverseList.length >= 6) break;
    }
  }

  const items = diverseList.slice(0, 6);

  const handleAddToCart = (e: React.MouseEvent, product: ProductCardData) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      image: product.images[0]?.url || '/placeholder-laptop.svg',
      brand: product.brand?.name,
      config: {},
      configSummary: 'Standard Configuration',
      unitPrice: product.basePrice,
      quantity: 1,
      maxStock: product.stock,
    });

    toast.success(`${product.title} added to Cart! 🛒`);
  };

  if (items.length === 0) return null;

  return (
    <section className="relative py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Performance Boosters &amp; Essentials
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Laptop Accessories &amp; Upgrades
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Genuine DDR4/DDR5 RAM, high-speed NVMe SSDs, replacement chargers, and durable carrying bags.
          </p>
        </div>

        <Link
          href="/accessories"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors group self-start sm:self-auto"
        >
          View All Accessories
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 6-Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((product) => {
          const mainImg = product.images[0]?.url || '/placeholder-laptop.svg';
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={product.id}
              className="group flex flex-col justify-between rounded-2xl bg-[#0B0F19] border border-white/[0.08] hover:border-amber-500/40 p-3.5 transition-all duration-300 shadow-lg hover:shadow-amber-500/5"
            >
              <div>
                {/* Image */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block aspect-square w-full rounded-xl bg-[#07090E] p-2 mb-3 overflow-hidden border border-white/[0.04] group-hover:border-amber-500/20 transition-all"
                >
                  <Image
                    src={mainImg}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 180px"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-amber-300 border border-white/10 uppercase">
                    {product.category?.name || 'Accessory'}
                  </span>
                </Link>

                {/* Title */}
                <Link href={`/products/${product.slug}`} className="block">
                  <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 min-h-[34px] leading-snug mb-2">
                    {product.title}
                  </h3>
                </Link>
              </div>

              {/* Price & Action */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <PriceDisplay
                  price={product.basePrice}
                  originalPrice={product.originalPrice}
                  size="sm"
                  showBadge={false}
                />

                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={isOutOfStock}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                    isOutOfStock
                      ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                      : 'bg-white/[0.06] hover:bg-amber-500 hover:text-black text-slate-200 border border-white/10 hover:border-amber-500 active:scale-95'
                  }`}
                >
                  <ShoppingCart className="w-3 h-3" />
                  Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
