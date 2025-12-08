'use client';

import { BuilderSearchResult } from '@/types/database';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { LockIcon, ArrowRightIcon } from 'lucide-react';

interface BuilderCardProps {
  builder: BuilderSearchResult;
  hasFullAccess?: boolean;
}

export function BuilderCard({ builder, hasFullAccess = false }: BuilderCardProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-medium text-foreground">{builder.name}</h3>
            <p className="text-muted-foreground">{builder.phone}</p>
          </div>
          <StatusBadge status={builder.status} size="lg" />
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{builder.review_count} review{builder.review_count !== 1 ? 's' : ''}</span>
        </div>

        {!hasFullAccess && builder.review_count > 0 && (
          <div className="mt-6">
            <Button asChild className="w-full">
              <Link href={`/builder/${builder.id}?unlock=true`}>
                <LockIcon className="mr-2 h-4 w-4" />
                Unlock Full Details ($20)
              </Link>
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              See reviews, photos, and red flags
            </p>
          </div>
        )}

        {hasFullAccess && (
          <div className="mt-6">
            <Button asChild variant="secondary" className="w-full">
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
