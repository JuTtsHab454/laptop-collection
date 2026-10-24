import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'sale' | 'new' | 'featured' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-bold rounded-full uppercase tracking-wider select-none';

  const variants = {
    default: 'bg-white/[0.06] border border-white/[0.08] text-slate-300',
    sale: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-sm shadow-orange-500/30',
    new: 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400',
    featured: 'bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-sm shadow-amber-400/20',
    success: 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400',
    warning: 'bg-amber-500/15 border border-amber-500/30 text-amber-300',
    error: 'bg-red-500/15 border border-red-500/30 text-red-400',
    outline: 'border border-white/[0.08] text-slate-300 bg-white/[0.02]',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>{children}</span>;
};

export default Badge;
