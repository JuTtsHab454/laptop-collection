import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Truck, Headphones } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-white border-t border-brand-steel">
      {/* Trust banner */}
      <div className="border-b border-brand-steel/60 bg-brand-charcoal/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Nationwide Delivery</h4>
                <p className="text-[11px] text-gray-400">Safely delivered across Pakistan</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-gold/10 text-accent-gold">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Verified Specs</h4>
                <p className="text-[11px] text-gray-400">100% genuine hardware checks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">WhatsApp Orders</h4>
                <p className="text-[11px] text-gray-400">Instant confirmation & updates</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue">
                <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Expert Advice</h4>
                <p className="text-[11px] text-gray-400">Guidance for every budget</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <Logo variant="light" />
            <p className="text-xs text-gray-400 leading-relaxed">
              Pakistan&apos;s trusted retailer for premium laptops, high-speed RAM, fast NVMe SSDs, original chargers, and computer accessories.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent-silver block mb-2">
                Branches in:
              </span>
              <div className="flex gap-2">
                <span className="text-xs px-2.5 py-1 rounded bg-brand-slate text-accent-blue font-semibold">
                  Lahore
                </span>
                <span className="text-xs px-2.5 py-1 rounded bg-brand-slate text-accent-blue font-semibold">
                  Islamabad
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-silver">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-accent-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/branches" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Our Branches
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Buying Guides & Blog
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-accent-gold hover:text-amber-300 transition-colors font-medium">
                  Deals & Discounts
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-silver">Categories</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/laptops" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Laptops
                </Link>
              </li>
              <li>
                <Link href="/ram" className="text-gray-300 hover:text-accent-blue transition-colors">
                  RAM Upgrades
                </Link>
              </li>
              <li>
                <Link href="/ssds" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Solid State Drives (SSDs)
                </Link>
              </li>
              <li>
                <Link href="/chargers" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Laptop Chargers
                </Link>
              </li>
              <li>
                <Link href="/accessories/mice" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Mice & Peripherals
                </Link>
              </li>
              <li>
                <Link href="/accessories/bags" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Laptop Bags
                </Link>
              </li>
              <li>
                <Link href="/accessories/cooling-pads" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Cooling Pads
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-silver">Customer Policies</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/policies/delivery" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/warranty" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Warranty & Check Time
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-gray-300 hover:text-accent-blue transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-silver">Get in Touch</h3>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[10px]">WhatsApp:</span>
                  <a href="https://wa.me/923134951239" target="_blank" rel="noopener noreferrer" className="hover:text-white font-mono">
                    +92 313 4951239
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Direct Call:</span>
                  <a href="tel:+923134951239" className="hover:text-white font-mono">
                    +92 313 4951239
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent-silver flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Locations:</span>
                  <span>Lahore & Islamabad, Pakistan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-steel py-5 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Laptop Collection. All rights reserved.</p>
          <p className="text-[11px] text-gray-400">
            Payment Method: Full advance bank transfer with WhatsApp verification.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
