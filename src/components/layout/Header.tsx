'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Laptop,
  Cpu,
  HardDrive,
  Zap,
  Mouse,
  Briefcase,
  Wind,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useCartStore } from '@/store/useCartStore';

interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  category: { name: string; slug: string };
  brand?: { name: string } | null;
}

export const Header: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [laptopsDropdown, setLaptopsDropdown] = useState(false);
  const [accessoriesDropdown, setAccessoriesDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsSticky(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to dismiss search results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const laptopBrands = ['HP', 'Dell', 'Lenovo', 'Apple', 'ASUS', 'Acer', 'MSI'];

  const accessories = [
    { name: 'RAM Upgrades', href: '/ram', icon: Cpu, desc: 'DDR4 & DDR5 SODIMM High-Speed' },
    { name: 'SSDs & Storage', href: '/ssds', icon: HardDrive, desc: 'NVMe M.2 & 2.5" SATA SSDs' },
    { name: 'Laptop Chargers', href: '/chargers', icon: Zap, desc: 'Original HP, Dell, Lenovo, Apple' },
    { name: 'Mice & Peripherals', href: '/accessories/mice', icon: Mouse, desc: 'Precision Wireless & Bluetooth' },
    { name: 'Laptop Bags', href: '/accessories/bags', icon: Briefcase, desc: 'Shockproof & Water-Resistant' },
    { name: 'Cooling Pads', href: '/accessories/cooling-pads', icon: Wind, desc: 'Silent Multi-Fan Cooling' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isSticky
          ? 'bg-[#080B11] border-b border-amber-500/25 shadow-xl shadow-black/80 py-2.5'
          : 'bg-[#080B11]/95 py-3.5 border-b border-white/[0.08]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Mobile Navigation Trigger Button & Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex items-center gap-1.5 p-2 px-2.5 text-slate-200 hover:text-amber-400 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] hover:border-amber-500/50 focus:outline-none transition-all active:scale-95 shadow-sm"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5 text-amber-400" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-200 hidden xs:inline">
                Menu
              </span>
            </button>
            <Logo variant="light" />
          </div>

          {/* Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/"
              className="text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors py-2"
            >
              Home
            </Link>

            {/* Laptops Dropdown (Solid High-Contrast Opaque Canvas) */}
            <div
              className="relative"
              onMouseEnter={() => setLaptopsDropdown(true)}
              onMouseLeave={() => setLaptopsDropdown(false)}
            >
              <Link
                href="/laptops"
                className="flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors py-2"
              >
                <span>Laptops</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 text-amber-400 ${
                    laptopsDropdown ? 'rotate-180' : ''
                  }`}
                />
              </Link>

              {laptopsDropdown && (
                <div className="absolute top-full left-0 w-72 rounded-2xl bg-[#0B0F19] border border-amber-500/40 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 animate-in fade-in zoom-in-95 duration-150">
                  <Link
                    href="/laptops"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-orange-500/10 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-black transition-all mb-2.5 group/btn"
                    onClick={() => setLaptopsDropdown(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-amber-400" />
                      <span>Explore All Laptops</span>
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/[0.1] mb-2">
                    Browse By Brand
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {laptopBrands.map((brand) => (
                      <Link
                        key={brand}
                        href={`/laptops?brand=${brand.toLowerCase()}`}
                        className="px-2.5 py-2 text-xs font-bold text-slate-200 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-amber-500/40 rounded-xl transition-all flex items-center justify-between"
                        onClick={() => setLaptopsDropdown(false)}
                      >
                        <span>{brand}</span>
                        <span className="text-amber-400 text-xs font-bold">&rsaquo;</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accessories Dropdown (100% Solid Opaque Background for Maximum Readability) */}
            <div
              className="relative"
              onMouseEnter={() => setAccessoriesDropdown(true)}
              onMouseLeave={() => setAccessoriesDropdown(false)}
            >
              <Link
                href="/accessories"
                className="flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors py-2"
              >
                <span>Accessories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 text-amber-400 ${
                    accessoriesDropdown ? 'rotate-180' : ''
                  }`}
                />
              </Link>

              {accessoriesDropdown && (
                <div className="absolute top-full left-0 w-84 min-w-[340px] rounded-2xl bg-[#0B0F19] border border-amber-500/40 p-3 shadow-[0_25px_60px_rgba(0,0,0,0.98)] z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="space-y-1.5">
                    {accessories.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3.5 p-2.5 rounded-xl bg-white/[0.02] hover:bg-amber-500/10 border border-transparent hover:border-amber-500/35 transition-all duration-150 group/item"
                          onClick={() => setAccessoriesDropdown(false)}
                        >
                          <div className="p-2.5 rounded-xl bg-[#141B2D] border border-amber-500/25 text-amber-400 group-hover/item:border-amber-400 group-hover/item:bg-amber-500/20 group-hover/item:scale-105 transition-all flex-shrink-0 shadow-sm">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white group-hover/item:text-amber-400 transition-colors">
                              {item.name}
                            </div>
                            <div className="text-[11px] font-medium text-slate-300 mt-0.5 truncate">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/deals"
              className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-amber-400 hover:text-amber-300 transition-colors py-2"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Deals</span>
            </Link>

            <Link
              href="/branches"
              className="text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors py-2"
            >
              Branches
            </Link>

            <Link
              href="/about"
              className="text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors py-2"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors py-2"
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar & Cart Action */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Desktop Search */}
            <div ref={searchContainerRef} className="relative hidden md:block w-52 lg:w-68">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search laptops, RAM, SSDs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#101524] border border-white/[0.12] hover:border-amber-500/50 focus:border-amber-500 text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
                  />
                  <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </form>

              {/* Live Search Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full right-0 left-0 mt-2 bg-[#0B0F19] border border-amber-500/40 rounded-2xl shadow-2xl p-2 z-50 space-y-1 max-h-80 overflow-y-auto">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.08] text-xs text-slate-200 transition-colors"
                      onClick={() => setSearchResults([])}
                    >
                      <span className="truncate max-w-[180px] font-semibold text-white">
                        {item.title}
                      </span>
                      <span className="text-amber-400 font-mono font-bold text-[11px] ml-2 flex-shrink-0">
                        Rs {Math.round(item.basePrice).toLocaleString('en-PK')}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Search Icon Toggle */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-amber-400 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:outline-none"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Ultra-Luxury Cart Button */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 py-2 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-orange-500/15 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-white transition-all duration-200 active:scale-95 group shadow-sm shadow-amber-500/15"
              aria-label={`Shopping cart with ${mounted ? totalCartItems : 0} items`}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-black tracking-wide">Cart</span>
              {mounted && totalCartItems > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black text-black bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-md shadow-amber-500/40 animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Field */}
        {searchOpen && (
          <div className="md:hidden pt-3 pb-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search laptops, SSDs, RAM, chargers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl bg-[#0F1424] border border-amber-500/50 text-white placeholder-slate-400 focus:outline-none"
              />
              <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* PORTAL-RENDERED FULLSCREEN MOBILE DRAWER (Bypasses parent header stacking context) */}
      {mounted &&
        mobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[99999] lg:hidden">
            {/* Backdrop Layer */}
            <div
              className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slideout Panel */}
            <div className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-[#090D17] border-r border-amber-500/35 p-5 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300 z-[100000]">
              <div className="space-y-5">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.1]">
                  <Logo variant="light" />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-300 hover:text-white rounded-xl bg-white/[0.06] border border-white/[0.1] hover:border-amber-500/50 transition-all active:scale-95"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5 text-amber-400" />
                  </button>
                </div>

                {/* Flagship Store Status */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/25 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
                    <span className="font-bold text-white">Stores Open: Lahore & ISB</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-amber-400 font-extrabold tracking-wider">
                    Verified
                  </span>
                </div>

                {/* Primary Navigation Links */}
                <nav className="space-y-1">
                  <Link
                    href="/"
                    className="flex items-center justify-between px-3.5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-100 hover:text-amber-400 hover:bg-white/[0.06] rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Home</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/laptops"
                    className="flex items-center justify-between px-3.5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-100 hover:text-amber-400 hover:bg-white/[0.06] rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2.5">
                      <Laptop className="w-4 h-4 text-amber-400" />
                      <span>All Laptops</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/deals"
                    className="flex items-center justify-between px-3.5 py-2.5 text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/30 rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>Hot Deals 🔥</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </Link>

                  {/* Hardware Categories Subgrid */}
                  <div className="pt-3 pb-1 px-3 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    Hardware Categories
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {accessories.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-2 px-2.5 py-2 text-[11px] font-bold text-slate-200 hover:text-white bg-[#111726] hover:bg-[#172035] border border-white/[0.08] hover:border-amber-500/40 rounded-xl transition-all shadow-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Company Links */}
                  <div className="pt-3 pb-1 px-3 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    Locations &amp; Help
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/branches"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>Branches (Lahore & Islamabad)</span>
                    </Link>
                    <Link
                      href="/about"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Checking Warranty &amp; About</span>
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Phone className="w-4 h-4 text-cyan-400" />
                      <span>Contact Support</span>
                    </Link>
                  </div>
                </nav>
              </div>

              {/* Bottom Quick Action Hotline */}
              <div className="pt-4 border-t border-white/[0.1] space-y-2">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-300">
                  Instant Support Hotline
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://wa.me/923134951239"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/35 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="tel:03134951239"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>Call Store</span>
                  </a>
                </div>

                <p className="text-[10px] text-slate-400 text-center pt-1">
                  Nationwide Express Delivery with Advance Verification
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

export default Header;
