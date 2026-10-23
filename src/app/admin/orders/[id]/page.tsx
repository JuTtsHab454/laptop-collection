import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ArrowLeft, User, MapPin, Phone, Calendar, MessageCircle, FileText } from 'lucide-react';
import { formatPKR } from '@/components/ui/PriceDisplay';
import AdminOrderDetailClient from '@/components/admin/AdminOrderDetailClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              brand: { select: { name: true } },
              images: { take: 1, select: { url: true } },
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6 text-slate-100 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brand-steel">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl bg-brand-charcoal border border-brand-steel text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-mono">
                {order.orderNumber}
              </h1>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  order.status === 'DELIVERED'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : order.status === 'CANCELLED'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-PK', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:brightness-110 shadow-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Message Customer on WhatsApp</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Items & Customer Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-accent-silver border-b border-brand-steel pb-3">
              Ordered Items & Selected Configuration Snapshot
            </h2>

            <div className="space-y-4 divide-y divide-brand-steel/50">
              {order.items.map((item) => {
                const config = (item.selectedConfig || {}) as Record<string, any>;
                const mainImg = item.product?.images[0]?.url || '/placeholder-laptop.svg';

                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm">
                        {item.productTitle}
                      </div>
                      {item.product?.brand && (
                        <div className="text-[11px] text-accent-silver">
                          Brand: {item.product.brand.name}
                        </div>
                      )}

                      {/* Selected Config snapshot */}
                      <div className="mt-2.5 p-3 rounded-xl bg-brand-navy border border-brand-steel/60 text-xs text-slate-300 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-blue block mb-1">
                          Chosen Options:
                        </span>
                        {config.ram && <p>• RAM: <strong>{config.ram}</strong></p>}
                        {config.ssd && <p>• Storage SSD: <strong>{config.ssd}</strong></p>}
                        {config.charger !== undefined && (
                          <p>
                            • Charger: <strong>{config.charger ? 'Included (With Charger)' : 'Without Charger (−Rs 3,000)'}</strong>
                          </p>
                        )}
                        {config.bag !== undefined && (
                          <p>• Laptop Bag: <strong>{config.bag ? 'Included' : 'Not Included'}</strong></p>
                        )}
                        {config.color && <p>• Color: <strong>{config.color}</strong></p>}
                      </div>
                    </div>

                    <div className="text-right sm:w-40 flex-shrink-0">
                      <div className="text-xs text-slate-400">
                        {item.quantity} × Rs {formatPKR(item.unitPrice)}
                      </div>
                      <div className="font-mono font-bold text-accent-blue text-sm sm:text-base mt-1">
                        Rs {formatPKR(item.lineTotal)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Totals Breakdown */}
            <div className="pt-4 border-t border-brand-steel space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">Rs {formatPKR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Charge</span>
                <span className="font-mono text-white">
                  {order.deliveryCharge > 0 ? `Rs ${formatPKR(order.deliveryCharge)}` : 'FREE'}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">−Rs {formatPKR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-brand-steel">
                <span>Total Amount Payable</span>
                <span className="font-mono text-accent-blue">Rs {formatPKR(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-accent-silver border-b border-brand-steel pb-3">
              Customer & Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 block">Customer Name</span>
                <p className="font-bold text-white text-sm">{order.customerName}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block">WhatsApp / Phone</span>
                <p className="font-mono font-bold text-accent-blue text-sm">{order.customerPhone}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block">City</span>
                <p className="font-bold text-white">{order.customerCity}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block">Delivery Address</span>
                <p className="text-slate-200 leading-relaxed font-medium">{order.customerAddress}</p>
              </div>

              {order.deliveryNotes && (
                <div className="sm:col-span-2 pt-2 border-t border-brand-steel space-y-1">
                  <span className="text-slate-400 block">Delivery Notes</span>
                  <p className="text-slate-300 italic">{order.deliveryNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Admin Status & Verification Form */}
        <div className="space-y-6">
          <AdminOrderDetailClient order={order as any} />
        </div>
      </div>
    </div>
  );
}
