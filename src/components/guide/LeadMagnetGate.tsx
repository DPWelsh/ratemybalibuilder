'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MailIcon,
  CheckCircleIcon,
  Loader2Icon,
  GiftIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react';

interface LeadMagnetGateProps {
  chapterTitle: string;
  chapterSlug: string;
  formattedContent: string;
}

export function LeadMagnetGate({ chapterTitle, chapterSlug, formattedContent }: LeadMagnetGateProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  // Check localStorage for existing access on mount
  useEffect(() => {
    const hasAccess = localStorage.getItem(`guide_access_${chapterSlug}`);
    if (hasAccess) {
      setIsUnlocked(true);
    }
  }, [chapterSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          source: 'guide',
          lead_magnet: chapterSlug,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to subscribe');
      }

      // Store access in localStorage
      localStorage.setItem(`guide_access_${chapterSlug}`, 'true');
      setIsUnlocked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Show full content if unlocked
  if (isUnlocked) {
    return (
      <div>
        {/* Success banner */}
        <div className="mb-8 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-600">Chapter Unlocked!</p>
              <p className="text-sm text-muted-foreground">
                Thanks for subscribing. Enjoy the full chapter below.
              </p>
            </div>
          </div>
        </div>

        {/* Full content */}
        <article
          className="guide-content"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      </div>
    );
  }

  // Show email gate
  return (
    <div className="py-8">
      <Card className="mx-auto max-w-xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
            <GiftIcon className="h-8 w-8 text-amber-500" />
          </div>
          <CardTitle className="text-2xl">
            Get &quot;{chapterTitle}&quot; Free
          </CardTitle>
          <p className="mt-2 text-muted-foreground">
            Enter your email to unlock this chapter instantly. No spam, unsubscribe
            anytime.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="h-12 pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-destructive">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                  Unlock Chapter Now
                </>
              )}
            </Button>
          </form>

          {/* What you'll learn */}
          <div className="mt-8 border-t pt-6">
            <p className="mb-4 text-center text-sm font-medium">
              In this chapter you&apos;ll learn:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <TrendingUpIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <p className="text-sm text-muted-foreground">
                  Detailed ROI calculations for Bali villa investments
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <p className="text-sm text-muted-foreground">
                  Expected rental yields and occupancy rates by area
                </p>
              </div>
              <div className="flex items-start gap-3">
                <UsersIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <p className="text-sm text-muted-foreground">
                  Real numbers from real projects over 15+ years
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social proof */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Join 500+ investors who&apos;ve used this guide to make smarter decisions
      </p>
    </div>
  );
}
