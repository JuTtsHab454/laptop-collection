import React from 'react';
import Link from 'next/link';
import { Search, Home, Laptop, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8">
      <div className="w-20 h-20 rounded-3xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mx-auto">
        <Laptop className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">404</h1>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          The page or product you were looking for might have been moved, renamed, or is currently out of stock.
        </p>
      </div>

      {/* Quick Search */}
      <form action="/search" method="GET" className="max-w-md mx-auto relative">
        <input
          type="text"
          name="q"
          placeholder="Search laptops, RAM, SSDs..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-surface-muted bg-white text-gray-800 shadow-sm focus:outline-none focus:border-accent-blue"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </form>

      {/* Popular Links */}
      <div className="pt-4 border-t border-surface-muted space-y-3">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
          Popular Sections
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/laptops"
            className="px-3.5 py-1.5 rounded-lg bg-white border border-surface-muted text-xs font-semibold text-gray-700 hover:border-accent-blue hover:text-accent-blue"
          >
            Laptops
          </Link>
          <Link
            href="/ram"
            className="px-3.5 py-1.5 rounded-lg bg-white border border-surface-muted text-xs font-semibold text-gray-700 hover:border-accent-blue hover:text-accent-blue"
          >
            RAM Upgrades
          </Link>
          <Link
            href="/ssds"
            className="px-3.5 py-1.5 rounded-lg bg-white border border-surface-muted text-xs font-semibold text-gray-700 hover:border-accent-blue hover:text-accent-blue"
          >
            SSDs
          </Link>
          <Link
            href="/deals"
            className="px-3.5 py-1.5 rounded-lg bg-white border border-surface-muted text-xs font-semibold text-accent-gold hover:border-accent-gold"
          >
            Special Deals 🔥
          </Link>
        </div>
      </div>

      <div>
        <Link href="/">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-2" />
            <span>Return to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
