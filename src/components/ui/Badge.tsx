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
  const baseStyles = 'inline-flex items-center font-semibold rounded-full uppercase tracking-wider select-none';

  const variants = {
    default: 'bg-brand-slate/10 text-brand-slate dark:bg-brand-slate dark:text-accent-silver',
    sale: 'bg-accent-gold text-brand-navy shadow-sm shadow-accent-gold/20 font-bold',
    new: 'bg-accent-blue text-white shadow-sm shadow-accent-blue/20',
    featured: 'bg-purple-600 text-white',
    success: 'bg-status-success/15 text-emerald-700 dark:text-emerald-400',
    warning: 'bg-status-warning/15 text-amber-700 dark:text-amber-400',
    error: 'bg-status-error/15 text-red-700 dark:text-red-400',
    outline: 'border border-surface-muted text-gray-700 dark:border-brand-steel dark:text-gray-300',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>{children}</span>;
};

export default Badge;
