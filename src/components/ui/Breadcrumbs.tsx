import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`py-3 text-xs sm:text-sm ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-slate-400">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-slate-300 hover:text-amber-400 transition-colors font-semibold truncate max-w-[150px] sm:max-w-[250px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-amber-400 font-bold truncate max-w-[200px] sm:max-w-[300px]" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
