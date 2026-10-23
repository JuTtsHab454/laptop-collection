import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Truck, Headphones, CheckCircle2, MapPin } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About Us — Laptop Collection Pakistan',
  description:
    "Learn about Laptop Collection, Pakistan's trusted retailer for premium business laptops, student notebooks, and performance hardware.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">About Us</span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Pakistan&apos;s Trusted Laptop Destination
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          <strong>Laptop Collection</strong> is a dedicated computing hardware retailer serving students, developers, remote professionals, and businesses across Pakistan. We specialize in thoroughly inspected, high-grade laptops from leading manufacturers including HP, Dell, Lenovo, Apple, and ASUS.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-surface-muted shadow-sm space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-accent-blue/10 text-accent-blue">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-gray-900">Rigorous Quality Testing</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Every device undergoes a comprehensive diagnostic checklist covering CPU thermal stability, RAM benchmarks, SSD health, display color &amp; backlight uniformity, battery life, keyboard keys, and ports before being listed for sale.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-surface-muted shadow-sm space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-600">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-gray-900">Nationwide Safe Packaging</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Parcels are packed using multi-layer bubble wrap, edge protectors, and tamper-evident courier bags to ensure safe arrival in any city across Pakistan.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-brand-navy text-white space-y-4">
        <h2 className="text-xl font-bold">Physical Presence in Lahore &amp; Islamabad</h2>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          In addition to nationwide shipping, we maintain physical store operations in Lahore and Islamabad where customers can inspect hardware in person and pick up orders directly.
        </p>
        <Link
          href="/branches"
          className="inline-flex items-center gap-2 text-xs font-bold text-accent-blue hover:text-accent-blue-light"
        >
          <MapPin className="w-4 h-4" />
          <span>View Branch Locations →</span>
        </Link>
      </div>
    </div>
  );
}
