'use client';

import { BuilderStatus } from '@/types/database';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: BuilderStatus;
  size?: 'sm' | 'md' | 'lg';
  rating?: number; // Optional rating to determine "Top Rated" display
}

const statusConfig = {
  blacklisted: {
    bg: 'bg-[var(--status-blacklisted)]/10',
    text: 'text-[var(--status-blacklisted)]',
    border: 'border-[var(--status-blacklisted)]/20',
    dot: 'bg-[var(--status-blacklisted)]',
    label: 'Blacklisted',
  },
  recommended: {
    bg: 'bg-[var(--status-recommended)]/10',
    text: 'text-[var(--status-recommended)]',
    border: 'border-[var(--status-recommended)]/20',
    dot: 'bg-[var(--status-recommended)]',
    label: 'Recommended',
  },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs gap-1.5',
  md: 'px-3 py-1 text-sm gap-2',
  lg: 'px-4 py-1.5 text-base gap-2',
};

const dotSizeConfig = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
};

export function StatusBadge({ status, size = 'md', rating }: StatusBadgeProps) {
  // 3 independent statuses:
  // - 'recommended' = Verified (future paid feature)
  // - rating >= 4.5 = Top Rated (automatic based on reviews)
  // - 'blacklisted' = Blacklisted

  const badges: (keyof typeof statusConfig)[] = [];

  // Check for blacklisted first (mutually exclusive with others)
  if (status === 'blacklisted') {
    badges.push('blacklisted');
  } else {
    // Verified badge (paid feature)
    if (status === 'recommended') {
      badges.push('recommended');
    }
    // Top Rated badge (automatic based on rating)
    if (rating && rating >= 4.5) {
      badges.push('top_rated');
    }
  }

  // Don't show anything for 'unknown' without high rating
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badgeKey) => {
        const config = statusConfig[badgeKey];
        return (
          <span
            key={badgeKey}
            className={cn(
              'inline-flex items-center rounded-full border font-medium',
              config.bg,
              config.text,
              config.border,
              sizeConfig[size]
            )}
          >
            <span className={cn('rounded-full', config.dot, dotSizeConfig[size])} />
            <span>{config.label}</span>
          </span>
        );
      })}
    </div>
  );
}
