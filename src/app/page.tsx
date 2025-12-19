'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { TrustStats } from '@/components/TrustStats';
import { SearchIcon, ArrowRightIcon, ShieldCheckIcon, Loader2Icon, PhoneCallIcon, FileCheckIcon, UsersIcon, BookOpenIcon } from 'lucide-react';
import { TradeCombobox } from '@/components/TradeCombobox';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeType, setTradeType] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [tradeError, setTradeError] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    if (!tradeType) {
      setTradeError(true);
      return;
    }

    setIsSearching(true);

    // Determine if input looks like a phone number (mostly digits)
    const digitsOnly = searchQuery.replace(/[^\d]/g, '');
    const isPhone = digitsOnly.length >= 6;

    // Log the search (don't await - fire and forget)
    fetch('/api/search-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: isPhone ? searchQuery : null,
        name: !isPhone ? searchQuery : null,
        trade_type: tradeType || null,
      }),
    }).catch(() => {
      // Don't block search if logging fails
    });

    // Navigate to builders page with search query (don't pass trade type - let users see all results first)
    router.push(`/builders?q=${encodeURIComponent(searchQuery)}`);
  };
  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col sm:min-h-[calc(100vh-73px)]">
      {/* Investment Guide Banner */}
      <div className="border-b bg-[var(--color-energy)] px-4 py-3 text-center">
        <Link href="/guide" className="inline-flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-white hover:underline sm:text-base">
          <BookOpenIcon className="h-4 w-4" />
          <span>Get our Bali Investment Guide FREE when you add a builder or review</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-24">
        {/* Animated gradient background - organic flowing shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-20 -top-20 h-[70%] w-[60%] animate-gradient-slow blur-[80px]"
            style={{
              background: 'linear-gradient(135deg, rgba(123, 162, 224, 0.5) 0%, rgba(123, 162, 224, 0.25) 60%, transparent 100%)',
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
            }}
          />
          <div
            className="absolute -bottom-10 -right-20 h-[60%] w-[70%] animate-gradient-slow-reverse blur-[80px]"
            style={{
              background: 'linear-gradient(315deg, rgba(125, 49, 45, 0.35) 0%, rgba(125, 49, 45, 0.2) 50%, transparent 100%)',
              borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%'
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-3xl tracking-tight sm:text-5xl lg:text-7xl">
            Vet your builder
            <br />
            <span className="text-[var(--color-energy)]">before you build</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-8 sm:text-lg">
            Search our database of Bali builders. See who&apos;s recommended,
            who&apos;s unknown, and who to avoid.
          </p>

          {/* Promotion Banner */}
          <div className="mx-auto mt-6 max-w-md animate-pulse-subtle rounded-lg border border-[var(--status-recommended)]/30 bg-[var(--status-recommended)]/10 px-4 py-3 sm:mt-8">
            <p className="text-sm font-medium text-[var(--color-core)]">
              100% Free - Search unlimited builders, no account required
            </p>
          </div>

          {/* Search Form */}
          <div className="mx-auto mt-8 max-w-xl sm:mt-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="search"
                        name="search"
                        type="text"
                        placeholder="Name or phone..."
                        className="h-12 pl-11 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="relative w-full sm:w-[200px]">
                      {tradeError && (
                        <p className="absolute -top-5 left-0 text-xs text-destructive">Please select a trade</p>
                      )}
                      <TradeCombobox
                        value={tradeType}
                        onValueChange={(val) => {
                          setTradeType(val);
                          setTradeError(false);
                        }}
                        error={tradeError}
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={!searchQuery.trim() || isSearching}>
                    {isSearching ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        Search builder
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
                <p className="mt-3 text-center text-xs text-muted-foreground sm:mt-4 sm:text-sm">
                  Free to search. Help us grow by adding builders you know.
                </p>
                {/* Security badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheckIcon className="h-4 w-4 text-[var(--status-recommended)]" />
                  <span>Community-verified reviews</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Stats */}
          <div className="mt-10 sm:mt-16">
            <TrustStats />
          </div>
        </div>
      </section>

      {/* Verification Process Section */}
      <section className="border-t bg-secondary/30 px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl">Every listing is manually verified</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
              We don&apos;t just collect reviews — we verify them. Our local team contacts builders directly
              and cross-references project details to ensure every review reflects real experiences.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                <PhoneCallIcon className="h-7 w-7 text-[var(--status-recommended)]" />
              </div>
              <h3 className="mt-4 font-medium">Direct Contact</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our Indonesian team calls each builder to verify their business details, active projects, and credentials.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                <FileCheckIcon className="h-7 w-7 text-[var(--status-recommended)]" />
              </div>
              <h3 className="mt-4 font-medium">Review Validation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Every review is checked for specific project details, dates, and verifiable information before approval.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                <UsersIcon className="h-7 w-7 text-[var(--status-recommended)]" />
              </div>
              <h3 className="mt-4 font-medium">Community Reports</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Active expat and local community members flag suspicious activity and report their firsthand experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Products Section */}
      <section className="border-t bg-card px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl">Two ways we help you build in Bali</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Whether you&apos;re vetting contractors or planning your entire investment, we&apos;ve got you covered.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-2">
            {/* Product 1: Builder Directory */}
            <Card className="relative overflow-hidden border-2 border-[var(--status-recommended)]/30">
              <div className="absolute right-4 top-4 rounded-full bg-[var(--status-recommended)]/10 px-3 py-1 text-xs font-medium text-[var(--status-recommended)]">
                Free
              </div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                  <ShieldCheckIcon className="h-7 w-7 text-[var(--status-recommended)]" />
                </div>
                <h3 className="mt-4 text-xl font-medium sm:text-2xl">Builder Directory</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Search our database of Bali builders. See who&apos;s recommended, who&apos;s unknown, and who to avoid.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-[var(--status-recommended)]" />
                    <span>Verified community reviews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-[var(--status-recommended)]" />
                    <span>Blacklist warnings & scam alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-[var(--status-recommended)]" />
                    <span>Search by name or phone number</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button asChild className="w-full">
                    <Link href="/builders">
                      Browse Builders
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product 2: Investment Guide */}
            <Card className="relative overflow-hidden border-2 border-[var(--color-energy)]/30">
              <div className="absolute right-4 top-4 rounded-full bg-[var(--color-energy)]/10 px-3 py-1 text-xs font-medium text-[var(--color-energy)]">
                Premium
              </div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-energy)]/10">
                  <BookOpenIcon className="h-7 w-7 text-[var(--color-energy)]" />
                </div>
                <h3 className="mt-4 text-xl font-medium sm:text-2xl">Bali Investment Guide</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  19 chapters covering everything from land ownership to ROI calculations to finding trusted suppliers.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-[var(--color-energy)]" />
                    <span>Leasehold vs freehold explained</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-[var(--color-energy)]" />
                    <span>Real ROI calculations & examples</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-[var(--color-energy)]" />
                    <span>Trusted supplier contacts</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button asChild variant="outline" className="w-full border-[var(--color-energy)] text-[var(--color-energy)] hover:bg-[var(--color-energy)]/10">
                    <Link href="/guide">
                      Read the Guide
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="border-t px-4 py-12 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-energy)]/10 px-4 py-2 text-sm font-medium text-[var(--color-energy)]">
            <BookOpenIcon className="h-4 w-4" />
            Get the Investment Guide FREE
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl">Contribute & get rewarded</h2>
          <p className="mt-4 text-sm text-muted-foreground sm:mt-6 sm:text-lg">
            Add a builder or submit a review and get <strong>free access</strong> to our complete Bali Investment Guide —
            19 chapters on land ownership, ROI calculations, and trusted supplier contacts.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/add-builder">
                Add a builder
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/submit-review">
                Submit a review
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Verified contributions unlock premium access instantly
          </p>
        </div>
      </section>

    </div>
  );
}
