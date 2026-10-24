import React from 'react';
import Link from 'next/link';
import { MessageCircle, Phone, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

interface FinalCTAProps {
  whatsappNumber?: string;
  callNumber?: string;
}

export default function FinalCTA({
  whatsappNumber = '923134951239',
  callNumber = '923134951239',
}: FinalCTAProps) {
  const cleanWA = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWA}?text=${encodeURIComponent(
    'Hi Laptop Collection! I need assistance choosing a laptop or checking stock availability.'
  )}`;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B0F1A] via-[#10172B] to-[#070A11] border border-amber-500/30 p-8 sm:p-12 lg:p-16 shadow-2xl">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Direct Technical Consultation
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Can&apos;t Find the Exact Specs <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
            You&apos;re Looking For?
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Speak directly with our hardware technicians. We offer custom RAM &amp; NVMe SSD upgrades, corporate fleet pricing, and live WhatsApp video inspections of any unit before dispatch.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            Chat with Laptop Specialist on WhatsApp
          </a>

          <Link
            href="/branches"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold text-sm border border-white/10 transition-all hover:border-amber-400/40"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            Visit Lahore &amp; Islamabad Stores
          </Link>
        </div>

        {/* Micro Trust Indicators */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            7-Day Checking Warranty
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300">Live Video Inspection Available</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300">Delivery in 2–4 Business Days</span>
        </div>
      </div>
    </section>
  );
}
