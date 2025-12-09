import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-medium text-foreground">
                Admin Dashboard
              </Link>
              <Link
                href="/admin/reviews"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Reviews
              </Link>
              <Link
                href="/admin/builders"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Builders
              </Link>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Exit Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main>{children}</main>
    </div>
  );
}
