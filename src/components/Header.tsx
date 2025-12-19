'use client';

import Image from 'next/image';
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
  const [isAdmin, setIsAdmin] = useState(false);
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
          .select('credit_balance, is_admin')
          .eq('id', user.id)
          .single();

        if (profile) {
          setCreditBalance(profile.credit_balance);
          setIsAdmin(profile.is_admin || false);
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
    <header className="border-b border-[var(--color-cloud)]/10 bg-[var(--color-core)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2 text-[var(--color-cloud)]">
          <Image src="/icon.svg" alt="Logo" width={32} height={32} className="h-8 w-8 brightness-0 invert" />
          <span className="font-['Raptor'] text-lg sm:text-xl">RateMyBaliBuilder</span>
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/builders"
            className="text-sm text-[var(--color-cloud)]/70 transition-colors hover:text-[var(--color-prompt)]"
          >
            Browse Builders
          </Link>
          <Link
            href="/guide"
            className="text-sm text-[var(--color-cloud)]/70 transition-colors hover:text-[var(--color-prompt)]"
          >
            Investment Guide
          </Link>
          {isLoading ? (
            <div className="flex items-center gap-6">
              <div className="h-4 w-16 rounded bg-[var(--color-cloud)]/10 animate-pulse" />
              <div className="h-8 w-20 rounded bg-[var(--color-cloud)]/10 animate-pulse" />
            </div>
          ) : user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-[var(--color-prompt)] transition-colors hover:text-[var(--color-prompt)]/80"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="text-sm text-[var(--color-cloud)]/70 transition-colors hover:text-[var(--color-prompt)]"
              >
                Dashboard
              </Link>
              <Link
                href="/submit-review"
                className="text-sm text-[var(--color-cloud)]/70 transition-colors hover:text-[var(--color-prompt)]"
              >
                Submit Review
              </Link>
              <Link
                href="/account"
                className="text-sm text-[var(--color-cloud)]/70 transition-colors hover:text-[var(--color-prompt)]"
              >
                Account
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-[var(--color-cloud)]/70 transition-colors hover:text-[var(--color-prompt)]"
              >
                Sign Out
              </button>
              <CreditBalance balance={creditBalance} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-[var(--color-cloud)]/70 transition-colors hover:text-[var(--color-prompt)]"
              >
                Sign In
              </Link>
              <Button asChild size="sm" className="bg-[var(--color-prompt)] text-[var(--color-core)] hover:bg-[var(--color-prompt)]/90">
                <Link href="/signup">
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-cloud)] md:hidden"
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
        <nav className="border-t border-[var(--color-cloud)]/10 bg-[var(--color-core)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/builders"
              onClick={closeMobileMenu}
              className="rounded-lg px-3 py-3 text-[var(--color-cloud)]/70 transition-colors hover:bg-[var(--color-cloud)]/10 hover:text-[var(--color-prompt)]"
            >
              Browse Builders
            </Link>
            <Link
              href="/guide"
              onClick={closeMobileMenu}
              className="rounded-lg px-3 py-3 text-[var(--color-cloud)]/70 transition-colors hover:bg-[var(--color-cloud)]/10 hover:text-[var(--color-prompt)]"
            >
              Investment Guide
            </Link>
            {isLoading ? (
              <div className="px-3 py-3">
                <div className="h-4 w-32 rounded bg-[var(--color-cloud)]/10 animate-pulse" />
              </div>
            ) : user ? (
              <>
                {isAdmin && (
                  <>
                    <Link
                      href="/admin"
                      onClick={closeMobileMenu}
                      className="rounded-lg px-3 py-3 font-medium text-[var(--color-prompt)] transition-colors hover:bg-[var(--color-cloud)]/10"
                    >
                      Admin
                    </Link>
                    <div className="my-2 h-px bg-[var(--color-cloud)]/10" />
                  </>
                )}
                <div className="px-3 py-2">
                  <CreditBalance balance={creditBalance} showBuyLink={false} />
                </div>
                <Link
                  href="/buy-credits"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-3 text-sm text-[var(--color-prompt)] transition-colors hover:bg-[var(--color-cloud)]/10"
                >
                  Buy credits
                </Link>
                <div className="my-2 h-px bg-[var(--color-cloud)]/10" />
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-3 text-[var(--color-cloud)]/70 transition-colors hover:bg-[var(--color-cloud)]/10 hover:text-[var(--color-prompt)]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/submit-review"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-3 text-[var(--color-cloud)]/70 transition-colors hover:bg-[var(--color-cloud)]/10 hover:text-[var(--color-prompt)]"
                >
                  Submit Review
                </Link>
                <Link
                  href="/account"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-3 text-[var(--color-cloud)]/70 transition-colors hover:bg-[var(--color-cloud)]/10 hover:text-[var(--color-prompt)]"
                >
                  Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="rounded-lg px-3 py-3 text-left text-[var(--color-cloud)]/70 transition-colors hover:bg-[var(--color-cloud)]/10 hover:text-[var(--color-prompt)]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="my-2 h-px bg-[var(--color-cloud)]/10" />
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-3 text-[var(--color-cloud)]/70 transition-colors hover:bg-[var(--color-cloud)]/10 hover:text-[var(--color-prompt)]"
                >
                  Sign In
                </Link>
                <Button asChild className="mt-2 bg-[var(--color-prompt)] text-[var(--color-core)] hover:bg-[var(--color-prompt)]/90">
                  <Link href="/signup" onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
