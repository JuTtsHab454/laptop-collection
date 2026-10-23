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
      setIsSticky(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced live search autocomplete
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

  // Close search suggestions on click outside
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
    { name: 'RAM Upgrades', href: '/ram', icon: Cpu },
    { name: 'SSDs & Storage', href: '/ssds', icon: HardDrive },
    { name: 'Laptop Chargers', href: '/chargers', icon: Zap },
    { name: 'Mice & Peripherals', href: '/accessories/mice', icon: Mouse },
    { name: 'Laptop Bags', href: '/accessories/bags', icon: Briefcase },
    { name: 'Cooling Pads', href: '/accessories/cooling-pads', icon: Wind },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isSticky
          ? 'bg-brand-navy/95 backdrop-blur-md shadow-lg shadow-black/20 py-2.5'
          : 'bg-brand-navy py-3.5 border-b border-brand-steel/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-300 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo variant="light" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-200 hover:text-accent-blue transition-colors"
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
                className="flex items-center gap-1 text-sm font-semibold text-gray-200 hover:text-accent-blue transition-colors py-2"
              >
                <span>Laptops</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </Link>

              {laptopsDropdown && (
                <div className="absolute top-full left-0 w-56 rounded-xl bg-brand-charcoal border border-brand-steel p-2 shadow-2xl z-50 animate-in fade-in duration-150">
                  <Link
                    href="/laptops"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-accent-blue hover:bg-brand-slate rounded-lg mb-1"
                    onClick={() => setLaptopsDropdown(false)}
                  >
                    <Laptop className="w-4 h-4" />
                    <span>View All Laptops</span>
                  </Link>
                  <div className="h-px bg-brand-steel my-1" />
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-silver">
                    Shop By Brand
                  </p>
                  {laptopBrands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/laptops?brand=${brand.toLowerCase()}`}
                      className="block px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-brand-slate rounded-lg transition-colors"
                      onClick={() => setLaptopsDropdown(false)}
                    >
                      {brand} Laptops
                    </Link>
                  ))}
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
                className="flex items-center gap-1 text-sm font-semibold text-gray-200 hover:text-accent-blue transition-colors py-2"
              >
                <span>Accessories</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </Link>

              {accessoriesDropdown && (
                <div className="absolute top-full left-0 w-64 rounded-xl bg-brand-charcoal border border-brand-steel p-2 shadow-2xl z-50 animate-in fade-in duration-150">
                  <Link
                    href="/accessories"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-accent-blue hover:bg-brand-slate rounded-lg mb-1"
                    onClick={() => setAccessoriesDropdown(false)}
                  >
                    <span>All Accessories</span>
                  </Link>
                  <div className="h-px bg-brand-steel my-1" />
                  {accessories.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-brand-slate rounded-lg transition-colors"
                        onClick={() => setAccessoriesDropdown(false)}
                      >
                        <Icon className="w-4 h-4 text-accent-blue" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/deals"
              className="flex items-center gap-1 text-sm font-semibold text-accent-gold hover:text-amber-400 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Special Deals</span>
            </Link>

            <Link
              href="/blog"
              className="text-sm font-semibold text-gray-200 hover:text-accent-blue transition-colors"
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className="text-sm font-semibold text-gray-200 hover:text-accent-blue transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action: Search bar & Cart */}
          <div className="flex items-center gap-3">
            {/* Desktop Search Bar */}
            <div ref={searchContainerRef} className="relative hidden md:block w-48 lg:w-64">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search laptops, specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-brand-charcoal border border-brand-steel text-white placeholder-gray-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>

              {/* Suggestions Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-80 right-0 bg-brand-charcoal border border-brand-steel rounded-xl shadow-2xl p-2 z-50">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-silver">
                    Matching Products
                  </p>
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-slate text-xs transition-colors"
                      onClick={() => setSearchResults([])}
                    >
                      <div className="truncate mr-2">
                        <p className="text-white font-medium truncate">{p.title}</p>
                        <p className="text-[10px] text-accent-silver">{p.category.name}</p>
                      </div>
                      <span className="text-accent-blue font-mono font-bold whitespace-nowrap">
                        Rs {p.basePrice.toLocaleString('en-PK')}
                      </span>
                    </Link>
                  ))}
                  <div className="h-px bg-brand-steel my-1" />
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    className="block text-center py-1.5 text-xs font-bold text-accent-blue hover:underline"
                    onClick={() => setSearchResults([])}
                  >
                    View all results
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Icon with Counter */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-200 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue transition-transform active:scale-95"
              aria-label={`Shopping cart containing ${mounted ? totalCartItems : 0} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {mounted && totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-black text-white bg-accent-blue rounded-full shadow-md animate-in zoom-in-75">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Input Overlay */}
        {searchOpen && (
          <div className="md:hidden pt-3 pb-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search laptops, SSDs, RAM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm rounded-lg bg-brand-charcoal border border-brand-steel text-white placeholder-gray-400 focus:outline-none focus:border-accent-blue"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Slide-Over */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-brand-navy/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-brand-navy border-r border-brand-steel p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-steel">
                <Logo variant="light" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-brand-slate rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/laptops"
                  className="px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-brand-slate rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Laptops
                </Link>
                <Link
                  href="/deals"
                  className="px-3 py-2 text-sm font-semibold text-accent-gold hover:bg-brand-slate rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Special Deals 🔥
                </Link>
                <div className="pt-2 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-accent-silver">
                  Categories
                </div>
                {accessories.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-brand-slate rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-accent-silver">
                  Company
                </div>
                <Link
                  href="/about"
                  className="px-3 py-2 text-xs font-medium text-gray-300 hover:bg-brand-slate rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/branches"
                  className="px-3 py-2 text-xs font-medium text-gray-300 hover:bg-brand-slate rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Branches (Lahore & Islamabad)
                </Link>
                <Link
                  href="/blog"
                  className="px-3 py-2 text-xs font-medium text-gray-300 hover:bg-brand-slate rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog & Guides
                </Link>
                <Link
                  href="/contact"
                  className="px-3 py-2 text-xs font-medium text-gray-300 hover:bg-brand-slate rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact & Support
                </Link>
              </nav>
            </div>

            {/* Bottom info in mobile drawer */}
            <div className="pt-6 border-t border-brand-steel text-xs text-accent-silver">
              <p className="font-semibold text-white">Call / WhatsApp Support:</p>
              <p className="font-mono text-accent-blue mt-1">0313-4951239</p>
              <p className="text-[11px] text-gray-400 mt-2">Delivering across all cities of Pakistan</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
