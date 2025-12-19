import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  chapters,
  getChapterBySlug,
  getTeaserContent,
  formatContentToHtml,
  getAllChapterSlugs,
} from '@/lib/guide';
import { getChapterContent } from '@/lib/guide-server';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LockIcon,
  MailIcon,
  BookOpenIcon,
  CheckCircleIcon,
} from 'lucide-react';
import { LeadMagnetGate } from '@/components/guide/LeadMagnetGate';
import { PaywallCTA } from '@/components/guide/PaywallCTA';

interface PageProps {
  params: Promise<{ chapter: string }>;
}

export async function generateStaticParams() {
  return getAllChapterSlugs().map((slug) => ({ chapter: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    return { title: 'Chapter Not Found' };
  }

  return {
    title: `${chapter.title} | Invest in Bali Guide`,
    description: chapter.description,
    openGraph: {
      title: `${chapter.title} | Invest in Bali Guide`,
      description: chapter.description,
      url: `https://ratemybalibuilder.com/guide/${chapter.slug}`,
    },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { chapter: slug } = await params;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    notFound();
  }

  const content = await getChapterContent(chapter);
  const chapterIndex = chapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  // Determine what to show based on access level
  const isFreeAccess = chapter.accessLevel === 'free';
  const isLeadMagnet = chapter.accessLevel === 'lead-magnet';
  const isTeaser = chapter.accessLevel === 'teaser';
  const isGated = chapter.accessLevel === 'gated';
  const isPremium = chapter.accessLevel === 'premium';

  // For teaser chapters, get partial content
  const teaserContent = isTeaser
    ? getTeaserContent(content, chapter.teaserPercentage || 30)
    : '';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-secondary/30 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/guide"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Guide
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {String(chapter.order).padStart(2, '0')}
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{chapter.title}</h1>
              <p className="mt-1 text-muted-foreground">{chapter.description}</p>
            </div>
          </div>

          {/* Access badge */}
          <div className="mt-4">
            {isFreeAccess && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                Free Chapter
              </span>
            )}
            {isLeadMagnet && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-600">
                <MailIcon className="h-4 w-4" />
                Free with Email
              </span>
            )}
            {isTeaser && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-600">
                <BookOpenIcon className="h-4 w-4" />
                Preview Available
              </span>
            )}
            {(isGated || isPremium) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                <LockIcon className="h-4 w-4" />
                {isPremium ? 'Premium Members Only' : 'Members Only'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Free chapters - show full content */}
          {isFreeAccess && (
            <article
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: formatContentToHtml(content) }}
            />
          )}

          {/* Lead magnet - show gate */}
          {isLeadMagnet && (
            <LeadMagnetGate
              chapterTitle={chapter.title}
              chapterSlug={chapter.slug}
              formattedContent={formatContentToHtml(content)}
            />
          )}

          {/* Teaser - show partial content + paywall */}
          {isTeaser && (
            <>
              <article
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: formatContentToHtml(teaserContent),
                }}
              />
              <PaywallCTA
                chapter={chapter}
                remainingContent={content.slice(teaserContent.length)}
              />
            </>
          )}

          {/* Gated/Premium - show paywall only */}
          {(isGated || isPremium) && (
            <PaywallCTA chapter={chapter} isPremium={isPremium} />
          )}

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between border-t pt-8">
            {prevChapter ? (
              <Link href={`/guide/${prevChapter.slug}`}>
                <Button variant="outline">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  {prevChapter.title}
                </Button>
              </Link>
            ) : (
              <div />
            )}
            {nextChapter ? (
              <Link href={`/guide/${nextChapter.slug}`}>
                <Button>
                  {nextChapter.title}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/guide">
                <Button>
                  Back to Guide
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Chapter',
            name: chapter.title,
            description: chapter.description,
            position: chapter.order,
            isPartOf: {
              '@type': 'Book',
              name: 'Invest in Bali Guide',
              url: 'https://ratemybalibuilder.com/guide',
            },
          }),
        }}
      />
    </div>
  );
}
