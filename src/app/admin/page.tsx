import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  ClipboardListIcon,
  UsersIcon,
  CreditCardIcon,
  AlertCircleIcon,
  CrownIcon,
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get stats
  const [
    { count: pendingReviews },
    { count: totalBuilders },
    { count: totalUsers },
    { data: recentTransactions },
  ] = await Promise.all([
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('builders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const stats = [
    {
      label: 'Pending Reviews',
      value: pendingReviews || 0,
      icon: ClipboardListIcon,
      href: '/admin/reviews',
      urgent: (pendingReviews || 0) > 0,
    },
    {
      label: 'Total Builders',
      value: totalBuilders || 0,
      icon: UsersIcon,
      href: '/admin/builders',
    },
    {
      label: 'Total Users',
      value: totalUsers || 0,
      icon: UsersIcon,
      href: '/admin/users',
    },
    {
      label: 'Recent Transactions',
      value: recentTransactions?.length || 0,
      icon: CreditCardIcon,
      href: '#',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-medium text-foreground sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage reviews, builders, and users.</p>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className={`border-0 transition-shadow hover:shadow-lg ${stat.urgent ? 'ring-2 ring-[var(--status-blacklisted)]' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                    {stat.urgent && (
                      <AlertCircleIcon className="h-5 w-5 text-[var(--status-blacklisted)]" />
                    )}
                  </div>
                  <p className="mt-4 text-3xl font-medium text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-foreground">Quick Actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/reviews">
              <Card className="border-0 transition-shadow hover:shadow-lg">
                <CardContent className="p-5">
                  <ClipboardListIcon className="h-6 w-6 text-muted-foreground" />
                  <h3 className="mt-3 font-medium text-foreground">Review Pending Reviews</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Approve or reject submitted reviews
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/builders">
              <Card className="border-0 transition-shadow hover:shadow-lg">
                <CardContent className="p-5">
                  <UsersIcon className="h-6 w-6 text-muted-foreground" />
                  <h3 className="mt-3 font-medium text-foreground">Manage Builders</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add, edit, or update builder status
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/users">
              <Card className="border-0 transition-shadow hover:shadow-lg">
                <CardContent className="p-5">
                  <CrownIcon className="h-6 w-6 text-muted-foreground" />
                  <h3 className="mt-3 font-medium text-foreground">Manage Users & Access</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Grant guide or investor access to users
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        {recentTransactions && recentTransactions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-foreground">Recent Transactions</h2>
            <Card className="mt-4 border-0">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="font-medium text-foreground">{tx.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className={`font-medium ${tx.amount > 0 ? 'text-[var(--status-recommended)]' : 'text-foreground'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount} credits
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
