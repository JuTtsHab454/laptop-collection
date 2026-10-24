'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    }, 300);

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
    { name: 'RAM Upgrades', href: '/ram', icon: Cpu, desc: 'DDR4 & DDR5 SODIMM' },
    { name: 'SSDs & Storage', href: '/ssds', icon: HardDrive, desc: 'M.2 NVMe & 2.5" SATA' },
    { name: 'Laptop Chargers', href: '/chargers', icon: Zap, desc: 'Original HP, Dell, Type-C' },
    { name: 'Mice & Peripherals', href: '/accessories/mice', icon: Mouse, desc: 'Wireless & Optical' },
    { name: 'Laptop Bags', href: '/accessories/bags', icon: Briefcase, desc: 'Water-resistant cases' },
    { name: 'Cooling Pads', href: '/accessories/cooling-pads', icon: Wind, desc: 'Silent LED fan pads' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isSticky
          ? 'bg-[#080B11]/95 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl shadow-black/80 py-2.5'
          : 'bg-[#080B11]/90 backdrop-blur-md py-3.5 border-b border-white/[0.07]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-amber-400 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 focus:outline-none transition-all active:scale-95"
              aria-label="Open mobile slidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Logo variant="light" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/"
              className="text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors"
            >
              Home
            </Link>

            {/* Laptops Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setLaptopsDropdown(true)}
              onMouseLeave={() => setLaptopsDropdown(false)}
            >
              <Link
                href="/laptops"
                className="flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors py-2"
              >
                <span>Laptops</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-amber-400" />
              </Link>

              {laptopsDropdown && (
                <div className="absolute top-full left-0 w-64 rounded-2xl bg-[#0F1424]/98 backdrop-blur-2xl border border-amber-500/30 p-3 shadow-2xl shadow-black/90 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <Link
                    href="/laptops"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-black transition-all mb-2 group/btn"
                    onClick={() => setLaptopsDropdown(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-amber-400" />
                      <span>Explore All Laptops</span>
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-white/[0.06] mb-1.5">
                    Filter by Brand
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    {laptopBrands.map((brand) => (
                      <Link
                        key={brand}
                        href={`/laptops?brand=${brand.toLowerCase()}`}
                        className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors flex items-center justify-between"
                        onClick={() => setLaptopsDropdown(false)}
                      >
                        <span>{brand}</span>
                        <span className="text-[10px] text-amber-400/80">&bull;</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accessories Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setAccessoriesDropdown(true)}
              onMouseLeave={() => setAccessoriesDropdown(false)}
            >
              <Link
                href="/accessories"
                className="flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors py-2"
              >
                <span>Accessories</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-amber-400" />
              </Link>

              {accessoriesDropdown && (
                <div className="absolute top-full left-0 w-80 rounded-2xl bg-[#0F1424]/98 backdrop-blur-2xl border border-amber-500/30 p-3 shadow-2xl shadow-black/90 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="space-y-1">
                    {accessories.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-all group/item"
                          onClick={() => setAccessoriesDropdown(false)}
                        >
                          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover/item:scale-110 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-100 group-hover/item:text-amber-400 transition-colors">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400">{item.desc}</div>
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
              className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Deals</span>
            </Link>

            <Link
              href="/branches"
              className="text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors"
            >
              Branches
            </Link>

            <Link
              href="/about"
              className="text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-xs uppercase font-extrabold tracking-wider text-slate-200 hover:text-amber-400 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Search & Cart Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Search Bar */}
            <div ref={searchContainerRef} className="relative hidden md:block w-56 lg:w-72">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search laptops, RAM, SSDs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 focus:border-amber-500 text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </form>

              {/* Live Search Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full right-0 left-0 mt-2 bg-[#0F1424] border border-amber-500/30 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] text-xs text-slate-200 transition-colors"
                      onClick={() => setSearchResults([])}
                    >
                      <span className="truncate max-w-[180px] font-semibold">{item.title}</span>
                      <span className="text-amber-400 font-mono font-bold text-[11px] ml-2">
                        Rs {Math.round(item.basePrice).toLocaleString('en-PK')}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-amber-400 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:outline-none"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Ultra-Luxury Cart Pill Button */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 py-2 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-orange-500/10 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white transition-all duration-200 active:scale-95 group shadow-sm shadow-amber-500/10"
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

        {/* Mobile Search Drawer Input */}
        {searchOpen && (
          <div className="md:hidden pt-3 pb-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search laptops, SSDs, RAM, chargers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-[#0F1424] border border-amber-500/40 text-white placeholder-slate-400 focus:outline-none"
              />
              <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ULTRA PREMIUM MOBILE SLIDEBAR / DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Frosted Dark Backdrop */}
          <div
            className="fixed inset-0 bg-[#07090E]/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slidebar Sheet */}
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-[#090D17]/98 backdrop-blur-2xl border-r border-amber-500/25 p-5 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
              {/* Slidebar Header with Logo & Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <Logo variant="light" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Flagship Store Live Status Card */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
                  <span className="font-bold text-slate-200">Stores Open: Lahore & ISB</span>
                </div>
                <span className="text-[10px] uppercase font-mono text-amber-400 font-extrabold tracking-wider">
                  Verified
                </span>
              </div>

              {/* Main Navigation Links */}
              <nav className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center justify-between px-3.5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-amber-400 hover:bg-white/[0.04] rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Home</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/laptops"
                  className="flex items-center justify-between px-3.5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-amber-400 hover:bg-white/[0.04] rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-amber-400" />
                    <span>All Laptops</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/deals"
                  className="flex items-center justify-between px-3.5 py-2.5 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Special Deals 🔥</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>

                {/* Categories Header */}
                <div className="pt-3 pb-1 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Hardware Categories
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {accessories.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-2 px-2.5 py-2 text-[11px] font-bold text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] hover:border-amber-500/30 rounded-xl transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Company Links */}
                <div className="pt-4 pb-1 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Company &amp; Service
                </div>

                <div className="space-y-1">
                  <Link
                    href="/branches"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Branches (Lahore & Islamabad)</span>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>7-Day Checking Warranty & About</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Contact Support</span>
                  </Link>
                </div>
              </nav>
            </div>

            {/* Bottom Contact Cards (WhatsApp & Call) */}
            <div className="pt-5 border-t border-white/[0.08] space-y-2.5">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                Direct Inquiry Hotline
              </p>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://wa.me/923134951239"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href="tel:03134951239"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call Us</span>
                </a>
              </div>

              <p className="text-[10px] text-slate-400 text-center pt-1">
                Advance Payment Secure Courier Across Pakistan
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
