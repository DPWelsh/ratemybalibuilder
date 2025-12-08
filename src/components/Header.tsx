'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CreditBalance } from './CreditBalance';
import { Button } from '@/components/ui/button';
import { MenuIcon, XIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credit_balance')
          .eq('id', user.id)
          .single();

        if (profile) {
          setCreditBalance(profile.credit_balance);
        }
      }
      setIsLoading(false);
    }

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="font-display text-lg tracking-tight text-foreground sm:text-xl">
          RateMyBaliBuilder
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {!isLoading && (
            <>
              {user ? (
                <>
                  <CreditBalance balance={creditBalance} />
                  <Link
                    href="/submit-review"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Submit Review
                  </Link>
                  <Link
                    href="/account"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Sign In
                  </Link>
                  <Button asChild size="sm">
                    <Link href="/signup">
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-card px-4 py-4 md:hidden">
          {!isLoading && (
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <CreditBalance balance={creditBalance} showBuyLink={false} className="pb-2" />
                  <Link
                    href="/buy-credits"
                    onClick={closeMobileMenu}
                    className="py-2 text-sm text-[var(--color-prompt)]"
                  >
                    Buy credits
                  </Link>
                  <div className="my-2 h-px bg-border" />
                  <Link
                    href="/submit-review"
                    onClick={closeMobileMenu}
                    className="py-2 text-muted-foreground"
                  >
                    Submit Review
                  </Link>
                  <Link
                    href="/account"
                    onClick={closeMobileMenu}
                    className="py-2 text-muted-foreground"
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="py-2 text-left text-muted-foreground"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="py-2 text-muted-foreground"
                  >
                    Sign In
                  </Link>
                  <Button asChild className="mt-2">
                    <Link href="/signup" onClick={closeMobileMenu}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
