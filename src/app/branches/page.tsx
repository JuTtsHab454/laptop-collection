import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { MapPin, Phone, Clock, MessageCircle, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Our Branches in Lahore & Islamabad — Laptop Collection',
  description:
    'Visit our physical experience centers in Lahore (Hafeez Center) and Islamabad (Blue Area) for hands-on laptop inspection, verified testing, and instant pickup.',
};

export const dynamic = 'force-dynamic';

const DEFAULT_BRANCHES = [
  {
    id: 'lahore-main',
    name: 'Lahore Experience Center',
    city: 'Lahore',
    address: 'Shop # 14-16, 2nd Floor, Hafeez Center, Main Boulevard, Gulberg III, Lahore',
    contactNumber: '+92 300 1234567',
    operatingHours: 'Mon – Sat: 11:00 AM – 9:00 PM (Sunday Closed)',
    mapLink: 'https://maps.google.com/?q=Hafeez+Center+Lahore',
    badge: 'Main Hub & Tech Center',
    whatsappMessage: 'Hi Laptop Collection Lahore, I would like to visit your Hafeez Center store to inspect laptops.',
  },
  {
    id: 'islamabad-flagship',
    name: 'Islamabad Experience Center',
    city: 'Islamabad',
    address: 'Mezzanine Floor, Beverly Centre, Jinnah Avenue, Blue Area, Islamabad',
    contactNumber: '+92 300 7654321',
    operatingHours: 'Mon – Sat: 11:30 AM – 8:30 PM (Sunday Closed)',
    mapLink: 'https://maps.google.com/?q=Beverly+Centre+Blue+Area+Islamabad',
    badge: 'Flagship Showroom',
    whatsappMessage: 'Hi Laptop Collection Islamabad, I want to visit your Blue Area branch for laptop inspection.',
  },
];

export default async function BranchesPage() {
  let branches: any[] = [];
  try {
    branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (err) {
    console.warn('Database error in BranchesPage:', err);
  }

  // Use fallback if database has no active branches
  const displayBranches = branches.length > 0 ? branches : DEFAULT_BRANCHES;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ label: 'Experience Centers' }]} />

      {/* Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#0E1526] to-[#07090E] border border-amber-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Physical Experience Centers
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Visit Us in <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Lahore & Islamabad</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Experience our laptops hands-on before you buy. Check screen condition, keyboard feel, battery health, and benchmark scores with our on-site hardware specialists.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Hands-On Inspection
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              7-Day Checking Warranty
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">Instant Cash & Bank Transfer Pickup</span>
          </div>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayBranches.map((b) => {
          const rawPhone = b.contactNumber?.replace(/[^0-9]/g, '') || '923001234567';
          const cleanPhone = rawPhone.startsWith('0') ? `92${rawPhone.slice(1)}` : rawPhone;
          const waMsg = encodeURIComponent(
            b.whatsappMessage || `Hi Laptop Collection ${b.name}, I would like to visit your branch.`
          );

          return (
            <div
              key={b.id || b.name}
              className="group relative rounded-3xl bg-[#0B0F19] border border-white/[0.08] hover:border-amber-500/40 p-6 sm:p-8 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header with badge */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold tracking-wide uppercase mb-2">
                      {b.badge || `${b.city} Branch`}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {b.name}
                    </h2>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-300 border-y border-white/[0.06] py-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                        Address
                      </span>
                      <span className="text-slate-200 font-medium leading-relaxed block mt-0.5">
                        {b.address || 'Address details coming soon.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                        Operating Hours
                      </span>
                      <span className="text-slate-200 font-medium block mt-0.5">
                        {b.operatingHours || 'Mon – Sat: 11:00 AM – 9:00 PM'}
                      </span>
                    </div>
                  </div>

                  {b.contactNumber && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                          Phone Helpline
                        </span>
                        <a
                          href={`tel:${b.contactNumber}`}
                          className="text-amber-300 hover:text-amber-200 font-mono font-bold block mt-0.5 transition-colors"
                        >
                          {b.contactNumber}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>

                {b.mapLink ? (
                  <a
                    href={b.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Get Directions
                  </a>
                ) : (
                  <div className="flex items-center justify-center py-3 px-4 text-[11px] text-slate-500 font-medium">
                    Maps upon request
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
