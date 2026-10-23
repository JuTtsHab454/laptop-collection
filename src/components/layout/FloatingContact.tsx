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
        <div className="relative flex items-center gap-2 bg-brand-navy text-white text-xs sm:text-sm font-medium py-2 px-3.5 rounded-2xl shadow-xl border border-brand-steel/60 animate-bounce">
          <span>Need help choosing a laptop? Chat with us!</span>
          <button
            onClick={dismissBubble}
            className="text-accent-silver hover:text-white p-0.5 rounded-full"
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
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
          aria-label="Chat with us on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 hidden sm:group-hover:inline-block whitespace-nowrap bg-brand-navy text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-md border border-brand-steel/40">
            Chat on WhatsApp
          </span>
        </a>

        {/* Phone Call Button */}
        <a
          href={`tel:+${cleanTel}`}
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent-blue hover:bg-accent-blue-dark text-white shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
          aria-label="Call Laptop Collection Support"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 hidden sm:group-hover:inline-block whitespace-nowrap bg-brand-navy text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-md border border-brand-steel/40">
            Call Us
          </span>
        </a>
      </div>
    </div>
  );
};

export default FloatingContact;
