'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SearchIcon,
  CrownIcon,
  BookOpenIcon,
  GiftIcon,
  CheckIcon,
  Loader2Icon,
  UserIcon,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
  membership_tier: string | null;
  has_free_guide_access: boolean;
  credit_balance: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const grantAccess = async (userId: string, type: 'guide' | 'investor') => {
    setActionLoading(`${userId}-${type}`);
    try {
      const res = await fetch('/api/admin/users/grant-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to grant access:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-medium text-foreground sm:text-3xl">Users</h1>
        <p className="mt-2 text-muted-foreground">Manage users and grant access.</p>

        {/* Search */}
        <div className="relative mt-6">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users List */}
        <div className="mt-6 space-y-3">
          {filteredUsers.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="border-0">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{user.email || 'No email'}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {user.membership_tier && user.membership_tier !== 'free' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-energy)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-energy)]">
                              <CrownIcon className="h-3 w-3" />
                              {user.membership_tier}
                            </span>
                          )}
                          {user.has_free_guide_access && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--status-recommended)]/10 px-2 py-0.5 text-xs font-medium text-[var(--status-recommended)]">
                              <GiftIcon className="h-3 w-3" />
                              Free Guide
                            </span>
                          )}
                          {user.credit_balance > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                              {user.credit_balance} credits
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => grantAccess(user.id, 'guide')}
                        disabled={actionLoading !== null || user.has_free_guide_access}
                      >
                        {actionLoading === `${user.id}-guide` ? (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        ) : user.has_free_guide_access ? (
                          <>
                            <CheckIcon className="mr-1.5 h-3.5 w-3.5" />
                            Has Guide
                          </>
                        ) : (
                          <>
                            <BookOpenIcon className="mr-1.5 h-3.5 w-3.5" />
                            Grant Guide
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => grantAccess(user.id, 'investor')}
                        disabled={actionLoading !== null || user.membership_tier === 'investor'}
                        className={user.membership_tier === 'investor' ? '' : 'border-[var(--color-energy)] text-[var(--color-energy)]'}
                      >
                        {actionLoading === `${user.id}-investor` ? (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        ) : user.membership_tier === 'investor' ? (
                          <>
                            <CheckIcon className="mr-1.5 h-3.5 w-3.5" />
                            Investor
                          </>
                        ) : (
                          <>
                            <CrownIcon className="mr-1.5 h-3.5 w-3.5" />
                            Grant Investor
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
