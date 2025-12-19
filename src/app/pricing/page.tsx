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
} from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    const planId: MembershipPlanId = billingPeriod === 'yearly' ? 'investor_yearly' : 'investor_monthly';

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
      setLoading(false);
    }
  };

  const plan = billingPeriod === 'yearly' ? MEMBERSHIP_PLANS.investor_yearly : MEMBERSHIP_PLANS.investor_monthly;

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-energy)]/10 px-4 py-2 text-sm font-medium text-[var(--color-energy)]">
            <SparklesIcon className="h-4 w-4" />
            Invest smarter in Bali
          </div>
          <h1 className="text-3xl tracking-tight sm:text-5xl">
            Get Full Access
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Everything you need to invest confidently in Bali real estate.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-[var(--color-energy)] text-white'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              billingPeriod === 'yearly'
                ? 'bg-[var(--color-energy)] text-white'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            Yearly
            <span className="absolute -right-2 -top-2 rounded-full bg-[var(--status-recommended)] px-2 py-0.5 text-xs font-medium text-white">
              Save 35%
            </span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
            {error}
          </div>
        )}

        {/* Pricing Card */}
        <Card className="mt-8 border-2 border-[var(--color-energy)]">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-energy)]/10">
                <CrownIcon className="h-6 w-6 text-[var(--color-energy)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Investor Membership</h2>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </div>

            <div className="mt-6 flex items-baseline gap-1">
              {billingPeriod === 'yearly' ? (
                <>
                  <span className="text-5xl font-bold">$149</span>
                  <span className="text-xl text-muted-foreground">/year</span>
                </>
              ) : (
                <>
                  <span className="text-5xl font-bold">$19</span>
                  <span className="text-xl text-muted-foreground">/month</span>
                </>
              )}
            </div>
            {billingPeriod === 'yearly' && (
              <p className="mt-1 text-sm text-[var(--status-recommended)]">
                $12.42/month — Save $79/year
              </p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">Cancel anytime</p>

            <ul className="mt-8 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-energy)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={handleCheckout}
              disabled={loading}
              size="lg"
              className="mt-8 w-full bg-[var(--color-energy)] text-lg hover:bg-[var(--color-energy)]/90"
            >
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Secure payment via Stripe
            </p>
          </CardContent>
        </Card>

        {/* Free tier callout */}
        <div className="mt-8 rounded-lg border border-[var(--status-recommended)]/30 bg-[var(--status-recommended)]/5 p-6 text-center">
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

        {/* What's Included */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold">What&apos;s Included</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border p-5">
              <BookOpenIcon className="h-6 w-6 text-[var(--color-energy)]" />
              <h3 className="mt-3 font-medium">Complete Investment Guide</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                19 chapters covering land ownership, ROI calculations, finding builders, and more.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <ShieldCheckIcon className="h-6 w-6 text-[var(--color-energy)]" />
              <h3 className="mt-3 font-medium">Trusted Supplier List</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                67+ verified contacts for furniture, interiors, pools, landscaping, and more.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold">Questions</h2>
          <div className="mt-8 space-y-4">
            <div className="rounded-lg border p-5">
              <h3 className="font-medium">Can I cancel anytime?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Yes. Cancel from your account settings and keep access until the end of your billing period.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <h3 className="font-medium">What payment methods do you accept?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                All major credit cards via Stripe&apos;s secure payment platform.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <h3 className="font-medium">Is the builder directory still free?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Yes! Searching and browsing builders is always free. The membership unlocks the investment guide and supplier contacts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
