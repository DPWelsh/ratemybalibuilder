import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRightIcon, ShieldCheckIcon, UsersIcon, StarIcon } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-12 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            About RateMyBaliBuilder
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
            Helping you make informed decisions about construction in Bali
          </p>
        </div>

        {/* Story */}
        <div className="mt-12 space-y-6 text-muted-foreground sm:mt-16">
          <p>
            Building in Bali can be an incredible experience—or a nightmare. Too many people have
            learned this the hard way, losing money to unreliable contractors, facing endless
            delays, or dealing with substandard work that costs even more to fix.
          </p>
          <p>
            <strong className="text-foreground">RateMyBaliBuilder</strong> was created to solve
            this problem. We&apos;re building a community-driven database of builders, contractors,
            and tradespeople in Bali, powered by real reviews from people who&apos;ve actually
            worked with them.
          </p>
          <p>
            Our mission is simple: help you vet your builder before you commit. Whether you&apos;re
            building a villa, renovating a property, or just need a reliable contractor for a
            small project, we want to give you the information you need to make the right choice.
          </p>
        </div>

        {/* Values */}
        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-3">
          <Card className="border-0 bg-secondary/50">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheckIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-medium text-foreground">Trust</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Every review comes from a verified user with real experience.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-secondary/50">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <UsersIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-medium text-foreground">Community</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Built by the community, for the community. We protect each other.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-secondary/50">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <StarIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-medium text-foreground">Quality</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We reward good builders and warn against bad ones.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center sm:mt-16">
          <h2 className="text-xl font-medium text-foreground sm:text-2xl">
            Ready to find a trusted builder?
          </h2>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button asChild size="lg">
              <Link href="/">
                Search Builders
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/submit-review">
                Submit a Review
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
