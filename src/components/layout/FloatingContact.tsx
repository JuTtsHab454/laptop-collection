'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';

interface FloatingContactProps {
  whatsappNumber?: string;
  callNumber?: string;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({
  whatsappNumber = '923134951239',
  callNumber = '923134951239',
}) => {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('lc_contact_bubble_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => setShowBubble(true), 1500);
      const autoDismiss = setTimeout(() => setShowBubble(false), 8000);
      return () => {
        clearTimeout(timer);
        clearTimeout(autoDismiss);
      };
    }
  }, []);

  const dismissBubble = () => {
    setShowBubble(false);
    localStorage.setItem('lc_contact_bubble_dismissed', 'true');
  };

  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
  const cleanTel = callNumber.replace(/[^0-9+]/g, '');

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 select-none">
      {/* Friendly Help Bubble */}
      {showBubble && (
        <div className="relative flex items-center gap-2 bg-[#0F1424] text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-2xl shadow-2xl border border-amber-500/30 animate-bounce">
          <span className="text-amber-300">Need help choosing a laptop? Chat with us!</span>
          <button
            onClick={dismissBubble}
            className="text-slate-400 hover:text-white p-0.5 rounded-full"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Buttons Stack */}
      <div className="flex flex-col items-center gap-2.5">
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${cleanWa}?text=${encodeURIComponent('Assalam o Alaikum! I have an inquiry about Laptop Collection.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-[0_0_25px_#25D366] hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20"
          aria-label="Chat with us on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 hidden sm:group-hover:inline-block whitespace-nowrap bg-[#0F1424] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl border border-amber-500/30">
            WhatsApp Support
          </span>
        </a>

        {/* Phone Call Button */}
        <a
          href={`tel:+${cleanTel}`}
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-500 text-white shadow-xl hover:shadow-[0_0_25px_#F59E0B] hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-amber-300/30"
          aria-label="Call Laptop Collection Support"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 hidden sm:group-hover:inline-block whitespace-nowrap bg-[#0F1424] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl border border-amber-500/30">
            Call Directly
          </span>
        </a>
      </div>
    </div>
  );
};

export default FloatingContact;
