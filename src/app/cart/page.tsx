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
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-sm text-gray-500">
        Loading shopping cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<ShoppingBag className="w-16 h-16 text-gray-300" />}
          title="Your shopping cart is empty"
          description="Explore our range of premium laptops, RAM, and SSD storage upgrades."
          actionLabel="Browse Laptops"
          actionHref="/laptops"
        />
      </div>
    );
  }

  const deliveryCharge = 0; // Free delivery default across Pakistan
  const totalAmount = subtotal + deliveryCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
        <p className="text-xs text-gray-500 mt-1">Review your selected laptops and hardware options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-surface-muted divide-y divide-surface-muted shadow-sm overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-surface-cream border border-surface-muted flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image || '/placeholder-laptop.svg'}
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
                    className="font-bold text-sm sm:text-base text-gray-900 hover:text-accent-blue transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>

                  {item.configSummary && (
                    <p className="text-xs text-gray-500 font-medium">{item.configSummary}</p>
                  )}

                  <div className="text-xs text-accent-blue font-mono font-bold pt-1">
                    Rs {formatPKR(item.unitPrice)} each
                  </div>
                </div>

                {/* Quantity and Line Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                  <div className="flex items-center border border-surface-muted rounded-xl bg-surface-cream overflow-hidden">
                    <button
                      type="button"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-white disabled:opacity-40 text-gray-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={item.quantity >= item.maxStock}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-white disabled:opacity-40 text-gray-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-sm sm:text-base font-black font-mono text-gray-900">
                      Rs {formatPKR(item.unitPrice * item.quantity)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] text-red-500 hover:underline flex items-center gap-1 sm:justify-end mt-0.5"
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-blue hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-surface-muted p-6 space-y-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 border-b border-surface-muted pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-gray-900">Rs {formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Nationwide Courier Delivery</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="pt-3 border-t border-surface-muted flex justify-between text-base font-black text-gray-900">
                <span>Total Amount Payable</span>
                <span className="font-mono text-accent-blue">Rs {formatPKR(totalAmount)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button variant="primary" size="lg" className="w-full">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <div className="p-3.5 rounded-2xl bg-surface-cream text-[11px] text-gray-500 space-y-1.5 leading-relaxed">
              <p className="font-bold text-gray-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Full Checking Warranty Included</span>
              </p>
              <p>Payment required via advance bank transfer after order review.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
