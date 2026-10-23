import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'auto',
  className = '',
  showText = true,
}) => {
  const isLight = variant === 'light';

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`} aria-label="Laptop Collection Home">
      {/* Geometric LC + Laptop Monogram Icon */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue via-accent-blue-dark to-brand-navy p-1.5 shadow-md shadow-accent-blue/20 group-hover:shadow-accent-blue/40 transition-all duration-300">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Laptop Screen & Bezel */}
          <rect x="7" y="7" width="26" height="17" rx="2.5" stroke="currentColor" strokeWidth="2.2" fill="none" />
          <path d="M12 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 16H23" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
          {/* Laptop Base & Trackpad */}
          <path d="M4 27.5C4 26.1193 5.11929 25 6.5 25H33.5C34.8807 25 36 26.1193 36 27.5V28.5C36 29.3284 35.3284 30 34.5 30H5.5C4.67157 30 4 29.3284 4 28.5V27.5Z" fill="currentColor" />
          <path d="M17 26.5H23" stroke="#0F1B2D" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span
              className={`font-black tracking-tight text-lg sm:text-xl ${
                isLight ? 'text-white' : 'text-surface-white'
              }`}
            >
              LAPTOP
            </span>
            <span className="font-extrabold text-accent-blue tracking-tight text-lg sm:text-xl">
              COLLECTION
            </span>
          </div>
          <span className="text-[10px] tracking-widest text-accent-silver font-semibold uppercase">
            Pakistan
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
