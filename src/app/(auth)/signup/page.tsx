'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2Icon, CheckIcon } from 'lucide-react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-0">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-recommended)]/10 sm:mb-6 sm:h-16 sm:w-16">
            <CheckIcon className="h-7 w-7 text-[var(--status-recommended)] sm:h-8 sm:w-8" />
          </div>
          <h1 className="text-xl text-foreground sm:text-2xl">Check your email</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            We&apos;ve sent a confirmation link to <strong className="text-foreground">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Button asChild size="lg" className="mt-6 w-full sm:mt-8 sm:w-auto">
            <Link href="/login">
              Back to Sign In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-0">
      <div className="w-full max-w-md">
        {/* Promotion Banner */}
        <div className="mb-6 rounded-lg bg-[var(--status-recommended)]/10 p-4 text-center">
          <p className="text-sm font-medium text-[var(--status-recommended)]">
            🎉 Early Promotion
          </p>
          <p className="mt-1 text-sm text-foreground">
            New users get <strong>$50 worth</strong> of free search credits
          </p>
        </div>

        <h1 className="text-center text-2xl text-foreground sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground sm:mt-3 sm:text-base">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--color-prompt)] transition-colors hover:text-[var(--color-prompt)]/80">
            Sign in
          </Link>
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
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 sm:h-12"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 sm:h-12"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
