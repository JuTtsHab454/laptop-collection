'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, MessageCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { formatPKR } from '@/components/ui/PriceDisplay';
import { generateWhatsAppLink, OrderData } from '@/lib/whatsapp';
import toast from 'react-hot-toast';

interface OrderConfirmationClientProps {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerCity: string;
    customerAddress: string;
    deliveryNotes: string | null;
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    totalAmount: number;
    status: string;
    paymentVerified: boolean;
    items: {
      id: string;
      productTitle: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      selectedConfig: any;
    }[];
  };
  settings: Record<string, string>;
}

export default function OrderConfirmationClient({
  order,
  settings,
}: OrderConfirmationClientProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const bankName = settings.bank_name || '[YOUR BANK NAME]';
  const accountTitle = settings.bank_account_title || '[YOUR ACCOUNT TITLE]';
  const accountNumber = settings.bank_account_number || '[YOUR ACCOUNT NUMBER]';
  const iban = settings.bank_iban || '[YOUR IBAN]';
  const accountType = settings.bank_account_type || '[Current/Savings]';
  const whatsappNumber = settings.whatsapp_number || '923134951239';

  const orderData: OrderData = {
    orderNumber: order.orderNumber,
    items: order.items.map((it) => ({
      productTitle: it.productTitle,
      config: it.selectedConfig || {},
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      lineTotal: it.lineTotal,
    })),
    subtotal: order.subtotal,
    deliveryCharge: order.deliveryCharge,
    discount: order.discount,
    totalAmount: order.totalAmount,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerCity: order.customerCity,
    customerAddress: order.customerAddress,
    deliveryNotes: order.deliveryNotes,
  };

  const whatsappUrl = generateWhatsAppLink(orderData, whatsappNumber);

  return (
    <div className="space-y-8">
      {/* Status Warning Badge */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 text-amber-800">
          <Clock className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <span className="font-semibold">
            Status: <strong>Awaiting Bank Payment Verification</strong>
          </span>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-700">
          Pending
        </span>
      </div>

      {/* PAYMENT INSTRUCTIONS BOX (MOST IMPORTANT) */}
      <div className="bg-brand-navy text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-steel space-y-6">
        <div className="border-b border-brand-steel pb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <span>💳 Official Payment Instructions</span>
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Full advance bank transfer is required to confirm hardware allocation and dispatch.
          </p>
        </div>

        {/* Bank Credentials Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-1">
            <span className="text-[11px] font-semibold text-accent-silver block">Bank Name</span>
            <p className="text-sm font-bold text-white">{bankName}</p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-1">
            <span className="text-[11px] font-semibold text-accent-silver block">Account Title</span>
            <p className="text-sm font-bold text-white">{accountTitle}</p>
          </div>

          {/* Account Number with Copy Button */}
          <div className="p-4 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-2">
            <span className="text-[11px] font-semibold text-accent-silver block">Account Number</span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm sm:text-base font-bold text-accent-blue">
                {accountNumber}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(accountNumber, 'Account Number')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-slate text-[11px] font-bold hover:bg-brand-steel text-white transition-colors"
              >
                {copiedField === 'Account Number' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* IBAN with Copy Button */}
          <div className="p-4 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-2">
            <span className="text-[11px] font-semibold text-accent-silver block">IBAN</span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs sm:text-sm font-bold text-accent-blue truncate mr-2 uppercase">
                {iban}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(iban, 'IBAN')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-slate text-[11px] font-bold hover:bg-brand-steel text-white transition-colors flex-shrink-0"
              >
                {copiedField === 'IBAN' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Transfer Amount Highlight */}
        <div className="p-4 rounded-2xl bg-brand-charcoal border border-brand-steel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-gray-400 block">Total Amount to Transfer:</span>
            <span className="text-2xl sm:text-3xl font-black text-accent-blue font-mono">
              Rs {formatPKR(order.totalAmount)}
            </span>
          </div>

          <div className="text-xs text-accent-silver text-right">
            <span>Account Type: {accountType}</span>
          </div>
        </div>

        {/* WhatsApp Action Callout */}
        <div className="pt-2 space-y-3">
          <p className="text-xs text-gray-300">
            After transferring the amount, click the button below to send your order receipt &amp; payment screenshot to our official WhatsApp.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:brightness-105 active:scale-98 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Send Order &amp; Receipt via WhatsApp</span>
          </a>

          <p className="text-[11px] text-accent-silver text-center">
            ⚠️ Your order status will be confirmed after our team manually verifies your bank deposit.
          </p>
        </div>
      </div>

      {/* Order Items Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-muted space-y-4 shadow-sm">
        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 border-b pb-3">
          Order Summary
        </h3>

        <div className="space-y-3 divide-y divide-surface-muted text-xs">
          {order.items.map((it) => (
            <div key={it.id} className="pt-3 first:pt-0 flex justify-between gap-4">
              <div>
                <p className="font-bold text-gray-900 text-sm">{it.productTitle}</p>
                <div className="text-gray-500 mt-1 space-y-0.5">
                  {it.selectedConfig?.ram && <p>• RAM: {it.selectedConfig.ram}</p>}
                  {it.selectedConfig?.ssd && <p>• SSD: {it.selectedConfig.ssd}</p>}
                  {it.selectedConfig?.charger !== undefined && (
                    <p>
                      • Charger:{' '}
                      {it.selectedConfig.charger
                        ? 'With Charger'
                        : 'Without Charger (−Rs 3,000)'}
                    </p>
                  )}
                  {it.selectedConfig?.bag && <p>• Laptop Bag Included</p>}
                </div>
                <p className="text-gray-400 mt-1">Quantity: {it.quantity}</p>
              </div>

              <div className="font-mono font-bold text-gray-900 text-sm whitespace-nowrap">
                Rs {formatPKR(it.lineTotal)}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-surface-muted flex items-center justify-between">
          <Link
            href="/laptops"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-blue hover:underline"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
