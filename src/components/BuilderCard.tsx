'use client';

import { BuilderSearchResult } from '@/types/database';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { LockIcon, ArrowRightIcon } from 'lucide-react';
import { PRICING, formatPrice } from '@/lib/pricing';
import { formatPhone } from '@/lib/utils';

interface BuilderCardProps {
  builder: BuilderSearchResult;
  hasFullAccess?: boolean;
}

export function BuilderCard({ builder, hasFullAccess = false }: BuilderCardProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-foreground sm:text-xl">{builder.name}</h3>
            <p className="text-sm text-muted-foreground sm:text-base">{formatPhone(builder.phone)}</p>
          </div>
          <StatusBadge status={builder.status} size="md" />
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground sm:mt-4">
          <span>{builder.review_count} review{builder.review_count !== 1 ? 's' : ''}</span>
        </div>

        {!hasFullAccess && builder.review_count > 0 && (
          <div className="mt-4 sm:mt-6">
            <Button asChild className="h-11 w-full sm:h-auto">
              <Link href={`/builder/${builder.id}?unlock=true`}>
                <LockIcon className="mr-2 h-4 w-4" />
                Unlock Full Details ({formatPrice(PRICING.unlock)})
              </Link>
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground sm:mt-3 sm:text-sm">
              See reviews, photos, and red flags
            </p>
          </div>
        )}

        {hasFullAccess && (
          <div className="mt-4 sm:mt-6">
            <Button asChild variant="secondary" className="h-11 w-full sm:h-auto">
              <Link href={`/builder/${builder.id}`}>
                View Full Details
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
