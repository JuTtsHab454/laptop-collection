import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { CheckCircle2, Clock, Copy, MessageCircle, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPKR } from '@/components/ui/PriceDisplay';
import OrderConfirmationClient from '@/components/order/OrderConfirmationClient';

export const dynamic = 'force-dynamic';

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const [order, settingsList] = await Promise.all([
    prisma.order.findUnique({
      where: { orderNumber: params.orderNumber },
      include: {
        items: true,
      },
    }),
    prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            'bank_name',
            'bank_account_title',
            'bank_account_number',
            'bank_iban',
            'bank_account_type',
            'payment_instructions',
            'whatsapp_number',
          ],
        },
      },
    }),
  ]);

  if (!order) {
    notFound();
  }

  const settings: Record<string, string> = {};
  settingsList.forEach((s) => {
    settings[s.key] = s.value;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Thank you, <strong className="text-gray-900">{order.customerName}</strong>. Your order is registered in our system and is currently pending bank payment verification.
        </p>

        <div className="inline-flex items-center gap-2 p-2.5 px-4 rounded-xl bg-surface-cream border border-surface-muted font-mono text-xs sm:text-sm">
          <span className="text-gray-500">Order Reference:</span>
          <strong className="text-accent-blue font-bold">{order.orderNumber}</strong>
        </div>
      </div>

      {/* Client component containing payment instructions, copy buttons, and pre-filled WhatsApp link */}
      <OrderConfirmationClient
        order={order as any}
        settings={settings}
      />
    </div>
  );
}
