'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2Icon, CheckIcon, MailIcon } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({ email });

      if (insertError) {
        if (insertError.code === '23505') {
          // Unique constraint violation - email already exists
          setSuccess(true);
        } else {
          setError('Something went wrong. Please try again.');
          setIsLoading(false);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-0">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-recommended)]/10 sm:mb-6 sm:h-16 sm:w-16">
            <CheckIcon className="h-7 w-7 text-[var(--status-recommended)] sm:h-8 sm:w-8" />
          </div>
          <h1 className="text-xl text-foreground sm:text-2xl">You&apos;re on the list!</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            We&apos;ll notify you at <strong className="text-foreground">{email}</strong> when we launch.
          </p>
          <Button asChild size="lg" variant="outline" className="mt-6 w-full sm:mt-8 sm:w-auto">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-0">
      <div className="w-full max-w-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-prompt)]/10 sm:mb-6 sm:h-16 sm:w-16">
          <MailIcon className="h-7 w-7 text-[var(--color-prompt)] sm:h-8 sm:w-8" />
        </div>

        <h1 className="text-center text-2xl text-foreground sm:text-3xl">
          Coming Soon
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground sm:mt-3 sm:text-base">
          We&apos;re working hard to bring you the best way to find trusted builders in Bali.
          Join our waitlist to be the first to know when we launch.
        </p>

        <Card className="mt-6 border-0 shadow-lg sm:mt-8">
          <CardContent className="p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive sm:p-4">
                  {error}
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-11 sm:h-12"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full sm:h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join the Waitlist'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground sm:mt-6 sm:text-sm">
          We&apos;ll never spam you. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
