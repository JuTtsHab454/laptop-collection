'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Save, AlertCircle, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Toggle from '@/components/ui/Toggle';
import toast from 'react-hot-toast';

interface AdminOrderDetailClientProps {
  order: {
    id: string;
    status: string;
    paymentVerified: boolean;
    paymentNote: string | null;
    adminNotes: string | null;
  };
}

export default function AdminOrderDetailClient({ order }: AdminOrderDetailClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [paymentVerified, setPaymentVerified] = useState(order.paymentVerified);
  const [paymentNote, setPaymentNote] = useState(order.paymentNote || '');
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          paymentVerified,
          paymentNote,
          adminNotes,
        }),
      });

      if (!res.ok) throw new Error('Failed to update order');
      toast.success('Order status updated successfully!');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = [
    { value: 'PENDING', label: 'PENDING (Awaiting Payment)' },
    { value: 'AWAITING_PAYMENT', label: 'AWAITING_PAYMENT' },
    { value: 'PAYMENT_REPORTED', label: 'PAYMENT_REPORTED' },
    { value: 'PAYMENT_VERIFIED', label: 'PAYMENT_VERIFIED' },
    { value: 'CONFIRMED', label: 'CONFIRMED (Payment Verified)' },
    { value: 'PROCESSING', label: 'PROCESSING (Preparing Hardware)' },
    { value: 'DISPATCHED', label: 'DISPATCHED (Out for Delivery)' },
    { value: 'DELIVERED', label: 'DELIVERED (Completed)' },
    { value: 'CANCELLED', label: 'CANCELLED' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-accent-silver border-b border-brand-steel pb-3 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-accent-blue" />
        <span>Admin Verification & Status</span>
      </h2>

      <form onSubmit={handleSave} className="space-y-5">
        <Select
          label="Order Fulfillment Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statusOptions}
          className="bg-brand-navy border-brand-steel text-white text-xs font-semibold"
        />

        {/* Manual Payment Verification Checkbox */}
        <div className="p-4 rounded-xl bg-brand-navy border border-brand-steel space-y-2">
          <Toggle
            label="Payment Verified"
            checked={paymentVerified}
            onChange={(checked) => {
              setPaymentVerified(checked);
              if (checked && status === 'PENDING') {
                setStatus('CONFIRMED');
              }
            }}
            helperText="Check ONLY after verifying bank transfer screenshot or statement"
          />
        </div>

        <Textarea
          label="Bank Payment Slip / Transaction Ref"
          placeholder="e.g. Meezan Bank Ref # 987410294, verified by Admin..."
          rows={2}
          value={paymentNote}
          onChange={(e) => setPaymentNote(e.target.value)}
          className="bg-brand-navy border-brand-steel text-white text-xs"
        />

        <Textarea
          label="Internal Admin Notes"
          placeholder="Private notes (tracking number, courier info, customer requests)..."
          rows={3}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          className="bg-brand-navy border-brand-steel text-white text-xs"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSaving}
          className="w-full"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save Order Updates
        </Button>
      </form>
    </div>
  );
}
