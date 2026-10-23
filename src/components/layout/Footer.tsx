import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Truck, Headphones, Sparkles } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export const Footer: React.FC = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923134951239';
  const callNumber = process.env.NEXT_PUBLIC_CALL_NUMBER || '923134951239';

  return (
    <footer className="bg-brand-navy text-white border-t border-brand-steel w-full overflow-hidden">
      {/* Trust banner */}
      <div className="border-b border-brand-steel/60 bg-brand-charcoal/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue flex-shrink-0">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">Nationwide Delivery</h4>
                <p className="text-[11px] text-gray-400 truncate">Safely delivered across Pakistan</p>
              </div>
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-accent-gold/10 text-accent-gold flex-shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">Verified Specs</h4>
                <p className="text-[11px] text-gray-400 truncate">100% genuine hardware checks</p>
              </div>
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">WhatsApp Orders</h4>
                <p className="text-[11px] text-gray-400 truncate">Instant confirmation & updates</p>
              </div>
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue flex-shrink-0">
                <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">Expert Advice</h4>
                <p className="text-[11px] text-gray-400 truncate">Guidance for every budget</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-8">
          {/* Column 1: Brand Info (Spans 4 columns on desktop for ample breathing room) */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 space-y-4 min-w-0 pr-0 lg:pr-6">
            <Logo variant="light" />
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              Pakistan&apos;s trusted destination for tested laptops, high-speed RAM upgrades, NVMe SSDs, original power adapters, and computing peripherals.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent-silver block mb-2">
                Physical Branches:
              </span>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/branches"
                  className="text-xs px-2.5 py-1 rounded-lg bg-brand-charcoal border border-brand-steel text-accent-blue hover:border-accent-blue font-semibold transition-colors"
                >
                  📍 Lahore Branch
                </Link>
                <Link
                  href="/branches"
                  className="text-xs px-2.5 py-1 rounded-lg bg-brand-charcoal border border-brand-steel text-accent-blue hover:border-accent-blue font-semibold transition-colors"
                >
                  📍 Islamabad Branch
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (Spans 2 columns on desktop) */}
          <div className="col-span-1 lg:col-span-2 space-y-3 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-silver border-b border-brand-steel pb-1.5">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/branches" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Our Branches
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-accent-blue transition-colors block py-0.5 font-medium">
                  Blog &amp; Buying Guides
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-accent-gold hover:text-amber-300 transition-colors font-semibold flex items-center gap-1 py-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Deals &amp; Discounts</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories (Spans 2 columns on desktop) */}
          <div className="col-span-1 lg:col-span-2 space-y-3 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-silver border-b border-brand-steel pb-1.5">
              Catalog
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/laptops" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  All Laptops
                </Link>
              </li>
              <li>
                <Link href="/ram" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  RAM Upgrades
                </Link>
              </li>
              <li>
                <Link href="/ssds" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  NVMe &amp; SATA SSDs
                </Link>
              </li>
              <li>
                <Link href="/chargers" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Laptop Chargers
                </Link>
              </li>
              <li>
                <Link href="/accessories/mice" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Mice &amp; Peripherals
                </Link>
              </li>
              <li>
                <Link href="/accessories/bags" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Bags &amp; Sleeves
                </Link>
              </li>
              <li>
                <Link href="/accessories/cooling-pads" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Cooling Pads
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies (Spans 2 columns on desktop) */}
          <div className="col-span-1 lg:col-span-2 space-y-3 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-silver border-b border-brand-steel pb-1.5">
              Policies
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/policies/delivery" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/warranty" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Warranty &amp; Check Time
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Returns &amp; Replacements
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-gray-300 hover:text-white transition-colors block py-0.5">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Info (Spans 2 columns on desktop) */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-3 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-silver border-b border-brand-steel pb-1.5">
              Get in Touch
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-400 block text-[10px]">WhatsApp:</span>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white font-mono font-medium block truncate"
                  >
                    +{whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-400 block text-[10px]">Direct Call:</span>
                  <a
                    href={`tel:+${callNumber.replace(/[^0-9+]/g, '')}`}
                    className="hover:text-white font-mono font-medium block truncate"
                  >
                    +{callNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-silver flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-400 block text-[10px]">Locations:</span>
                  <span className="text-gray-300 text-[11px] leading-tight block">
                    Lahore &amp; Islamabad, Pakistan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-steel/80 py-5 text-xs text-gray-400 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Laptop Collection Pakistan. All rights reserved.</p>
          <p className="text-[11px] text-gray-400">
            Official Advance Bank Payment with WhatsApp Verification.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
