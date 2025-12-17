'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboardIcon,
  SearchIcon,
  PlusCircleIcon,
  StarIcon,
  SettingsIcon,
  LogOutIcon,
  UsersIcon,
  ShieldIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

interface SidebarProps {
  isAdmin: boolean;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { href: '/builders', label: 'Browse Builders', icon: UsersIcon },
  { href: '/', label: 'Search', icon: SearchIcon },
  { href: '/submit-review', label: 'Submit Review', icon: StarIcon },
  { href: '/add-builder', label: 'Add Builder', icon: PlusCircleIcon },
];

const adminItems = [
  { href: '/admin', label: 'Admin Dashboard', icon: ShieldIcon },
  { href: '/admin/reviews', label: 'Pending Reviews', icon: StarIcon },
  { href: '/admin/builders', label: 'Manage Builders', icon: UsersIcon },
];

export function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <Image src="/icon.svg" alt="Logo" width={28} height={28} className="h-7 w-7" />
        <span className="font-['Raptor'] text-lg text-foreground">RateMyBali</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="my-4 border-t border-border" />
            <p className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">
              Admin
            </p>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? 'bg-[var(--color-prompt)] text-[var(--color-core)]'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-border p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOutIcon className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <Image src="/icon.svg" alt="Logo" width={24} height={24} className="h-6 w-6" />
          <span className="font-['Raptor'] text-base text-foreground">RateMyBali</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-secondary"
        >
          {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-background transition-transform lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 flex-col border-r border-border bg-background lg:flex">
        <NavContent />
      </aside>
    </>
  );
}
