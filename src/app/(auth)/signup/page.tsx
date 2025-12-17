'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2Icon, UserPlusIcon } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard after successful signup
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-0">
      <div className="w-full max-w-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-prompt)]/10 sm:mb-6 sm:h-16 sm:w-16">
          <UserPlusIcon className="h-7 w-7 text-[var(--color-prompt)] sm:h-8 sm:w-8" />
        </div>

        <h1 className="text-center text-2xl text-foreground sm:text-3xl">
          Create an account
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground sm:mt-3 sm:text-base">
          Sign up to find and review trusted builders in Bali
        </p>

        <Card className="mt-6 border-0 shadow-lg sm:mt-8">
          <CardContent className="p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="h-11 sm:h-12"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm password
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
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
                  'Sign up'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground sm:mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--color-prompt)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
