'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  SearchIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  HistoryIcon,
  Loader2Icon,
  HeartIcon,
  XIcon,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { getBuilderById, Builder } from '@/lib/dummy-data';
import { getSavedBuilders } from '@/components/SaveBuilderButton';
import { PRICING, formatPrice } from '@/lib/pricing';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [creditBalance, setCreditBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState('');
  const [savedBuilders, setSavedBuilders] = useState<Builder[]>([]);
  const router = useRouter();

  // Load saved builders from localStorage
  useEffect(() => {
    const savedIds = getSavedBuilders();
    const builders = savedIds
      .map((id) => getBuilderById(id))
      .filter((b): b is Builder => b !== undefined);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedBuilders(builders);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('credit_balance')
        .eq('id', user.id)
        .single();

      if (profile) {
        setCreditBalance(profile.credit_balance);
      }

      setIsLoading(false);
    }

    getUser();
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone) return;

    const params = new URLSearchParams();
    params.set('phone', searchPhone);
    router.push(`/search?${params.toString()}`);
  };

  const handleRemoveSavedBuilder = (builderId: string) => {
    // Remove from localStorage
    const saved = getSavedBuilders().filter((id) => id !== builderId);
    localStorage.setItem('savedBuilders', JSON.stringify(saved));
    // Update state
    setSavedBuilders((prev) => prev.filter((b) => b.id !== builderId));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center sm:min-h-[calc(100vh-73px)]">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-6 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl text-foreground sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
          </p>
        </div>

        {/* Credit Balance Card */}
        <Card className="mb-6 border-0 shadow-md sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Credits</p>
                <p className="mt-1 text-3xl font-medium text-foreground">${creditBalance}</p>
              </div>
              <Button asChild>
                <Link href="/buy-credits">
                  Buy Credits
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {formatPrice(PRICING.search)} per search, {formatPrice(PRICING.unlock)} to unlock full details. Earn {formatPrice(PRICING.reviewCredit)} for each approved review.
            </p>
          </CardContent>
        </Card>

        {/* Quick Search */}
        <Card className="mb-6 border-0 shadow-md sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-medium text-foreground">Search a Builder</h2>
            </div>
            <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone / WhatsApp
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="+62 812 XXX XXXX"
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full sm:w-auto"
                disabled={!searchPhone}
              >
                Search Builder
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-prompt)]/10">
                  <PlusCircleIcon className="h-5 w-5 text-[var(--color-prompt)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Submit a Review</h3>
                  <p className="text-sm text-muted-foreground">Earn {formatPrice(PRICING.reviewCredit)} credits</p>
                </div>
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/submit-review">
                  Submit Review
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <HistoryIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Search History</h3>
                  <p className="text-sm text-muted-foreground">View past searches</p>
                </div>
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/account">
                  View History
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* My Saved Builders */}
        {savedBuilders.length > 0 && (
          <Card className="mt-6 border-0 shadow-md sm:mt-8">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <HeartIcon className="h-5 w-5 text-[var(--color-energy)]" />
                <h2 className="font-medium text-foreground">
                  My Saved Builders ({savedBuilders.length})
                </h2>
              </div>
              <div className="space-y-3">
                {savedBuilders.map((builder) => (
                  <div
                    key={builder.id}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{builder.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {builder.location} · {builder.tradeType}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/builder/${builder.id}`}>View</Link>
                      </Button>
                      <button
                        onClick={() => handleRemoveSavedBuilder(builder.id)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Remove from saved"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
