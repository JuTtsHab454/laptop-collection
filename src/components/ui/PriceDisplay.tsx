import React from 'react';

export interface PriceDisplayProps {
  price: number;
  originalPrice?: number | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
}

export function formatPKR(amount: number): string {
  if (isNaN(amount)) return '0';
  return Math.round(amount).toLocaleString('en-PK');
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  size = 'md',
  showBadge = true,
  className = '',
}) => {
  const hasDiscount = !!originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const currentStyles = {
    sm: 'text-sm font-bold',
    md: 'text-base sm:text-lg font-extrabold',
    lg: 'text-xl sm:text-2xl font-black',
    xl: 'text-2xl sm:text-3xl font-black',
  };

  const originalStyles = {
    sm: 'text-xs',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
    xl: 'text-base sm:text-lg',
  };

  return (
    <div className={`flex items-baseline flex-wrap gap-2 ${className}`}>
      <span className={`text-accent-blue font-mono ${currentStyles[size]}`}>
        <span className="text-[0.75em] mr-0.5">Rs</span>
        {formatPKR(price)}
      </span>

      {hasDiscount && (
        <>
          <span
            className={`line-through text-gray-400 dark:text-accent-silver font-mono ${originalStyles[size]}`}
          >
            Rs {formatPKR(originalPrice)}
          </span>

          {showBadge && discountPercent > 0 && (
            <span className="bg-accent-gold/20 text-accent-gold text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default PriceDisplay;
