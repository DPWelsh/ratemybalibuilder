import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, UnlockIcon, CheckCircleIcon, ArrowRightIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col sm:min-h-[calc(100vh-73px)]">
      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-24">
        {/* Subtle gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-prompt)]/5 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 sm:mb-6">
            Trusted by 500+ expats in Bali
          </Badge>

          <h1 className="text-3xl tracking-tight sm:text-5xl lg:text-7xl">
            Vet your builder
            <br />
            <span className="text-[var(--color-energy)]">before you build</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-8 sm:text-lg">
            Search our database of Bali builders. See who&apos;s recommended,
            who&apos;s unknown, and who to avoid.
          </p>

          {/* Search Form */}
          <div className="mx-auto mt-8 max-w-xl sm:mt-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <form action="/search" method="GET" className="space-y-3 sm:space-y-4">
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Builder name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Pak Wayan"
                        className="h-11 sm:h-12"
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone / WhatsApp
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+62 812 XXX XXXX"
                        className="h-11 sm:h-12"
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="h-11 w-full sm:h-12">
                    Search builder
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="mt-3 text-center text-xs text-muted-foreground sm:mt-4 sm:text-sm">
                  $10 per search. Only charged if we find a match.
                </p>
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
            <Card className="relative overflow-hidden border-0 bg-secondary/50">
              <CardContent className="p-5 sm:p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:h-12 sm:w-12">
                  <SearchIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-4 text-lg sm:mt-6 sm:text-xl">Search</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  Enter the builder&apos;s name and phone number. We&apos;ll check
                  our database instantly.
                </p>
                <p className="mt-3 font-medium sm:mt-4">$10</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-secondary/50">
              <CardContent className="p-5 sm:p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:h-12 sm:w-12">
                  <UnlockIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-4 text-lg sm:mt-6 sm:text-xl">Unlock</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  Found a match? Unlock full details including reviews,
                  photos, and red flags.
                </p>
                <p className="mt-3 font-medium sm:mt-4">$20</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-secondary/50">
              <CardContent className="p-5 sm:p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:h-12 sm:w-12">
                  <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-4 text-lg sm:mt-6 sm:text-xl">Decide</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  Make an informed decision with real feedback from
                  other expats who&apos;ve been there.
                </p>
                <p className="mt-3 font-medium text-[#22c55e] sm:mt-4">Peace of mind</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Earn Credits CTA */}
      <section className="border-t px-4 py-12 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl">Built something in Bali?</h2>
          <p className="mt-4 text-sm text-muted-foreground sm:mt-6 sm:text-lg">
            Help other expats by sharing your experience. Submit a review and
            earn $20 in credits toward your next search.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/submit-review">
                Submit a review
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/buy-credits">
                Buy credits
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
          <div className="text-sm text-muted-foreground">
            RateMyBaliBuilder
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground sm:gap-8">
            <Link href="/about" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
