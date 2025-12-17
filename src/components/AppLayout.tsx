'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { User } from '@supabase/supabase-js';

// Pages that should always show the landing header (no sidebar)
const publicPages = ['/', '/login', '/signup', '/about', '/contact', '/privacy', '/terms'];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (profile) {
          setIsAdmin(profile.is_admin || false);
        }
      }
      setIsLoading(false);
    }

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Determine if we should show sidebar
  const isPublicPage = publicPages.includes(pathname);
  const showSidebar = !isLoading && user && !isPublicPage;

  // Show loading state briefly
  if (isLoading) {
    return (
      <>
        <Header />
        <main>{children}</main>
      </>
    );
  }

  // Public pages or not logged in: show header
  if (!showSidebar) {
    return (
      <>
        <Header />
        <main>{children}</main>
      </>
    );
  }

  // Logged in on app pages: show sidebar
  return (
    <div className="min-h-screen bg-background">
      <Sidebar isAdmin={isAdmin} />
      {/* Main content area with left margin for sidebar */}
      <main className="pt-14 lg:ml-64 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
