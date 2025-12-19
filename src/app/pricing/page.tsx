'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MEMBERSHIP_PLANS, MembershipPlanId } from '@/lib/stripe-config';
import {
  CheckIcon,
  CrownIcon,
  Loader2Icon,
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BookOpenIcon,
  XIcon,
} from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<MembershipPlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const guidePlan = MEMBERSHIP_PLANS.guide;
  const investorPlan = MEMBERSHIP_PLANS.investor;

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-energy)]/10 px-4 py-2 text-sm font-medium text-[var(--color-energy)]">
            <SparklesIcon className="h-4 w-4" />
            Invest smarter in Bali
          </div>
          <h1 className="text-3xl tracking-tight sm:text-5xl">
            Choose Your Plan
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

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Guide Plan - $79 one-time */}
          <Card className="relative border-2">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <BookOpenIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{guidePlan.name}</h2>
                  <p className="text-sm text-muted-foreground">{guidePlan.description}</p>
                </div>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold">$79</span>
                <span className="text-xl text-muted-foreground">one-time</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Pay once, access forever</p>

              <ul className="mt-8 space-y-4">
                {guidePlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
                {/* Show what's NOT included */}
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>Supplier Directory (100+ contacts)</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>Priority builder verification</span>
                </li>
              </ul>

              <Button
                onClick={() => handleCheckout('guide')}
                disabled={loading !== null}
                size="lg"
                variant="outline"
                className="mt-8 w-full text-lg"
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
            </CardContent>
          </Card>

          {/* Investor Plan - $199/year */}
          <Card className="relative border-2 border-[var(--color-energy)]">
            {/* Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-[var(--color-energy)] px-4 py-1 text-sm font-medium text-white">
                Best Value
              </span>
            </div>

            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-energy)]/10">
                  <CrownIcon className="h-6 w-6 text-[var(--color-energy)]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{investorPlan.name}</h2>
                  <p className="text-sm text-muted-foreground">{investorPlan.description}</p>
                </div>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold">$199</span>
                <span className="text-xl text-muted-foreground">/year</span>
              </div>
              <p className="mt-1 text-sm text-[var(--status-recommended)]">
                $16.58/month • Cancel anytime
              </p>

              <ul className="mt-8 space-y-4">
                {investorPlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-energy)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCheckout('investor')}
                disabled={loading !== null}
                size="lg"
                className="mt-8 w-full bg-[var(--color-energy)] text-lg hover:bg-[var(--color-energy)]/90"
              >
                {loading === 'investor' ? (
                  <>
                    <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Get Full Access
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
        <div className="mt-12 rounded-lg border border-[var(--status-recommended)]/30 bg-[var(--status-recommended)]/5 p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <ShieldCheckIcon className="h-5 w-5 text-[var(--status-recommended)]" />
            <span>Or get free access</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Contribute a builder or review to unlock the guide for free.
          </p>
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

        {/* Comparison */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold">Why Investor?</h2>
          <p className="mt-2 text-center text-muted-foreground">
            The supplier contacts alone can save you thousands
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border p-5 text-center">
              <div className="text-3xl font-bold text-[var(--color-energy)]">100+</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Verified contacts with WhatsApp links
              </p>
            </div>
            <div className="rounded-lg border p-5 text-center">
              <div className="text-3xl font-bold text-[var(--color-energy)]">$250+</div>
              <p className="mt-1 text-sm text-muted-foreground">
                What competitors charge for less
              </p>
            </div>
            <div className="rounded-lg border p-5 text-center">
              <div className="text-3xl font-bold text-[var(--color-energy)]">∞</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Lifetime updates included
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold">Questions</h2>
          <div className="mt-8 space-y-4">
            <div className="rounded-lg border p-5">
              <h3 className="font-medium">What&apos;s the difference between plans?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The Guide ($79) gives you all 19 chapters. Investor ($199/year) adds the supplier directory with 100+ verified contacts, priority builder verification, and ongoing updates.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <h3 className="font-medium">Can I upgrade later?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Yes! Start with the Guide and upgrade to Investor anytime. You&apos;ll only pay the difference.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <h3 className="font-medium">Is the builder directory still free?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Yes! Searching and browsing builders is always free. The paid plans unlock the investment guide and supplier contacts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
