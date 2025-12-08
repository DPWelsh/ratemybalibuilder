'use client';

import { StarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const textSizeConfig = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  className,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const partial = i === Math.floor(rating) && rating % 1 > 0;

          return (
            <StarIcon
              key={i}
              className={cn(
                sizeConfig[size],
                filled
                  ? 'fill-[#facc15] text-[#facc15]'
                  : partial
                    ? 'fill-[#facc15]/50 text-[#facc15]'
                    : 'fill-muted text-muted'
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn('font-medium text-foreground', textSizeConfig[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Interactive version for input
interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'md' | 'lg';
  className?: string;
}

export function StarRatingInput({
  value,
  onChange,
  size = 'lg',
  className,
}: StarRatingInputProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= value;

        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starValue)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <StarIcon
              className={cn(
                size === 'lg' ? 'h-8 w-8' : 'h-6 w-6',
                filled
                  ? 'fill-[#facc15] text-[#facc15]'
                  : 'fill-muted text-muted hover:fill-[#facc15]/30 hover:text-[#facc15]'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
