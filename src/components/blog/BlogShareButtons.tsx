'use client';

import React, { useState } from 'react';
import { MessageCircle, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://laptopcollection.pk/blog/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://laptopcollection.pk/blog/${slug}`;
    const text = `Check out this guide on Laptop Collection: ${title}\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleWhatsApp}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:brightness-105"
      >
        <MessageCircle className="w-4 h-4 fill-current" />
        <span>Share on WhatsApp</span>
      </button>

      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-surface-muted text-gray-700 hover:border-gray-400 text-xs font-bold"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
