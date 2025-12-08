import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, UnlockIcon, CheckCircleIcon, ArrowRightIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-24">
        {/* Subtle gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-prompt)]/5 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            Trusted by 500+ expats in Bali
          </Badge>

          <h1 className="text-5xl tracking-tight sm:text-6xl lg:text-7xl">
            Vet your builder
            <br />
            <span className="text-[var(--color-energy)]">before you build</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
            Search our database of Bali builders. See who&apos;s recommended,
            who&apos;s unknown, and who to avoid. Real data from real expats.
          </p>

          {/* Search Form */}
          <div className="mx-auto mt-12 max-w-xl">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <form action="/search" method="GET" className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Builder name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Pak Wayan"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone / WhatsApp
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+62 812 XXX XXXX"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="w-full h-12">
                    Search builder
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  $10 per search. Only charged if we find a match.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Legend */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#22c55e]" />
              <span className="text-muted-foreground">Recommended</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[var(--color-prompt)]" />
              <span className="text-muted-foreground">Unknown</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[var(--color-energy)]" />
              <span className="text-muted-foreground">Blacklisted</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t bg-card px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl">How it works</h2>
            <p className="mt-4 text-muted-foreground">
              Three simple steps to protect your investment
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="relative overflow-hidden border-0 bg-secondary/50">
              <CardContent className="p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <SearchIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl">Search</h3>
                <p className="mt-3 text-muted-foreground">
                  Enter the builder&apos;s name and phone number. We&apos;ll check
                  our database instantly.
                </p>
                <p className="mt-4 font-medium">$10</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-secondary/50">
              <CardContent className="p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <UnlockIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl">Unlock</h3>
                <p className="mt-3 text-muted-foreground">
                  Found a match? Unlock full details including reviews,
                  photos, and red flags.
                </p>
                <p className="mt-4 font-medium">$20</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-secondary/50">
              <CardContent className="p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl">Decide</h3>
                <p className="mt-3 text-muted-foreground">
                  Make an informed decision with real feedback from
                  other expats who&apos;ve been there.
                </p>
                <p className="mt-4 font-medium text-[#22c55e]">Peace of mind</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Earn Credits CTA */}
      <section className="border-t px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl">Built something in Bali?</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Help other expats by sharing your experience. Submit a review and
            earn $20 in credits toward your next search.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/submit-review">
                Submit a review
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/buy-credits">
                Buy credits
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-sm text-muted-foreground">
            RateMyBaliBuilder
          </div>
          <nav className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
