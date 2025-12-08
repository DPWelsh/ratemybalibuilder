'use client';

import { HardHatIcon, StarIcon, ShieldCheckIcon } from 'lucide-react';
import { getTotalBuilders, getTotalReviews } from '@/lib/dummy-data';

interface TrustStatsProps {
  variant?: 'hero' | 'compact';
  className?: string;
}

export function TrustStats({ variant = 'hero', className = '' }: TrustStatsProps) {
  const totalBuilders = getTotalBuilders();
  const totalReviews = getTotalReviews();
  const expatsProtected = 520; // Seed number - later track from unlocks

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-4 text-sm text-muted-foreground ${className}`}>
        <span>{totalBuilders} builders vetted</span>
        <span className="text-border">|</span>
        <span>{totalReviews} reviews</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap justify-center gap-6 sm:gap-10 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <HardHatIcon className="h-6 w-6 text-foreground" />
        </div>
        <div>
          <p className="text-2xl font-medium text-foreground">{totalBuilders}</p>
          <p className="text-sm text-muted-foreground">Builders Vetted</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <StarIcon className="h-6 w-6 text-foreground" />
        </div>
        <div>
          <p className="text-2xl font-medium text-foreground">{totalReviews}</p>
          <p className="text-sm text-muted-foreground">Reviews Submitted</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <ShieldCheckIcon className="h-6 w-6 text-foreground" />
        </div>
        <div>
          <p className="text-2xl font-medium text-foreground">{expatsProtected}+</p>
          <p className="text-sm text-muted-foreground">Expats Protected</p>
        </div>
      </div>
    </div>
  );
}
