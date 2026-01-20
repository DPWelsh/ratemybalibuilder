'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MembershipPlanId } from '@/lib/stripe-config';
import {
  CheckIcon,
  Loader2Icon,
  ArrowRightIcon,
  SparklesIcon,
  BookOpenIcon,
  GiftIcon,
} from 'lucide-react';

interface ContributionProgress {
  approved_builders: number;
  approved_reviews: number;
  pending_builders: number;
  pending_reviews: number;
  has_free_guide_access: boolean;
  total_approved: number;
  progress: number;
  target: number;
}

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<MembershipPlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contributions, setContributions] = useState<ContributionProgress | null>(null);

  useEffect(() => {
    fetch('/api/contributions')
      .then((res) => res.json())
      .then((data) => setContributions(data))
      .catch(() => {});
  }, []);

  const handleCheckout = async (planId: MembershipPlanId) => {
    setLoading(planId);
    setError(null);

    try {
      const response = await fetch('/api/checkout/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?redirect=/pricing');
          return;
        }
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(null);
    }
  };

  const features = [
    'Complete Bali Investment Guide (19 chapters)',
    'Downloadable PDF',
    'ROI calculator tool',
    'Searchable Supplier Directory (100+ contacts)',
    'Priority builder verification',
    'Lifetime access & updates',
  ];

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-energy)]/10 px-4 py-2 text-sm font-medium text-[var(--color-energy)]">
            <SparklesIcon className="h-4 w-4" />
            Invest smarter in Bali
          </div>
          <h1 className="text-3xl tracking-tight sm:text-5xl">
            Bali Investment Guide
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Everything you need to invest confidently in Bali real estate.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-auto mt-6 max-w-md rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
            {error}
          </div>
        )}

        {/* Single Pricing Card */}
        <div className="mt-12">
          <Card className="relative border-2 border-[var(--color-energy)]">
            {/* 50% off badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-[var(--color-energy)] px-4 py-1 text-sm font-medium text-white">
                50% Off
              </span>
            </div>

            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-energy)]/10">
                  <BookOpenIcon className="h-7 w-7 text-[var(--color-energy)]" />
                </div>
              </div>

              <div className="mt-6 flex items-baseline justify-center gap-2">
                <span className="text-2xl text-muted-foreground line-through">$158</span>
                <span className="text-5xl font-bold">$79</span>
              </div>
              <p className="mt-2 text-center text-sm text-[var(--status-recommended)] font-medium">
                One-time payment • Lifetime access
              </p>

              <ul className="mt-8 space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-energy)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCheckout('guide')}
                disabled={loading !== null}
                size="lg"
                className="mt-8 w-full bg-[var(--color-energy)] text-lg hover:bg-[var(--color-energy)]/90"
              >
                {loading === 'guide' ? (
                  <>
                    <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Get the Guide
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Secure payment via Stripe
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Free tier callout */}
        <div className="mt-12 rounded-lg border border-[var(--status-recommended)]/30 bg-[var(--status-recommended)]/5 p-6">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <GiftIcon className="h-5 w-5 text-[var(--status-recommended)]" />
            <span>Earn free guide access</span>
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Submit 5 builders or reviews to unlock the guide for free.
          </p>

          {/* Progress bar */}
          {contributions && (
            <div className="mx-auto mt-4 max-w-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Your progress</span>
                <span className="font-medium">
                  {contributions.total_approved} / {contributions.target} approved
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-[var(--status-recommended)] transition-all duration-500"
                  style={{ width: `${contributions.progress * 100}%` }}
                />
              </div>
              {(contributions.pending_builders > 0 || contributions.pending_reviews > 0) && (
                <p className="mt-1.5 text-xs text-muted-foreground text-center">
                  {contributions.pending_builders + contributions.pending_reviews} pending approval
                </p>
              )}
              {contributions.has_free_guide_access && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--status-recommended)]">
                  <CheckIcon className="h-4 w-4" />
                  Free guide unlocked!
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" size="sm">
              <Link href="/add-builder">
                Add a Builder
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/submit-review">
                Submit a Review
              </Link>
            </Button>
          </div>
        </div>

        {/* What's included */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold">What&apos;s Included</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Everything you need in one package
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border p-5 text-center">
              <div className="text-3xl font-bold text-[var(--color-energy)]">19</div>
              <p className="mt-1 text-sm text-muted-foreground">
                In-depth chapters covering every aspect
              </p>
            </div>
            <div className="rounded-lg border p-5 text-center">
              <div className="text-3xl font-bold text-[var(--color-energy)]">100+</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Verified supplier contacts with WhatsApp
              </p>
            </div>
            <div className="rounded-lg border p-5 text-center">
              <div className="text-3xl font-bold text-[var(--color-energy)]">∞</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Lifetime access & updates
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold">Questions</h2>
          <div className="mt-8 space-y-4">
            <div className="rounded-lg border p-5">
              <h3 className="font-medium">Is this a subscription?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No, it&apos;s a one-time payment. Pay once and get lifetime access to the guide, all 100+ supplier contacts, and future updates.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <h3 className="font-medium">Is the builder directory still free?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Yes! Searching and browsing builders is always free. The paid guide unlocks the investment guide and supplier contacts.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <h3 className="font-medium">What if I&apos;m not satisfied?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We offer a 30-day money-back guarantee. If the guide doesn&apos;t meet your expectations, we&apos;ll refund you in full.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
