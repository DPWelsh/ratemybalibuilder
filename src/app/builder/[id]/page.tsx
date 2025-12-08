'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { MaskedPhone } from '@/components/MaskedPhone';
import { StarRating } from '@/components/StarRating';
import { ReviewCard } from '@/components/ReviewCard';
import {
  getBuilderById,
  getReviewsForBuilder,
  getAverageRating,
  getRedFlagsForBuilder,
} from '@/lib/dummy-data';
import {
  LockIcon,
  MessageCircleIcon,
  InstagramIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BuilderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const builderId = params.id as string;
  const isUnlocked = searchParams.get('unlocked') === '1';

  const [showToast, setShowToast] = useState(false);

  const builder = getBuilderById(builderId);
  const reviews = getReviewsForBuilder(builderId);
  const avgRating = getAverageRating(builderId);
  const redFlags = getRedFlagsForBuilder(builderId);

  // Show toast when unlocking
  useEffect(() => {
    if (isUnlocked) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);

  if (!builder) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 sm:min-h-[calc(100vh-73px)]">
        <Card className="border-0 shadow-md">
          <CardContent className="px-6 py-12 text-center">
            <h1 className="text-xl font-medium">Builder not found</h1>
            <p className="mt-2 text-muted-foreground">This builder doesn&apos;t exist in our database.</p>
            <Button asChild className="mt-6">
              <Link href="/">Back to Search</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/${builder.phone.replace(/\s|\+/g, '')}`;
  const instagramLink = builder.instagram ? `https://instagram.com/${builder.instagram}` : null;

  return (
    <div className="min-h-[calc(100vh-57px)] pb-24 sm:min-h-[calc(100vh-73px)] sm:pb-8">
      {/* Demo Toast */}
      {showToast && (
        <div className="fixed left-4 right-4 top-20 z-50 mx-auto max-w-md sm:left-auto sm:right-6 sm:top-24">
          <div className="flex items-center gap-3 rounded-lg bg-foreground px-4 py-3 text-background shadow-lg">
            <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-[var(--status-recommended)]" />
            <p className="text-sm">Demo mode - this would normally cost $20</p>
          </div>
        </div>
      )}

      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-2xl">
          {/* Back Button */}
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
            <Link href="/search">
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to results
            </Link>
          </Button>

          {/* Builder Header */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-xl font-medium text-foreground sm:text-2xl">{builder.name}</h1>
                  {builder.companyName && (
                    <p className="mt-1 text-sm text-muted-foreground">{builder.companyName}</p>
                  )}
                </div>
                <StatusBadge status={builder.status} size="lg" />
              </div>

              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                <MaskedPhone phone={builder.phone} masked={!isUnlocked} />

                {isUnlocked && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button asChild size="sm" className="gap-2">
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircleIcon className="h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                    {instagramLink && (
                      <Button asChild variant="outline" size="sm" className="gap-2">
                        <a href={instagramLink} target="_blank" rel="noopener noreferrer">
                          <InstagramIcon className="h-4 w-4" />
                          @{builder.instagram}
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-6 flex items-center gap-6 border-t border-border pt-6">
                {avgRating > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={avgRating} size="md" />
                    <span className="font-medium">{avgRating.toFixed(1)}</span>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Red Flags Section - Only for blacklisted */}
          {builder.status === 'blacklisted' && redFlags.length > 0 && isUnlocked && (
            <Card className="mt-4 border-0 border-l-4 border-l-[var(--color-energy)] bg-[var(--color-energy)]/5 shadow-md sm:mt-6">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 text-[var(--color-energy)]">
                  <AlertTriangleIcon className="h-5 w-5" />
                  <h2 className="font-medium">Red Flags Reported</h2>
                </div>
                <ul className="mt-4 space-y-2">
                  {redFlags.map((flag, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-energy)]" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <div className="mt-6 sm:mt-8">
            <h2 className="mb-4 text-lg font-medium sm:text-xl">Reviews</h2>

            {isUnlocked ? (
              reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <Card className="border-0 bg-secondary/30">
                  <CardContent className="px-4 py-8 text-center">
                    <p className="text-muted-foreground">No reviews yet for this builder.</p>
                  </CardContent>
                </Card>
              )
            ) : (
              // Locked state - blurred preview
              <div className="relative">
                <div className="space-y-4 blur-sm">
                  {reviews.slice(0, 2).map((review) => (
                    <Card key={review.id} className="border-0 bg-secondary/30">
                      <CardContent className="p-4 sm:p-5">
                        <StarRating rating={review.rating} size="sm" />
                        <p className="mt-3 text-sm leading-relaxed">
                          {review.text.slice(0, 100)}...
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <div className="text-center">
                    <LockIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Unlock to see all {reviews.length} reviews
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Unlock CTA - Only when locked */}
      {!isUnlocked && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 shadow-lg sm:relative sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
          <div className="mx-auto max-w-2xl sm:px-6">
            <Button asChild size="lg" className="h-12 w-full">
              <Link href={`/builder/${builderId}?unlocked=1`}>
                <LockIcon className="mr-2 h-4 w-4" />
                Unlock Full Details - $20
              </Link>
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              See full phone number, reviews, and red flags
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
