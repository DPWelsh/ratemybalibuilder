'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { chapters } from '@/lib/guide';
import {
  CheckCircleIcon,
  LockIcon,
  MailIcon,
  BookOpenIcon,
  CrownIcon,
  ChevronLeftIcon,
  CheckIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const accessIcons = {
  free: CheckCircleIcon,
  teaser: BookOpenIcon,
  'lead-magnet': MailIcon,
  gated: LockIcon,
  premium: CrownIcon,
};

const accessColors = {
  free: 'text-green-500',
  teaser: 'text-blue-500',
  'lead-magnet': 'text-amber-500',
  gated: 'text-muted-foreground',
  premium: 'text-purple-500',
};

interface GuideSidebarProps {
  currentChapter?: string;
  className?: string;
  completedChapters?: string[];
}

export function GuideSidebar({ currentChapter, className, completedChapters: initialCompleted }: GuideSidebarProps) {
  const [completedChapters, setCompletedChapters] = useState<string[]>(initialCompleted || []);

  // Fetch progress on mount if not provided
  useEffect(() => {
    if (!initialCompleted) {
      fetch('/api/guide-progress')
        .then(res => res.json())
        .then(data => {
          if (data.completedChapters) {
            setCompletedChapters(data.completedChapters);
          }
        })
        .catch(() => {});
    }
  }, [initialCompleted]);

  const completedCount = completedChapters.length;
  const progressPercent = (completedCount / chapters.length) * 100;

  return (
    <aside className={cn('flex flex-col', className)}>
      {/* Back to Guide link */}
      <Link
        href="/guide"
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to Guide Overview
      </Link>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {completedCount}/{chapters.length} completed
          </span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-[var(--status-recommended)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Chapter list */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Chapters
        </p>
        {chapters.map((chapter, index) => {
          const Icon = accessIcons[chapter.accessLevel];
          const isActive = chapter.slug === currentChapter;
          const isCompleted = completedChapters.includes(chapter.slug);
          const isFree = chapter.accessLevel === 'free';
          const isLeadMagnet = chapter.accessLevel === 'lead-magnet';

          return (
            <Link
              key={chapter.id}
              href={`/guide/${chapter.slug}`}
              className={cn(
                'group flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                  isCompleted
                    ? 'bg-[var(--status-recommended)] text-white'
                    : isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground group-hover:bg-muted'
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="h-3.5 w-3.5" />
                ) : (
                  String(index + 1).padStart(2, '0')
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'font-medium truncate',
                  isActive && 'text-primary',
                  isCompleted && !isActive && 'text-foreground'
                )}>
                  {chapter.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isCompleted ? (
                    <>
                      <CheckCircleIcon className="h-3 w-3 text-[var(--status-recommended)]" />
                      <span className="text-xs text-[var(--status-recommended)]">Completed</span>
                    </>
                  ) : (
                    <>
                      <Icon className={cn('h-3 w-3', accessColors[chapter.accessLevel])} />
                      <span className="text-xs text-muted-foreground">
                        {isFree ? 'Free' : isLeadMagnet ? 'Free w/ email' : chapter.accessLevel === 'premium' ? 'Premium' : 'Members'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* CTA at bottom - only show if not all completed */}
      {completedCount < chapters.length && (
        <div className="mt-6 pt-6 border-t">
          <div className="rounded-lg bg-primary/5 p-4 text-center">
            <p className="text-sm font-medium">Unlock All Chapters</p>
            <p className="text-xs text-muted-foreground mt-1">
              Get full access to all {chapters.length} chapters
            </p>
            <Link
              href="/pricing"
              className="mt-3 inline-block w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>
      )}

      {/* Completion message */}
      {completedCount === chapters.length && (
        <div className="mt-6 pt-6 border-t">
          <div className="rounded-lg bg-[var(--status-recommended)]/10 p-4 text-center">
            <CheckCircleIcon className="h-8 w-8 text-[var(--status-recommended)] mx-auto" />
            <p className="text-sm font-medium mt-2">Guide Complete!</p>
            <p className="text-xs text-muted-foreground mt-1">
              You&apos;ve finished all chapters
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
