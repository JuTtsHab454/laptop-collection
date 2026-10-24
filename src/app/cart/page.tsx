'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPKR } from '@/components/ui/PriceDisplay';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-sm text-slate-400">
        Loading shopping cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Your Shopping Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
          Explore our range of premium verified laptops, RAM modules, and NVMe SSD upgrades.
        </p>
        <Link
          href="/laptops"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
        >
          <span>Browse All Laptops</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const deliveryCharge = 0; // Free delivery default across Pakistan
  const totalAmount = subtotal + deliveryCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Shopping Cart</h1>
        <p className="text-xs text-slate-400 mt-1">Review your selected laptops and hardware options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#0E1322]/95 backdrop-blur-xl rounded-3xl border border-white/[0.08] divide-y divide-white/[0.08] shadow-2xl overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#090D17] border border-white/[0.08] flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-bold text-sm sm:text-base text-white hover:text-amber-400 transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>

                  {item.configSummary && (
                    <p className="text-xs text-slate-400 font-medium">{item.configSummary}</p>
                  )}

                  <div className="text-xs text-amber-400 font-mono font-bold pt-1">
                    Rs {formatPKR(item.unitPrice)} each
                  </div>
                </div>

                {/* Quantity and Line Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                  <div className="flex items-center border border-white/[0.08] rounded-xl bg-[#090D17] overflow-hidden">
                    <button
                      type="button"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-white/[0.05] disabled:opacity-30 text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={item.quantity >= item.maxStock}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-white/[0.05] disabled:opacity-30 text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-sm sm:text-base font-black font-mono text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                      Rs {formatPKR(item.unitPrice * item.quantity)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 sm:justify-end mt-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/laptops"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0E1322]/95 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-6 space-y-5 shadow-2xl">
            <h2 className="text-base font-bold text-white border-b border-white/[0.08] pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-white">Rs {formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Nationwide Courier Delivery</span>
                <span className="font-bold text-emerald-400">FREE</span>
              </div>
              <div className="pt-3 border-t border-white/[0.08] flex justify-between text-base font-black text-white">
                <span>Total Amount Payable</span>
                <span className="font-mono text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                  Rs {formatPKR(totalAmount)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full">
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-500 shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2 border border-amber-300/30 active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <div className="p-3.5 rounded-2xl bg-[#090D17] border border-white/[0.06] text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
              <p className="font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Full 7-Day Checking Warranty Included</span>
              </p>
              <p>Payment required via advance official bank transfer after order review.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
