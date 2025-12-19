'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MEMBERSHIP_PLANS, MembershipPlanId } from '@/lib/stripe';
import {
  CheckIcon,
  BookOpenIcon,
  CrownIcon,
  Loader2Icon,
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
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
          // Redirect to login
          router.push('/login?redirect=/pricing');
          return;
        }
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-energy)]/10 px-4 py-2 text-sm font-medium text-[var(--color-energy)]">
            <SparklesIcon className="h-4 w-4" />
            Invest smarter in Bali
          </div>
          <h1 className="text-3xl tracking-tight sm:text-5xl">
            Choose Your Access
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Get the complete guide to investing in Bali real estate, with access to our
            exclusive network of trusted suppliers.
          </p>
        </div>

        {/* Free tier callout */}
        <div className="mt-10 rounded-lg border border-[var(--status-recommended)]/30 bg-[var(--status-recommended)]/5 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm">
            <ShieldCheckIcon className="h-4 w-4 text-[var(--status-recommended)]" />
            <span>
              <strong>Builder Directory is always free.</strong> Contribute a builder or review to unlock the guide for free.
            </span>
            <Link href="/add-builder" className="ml-2 text-[var(--color-prompt)] underline">
              Add a builder
            </Link>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Guide Only */}
          <Card className="relative">
            <CardHeader className="pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <BookOpenIcon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold">{MEMBERSHIP_PLANS.guide_only.name}</h2>
              <p className="text-sm text-muted-foreground">
                {MEMBERSHIP_PLANS.guide_only.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <ul className="mb-6 space-y-3">
                {MEMBERSHIP_PLANS.guide_only.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-recommended)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleCheckout('guide_only')}
                disabled={loading !== null}
                variant="outline"
                className="w-full"
              >
                {loading === 'guide_only' ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Get the Guide'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Investor Monthly */}
          <Card className="relative border-2 border-[var(--color-energy)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-energy)] px-4 py-1 text-xs font-medium text-white">
              Most Popular
            </div>
            <CardHeader className="pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-energy)]/10">
                <CrownIcon className="h-6 w-6 text-[var(--color-energy)]" />
              </div>
              <h2 className="mt-4 text-xl font-bold">{MEMBERSHIP_PLANS.investor_monthly.name}</h2>
              <p className="text-sm text-muted-foreground">
                {MEMBERSHIP_PLANS.investor_monthly.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-6 space-y-3">
                {MEMBERSHIP_PLANS.investor_monthly.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-energy)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleCheckout('investor_monthly')}
                disabled={loading !== null}
                className="w-full bg-[var(--color-energy)] hover:bg-[var(--color-energy)]/90"
              >
                {loading === 'investor_monthly' ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Start Monthly
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Investor Yearly */}
          <Card className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--status-recommended)] px-4 py-1 text-xs font-medium text-white">
              Save 35%
            </div>
            <CardHeader className="pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                <CrownIcon className="h-6 w-6 text-[var(--status-recommended)]" />
              </div>
              <h2 className="mt-4 text-xl font-bold">Investor (Annual)</h2>
              <p className="text-sm text-muted-foreground">
                {MEMBERSHIP_PLANS.investor_yearly.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">$149</span>
                <span className="text-muted-foreground">/year</span>
                <div className="mt-1 text-sm text-[var(--status-recommended)]">
                  $12.42/month
                </div>
              </div>
              <ul className="mb-6 space-y-3">
                {MEMBERSHIP_PLANS.investor_yearly.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-recommended)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleCheckout('investor_yearly')}
                disabled={loading !== null}
                variant="outline"
                className="w-full border-[var(--status-recommended)] text-[var(--status-recommended)] hover:bg-[var(--status-recommended)]/10"
              >
                {loading === 'investor_yearly' ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Start Annual'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ / Trust Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-8 grid gap-6 text-left sm:grid-cols-2">
            <div className="rounded-lg border p-6">
              <h3 className="font-medium">Can I cancel anytime?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Yes! Monthly and annual subscriptions can be cancelled anytime from your account settings.
                You&apos;ll keep access until the end of your billing period.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="font-medium">What payment methods do you accept?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American Express) through Stripe&apos;s
                secure payment platform.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="font-medium">Is there a free trial?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We offer 3 free chapters to preview. Plus, contribute a builder or review to unlock
                the full guide for free!
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="font-medium">What&apos;s in the supplier contact list?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                67+ verified contacts including furniture suppliers, interior designers,
                pool builders, landscapers, and more — all vetted by our team.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border bg-secondary/30 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold">Not ready to pay?</h2>
          <p className="mt-4 text-muted-foreground">
            Add a builder or submit a review and get <strong>free access</strong> to the complete guide.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/add-builder">
                Add a Builder
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/submit-review">Submit a Review</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
