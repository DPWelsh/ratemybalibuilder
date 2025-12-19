import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { chapters, guideMeta } from '@/lib/guide';
import {
  BookOpenIcon,
  CheckCircleIcon,
  LockIcon,
  MailIcon,
  CrownIcon,
  ArrowRightIcon,
  StarIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bali Investment Guide | RateMyBaliBuilder',
  description:
    'The complete guide to investing in Bali real estate. Learn about land ownership, ROI calculations, finding builders, and trusted supplier contacts.',
  openGraph: {
    title: 'Bali Investment Guide | RateMyBaliBuilder',
    description:
      'The complete guide to investing in Bali real estate. Learn about land ownership, ROI calculations, finding builders, and trusted supplier contacts.',
    url: 'https://ratemybalibuilder.com/guide',
  },
};

const accessIcons = {
  free: <CheckCircleIcon className="h-4 w-4 text-[var(--status-recommended)]" />,
  teaser: <BookOpenIcon className="h-4 w-4 text-blue-500" />,
  'lead-magnet': <MailIcon className="h-4 w-4 text-amber-500" />,
  gated: <LockIcon className="h-4 w-4 text-muted-foreground" />,
  premium: <CrownIcon className="h-4 w-4 text-purple-500" />,
};

const accessLabels = {
  free: 'Free',
  teaser: 'Preview',
  'lead-magnet': 'Free with email',
  gated: 'Members only',
  premium: 'Premium',
};

export default function GuidePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-20 -top-20 h-[70%] w-[60%] blur-[80px]"
            style={{
              background:
                'linear-gradient(135deg, rgba(123, 162, 224, 0.4) 0%, rgba(123, 162, 224, 0.2) 60%, transparent 100%)',
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            }}
          />
          <div
            className="absolute -bottom-10 -right-20 h-[60%] w-[70%] blur-[80px]"
            style={{
              background:
                'linear-gradient(315deg, rgba(125, 49, 45, 0.3) 0%, rgba(125, 49, 45, 0.15) 50%, transparent 100%)',
              borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-600">
            <StarIcon className="h-4 w-4" />
            By RateMyBaliBuilder.com
          </div>

          <h1 className="text-3xl tracking-tight sm:text-5xl lg:text-6xl">
            The Complete Guide to
            <br />
            <span className="text-[var(--color-energy)]">Investing in Bali</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {guideMeta.totalChapters} chapters covering everything from land
            ownership to finding builders, calculating ROI, and accessing our
            exclusive network of {67}+ trusted suppliers.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/guide/introduction">
                Start Reading Free
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">See Membership Plans</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">{guideMeta.totalChapters}</div>
              <div className="text-sm text-muted-foreground">Chapters</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">19k+</div>
              <div className="text-sm text-muted-foreground">Words</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">67+</div>
              <div className="text-sm text-muted-foreground">Suppliers</div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="border-t bg-secondary/30 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            What You&apos;ll Learn
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                <ShieldCheckIcon className="h-7 w-7 text-[var(--status-recommended)]" />
              </div>
              <h3 className="mt-4 font-medium">Land Ownership</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Understand leasehold vs freehold, zoning laws, and how foreigners
                can legally invest in Bali property.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                <TrendingUpIcon className="h-7 w-7 text-[var(--status-recommended)]" />
              </div>
              <h3 className="mt-4 font-medium">ROI Calculations</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Real numbers from real projects. Learn expected returns, costs,
                and how to evaluate investment opportunities.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                <BookOpenIcon className="h-7 w-7 text-[var(--status-recommended)]" />
              </div>
              <h3 className="mt-4 font-medium">Complete Process</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                From finding land to managing your villa — every step of the
                investment journey explained.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="border-t px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Table of Contents
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            {guideMeta.freeChapters} free chapters to get you started
          </p>

          <div className="mt-10 space-y-2 sm:space-y-3">
            {chapters.map((chapter, index) => (
              <Link key={chapter.id} href={`/guide/${chapter.slug}`}>
                <Card className="transition-colors hover:bg-secondary/50">
                  <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium sm:h-10 sm:w-10 sm:text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium sm:text-base">{chapter.title}</h3>
                      <p className="hidden text-sm text-muted-foreground sm:block sm:truncate">
                        {chapter.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                      {accessIcons[chapter.accessLevel]}
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {accessLabels[chapter.accessLevel]}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-secondary/30 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to Start Your Bali Investment Journey?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Get instant access to all {guideMeta.totalChapters} chapters plus our
            exclusive supplier contact list with membership.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/pricing">
                View Membership Plans
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/guide/calculating-roi">
                <MailIcon className="mr-2 h-4 w-4" />
                Get Free ROI Chapter
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: 'Bali Investment Guide',
            description:
              'The complete guide to investing in Bali real estate - land ownership, ROI calculations, finding builders, and supplier contacts.',
            author: {
              '@type': 'Organization',
              name: 'RateMyBaliBuilder',
              url: 'https://ratemybalibuilder.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'RateMyBaliBuilder',
              url: 'https://ratemybalibuilder.com',
            },
            inLanguage: 'en',
            genre: 'Business & Investing',
            about: [
              'Bali real estate investment',
              'Villa construction',
              'Land ownership in Indonesia',
            ],
          }),
        }}
      />
    </div>
  );
}
