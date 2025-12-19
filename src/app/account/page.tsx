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
  CalendarIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronRightIcon,
  KeyIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Please enter your current password' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setPasswordUpdating(true);

    try {
      const supabase = createClient();

      // First verify the current password by re-authenticating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        setPasswordMessage({ type: 'error', text: 'Current password is incorrect' });
        setPasswordUpdating(false);
        return;
      }

      // Now update to the new password
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setPasswordMessage({ type: 'error', text: error.message });
      } else {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Failed to update password' });
    }

    setPasswordUpdating(false);
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

        {/* Change Password */}
        <Card className="mb-6 border-0 shadow-md">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <KeyIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-medium text-foreground">
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="h-11"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-foreground">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="h-11"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="h-11"
                />
              </div>

              {passwordMessage && (
                <div className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                  passwordMessage.type === 'success'
                    ? 'bg-[var(--status-recommended)]/10 text-[var(--status-recommended)]'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {passwordMessage.type === 'success' ? (
                    <CheckCircleIcon className="h-4 w-4" />
                  ) : (
                    <AlertCircleIcon className="h-4 w-4" />
                  )}
                  {passwordMessage.text}
                </div>
              )}

              <Button
                type="submit"
                disabled={passwordUpdating || !currentPassword || !newPassword || !confirmPassword}
                className="w-full sm:w-auto"
              >
                {passwordUpdating ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
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
