import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export const Footer: React.FC = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923134951239';
  const callNumber = process.env.NEXT_PUBLIC_CALL_NUMBER || '923134951239';

  return (
    <footer className="bg-[#07090E] text-white border-t border-amber-500/20 w-full overflow-hidden">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-8">
          {/* Column 1: Brand Info */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 space-y-4 min-w-0 pr-0 lg:pr-6">
            <Logo variant="light" />
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Pakistan&apos;s trusted destination for tested laptops, high-speed RAM upgrades, NVMe SSDs, original power adapters, and computing peripherals.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                Physical Branches:
              </span>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/branches"
                  className="text-xs px-3 py-1.5 rounded-xl bg-[#0F1424] border border-amber-500/30 text-amber-300 hover:border-amber-400 font-bold transition-colors shadow-sm"
                >
                  📍 Lahore Flagship
                </Link>
                <Link
                  href="/branches"
                  className="text-xs px-3 py-1.5 rounded-xl bg-[#0F1424] border border-amber-500/30 text-amber-300 hover:border-amber-400 font-bold transition-colors shadow-sm"
                >
                  📍 Islamabad Center
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-1 lg:col-span-2 space-y-3 min-w-0">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 border-b border-white/[0.08] pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/branches" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Our Branches
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-300 hover:text-amber-400 transition-colors block py-0.5 font-medium">
                  Blog &amp; Buying Guides
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-amber-400 hover:text-amber-300 transition-colors font-bold flex items-center gap-1 py-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Deals &amp; Discounts</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="col-span-1 lg:col-span-2 space-y-3 min-w-0">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 border-b border-white/[0.08] pb-2">
              Catalog
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/laptops" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  All Laptops
                </Link>
              </li>
              <li>
                <Link href="/ram" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  RAM Upgrades
                </Link>
              </li>
              <li>
                <Link href="/ssds" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  NVMe &amp; SATA SSDs
                </Link>
              </li>
              <li>
                <Link href="/chargers" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Laptop Chargers
                </Link>
              </li>
              <li>
                <Link href="/accessories/mice" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Mice &amp; Peripherals
                </Link>
              </li>
              <li>
                <Link href="/accessories/bags" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Bags &amp; Sleeves
                </Link>
              </li>
              <li>
                <Link href="/accessories/cooling-pads" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Cooling Pads
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies */}
          <div className="col-span-1 lg:col-span-2 space-y-3 min-w-0">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 border-b border-white/[0.08] pb-2">
              Policies
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/policies/delivery" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/warranty" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Warranty &amp; Check Time
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Returns &amp; Replacements
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-slate-300 hover:text-white transition-colors block py-0.5">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-3 min-w-0">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 border-b border-white/[0.08] pb-2">
              Direct Contact
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-slate-400 block text-[10px]">WhatsApp:</span>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 font-mono font-medium block truncate"
                  >
                    +{whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-slate-400 block text-[10px]">Direct Call:</span>
                  <a
                    href={`tel:+${callNumber.replace(/[^0-9+]/g, '')}`}
                    className="hover:text-amber-400 font-mono font-medium block truncate"
                  >
                    +{callNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-slate-400 block text-[10px]">Display Centers:</span>
                  <span className="text-slate-300 text-[11px] leading-tight block">
                    Hafeez Centre Lahore &amp; Beverly Centre Islamabad
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.08] py-5 text-xs text-slate-400 bg-[#05070B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Laptop Collection Pakistan. All rights reserved.</p>
          <p className="text-[11px] text-amber-400/90 font-medium">
            Advance Payment Secure Courier Across Pakistan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
