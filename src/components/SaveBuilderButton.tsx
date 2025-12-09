'use client';

import { HeartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface SaveBuilderButtonProps {
  builderId: string;
  builderName: string;
  variant?: 'icon' | 'button';
  className?: string;
}

// Helper functions for localStorage
function getSavedBuilders(): string[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('savedBuilders');
  return saved ? JSON.parse(saved) : [];
}

function saveBuilder(builderId: string): void {
  const saved = getSavedBuilders();
  if (!saved.includes(builderId)) {
    saved.push(builderId);
    localStorage.setItem('savedBuilders', JSON.stringify(saved));
  }
}

function unsaveBuilder(builderId: string): void {
  const saved = getSavedBuilders();
  const filtered = saved.filter((id) => id !== builderId);
  localStorage.setItem('savedBuilders', JSON.stringify(filtered));
}

function isBuilderSaved(builderId: string): boolean {
  return getSavedBuilders().includes(builderId);
}

export function SaveBuilderButton({
  builderId,
  builderName,
  variant = 'icon',
  className = '',
}: SaveBuilderButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setIsSaved(isBuilderSaved(builderId));
  }, [builderId]);

  const handleToggle = () => {
    if (isSaved) {
      unsaveBuilder(builderId);
      setIsSaved(false);
    } else {
      saveBuilder(builderId);
      setIsSaved(true);
    }
  };

  // Avoid hydration mismatch
  if (!mounted) {
    if (variant === 'icon') {
      return (
        <button className={`text-muted-foreground ${className}`}>
          <HeartIcon className="h-5 w-5" />
        </button>
      );
    }
    return (
      <Button variant="outline" size="sm" className={className}>
        <HeartIcon className="mr-2 h-4 w-4" />
        Save
      </Button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={`transition-colors ${
          isSaved
            ? 'text-[var(--color-energy)]'
            : 'text-muted-foreground hover:text-foreground'
        } ${className}`}
        title={isSaved ? `Remove ${builderName} from saved` : `Save ${builderName}`}
      >
        <HeartIcon className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
      </button>
    );
  }

  return (
    <Button
      variant={isSaved ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggle}
      className={className}
    >
      <HeartIcon className={`mr-2 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
      {isSaved ? 'Saved' : 'Save'}
    </Button>
  );
}

// Export helper for dashboard
export { getSavedBuilders };
