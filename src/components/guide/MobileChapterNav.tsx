'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const drawer = (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 9998 }}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-background shadow-2xl transition-transform duration-300 ease-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ zIndex: 9999 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-4 shrink-0">
          <h2 className="text-lg font-medium">Chapters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 hover:bg-secondary transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="border-b px-4 py-4 shrink-0">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{currentIndex + 1} of {totalChapters}</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${((currentIndex + 1) / totalChapters) * 100}%` }}
            />
          </div>
        </div>

        {/* Chapter list - scrollable */}
        <nav className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-3 space-y-1">
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
                    'flex items-start gap-3 rounded-lg px-3 py-3 text-sm',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      isActive
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium leading-tight">
                      {chapter.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Icon className={cn('h-3 w-3', isActive ? 'text-primary-foreground/70' : accessColors[chapter.accessLevel])} />
                      <span className={cn('text-xs', isActive ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
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

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium active:scale-95 transition-transform"
      >
        <ListIcon className="h-4 w-4" />
        <span>Ch. {currentIndex + 1}/{totalChapters}</span>
      </button>

      {/* Portal drawer to body */}
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
