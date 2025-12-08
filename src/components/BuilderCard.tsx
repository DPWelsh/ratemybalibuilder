'use client';

import { BuilderSearchResult } from '@/types/database';
import { StatusBadge } from './StatusBadge';
import Link from 'next/link';

interface BuilderCardProps {
  builder: BuilderSearchResult;
  hasFullAccess?: boolean;
}

export function BuilderCard({ builder, hasFullAccess = false }: BuilderCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-900">{builder.name}</h3>
          <p className="text-gray-500">{builder.phone}</p>
        </div>
        <StatusBadge status={builder.status} size="lg" />
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <span>📝</span>
        <span>{builder.review_count} review{builder.review_count !== 1 ? 's' : ''}</span>
      </div>

      {!hasFullAccess && builder.review_count > 0 && (
        <div className="mt-6">
          <Link
            href={`/builder/${builder.id}?unlock=true`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800"
          >
            Unlock Full Details ($20)
          </Link>
          <p className="mt-2 text-center text-sm text-gray-500">
            See reviews, photos, and red flags
          </p>
        </div>
      )}

      {hasFullAccess && (
        <div className="mt-6">
          <Link
            href={`/builder/${builder.id}`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
          >
            View Full Details
          </Link>
        </div>
      )}
    </div>
  );
}
