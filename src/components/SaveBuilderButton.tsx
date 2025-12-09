'use client';

import { HeartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SaveBuilderButtonProps {
  builderId: string;
  builderName: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export function SaveBuilderButton({
  builderId,
  builderName,
  variant = 'icon',
  className = '',
}: SaveBuilderButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSavedStatus() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from('saved_builders')
        .select('id')
        .eq('user_id', user.id)
        .eq('builder_id', builderId)
        .single();

      setIsSaved(!!data);
      setIsLoading(false);
    }

    checkSavedStatus();
  }, [builderId]);

  const handleToggle = async () => {
    if (!userId) {
      router.push('/login?redirect=/builder/' + builderId);
      return;
    }

    const supabase = createClient();

    if (isSaved) {
      // Unsave
      await supabase
        .from('saved_builders')
        .delete()
        .eq('user_id', userId)
        .eq('builder_id', builderId);
      setIsSaved(false);
    } else {
      // Save
      await supabase
        .from('saved_builders')
        .insert({ user_id: userId, builder_id: builderId });
      setIsSaved(true);
    }
  };

  // Show loading state
  if (isLoading) {
    if (variant === 'icon') {
      return (
        <button className={`text-muted-foreground ${className}`} disabled>
          <HeartIcon className="h-5 w-5 animate-pulse" />
        </button>
      );
    }
    return (
      <Button variant="outline" size="sm" className={className} disabled>
        <HeartIcon className="mr-2 h-4 w-4 animate-pulse" />
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
