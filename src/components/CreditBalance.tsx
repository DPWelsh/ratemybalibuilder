'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CreditBalanceProps {
  balance: number;
  showBuyLink?: boolean;
  className?: string;
}

export function CreditBalance({ balance, showBuyLink = true, className }: CreditBalanceProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center gap-2 rounded-full bg-[var(--color-cloud)]/10 px-3 py-1.5">
        <span className="text-sm font-medium text-[var(--color-cloud)]">${balance}</span>
        <span className="text-xs text-[var(--color-cloud)]/60">credits</span>
      </div>
      {showBuyLink && (
        <Link
          href="/buy-credits"
          className="text-sm text-[var(--color-prompt)] transition-colors hover:text-[var(--color-prompt)]/80"
        >
          Buy more
        </Link>
      )}
    </div>
  );
}
