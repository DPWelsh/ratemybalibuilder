'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Chapter } from '@/lib/guide';
import {
  LockIcon,
  CrownIcon,
  CheckIcon,
  ArrowRightIcon,
  MailIcon,
  BookOpenIcon,
} from 'lucide-react';

interface PaywallCTAProps {
  chapter: Chapter;
  remainingContent?: string;
  isPremium?: boolean;
}

export function PaywallCTA({
  chapter,
  remainingContent,
  isPremium = false,
}: PaywallCTAProps) {
  // Estimate remaining reading time
  const remainingWords = remainingContent
    ? remainingContent.split(/\s+/).length
    : chapter.wordCount;
  const readingTime = Math.ceil(remainingWords / 200);

  return (
    <div className="relative mt-8">
      {/* Blurred preview of remaining content */}
      {remainingContent && (
        <div className="pointer-events-none relative mb-8 select-none">
          <div
            className="line-clamp-6 text-lg leading-relaxed opacity-50 blur-sm"
            aria-hidden="true"
          >
            {remainingContent.slice(0, 500)}...
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        </div>
      )}

      {/* Paywall Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {isPremium ? (
              <CrownIcon className="h-8 w-8 text-purple-500" />
            ) : (
              <LockIcon className="h-8 w-8 text-primary" />
            )}
          </div>

          <h3 className="text-2xl font-bold">
            {isPremium
              ? 'Premium Members Only'
              : 'Unlock the Full Guide'}
          </h3>

          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            {isPremium
              ? 'This chapter contains our exclusive supplier contacts with direct phone numbers and special discounts.'
              : `Continue reading this chapter and get access to all ${19} chapters of the Invest in Bali Guide.`}
          </p>

          {/* What's included */}
          <div className="mx-auto mt-6 max-w-sm text-left">
            <p className="mb-3 text-sm font-medium">Membership includes:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>All 19 chapters (19,000+ words)</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>67+ trusted supplier contacts</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>ROI calculator & templates</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Priority builder verification</span>
              </li>
            </ul>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/pricing">
                View Membership Plans
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/guide/calculating-roi">
                <MailIcon className="mr-2 h-4 w-4" />
                Try Free Chapter First
              </Link>
            </Button>
          </div>

          {/* Reading time indicator */}
          {remainingContent && (
            <p className="mt-6 text-sm text-muted-foreground">
              <BookOpenIcon className="mr-1 inline h-4 w-4" />
              ~{readingTime} min remaining in this chapter
            </p>
          )}
        </CardContent>
      </Card>

      {/* Alternative CTA */}
      <div className="mt-8 rounded-lg border bg-secondary/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Not ready to commit? Start with our{' '}
          <Link
            href="/guide/introduction"
            className="font-medium text-primary hover:underline"
          >
            free introduction chapter
          </Link>{' '}
          or{' '}
          <Link
            href="/guide/calculating-roi"
            className="font-medium text-primary hover:underline"
          >
            get the ROI chapter free with your email
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
