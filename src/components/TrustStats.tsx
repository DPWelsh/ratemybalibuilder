'use client';

import { useEffect, useState } from 'react';
import { HardHatIcon, StarIcon, ShieldCheckIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TrustStatsProps {
  variant?: 'hero' | 'compact';
  className?: string;
}

export function TrustStats({ variant = 'hero', className = '' }: TrustStatsProps) {
  const [stats, setStats] = useState({ builders: 0, reviews: 0, searches: 0 });

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      // Get builder count
      const { count: builderCount } = await supabase
        .from('builders')
        .select('*', { count: 'exact', head: true });

      // Get approved reviews count
      const { count: reviewCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Get total searches/unlocks count
      const { count: searchCount } = await supabase
        .from('searches')
        .select('*', { count: 'exact', head: true });

      setStats({
        builders: builderCount || 0,
        reviews: reviewCount || 0,
        searches: searchCount || 0,
      });
    }

    fetchStats();
  }, []);

  const totalBuilders = stats.builders;
  const totalReviews = stats.reviews;
  const expatsProtected = stats.searches || 0;

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
