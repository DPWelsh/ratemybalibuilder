'use client';

import { useState } from 'react';
import Link from 'next/link';
import { chapters } from '@/lib/guide';
import {
  CheckCircleIcon,
  LockIcon,
  MailIcon,
  BookOpenIcon,
  CrownIcon,
  XIcon,
  ListIcon,
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

interface MobileChapterNavProps {
  currentChapter: string;
  totalChapters: number;
  currentIndex: number;
}

export function MobileChapterNav({ currentChapter, totalChapters, currentIndex }: MobileChapterNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium"
      >
        <ListIcon className="h-4 w-4" />
        <span>Ch. {currentIndex + 1}/{totalChapters}</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-background shadow-xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-medium">Chapters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1.5 hover:bg-secondary"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="border-b px-4 py-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{currentIndex + 1}/{totalChapters}</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((currentIndex + 1) / totalChapters) * 100}%` }}
            />
          </div>
        </div>

        {/* Chapter list */}
        <nav className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          <div className="space-y-1">
            {chapters.map((chapter, index) => {
              const Icon = accessIcons[chapter.accessLevel];
              const isActive = chapter.slug === currentChapter;
              const isFree = chapter.accessLevel === 'free';
              const isLeadMagnet = chapter.accessLevel === 'lead-magnet';

              return (
                <Link
                  key={chapter.id}
                  href={`/guide/${chapter.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn('font-medium text-sm leading-tight', isActive && 'text-primary')}>
                      {chapter.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Icon className={cn('h-3 w-3', accessColors[chapter.accessLevel])} />
                      <span className="text-xs text-muted-foreground">
                        {isFree ? 'Free' : isLeadMagnet ? 'Free w/ email' : chapter.accessLevel === 'premium' ? 'Premium' : 'Members'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
