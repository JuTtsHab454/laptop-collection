import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  ...props
}) => {
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-brand-steel/60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-brand-charcoal border border-surface-muted dark:border-brand-steel rounded-xl p-4 space-y-4">
    <Skeleton className="w-full aspect-[4/3]" />
    <div className="space-y-2">
      <Skeleton variant="text" className="w-1/3 h-3" />
      <Skeleton variant="text" className="w-full h-5" />
      <Skeleton variant="text" className="w-2/3 h-4" />
    </div>
    <div className="pt-2 border-t border-surface-muted dark:border-brand-steel flex justify-between items-center">
      <Skeleton variant="text" className="w-1/2 h-6" />
      <Skeleton className="w-20 h-8 rounded-lg" />
    </div>
  </div>
);

export default Skeleton;
