import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
  ClockIcon,
  MenuIcon,
} from 'lucide-react';
import { LeadMagnetGate } from '@/components/guide/LeadMagnetGate';
import { PaywallCTA } from '@/components/guide/PaywallCTA';
import { GuideSidebar } from '@/components/guide/GuideSidebar';

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

  // Calculate reading time
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/guide"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Guide
          </Link>
          <span className="text-sm font-medium">
            Chapter {chapter.order} of {chapters.length}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="flex">
          {/* Sidebar - desktop only */}
          <GuideSidebar
            currentChapter={chapter.slug}
            className="hidden lg:flex lg:w-72 lg:shrink-0 lg:flex-col lg:border-r lg:px-6 lg:py-8 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto"
          />

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Chapter header */}
            <header className="border-b bg-gradient-to-b from-secondary/50 to-background px-4 py-8 sm:px-8 lg:px-12">
              <div className="max-w-3xl">
                {/* Chapter number badge */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold">
                    {String(chapter.order).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <ClockIcon className="h-4 w-4" />
                      {readingTime} min read
                    </span>
                    <span>•</span>
                    <span>{wordCount.toLocaleString()} words</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {chapter.title}
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  {chapter.description}
                </p>

                {/* Access badge */}
                <div className="mt-4">
                  {isFreeAccess && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      Free Chapter
                    </span>
                  )}
                  {isLeadMagnet && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-600">
                      <MailIcon className="h-4 w-4" />
                      Free with Email
                    </span>
                  )}
                  {isTeaser && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-600">
                      <BookOpenIcon className="h-4 w-4" />
                      Preview Available
                    </span>
                  )}
                  {(isGated || isPremium) && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
                      <LockIcon className="h-4 w-4" />
                      {isPremium ? 'Premium Members Only' : 'Members Only'}
                    </span>
                  )}
                </div>
              </div>
            </header>

            {/* Chapter content */}
            <div className="px-4 py-8 sm:px-8 lg:px-12">
              <div className="max-w-3xl">
                {/* Free chapters - show full content */}
                {isFreeAccess && (
                  <article
                    className="guide-content"
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
                      className="guide-content"
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
                <nav className="mt-16 flex items-center justify-between border-t pt-8">
                  {prevChapter ? (
                    <Link href={`/guide/${prevChapter.slug}`} className="group">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Previous
                      </div>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {prevChapter.title}
                      </p>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextChapter ? (
                    <Link href={`/guide/${nextChapter.slug}`} className="group text-right">
                      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-1">
                        Next
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {nextChapter.title}
                      </p>
                    </Link>
                  ) : (
                    <Link href="/guide" className="group text-right">
                      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-1">
                        Finish
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        Back to Guide Overview
                      </p>
                    </Link>
                  )}
                </nav>
              </div>
            </div>
          </main>
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
            wordCount: wordCount,
            timeRequired: `PT${readingTime}M`,
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
