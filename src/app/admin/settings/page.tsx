'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CreditCard, Truck, Globe, Sliders } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'delivery' | 'defaults'>('payment');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        setSettings(data.settings || {});
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      toast.success('Settings saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 text-slate-100 max-w-4xl pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-steel">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Website Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure bank account details, contact phone numbers, delivery charges, and system defaults.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          isLoading={isSaving}
          onClick={handleSubmit}
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save All Settings
        </Button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-brand-steel pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'payment'
              ? 'bg-accent-blue text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-brand-slate'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment & Bank Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'general'
              ? 'bg-accent-blue text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-brand-slate'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>General & Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'delivery'
              ? 'bg-accent-blue text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-brand-slate'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Delivery</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('defaults')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'defaults'
              ? 'bg-accent-blue text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-brand-slate'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Catalog Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PAYMENT TAB */}
        {activeTab === 'payment' && (
          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">Bank Account Transfer Details</h3>
              <p className="text-xs text-accent-silver mt-0.5">
                These bank details are shown to customers on checkout and order confirmation with click-to-copy buttons.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Bank Name"
                placeholder="[YOUR BANK NAME]"
                value={settings.bank_name || ''}
                onChange={(e) => handleChange('bank_name', e.target.value)}
                className="bg-brand-navy border-brand-steel text-white"
              />

              <Input
                label="Account Title"
                placeholder="[YOUR ACCOUNT TITLE]"
                value={settings.bank_account_title || ''}
                onChange={(e) => handleChange('bank_account_title', e.target.value)}
                className="bg-brand-navy border-brand-steel text-white"
              />

              <Input
                label="Account Number"
                placeholder="[YOUR ACCOUNT NUMBER]"
                value={settings.bank_account_number || ''}
                onChange={(e) => handleChange('bank_account_number', e.target.value)}
                className="bg-brand-navy border-brand-steel text-white font-mono"
              />

              <Input
                label="IBAN (International Bank Account Number)"
                placeholder="[YOUR IBAN]"
                value={settings.bank_iban || ''}
                onChange={(e) => handleChange('bank_iban', e.target.value)}
                className="bg-brand-navy border-brand-steel text-white font-mono uppercase"
              />

              <Input
                label="Account Type"
                placeholder="Current / Savings"
                value={settings.bank_account_type || ''}
                onChange={(e) => handleChange('bank_account_type', e.target.value)}
                className="bg-brand-navy border-brand-steel text-white"
              />
            </div>

            <Textarea
              label="Payment Instructions for Customer"
              rows={4}
              value={settings.payment_instructions || ''}
              onChange={(e) => handleChange('payment_instructions', e.target.value)}
              className="bg-brand-navy border-brand-steel text-white text-xs leading-relaxed"
            />
          </div>
        )}

        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">Store Identity & Contact Numbers</h3>
              <p className="text-xs text-accent-silver mt-0.5">
                WhatsApp number is used for WhatsApp floating buttons, product inquiries, and checkout order messages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Site Name"
                value={settings.site_name || 'Laptop Collection'}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="bg-brand-navy border-brand-steel text-white"
              />

              <Input
                label="Support Email"
                placeholder="support@laptopcollection.pk"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="bg-brand-navy border-brand-steel text-white"
              />

              <Input
                label="WhatsApp Number (Format: 923134951239)"
                value={settings.whatsapp_number || '923134951239'}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="bg-brand-navy border-brand-steel text-white font-mono"
              />

              <Input
                label="Direct Call Phone Number (Format: 923134951239)"
                value={settings.call_number || '923134951239'}
                onChange={(e) => handleChange('call_number', e.target.value)}
                className="bg-brand-navy border-brand-steel text-white font-mono"
              />
            </div>
          </div>
        )}

        {/* DELIVERY TAB */}
        {activeTab === 'delivery' && (
          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">Nationwide Delivery Configuration</h3>
              <p className="text-xs text-accent-silver mt-0.5">
                Control default shipping cost across Pakistan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Default Delivery Charge (Rs)"
                type="number"
                value={settings.delivery_charge || '0'}
                onChange={(e) => handleChange('delivery_charge', e.target.value)}
                helperText="Set to 0 for nationwide Free Delivery"
                className="bg-brand-navy border-brand-steel text-white font-mono"
              />

              <Input
                label="Delivery Information Note"
                value={settings.delivery_info || 'We deliver throughout Pakistan'}
                onChange={(e) => handleChange('delivery_info', e.target.value)}
                className="bg-brand-navy border-brand-steel text-white"
              />
            </div>
          </div>
        )}

        {/* DEFAULTS TAB */}
        {activeTab === 'defaults' && (
          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-steel space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">Product Defaults & Catalog Rules</h3>
              <p className="text-xs text-accent-silver mt-0.5">
                Default amounts applied when creating new laptop products.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Default Charger Deduction (Rs)"
                type="number"
                value={settings.charger_deduction || '3000'}
                onChange={(e) => handleChange('charger_deduction', e.target.value)}
                helperText="Standard deduction when customer selects 'Without Charger'"
                className="bg-brand-navy border-brand-steel text-white font-mono"
              />

              <Input
                label="Currency Code"
                value={settings.currency || 'PKR'}
                disabled
                className="bg-brand-navy border-brand-steel text-slate-400 font-mono"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
