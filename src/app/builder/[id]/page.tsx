'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { StarRating } from '@/components/StarRating';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewPrompt } from '@/components/ReviewPrompt';
import { SaveBuilderButton } from '@/components/SaveBuilderButton';
import { createClient } from '@/lib/supabase/client';
import {
  MessageCircleIcon,
  InstagramIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  Loader2Icon,
  GlobeIcon,
  StarIcon,
  PhoneIcon,
  LockIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatPhone } from '@/lib/utils';

interface Builder {
  id: string;
  name: string;
  phone: string;
  company_name: string | null;
  instagram: string | null;
  website: string | null;
  google_reviews_url: string | null;
  status: 'recommended' | 'unknown' | 'blacklisted';
  location: string;
  trade_type: string;
  project_types: string[];
  notes: string | null;
}

interface Review {
  id: string;
  rating: number;
  review_text: string;
  photos: string[];
  created_at: string;
}

export default function BuilderPage() {
  const params = useParams();
  const builderId = params.id as string;

  const [builder, setBuilder] = useState<Builder | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Check if user is signed in
      const { data: { user } } = await supabase.auth.getUser();
      setIsSignedIn(!!user);

      // Fetch builder
      const { data: builderData, error: builderError } = await supabase
        .from('builders')
        .select('*')
        .eq('id', builderId)
        .single();

      if (builderError || !builderData) {
        setIsLoading(false);
        return;
      }

      setBuilder(builderData);

      // Fetch approved reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('id, rating, review_text, photos, created_at')
        .eq('builder_id', builderId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      const approvedReviews = reviewsData || [];
      setReviews(approvedReviews);

      // Calculate average rating
      if (approvedReviews.length > 0) {
        const avg = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
        setAvgRating(Math.round(avg * 10) / 10);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [builderId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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

  const whatsappLink = `https://wa.me/${builder.phone.replace(/[\s\-\+]/g, '')}`;
  const instagramLink = builder.instagram ? `https://instagram.com/${builder.instagram.replace('@', '')}` : null;

  // Generate red flags for blacklisted builders (based on low ratings)
  const redFlags = builder.status === 'blacklisted' ? [
    'Multiple negative reviews reported',
    'Exercise caution when engaging',
  ] : [];

  return (
    <div className="min-h-[calc(100vh-57px)] sm:min-h-[calc(100vh-73px)]">
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-2xl">
          {/* Back Button */}
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
            <Link href="/builders">
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to builders
            </Link>
          </Button>

          {/* Builder Header */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-xl font-medium text-foreground sm:text-2xl">{builder.name}</h1>
                  {builder.company_name && (
                    <p className="mt-1 text-sm text-muted-foreground">{builder.company_name}</p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">{builder.trade_type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <SaveBuilderButton
                    builderId={builder.id}
                    builderName={builder.name}
                    variant="icon"
                  />
                  <StatusBadge status={builder.status} size="lg" />
                </div>
              </div>

              {/* Specialties */}
              {builder.project_types && builder.project_types.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {builder.project_types.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}

              {/* Contact Info - Always visible now (free) */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono">{formatPhone(builder.phone)}</span>
                </div>

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
                        {builder.instagram}
                      </a>
                    </Button>
                  )}
                  {builder.website && (
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <a href={builder.website.startsWith('http') ? builder.website : `https://${builder.website}`} target="_blank" rel="noopener noreferrer">
                        <GlobeIcon className="h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  )}
                  {builder.google_reviews_url && (
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <a href={builder.google_reviews_url} target="_blank" rel="noopener noreferrer">
                        <StarIcon className="h-4 w-4" />
                        Google Reviews
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 flex items-center gap-6 border-t border-border pt-6">
                {avgRating > 0 && (
                  isSignedIn ? (
                    <div className="flex items-center gap-2">
                      <StarRating rating={avgRating} size="md" />
                      <span className="font-medium">{avgRating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <Link href="/login" className="flex items-center gap-2 group">
                      <div className="blur-sm select-none pointer-events-none">
                        <StarRating rating={avgRating} size="md" />
                      </div>
                      <span className="text-xs text-muted-foreground group-hover:text-[var(--color-prompt)] group-hover:underline">Sign in</span>
                    </Link>
                  )
                )}
                <div className="text-sm text-muted-foreground">
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Prompt */}
          <div className="mt-4 sm:mt-6">
            <ReviewPrompt
              builderName={builder.name}
              builderId={builder.id}
              variant="banner"
            />
          </div>

          {/* Red Flags Section - Only for blacklisted */}
          {builder.status === 'blacklisted' && (
            <Card className="mt-4 border-0 border-l-4 border-l-[var(--color-energy)] bg-[var(--color-energy)]/5 shadow-md sm:mt-6">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 text-[var(--color-energy)]">
                  <AlertTriangleIcon className="h-5 w-5" />
                  <h2 className="font-medium">Warning - Flagged Builder</h2>
                </div>
                {builder.notes ? (
                  <p className="mt-4 text-sm leading-relaxed">{builder.notes}</p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {redFlags.map((flag, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-energy)]" />
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <div className="mt-6 sm:mt-8">
            <h2 className="mb-4 text-lg font-medium sm:text-xl">
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </h2>

            {!isSignedIn ? (
              /* Locked state - not signed in */
              <Card className="border-0 bg-secondary/30">
                <CardContent className="px-4 py-10 text-center sm:py-12">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <LockIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground">Sign in to see reviews</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create a free account to read detailed reviews and ratings from the community.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button asChild>
                      <Link href="/login">Sign in</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/signup">Create account</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={{
                      id: review.id,
                      builderId: builderId,
                      rating: review.rating,
                      text: review.review_text,
                      photos: review.photos || [],
                      createdAt: review.created_at,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-0 bg-secondary/30">
                <CardContent className="px-4 py-8 text-center">
                  <p className="text-muted-foreground">No reviews yet for this builder.</p>
                  <Button asChild className="mt-4">
                    <Link href="/submit-review">Be the first to review</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
