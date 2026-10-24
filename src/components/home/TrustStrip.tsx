import React from 'react';
import { Truck, ShieldCheck, MessageCircle, MapPin } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    subtitle: 'Safe, insured shipping across Pakistan in 2–4 days',
    accent: 'text-amber-400',
  },
  {
    icon: ShieldCheck,
    title: '7-Day Checking Warranty',
    subtitle: 'Hardware stress-tested: battery, screen & thermals',
    accent: 'text-emerald-400',
  },
  {
    icon: MessageCircle,
    title: 'Instant WhatsApp Order',
    subtitle: 'Direct technician guidance & real device photos',
    accent: 'text-emerald-400',
  },
  {
    icon: MapPin,
    title: 'Lahore & Islamabad Centers',
    subtitle: 'Physical experience stores for hands-on inspection',
    accent: 'text-amber-400',
  },
];

export default function TrustStrip() {
  return (
    <section className="relative border-y border-white/[0.08] bg-[#0A0E18]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-amber-500/20 transition-colors"
              >
                <div className={`p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] ${item.accent} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
