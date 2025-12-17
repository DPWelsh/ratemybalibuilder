'use client';

import { useEffect, useState } from 'react';
import { HardHatIcon, StarIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TrustStatsProps {
  variant?: 'hero' | 'compact';
  className?: string;
}

function StatSkeleton() {
  return (
    <div className="h-7 w-12 skeleton rounded" />
  );
}

export function TrustStats({ variant = 'hero', className = '' }: TrustStatsProps) {
  const [stats, setStats] = useState<{ builders: number; reviews: number; searches: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    }

    fetchStats();
  }, []);

  const totalBuilders = stats?.builders ?? 0;
  const totalReviews = stats?.reviews ?? 0;

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 text-sm ${className}`}>
        {isLoading ? (
          <>
            <span className="h-4 w-24 rounded bg-current/20 animate-pulse" />
            <span className="opacity-30">|</span>
            <span className="h-4 w-16 rounded bg-current/20 animate-pulse" />
          </>
        ) : (
          <>
            <span>{totalBuilders} builders vetted</span>
            <span className="opacity-30">|</span>
            <span>{totalReviews} reviews</span>
          </>
        )}
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
          {isLoading ? <StatSkeleton /> : (
            <p className="text-2xl font-medium text-foreground">{totalBuilders}</p>
          )}
          <p className="text-sm text-muted-foreground">Builders Vetted</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <StarIcon className="h-6 w-6 text-foreground" />
        </div>
        <div>
          {isLoading ? <StatSkeleton /> : (
            <p className="text-2xl font-medium text-foreground">{totalReviews}</p>
          )}
          <p className="text-sm text-muted-foreground">Reviews Submitted</p>
        </div>
      </div>
    </div>
  );
}
