'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon, Loader2Icon, CircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkCompleteButtonProps {
  chapterSlug: string;
  initialCompleted?: boolean;
  isLoggedIn: boolean;
}

export function MarkCompleteButton({ chapterSlug, initialCompleted = false, isLoggedIn }: MarkCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoggedIn) {
    return null;
  }

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      if (isCompleted) {
        // Mark as incomplete
        const response = await fetch('/api/guide-progress', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chapterSlug }),
        });

        if (response.ok) {
          setIsCompleted(false);
        }
      } else {
        // Mark as complete
        const response = await fetch('/api/guide-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chapterSlug }),
        });

        if (response.ok) {
          setIsCompleted(true);
        }
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isCompleted ? 'default' : 'outline'}
      size="lg"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'gap-2 transition-all',
        isCompleted && 'bg-[var(--status-recommended)] hover:bg-[var(--status-recommended)]/90'
      )}
    >
      {isLoading ? (
        <Loader2Icon className="h-4 w-4 animate-spin" />
      ) : isCompleted ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <CircleIcon className="h-4 w-4" />
      )}
      {isCompleted ? 'Completed' : 'Mark as Complete'}
    </Button>
  );
}
