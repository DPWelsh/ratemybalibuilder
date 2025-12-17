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
  UnlockIcon,
  WrenchIcon,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { PRICING, formatPrice } from '@/lib/pricing';
import { StatusBadge } from '@/components/StatusBadge';
import { BuilderStatus, tradeTypes } from '@/lib/supabase/builders';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UnlockedBuilder {
  id: string;
  name: string;
  company_name: string | null;
  status: BuilderStatus;
  location: string;
  trade_type: string;
  unlocked_at: string;
}

interface SavedBuilder {
  id: string;
  name: string;
  company_name: string | null;
  status: BuilderStatus;
  location: string;
  trade_type: string;
  saved_at: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [creditBalance, setCreditBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeType, setTradeType] = useState<string>('');
  const [savedBuilders, setSavedBuilders] = useState<SavedBuilder[]>([]);
  const [unlockedBuilders, setUnlockedBuilders] = useState<UnlockedBuilder[]>([]);
  const router = useRouter();

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

      // Fetch unlocked builders
      const { data: searches } = await supabase
        .from('searches')
        .select(`
          created_at,
          builders (
            id,
            name,
            company_name,
            status,
            location,
            trade_type
          )
        `)
        .eq('user_id', user.id)
        .eq('level', 'full')
        .order('created_at', { ascending: false });

      if (searches) {
        const unlocked = searches
          .filter((s) => s.builders)
          .map((s) => ({
            ...(s.builders as unknown as Omit<UnlockedBuilder, 'unlocked_at'>),
            unlocked_at: s.created_at,
          }));
        setUnlockedBuilders(unlocked);
      }

      // Fetch saved builders
      const { data: savedData } = await supabase
        .from('saved_builders')
        .select(`
          created_at,
          builders (
            id,
            name,
            company_name,
            status,
            location,
            trade_type
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (savedData) {
        const saved = savedData
          .filter((s) => s.builders)
          .map((s) => ({
            ...(s.builders as unknown as Omit<SavedBuilder, 'saved_at'>),
            saved_at: s.created_at,
          }));
        setSavedBuilders(saved);
      }

      setIsLoading(false);
    }

    getUser();
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Determine if input looks like a phone number (mostly digits)
    const digitsOnly = searchQuery.replace(/[^\d]/g, '');
    const isPhone = digitsOnly.length >= 6;

    const params = new URLSearchParams();
    if (isPhone) {
      params.set('phone', searchQuery);
    } else {
      params.set('name', searchQuery);
    }
    if (tradeType && tradeType !== 'any') params.set('trade', tradeType);
    router.push(`/search?${params.toString()}`);
  };

  const handleRemoveSavedBuilder = async (builderId: string) => {
    if (!user) return;

    const supabase = createClient();
    await supabase
      .from('saved_builders')
      .delete()
      .eq('user_id', user.id)
      .eq('builder_id', builderId);

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

        {/* Quick Search */}
        <Card className="mb-6 border-0 shadow-md sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-medium text-foreground">Search a Builder</h2>
            </div>
            <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name or phone..."
                    className="h-11 pl-10"
                  />
                </div>
                <Select value={tradeType} onValueChange={setTradeType}>
                  <SelectTrigger className="h-11 w-full sm:w-[160px]">
                    <WrenchIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    <SelectValue placeholder="Select trade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any trade</SelectItem>
                    {tradeTypes.map((trade) => (
                      <SelectItem key={trade} value={trade}>
                        {trade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="h-11 w-full sm:w-auto"
                disabled={!searchQuery.trim()}
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
                  <p className="text-sm text-muted-foreground">Help others find good builders</p>
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

        {/* Unlocked Builders */}
        {unlockedBuilders.length > 0 && (
          <Card className="mt-6 border-0 shadow-md sm:mt-8">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <UnlockIcon className="h-5 w-5 text-[var(--status-recommended)]" />
                <h2 className="font-medium text-foreground">
                  Unlocked Builders ({unlockedBuilders.length})
                </h2>
              </div>
              <div className="space-y-3">
                {unlockedBuilders.map((builder) => (
                  <div
                    key={builder.id}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">{builder.name}</p>
                        <StatusBadge status={builder.status} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {builder.location} · {builder.trade_type}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Unlocked {new Date(builder.unlocked_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="ml-2 shrink-0">
                      <Link href={`/builder/${builder.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">{builder.name}</p>
                        <StatusBadge status={builder.status} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {builder.location} · {builder.trade_type}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Saved {new Date(builder.saved_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2 shrink-0">
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
