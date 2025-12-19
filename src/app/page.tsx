'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { TrustStats } from '@/components/TrustStats';
import { SearchIcon, ArrowRightIcon, ShieldCheckIcon, Loader2Icon, PhoneCallIcon, FileCheckIcon, UsersIcon } from 'lucide-react';
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
              100% Free — Search unlimited builders, no account required
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

      {/* Contribute CTA */}
      <section className="border-t px-4 py-12 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl">Help build the database</h2>
          <p className="mt-4 text-sm text-muted-foreground sm:mt-6 sm:text-lg">
            Know a builder in Bali? Add them to our database and help others make informed decisions.
            Every contribution makes this community stronger.
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
        </div>
      </section>

    </div>
  );
}
