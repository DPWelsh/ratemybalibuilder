'use client';

import Link from 'next/link';

interface CreditBalanceProps {
  balance: number;
  showBuyLink?: boolean;
}

export function CreditBalance({ balance, showBuyLink = true }: CreditBalanceProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
        <span className="text-lg">💰</span>
        <span className="font-semibold text-gray-900">${balance}</span>
        <span className="text-sm text-gray-500">credits</span>
      </div>
      {showBuyLink && (
        <Link
          href="/buy-credits"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Buy more
        </Link>
      )}
    </div>
  );
}
