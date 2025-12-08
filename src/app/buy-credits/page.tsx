'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PRICING, formatPrice } from '@/lib/pricing';
import {
  ArrowLeftIcon,
  CheckIcon,
  CreditCardIcon,
  SparklesIcon,
  Loader2Icon,
} from 'lucide-react';

export default function BuyCreditsPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>('value');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    if (!selectedPack) return;

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In real implementation, this would redirect to Stripe Checkout
    alert('Demo mode: This would redirect to Stripe Checkout');
    setIsProcessing(false);
  };

  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-6 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href="/dashboard">
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl text-foreground sm:text-3xl">Buy Credits</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Credits never expire. Use them to search and unlock builder profiles.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {PRICING.creditPacks.map((pack) => (
            <Card
              key={pack.id}
              className={`relative cursor-pointer border-2 transition-all ${
                selectedPack === pack.id
                  ? 'border-[var(--color-prompt)] shadow-lg'
                  : 'border-transparent hover:border-border'
              } ${pack.popular ? 'ring-2 ring-[var(--color-prompt)]/20' : ''}`}
              onClick={() => setSelectedPack(pack.id)}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-prompt)] px-3 py-1 text-xs font-medium text-white">
                    <SparklesIcon className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}
              <CardContent className="p-5 pt-6 text-center">
                <h3 className="font-medium text-foreground">{pack.label}</h3>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(pack.price)}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-medium text-muted-foreground">
                  {formatPrice(pack.credits)} credits
                </p>
                {'savings' in pack && pack.savings && (
                  <p className="mt-2 text-sm font-medium text-[var(--status-recommended)]">
                    Save {formatPrice(pack.savings)}
                  </p>
                )}
                <div className="mt-4">
                  {selectedPack === pack.id ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-prompt)]">
                      <CheckIcon className="h-4 w-4" />
                      Selected
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Click to select
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What You Get */}
        <Card className="mt-8 border-0 bg-secondary/50">
          <CardContent className="p-5 sm:p-6">
            <h3 className="font-medium text-foreground">What you can do with credits:</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--status-recommended)]" />
                <div>
                  <p className="font-medium text-foreground">Search builders</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(PRICING.search)} per search - only charged if we find a match
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--status-recommended)]" />
                <div>
                  <p className="font-medium text-foreground">Unlock full profiles</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(PRICING.unlock)} to see reviews, photos, and red flags
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--status-recommended)]" />
                <div>
                  <p className="font-medium text-foreground">Earn credits back</p>
                  <p className="text-sm text-muted-foreground">
                    Submit a review and earn {formatPrice(PRICING.reviewCredit)} when approved
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Purchase Button */}
        <div className="mt-8">
          <Button
            onClick={handlePurchase}
            disabled={!selectedPack || isProcessing}
            size="lg"
            className="h-12 w-full"
          >
            {isProcessing ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCardIcon className="mr-2 h-4 w-4" />
                {selectedPack
                  ? `Buy ${PRICING.creditPacks.find((p) => p.id === selectedPack)?.label}`
                  : 'Select a pack'}
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Secure payment powered by Stripe. Credits never expire.
          </p>
        </div>
      </div>
    </div>
  );
}
