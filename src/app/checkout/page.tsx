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
    return <div className="p-16 text-center text-sm text-gray-500">Loading checkout...</div>;
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

    if (!customerName.trim() || customerName.length < 2) {
      toast.error('Please enter your full name.');
      return;
    }

    const cleanPhone = customerPhone.replace(/[\s-]/g, '');
    const phoneRegex = /^(03|\+923|923)\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('Please enter a valid Pakistani mobile number (e.g. 03134951239).');
      return;
    }

    if (!customerAddress.trim() || customerAddress.length < 10) {
      toast.error('Please enter a complete street delivery address (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerCity,
        customerAddress: customerAddress.trim(),
        deliveryNotes: deliveryNotes.trim() || null,
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          config: it.config,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/order/${data.order.orderNumber}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error creating order.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-blue hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Cart</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-gray-500 mt-1">Provide delivery details to confirm your order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-surface-muted shadow-sm space-y-6">
          <div className="border-b border-surface-muted pb-3">
            <h2 className="text-base font-bold text-gray-900">Delivery Information</h2>
            <p className="text-xs text-gray-500">Where should we deliver your parcel?</p>
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

            <div className="pt-4 border-t border-surface-muted space-y-3">
              <div className="p-4 rounded-2xl bg-surface-cream border border-surface-muted text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <CreditCard className="w-4 h-4 text-accent-blue" />
                  <span>Payment Method: Full Advance Bank Transfer</span>
                </div>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  Official bank account details will be presented on the next confirmation screen. Transfer the order amount and send the slip screenshot to our WhatsApp to confirm dispatch.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full font-black text-base shadow-lg"
              >
                <Lock className="w-4 h-4 mr-2" />
                Place Order (Rs {formatPKR(totalAmount)})
              </Button>
            </div>
          </form>
        </div>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-surface-muted shadow-sm space-y-5">
          <h2 className="text-base font-bold text-gray-900 border-b border-surface-muted pb-3">
            Order Items ({items.length})
          </h2>

          <div className="space-y-4 max-h-80 overflow-y-auto divide-y divide-surface-muted pr-1">
            {items.map((it) => (
              <div key={it.id} className="pt-3 first:pt-0 flex justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-gray-900 line-clamp-1">{it.title}</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">{it.configSummary}</p>
                  <span className="text-gray-400 text-[11px]">Qty: {it.quantity}</span>
                </div>
                <div className="font-mono font-bold text-gray-900 whitespace-nowrap">
                  Rs {formatPKR(it.unitPrice * it.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-surface-muted space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-gray-900">Rs {formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="pt-3 border-t border-surface-muted flex justify-between text-base font-black text-gray-900">
              <span>Total Payable</span>
              <span className="font-mono text-accent-blue">Rs {formatPKR(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
