import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'dark' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  className = '',
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-white dark:bg-brand-charcoal border border-surface-muted dark:border-brand-steel shadow-sm rounded-xl',
    elevated: 'bg-white dark:bg-brand-charcoal border border-surface-muted dark:border-brand-steel shadow-md hover:shadow-lg transition-all duration-200 rounded-xl',
    dark: 'bg-brand-navy border border-brand-steel text-white rounded-xl shadow-md',
    outline: 'border border-surface-muted dark:border-brand-steel rounded-xl',
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-4 sm:p-5 border-b border-surface-muted dark:border-brand-steel ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-4 sm:p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-4 sm:p-5 border-t border-surface-muted dark:border-brand-steel bg-surface-cream dark:bg-brand-navy/40 rounded-b-xl ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
