'use client';

import Link from 'next/link';
import { StarIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

interface ReviewPromptProps {
  builderName: string;
  builderId: string;
  variant?: 'banner' | 'card';
  onDismiss?: () => void;
}

export function ReviewPrompt({
  builderName,
  builderId,
  variant = 'banner',
  onDismiss,
}: ReviewPromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (variant === 'card') {
    return (
      <Card className="border-0 bg-[var(--color-prompt)]/5">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-prompt)]/10">
                <StarIcon className="h-5 w-5 text-[var(--color-prompt)]" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Worked with {builderName}?
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Help others find good builders
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <Button asChild size="sm">
              <Link href={`/submit-review?builder=${builderId}`}>
                Write Review
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Banner variant
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-[var(--color-prompt)]/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <StarIcon className="h-5 w-5 flex-shrink-0 text-[var(--color-prompt)]" />
        <p className="text-sm">
          <span className="font-medium">Worked with {builderName}?</span>{' '}
          <span className="text-muted-foreground">
            Leave a review and help others find good builders
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild size="sm">
          <Link href={`/submit-review?builder=${builderId}`}>
            Write Review
          </Link>
        </Button>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
