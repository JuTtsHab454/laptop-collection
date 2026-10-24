'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, MessageCircle, MapPin } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if not previously dismissed in this session
    const isDismissed = sessionStorage.getItem('announcement_bar_dismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('announcement_bar_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Store Announcement"
      className="relative z-50 bg-gradient-to-r from-[#07090E] via-[#0E1526] to-[#07090E] border-b border-amber-500/25 text-xs text-slate-200 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
        {/* Main Banner Message */}
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-center font-medium">
          <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            Nationwide Delivery Across Pakistan
          </span>

          <span className="hidden md:inline text-amber-500/40">✦</span>

          <a
            href="https://wa.me/923134951239?text=Hi%20Laptop%20Collection%2C%20I%20have%20an%20order%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            Instant WhatsApp Checkout
          </a>

          <span className="hidden md:inline text-amber-500/40">✦</span>

          <Link
            href="/branches"
            className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors underline-offset-2 hover:underline"
          >
            <MapPin className="w-3 h-3 text-amber-400" />
            Lahore & Islamabad Branches
          </Link>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          type="button"
          aria-label="Dismiss announcement"
          className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-white/[0.06] transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
