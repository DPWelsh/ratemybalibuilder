'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  PlusCircleIcon,
  SettingsIcon,
  Loader2Icon,
  HeartIcon,
  XIcon,
  UserPlusIcon,
  GiftIcon,
  CheckCircleIcon,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { StatusBadge } from '@/components/StatusBadge';
import { BuilderStatus } from '@/lib/supabase/builders';
import { SearchForm } from '@/components/SearchForm';

interface AddedBuilder {
  id: string;
  name: string;
  company_name: string | null;
  status: BuilderStatus;
  location: string;
  trade_type: string;
  added_at: string;
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

interface Profile {
  has_free_guide_access: boolean;
  membership_tier: string | null;
  approved_builders_count: number;
  approved_reviews_count: number;
  pending_contributions_count: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedBuilders, setSavedBuilders] = useState<SavedBuilder[]>([]);
  const [addedBuilders, setAddedBuilders] = useState<AddedBuilder[]>([]);
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

      // Fetch profile with contribution counts
      const { data: profileData } = await supabase
        .from('profiles')
        .select('has_free_guide_access, membership_tier, approved_builders_count, approved_reviews_count, pending_contributions_count')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch builders added by this user
      const { data: addedData } = await supabase
        .from('builders')
        .select(`
          id,
          name,
          company_name,
          status,
          location,
          trade_type,
          created_at
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (addedData) {
        const added = addedData.map((b) => ({
          ...b,
          added_at: b.created_at,
        }));
        setAddedBuilders(added as AddedBuilder[]);
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

        {/* Contributions */}
        {profile && (
          <Card className={`mb-6 border-0 shadow-md sm:mb-8 overflow-hidden ${
            profile.has_free_guide_access || profile.membership_tier === 'investor'
              ? 'bg-gradient-to-br from-[var(--status-recommended)]/5 to-[var(--color-energy)]/5'
              : ''
          }`}>
            <CardContent className="p-4 sm:p-6">
              {profile.has_free_guide_access || profile.membership_tier === 'investor' ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--status-recommended)]/10">
                      <CheckCircleIcon className="h-5 w-5 text-[var(--status-recommended)]" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Guide Unlocked</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.approved_builders_count || 0} builders · {profile.approved_reviews_count || 0} reviews contributed
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href="/guide">Read Guide</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link href="/add-builder">Add Builder</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GiftIcon className="h-5 w-5 text-[var(--color-energy)]" />
                      <span className="font-medium">Earn Free Guide</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {(profile.approved_builders_count || 0) + (profile.approved_reviews_count || 0)}/5
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden mb-3">
                    <div
                      className="h-full bg-[var(--status-recommended)] transition-all"
                      style={{
                        width: `${Math.min(((profile.approved_builders_count || 0) + (profile.approved_reviews_count || 0)) / 5 * 100, 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Submit 5 builders or reviews to unlock.
                    {(profile.pending_contributions_count || 0) > 0 && (
                      <span className="text-amber-500"> ({profile.pending_contributions_count} pending)</span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link href="/add-builder">Add Builder</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link href="/submit-review">Add Review</Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Search */}
        <Card className="mb-6 border-0 shadow-md sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <SearchForm />
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
                  <SettingsIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Account Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your account</p>
                </div>
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/account">
                  View Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Builders You Added */}
        {addedBuilders.length > 0 && (
          <Card className="mt-6 border-0 shadow-md sm:mt-8">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <UserPlusIcon className="h-5 w-5 text-[var(--status-recommended)]" />
                <h2 className="font-medium text-foreground">
                  Builders You Added ({addedBuilders.length})
                </h2>
              </div>
              <div className="space-y-3">
                {addedBuilders.map((builder) => (
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
                        Added {new Date(builder.added_at).toLocaleDateString()}
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
