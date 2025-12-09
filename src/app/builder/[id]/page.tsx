'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { MaskedPhone } from '@/components/MaskedPhone';
import { StarRating } from '@/components/StarRating';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewPrompt } from '@/components/ReviewPrompt';
import { SaveBuilderButton } from '@/components/SaveBuilderButton';
import { createClient } from '@/lib/supabase/client';
import { PRICING, formatPrice } from '@/lib/pricing';
import {
  LockIcon,
  MessageCircleIcon,
  InstagramIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  Loader2Icon,
  GlobeIcon,
  StarIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const router = useRouter();
  const builderId = params.id as string;

  const [builder, setBuilder] = useState<Builder | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

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

      // Check if user has unlocked this builder
      if (user) {
        const { data: searchData } = await supabase
          .from('searches')
          .select('level')
          .eq('user_id', user.id)
          .eq('builder_id', builderId)
          .single();

        setIsUnlocked(searchData?.level === 'full');

        // Get user's credit balance
        const { data: profile } = await supabase
          .from('profiles')
          .select('credit_balance')
          .eq('id', user.id)
          .single();

        setUserBalance(profile?.credit_balance ?? 0);
      }

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

  const handleUnlock = async () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/builder/' + builderId);
      return;
    }

    if (userBalance !== null && userBalance < PRICING.unlock) {
      setToastMessage(`Not enough credits. You need ${PRICING.unlock} credits.`);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      return;
    }

    setIsUnlocking(true);

    try {
      const response = await fetch('/api/credits/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'unlock',
          builderId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          router.push('/buy-credits');
          return;
        }
        throw new Error(data.error || 'Failed to unlock');
      }

      // Update state
      setIsUnlocked(true);
      setUserBalance(data.newBalance);

      // Show success toast
      if (!data.alreadyPaid) {
        setToastMessage(`Unlocked! ${data.charged} credits used.`);
        setToastType('success');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
    } catch (error) {
      console.error('Unlock error:', error);
      setToastMessage('Failed to unlock. Please try again.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsUnlocking(false);
    }
  };

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
    <div className="min-h-[calc(100vh-57px)] pb-24 sm:min-h-[calc(100vh-73px)] sm:pb-8">
      {/* Toast */}
      {showToast && (
        <div className="fixed left-4 right-4 top-20 z-50 mx-auto max-w-md sm:left-auto sm:right-6 sm:top-24">
          <div className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${
            toastType === 'success'
              ? 'bg-foreground text-background'
              : 'bg-[var(--status-blacklisted)] text-white'
          }`}>
            {toastType === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-[var(--status-recommended)]" />
            ) : (
              <AlertTriangleIcon className="h-5 w-5 flex-shrink-0" />
            )}
            <p className="text-sm">{toastMessage}</p>
          </div>
        </div>
      )}

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

          {/* Review Prompt - Only when unlocked */}
          {isUnlocked && (
            <div className="mt-4 sm:mt-6">
              <ReviewPrompt
                builderName={builder.name}
                builderId={builder.id}
                variant="banner"
              />
            </div>
          )}

          {/* Red Flags Section - Only for blacklisted */}
          {builder.status === 'blacklisted' && isUnlocked && (
            <Card className="mt-4 border-0 border-l-4 border-l-[var(--color-energy)] bg-[var(--color-energy)]/5 shadow-md sm:mt-6">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 text-[var(--color-energy)]">
                  <AlertTriangleIcon className="h-5 w-5" />
                  <h2 className="font-medium">Warning</h2>
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
              )
            ) : (
              // Locked state - blurred preview
              <div className="relative">
                <div className="space-y-4 blur-sm pointer-events-none">
                  {reviews.length > 0 ? (
                    reviews.slice(0, 2).map((review) => (
                      <Card key={review.id} className="border-0 bg-secondary/30">
                        <CardContent className="p-4 sm:p-5">
                          <StarRating rating={review.rating} size="sm" />
                          <p className="mt-3 text-sm leading-relaxed">
                            {review.review_text.slice(0, 100)}...
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-0 bg-secondary/30">
                      <CardContent className="p-4 sm:p-5">
                        <p className="text-sm">Reviews are locked until you unlock this profile.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <div className="text-center">
                    <LockIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Unlock to see {reviews.length > 0 ? `all ${reviews.length} reviews` : 'full details'}
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
            <Button
              onClick={handleUnlock}
              disabled={isUnlocking}
              size="lg"
              className="h-12 w-full"
            >
              {isUnlocking ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>
                  <LockIcon className="mr-2 h-4 w-4" />
                  Unlock Full Details - {formatPrice(PRICING.unlock)}
                </>
              )}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {isLoggedIn
                ? `Your balance: ${userBalance} credits`
                : 'Sign in to unlock'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
