'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { TrustStats } from '@/components/TrustStats';
import { SearchIcon, UnlockIcon, CheckCircleIcon, ArrowRightIcon, ShieldCheckIcon, QuoteIcon, WrenchIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { tradeTypes } from '@/lib/supabase/builders';

export default function Home() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [tradeType, setTradeType] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log the search
    try {
      await fetch('/api/search-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, trade_type: tradeType || null }),
      });
    } catch {
      // Don't block search if logging fails
    }

    // Navigate to search results
    const params = new URLSearchParams();
    if (phone) params.set('phone', phone);
    if (tradeType) params.set('trade', tradeType);
    router.push(`/search?${params.toString()}`);
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
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone / WhatsApp
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+62 812 XXX XXXX"
                        className="h-12"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-sm font-medium">
                        Trade Type
                      </label>
                      <Select value={tradeType} onValueChange={setTradeType}>
                        <SelectTrigger className="h-12 w-full">
                          <WrenchIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                          <SelectValue placeholder="Any trade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any trade</SelectItem>
                          {tradeTypes.map((trade) => (
                            <SelectItem key={trade} value={trade}>
                              {trade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="h-11 w-full sm:h-12">
                    Search builder
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
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

          {/* Status Legend - horizontal scroll on mobile */}
          <div className="mt-8 flex items-center justify-center gap-4 text-xs sm:mt-12 sm:gap-8 sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e] sm:h-3 sm:w-3" />
              <span className="text-muted-foreground">Recommended</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-prompt)] sm:h-3 sm:w-3" />
              <span className="text-muted-foreground">Unknown</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-energy)] sm:h-3 sm:w-3" />
              <span className="text-muted-foreground">Blacklisted</span>
            </div>
          </div>

          {/* Trust Stats */}
          <div className="mt-10 sm:mt-16">
            <TrustStats />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t bg-card px-4 py-12 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-4 sm:text-base">
              Three simple steps to protect your investment
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-16 sm:gap-8 md:grid-cols-3">
            <Card className="relative overflow-hidden border-0 bg-secondary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--color-prompt)]/10">
              <CardContent className="p-5 sm:p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:h-12 sm:w-12">
                  <SearchIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-4 text-lg sm:mt-6 sm:text-xl">Search</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  Enter the builder&apos;s name and phone number. We&apos;ll check
                  our database instantly.
                </p>
                <p className="mt-3 font-medium text-[var(--status-recommended)] sm:mt-4">Free</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-secondary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--color-prompt)]/10">
              <CardContent className="p-5 sm:p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:h-12 sm:w-12">
                  <UnlockIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-4 text-lg sm:mt-6 sm:text-xl">Unlock</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  Found a match? Unlock full details including reviews,
                  photos, and red flags.
                </p>
                <p className="mt-3 font-medium text-[var(--status-recommended)] sm:mt-4">Free</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-secondary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--color-prompt)]/10">
              <CardContent className="p-5 sm:p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:h-12 sm:w-12">
                  <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-4 text-lg sm:mt-6 sm:text-xl">Decide</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  Make an informed decision with real feedback from
                  others who&apos;ve been there.
                </p>
                <p className="mt-3 font-medium text-[#22c55e] sm:mt-4">Peace of mind</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t px-4 py-12 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl">What people are saying</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-4 sm:text-base">
              Real experiences from the Bali building community
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {/* Testimonial 1 */}
            <Card className="border-0 bg-secondary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--color-prompt)]/10">
              <CardContent className="p-5 sm:p-6">
                <QuoteIcon className="h-6 w-6 text-[var(--color-prompt)]/50" />
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  &ldquo;Saved me from a contractor with a history of abandoned projects. Worth every dollar.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-prompt)]/20 text-sm font-medium">
                    MK
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mike K.</p>
                    <p className="text-xs text-muted-foreground">Villa project, Canggu</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-0 bg-secondary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--color-prompt)]/10">
              <CardContent className="p-5 sm:p-6">
                <QuoteIcon className="h-6 w-6 text-[var(--color-prompt)]/50" />
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  &ldquo;Found a recommended builder through the platform. Our villa was completed on time and on budget.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--status-recommended)]/20 text-sm font-medium">
                    SL
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah L.</p>
                    <p className="text-xs text-muted-foreground">New build, Ubud</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-0 bg-secondary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--color-prompt)]/10">
              <CardContent className="p-5 sm:p-6">
                <QuoteIcon className="h-6 w-6 text-[var(--color-prompt)]/50" />
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  &ldquo;I wish this existed when I started my first project. Would have saved months of stress.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-energy)]/20 text-sm font-medium">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-medium">James D.</p>
                    <p className="text-xs text-muted-foreground">Renovation, Seminyak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
