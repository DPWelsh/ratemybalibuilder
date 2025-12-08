'use client';

import { BuilderStatus } from '@/types/database';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: BuilderStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  blacklisted: {
    bg: 'bg-[var(--status-blacklisted)]/10',
    text: 'text-[var(--status-blacklisted)]',
    border: 'border-[var(--status-blacklisted)]/20',
    dot: 'bg-[var(--status-blacklisted)]',
    label: 'Blacklisted',
  },
  unknown: {
    bg: 'bg-[var(--status-unknown)]/10',
    text: 'text-[var(--status-unknown)]',
    border: 'border-[var(--status-unknown)]/20',
    dot: 'bg-[var(--status-unknown)]',
    label: 'Unknown',
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

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
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
}
