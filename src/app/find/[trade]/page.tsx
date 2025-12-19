import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRightIcon, SearchIcon, CheckCircleIcon, UsersIcon, ShieldCheckIcon } from 'lucide-react';
import { trades, getTradeBySlug, getAllTradeSlugs } from '@/lib/trades';

const siteUrl = 'https://ratemybalibuilder.com';

interface PageProps {
  params: Promise<{ trade: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { trade: tradeSlug } = await params;
  const trade = getTradeBySlug(tradeSlug);

  if (!trade) {
    return { title: 'Trade Not Found' };
  }

  const title = `Find a ${trade.name} in Bali - Verified Reviews & Ratings`;

  return {
    title,
    description: trade.metaDescription,
    keywords: [
      `${trade.name.toLowerCase()} Bali`,
      `find ${trade.name.toLowerCase()} Bali`,
      `Bali ${trade.name.toLowerCase()}`,
      `${trade.name.toLowerCase()} reviews`,
      `trusted ${trade.name.toLowerCase()} Bali`,
      `hire ${trade.name.toLowerCase()} Bali`,
    ],
    openGraph: {
      title: `${title} | RateMyBaliBuilder`,
      description: trade.metaDescription,
      url: `${siteUrl}/find/${trade.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: trade.metaDescription,
    },
    alternates: {
      canonical: `${siteUrl}/find/${trade.slug}`,
    },
  };
}

export function generateStaticParams() {
  return getAllTradeSlugs().map((trade) => ({ trade }));
}

export default async function TradePage({ params }: PageProps) {
  const { trade: tradeSlug } = await params;
  const trade = getTradeBySlug(tradeSlug);

  if (!trade) {
    notFound();
  }

  // JSON-LD for the trade page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${trade.name} Services in Bali`,
    description: trade.description,
    areaServed: {
      "@type": "Place",
      name: "Bali, Indonesia",
    },
    provider: {
      "@type": "Organization",
      name: "RateMyBaliBuilder",
      url: siteUrl,
    },
  };

  // FAQ Schema
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: trade.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-[calc(100vh-57px)] sm:min-h-[calc(100vh-73px)]">
        {/* Hero Section */}
        <section className="relative px-4 py-12 sm:px-6 sm:py-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -left-20 -top-20 h-[70%] w-[60%] blur-[80px]"
              style={{
                background: 'linear-gradient(135deg, rgba(123, 162, 224, 0.4) 0%, rgba(123, 162, 224, 0.2) 60%, transparent 100%)',
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h1 className="text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Find a {trade.name}
              <br />
              <span className="text-[var(--color-energy)]">in Bali</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
              {trade.description}
            </p>

            {/* Search CTA */}
            <div className="mx-auto mt-8 max-w-md sm:mt-10">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Search our verified database of {trade.plural.toLowerCase()} in Bali
                  </p>
                  <Button asChild size="lg" className="h-12 w-full text-base">
                    <Link href={`/builders?trade=${encodeURIComponent(trade.name)}`}>
                      <SearchIcon className="mr-2 h-4 w-4" />
                      Browse {trade.plural}
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    100% Free - No account required to search
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-[var(--status-recommended)]" />
                <span>Verified reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-[var(--status-recommended)]" />
                <span>Community-driven</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-[var(--status-recommended)]" />
                <span>Scam warnings</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Check Reviews Section */}
        <section className="border-t bg-secondary/30 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl sm:text-3xl">
              Why check reviews before hiring a {trade.name.toLowerCase()}?
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                  <CheckCircleIcon className="h-6 w-6 text-[var(--status-recommended)]" />
                </div>
                <h3 className="mt-3 font-medium">Avoid Scams</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  See which {trade.plural.toLowerCase()} have been flagged for poor work or scams
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                  <UsersIcon className="h-6 w-6 text-[var(--status-recommended)]" />
                </div>
                <h3 className="mt-3 font-medium">Real Experiences</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Read reviews from expats and locals who hired them
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                  <ShieldCheckIcon className="h-6 w-6 text-[var(--status-recommended)]" />
                </div>
                <h3 className="mt-3 font-medium">Find Trusted Pros</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Discover recommended {trade.plural.toLowerCase()} with proven track records
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-center text-muted-foreground">
              Common questions about hiring a {trade.name.toLowerCase()} in Bali
            </p>

            <div className="mt-8 space-y-6">
              {trade.faqs.map((faq, index) => (
                <Card key={index} className="border-0 bg-secondary/30">
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="font-medium text-foreground">
                      {faq.question}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-secondary/30 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl">
              Ready to find a {trade.name.toLowerCase()}?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Search our database of verified {trade.plural.toLowerCase()} in Bali
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href={`/builders?trade=${encodeURIComponent(trade.name)}`}>
                  Search {trade.plural}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/add-builder">
                  Add a {trade.name}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Other Trades Section */}
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-xl sm:text-2xl">
              Find other trades in Bali
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {trades
                .filter((t) => t.slug !== trade.slug)
                .map((t) => (
                  <Link
                    key={t.slug}
                    href={`/find/${t.slug}`}
                    className="rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
                  >
                    {t.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
