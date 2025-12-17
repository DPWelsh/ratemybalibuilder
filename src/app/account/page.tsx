'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Loader2Icon,
  UserIcon,
  MailIcon,
  ShieldCheckIcon,
  CoinsIcon,
  CalendarIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronRightIcon,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Profile {
  credit_balance: number;
  is_admin: boolean;
  created_at: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('credit_balance, is_admin, created_at')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      setIsLoading(false);
    }

    getUser();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
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
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl text-foreground sm:text-3xl">Account Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Info Card */}
        <Card className="mb-6 border-0 shadow-md">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-prompt)]/10">
                <UserIcon className="h-8 w-8 text-[var(--color-prompt)]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-foreground">
                  {user?.email?.split('@')[0] || 'User'}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MailIcon className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
              {profile?.is_admin && (
                <div className="flex items-center gap-2 rounded-full bg-[var(--color-prompt)]/10 px-3 py-1.5 text-sm font-medium text-[var(--color-prompt)]">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Admin
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="mb-6 border-0 shadow-md">
          <CardContent className="divide-y divide-border p-0">
            {/* Credits */}
            <div className="flex items-center justify-between p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--status-recommended)]/10">
                  <CoinsIcon className="h-5 w-5 text-[var(--status-recommended)]" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Credit Balance</p>
                  <p className="text-sm text-muted-foreground">Use credits to unlock builder details</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-foreground">{profile?.credit_balance || 0}</p>
                <Link href="/buy-credits" className="text-sm text-[var(--color-prompt)] hover:underline">
                  Buy more
                </Link>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-center justify-between p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Member Since</p>
                  <p className="text-sm text-muted-foreground">Account creation date</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Unknown'}
              </p>
            </div>

            {/* Admin Status */}
            <div className="flex items-center justify-between p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  profile?.is_admin ? 'bg-[var(--color-prompt)]/10' : 'bg-secondary'
                }`}>
                  <ShieldCheckIcon className={`h-5 w-5 ${
                    profile?.is_admin ? 'text-[var(--color-prompt)]' : 'text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-foreground">Account Type</p>
                  <p className="text-sm text-muted-foreground">Your permission level</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                profile?.is_admin
                  ? 'bg-[var(--color-prompt)]/10 text-[var(--color-prompt)]'
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {profile?.is_admin ? 'Administrator' : 'Standard User'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="mb-6 border-0 shadow-md">
          <CardContent className="divide-y divide-border p-0">
            <Link
              href="/dashboard"
              className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/50 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <SettingsIcon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Dashboard</span>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
            </Link>

            {profile?.is_admin && (
              <Link
                href="/admin"
                className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/50 sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-[var(--color-prompt)]" />
                  <span className="font-medium text-[var(--color-prompt)]">Admin Panel</span>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
