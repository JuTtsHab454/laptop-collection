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
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group max-w-full min-w-0 ${className}`}
      aria-label="Laptop Collection Home"
    >
      {/* Geometric LC + Laptop Monogram Icon in Luxury Gold & Cyber Titanium */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-1.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 group-hover:scale-105 transition-all duration-300 border border-amber-300/30">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
        >
          {/* Laptop Screen & Bezel */}
          <rect x="7" y="7" width="26" height="17" rx="2.5" stroke="currentColor" strokeWidth="2.2" fill="none" />
          <path d="M12 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 16H23" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
          {/* Laptop Base & Trackpad */}
          <path d="M4 27.5C4 26.1193 5.11929 25 6.5 25H33.5C34.8807 25 36 26.1193 36 27.5V28.5C36 29.3284 35.3284 30 34.5 30H5.5C4.67157 30 4 29.3284 4 28.5V27.5Z" fill="currentColor" />
          <path d="M17 26.5H23" stroke="#07090E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight min-w-0">
          <div className="flex flex-wrap sm:flex-nowrap items-baseline gap-x-1.5 min-w-0">
            <span
              className={`font-black tracking-tight text-base sm:text-lg whitespace-nowrap text-white`}
            >
              LAPTOP
            </span>
            <span className="font-extrabold tracking-tight text-base sm:text-lg whitespace-nowrap text-gradient-gold">
              COLLECTION
            </span>
          </div>
          <span className="text-[10px] tracking-widest text-accent-silver font-semibold uppercase block">
            Pakistan &bull; Flagship
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
