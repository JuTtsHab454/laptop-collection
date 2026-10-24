'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Truck, CreditCard } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPKR } from '@/components/ui/PriceDisplay';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { generateWhatsAppLink, OrderData } from '@/lib/whatsapp';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.getSubtotal());

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Lahore');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-16 text-center text-sm text-slate-400">Loading checkout...</div>;
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const deliveryCharge = 0;
  const totalAmount = subtotal + deliveryCharge;

  const pakistaniCities = [
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Karachi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Bahawalpur',
    'Sargodha',
    'Abbottabad',
    'Other City',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerCity,
        customerAddress: customerAddress.trim(),
        deliveryNotes: deliveryNotes.trim() || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          config: i.config || {},
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        let errMsg = 'Failed to place order';
        if (typeof errorData.error === 'string') {
          errMsg = errorData.error;
        } else if (errorData.error && typeof errorData.error === 'object') {
          errMsg = JSON.stringify(errorData.error);
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      const confirmedOrder = data.order;

      // Construct WhatsApp order message with full item specs, totals, and delivery info
      const orderData: OrderData = {
        orderNumber: confirmedOrder.orderNumber,
        items: items.map((i) => ({
          productTitle: i.title,
          brand: i.brand,
          config: (i.config || {}) as any,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.unitPrice * i.quantity,
        })),
        subtotal,
        deliveryCharge,
        discount: 0,
        totalAmount,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerCity,
        customerAddress: customerAddress.trim(),
        deliveryNotes: deliveryNotes.trim() || undefined,
      };

      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923134951239';
      const whatsappUrl = generateWhatsAppLink(orderData, whatsappNumber);

      clearCart();
      toast.success('Order placed! Opening WhatsApp to send your order details...');

      // Redirect immediately to WhatsApp with pre-filled order message so customer just taps "Send"
      window.location.href = whatsappUrl;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Something went wrong while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Cart</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-400 mt-1">Provide delivery details to confirm your order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#0E1322]/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-2xl space-y-6">
          <div className="border-b border-white/[0.08] pb-3">
            <h2 className="text-base font-bold text-white">Delivery Information</h2>
            <p className="text-xs text-slate-400">Where should we deliver your parcel?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Muhammad Ali"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="WhatsApp / Mobile Phone"
                required
                placeholder="03134951239"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                helperText="We will send tracking updates here"
              />

              <Select
                label="City"
                required
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                options={pakistaniCities.map((c) => ({ value: c, label: c }))}
              />
            </div>

            <Textarea
              label="Complete Street Delivery Address"
              required
              rows={3}
              placeholder="House/Office #, Street #, Sector/Area, Landmark..."
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              helperText="Exact courier delivery destination"
            />

            <Textarea
              label="Delivery Instructions / Notes (Optional)"
              rows={2}
              placeholder="e.g. Call before arrival, deliver after 2 PM..."
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
            />

            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <div className="p-4 rounded-2xl bg-[#090D17] border border-white/[0.08] text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Payment Method: Full Advance Bank Transfer</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Official bank account details will be presented on the next confirmation screen. Transfer the order amount and send the slip screenshot to our WhatsApp to confirm dispatch.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl font-black text-sm sm:text-base text-white bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-500 shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2 border border-amber-300/30 active:scale-95 disabled:opacity-50"
              >
                <Lock className="w-4 h-4 mr-2" />
                <span>{isSubmitting ? 'Processing...' : `Place Order (Rs ${formatPKR(totalAmount)})`}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5 bg-[#0E1322]/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-2xl space-y-5">
          <h2 className="text-base font-bold text-white border-b border-white/[0.08] pb-3">
            Order Items ({items.length})
          </h2>

          <div className="space-y-4 max-h-80 overflow-y-auto divide-y divide-white/[0.08] pr-1">
            {items.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
                  {item.configSummary && <p className="text-[11px] text-slate-400">{item.configSummary}</p>}
                  <span className="text-[11px] text-slate-400 font-mono">Qty: {item.quantity}</span>
                </div>
                <div className="font-mono font-bold text-amber-400 ml-3">
                  Rs {formatPKR(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.08] space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-white">Rs {formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Nationwide Courier Delivery</span>
              <span className="font-bold text-emerald-400">FREE</span>
            </div>
            <div className="pt-3 border-t border-white/[0.08] flex justify-between text-base font-black text-white">
              <span>Total Payable</span>
              <span className="font-mono text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                Rs {formatPKR(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
