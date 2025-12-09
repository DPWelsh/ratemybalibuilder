import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRightIcon, MapPinIcon, SearchIcon } from 'lucide-react';
import { PRICING, formatPrice } from '@/lib/pricing';
import type { Metadata } from 'next';

const LOCATIONS: Record<string, { name: string; description: string }> = {
  canggu: {
    name: 'Canggu',
    description: 'Find trusted builders and contractors in Canggu, Bali. Check reviews and ratings before you build.',
  },
  ubud: {
    name: 'Ubud',
    description: 'Find trusted builders and contractors in Ubud, Bali. Check reviews and ratings before you build.',
  },
  seminyak: {
    name: 'Seminyak',
    description: 'Find trusted builders and contractors in Seminyak, Bali. Check reviews and ratings before you build.',
  },
  uluwatu: {
    name: 'Uluwatu',
    description: 'Find trusted builders and contractors in Uluwatu, Bali. Check reviews and ratings before you build.',
  },
  sanur: {
    name: 'Sanur',
    description: 'Find trusted builders and contractors in Sanur, Bali. Check reviews and ratings before you build.',
  },
  denpasar: {
    name: 'Denpasar',
    description: 'Find trusted builders and contractors in Denpasar, Bali. Check reviews and ratings before you build.',
  },
};

interface PageProps {
  params: Promise<{ location: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { location } = await params;
  const locationData = LOCATIONS[location.toLowerCase()];

  if (!locationData) {
    return { title: 'Location Not Found' };
  }

  return {
    title: `Builders in ${locationData.name} - Find Trusted Contractors`,
    description: locationData.description,
    openGraph: {
      title: `Builders in ${locationData.name} | RateMyBaliBuilder`,
      description: locationData.description,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(LOCATIONS).map((location) => ({ location }));
}

export default async function LocationPage({ params }: PageProps) {
  const { location } = await params;
  const locationData = LOCATIONS[location.toLowerCase()];

  if (!locationData) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-12 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <MapPinIcon className="h-4 w-4" />
            {locationData.name}, Bali
          </div>
          <h1 className="text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            Find Trusted Builders in {locationData.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
            Search our database to check if your {locationData.name} builder is recommended,
            unknown, or blacklisted before signing that contract.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mx-auto mt-8 max-w-md border-0 shadow-lg sm:mt-12">
          <CardContent className="p-4 sm:p-6">
            <form action="/search" method="GET" className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Builder&apos;s Phone / WhatsApp
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+62 812 XXX XXXX"
                  className="h-11 sm:h-12"
                />
              </div>
              <Button type="submit" size="lg" className="h-11 w-full sm:h-12">
                <SearchIcon className="mr-2 h-4 w-4" />
                Search Builder
              </Button>
            </form>
            <p className="mt-3 text-center text-xs text-muted-foreground sm:mt-4 sm:text-sm">
              {formatPrice(PRICING.unlock)} to unlock findings. Only charged if found.
            </p>
          </CardContent>
        </Card>

        {/* FAQ Section for SEO */}
        <div className="mt-16 sm:mt-24">
          <h2 className="text-center text-2xl sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-medium text-foreground">
                How do I find a good builder in {locationData.name}?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Before hiring any builder in {locationData.name}, search their phone number
                on RateMyBaliBuilder to see reviews from other expats. Check if they&apos;re
                recommended, unknown, or blacklisted based on real experiences.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">
                What should I look for in a {locationData.name} contractor?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Look for builders with positive reviews, a track record of completing projects
                on time, and transparent pricing. Avoid contractors who ask for large upfront
                payments or have a history of disappearing mid-project.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">
                How much does it cost to build in {locationData.name}?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Building costs in {locationData.name} vary based on location, materials, and
                complexity. Generally expect $800-1500 USD per sqm for quality villa construction.
                Always get multiple quotes and check builder reviews first.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">
                What are common builder scams in Bali?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Common issues include: demanding large upfront payments then disappearing,
                using substandard materials, massively underquoting then adding hidden costs,
                and abandoning projects midway. Checking reviews on RateMyBaliBuilder can
                help you avoid these problems.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center sm:mt-24">
          <p className="text-muted-foreground">
            Had an experience with a builder in {locationData.name}?
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/submit-review">
              Submit a Review
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
