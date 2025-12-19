'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SearchIcon,
  CrownIcon,
  BookOpenIcon,
  CheckIcon,
  Loader2Icon,
} from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

interface User {
  id: string;
  email: string;
  created_at: string;
  membership_tier: string | null;
  has_free_guide_access: boolean;
  contributions: {
    builders: number;
    reviews: number;
    pending: number;
  };
}

interface UserRow {
  id: string;
  email: string;
  joined: string;
  builders: number;
  reviews: number;
  pending: number;
  hasGuide: boolean;
  isInvestor: boolean;
}

// Cell renderer for counts
function CountCellRenderer(params: ICellRendererParams<UserRow>) {
  const count = params.value as number;
  if (count === 0) return <span className="text-muted-foreground">-</span>;
  return <span className="font-medium">{count}</span>;
}

// Cell renderer for pending with amber color
function PendingCellRenderer(params: ICellRendererParams<UserRow>) {
  const pending = params.value as number;
  if (pending === 0) return <span className="text-muted-foreground">-</span>;
  return <span className="text-amber-500 font-medium">{pending}</span>;
}

// Cell renderer for guide access
function GuideAccessCellRenderer(params: ICellRendererParams<UserRow>) {
  const hasGuide = params.value as boolean;
  if (!hasGuide) return <span className="text-muted-foreground">-</span>;
  return (
    <span className="inline-flex items-center gap-1 text-[var(--status-recommended)]">
      <CheckIcon className="h-4 w-4" />
    </span>
  );
}

// Cell renderer for investor status
function InvestorCellRenderer(params: ICellRendererParams<UserRow>) {
  const isInvestor = params.value as boolean;
  if (!isInvestor) return <span className="text-muted-foreground">-</span>;
  return (
    <span className="inline-flex items-center gap-1 text-[var(--color-energy)]">
      <CrownIcon className="h-4 w-4" />
    </span>
  );
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

  // Actions cell renderer
  const ActionsCellRenderer = useCallback((params: ICellRendererParams<UserRow>) => {
    if (!params.data) return null;
    const { id, hasGuide, isInvestor } = params.data;

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => grantAccess(id, 'guide')}
          disabled={actionLoading !== null || hasGuide}
          className="h-7 text-xs"
        >
          {actionLoading === `${id}-guide` ? (
            <Loader2Icon className="h-3 w-3 animate-spin" />
          ) : hasGuide ? (
            <CheckIcon className="h-3 w-3" />
          ) : (
            <BookOpenIcon className="h-3 w-3" />
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => grantAccess(id, 'investor')}
          disabled={actionLoading !== null || isInvestor}
          className={`h-7 text-xs ${!isInvestor ? 'border-[var(--color-energy)] text-[var(--color-energy)]' : ''}`}
        >
          {actionLoading === `${id}-investor` ? (
            <Loader2Icon className="h-3 w-3 animate-spin" />
          ) : isInvestor ? (
            <CheckIcon className="h-3 w-3" />
          ) : (
            <CrownIcon className="h-3 w-3" />
          )}
        </Button>
      </div>
    );
  }, [actionLoading]);

  const rowData = useMemo<UserRow[]>(() => {
    return users
      .filter((u) =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toLowerCase().includes(search.toLowerCase())
      )
      .map((u) => ({
        id: u.id,
        email: u.email || 'No email',
        joined: new Date(u.created_at).toLocaleDateString(),
        builders: u.contributions.builders,
        reviews: u.contributions.reviews,
        pending: u.contributions.pending,
        hasGuide: u.has_free_guide_access,
        isInvestor: u.membership_tier === 'investor',
      }));
  }, [users, search]);

  const columnDefs = useMemo<ColDef<UserRow>[]>(() => [
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      minWidth: 220,
    },
    {
      field: 'joined',
      headerName: 'Joined',
      width: 110,
    },
    {
      field: 'builders',
      headerName: 'Builders',
      width: 100,
      cellRenderer: CountCellRenderer,
    },
    {
      field: 'reviews',
      headerName: 'Reviews',
      width: 100,
      cellRenderer: CountCellRenderer,
    },
    {
      field: 'pending',
      headerName: 'Pending',
      width: 100,
      cellRenderer: PendingCellRenderer,
    },
    {
      field: 'hasGuide',
      headerName: 'Guide',
      width: 80,
      cellRenderer: GuideAccessCellRenderer,
    },
    {
      field: 'isInvestor',
      headerName: 'Investor',
      width: 90,
      cellRenderer: InvestorCellRenderer,
    },
    {
      headerName: 'Actions',
      width: 120,
      sortable: false,
      cellRenderer: ActionsCellRenderer,
    },
  ], [ActionsCellRenderer]);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    cellStyle: { display: 'flex', alignItems: 'center' },
  }), []);

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
        <p className="mt-2 text-muted-foreground">
          {users.length} users registered. Grant guide or investor access below.
        </p>

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

        {/* AG Grid */}
        <div
          className="mt-6 rounded-lg overflow-hidden shadow-md"
          style={{
            height: 'calc(100vh - 300px)',
            minHeight: '400px',
          }}
        >
          <AgGridReact<UserRow>
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            theme={themeQuartz.withParams({
              backgroundColor: 'var(--card)',
              headerBackgroundColor: 'var(--secondary)',
              oddRowBackgroundColor: 'var(--background)',
              rowHoverColor: 'var(--secondary)',
              borderColor: 'var(--border)',
              headerTextColor: 'var(--foreground)',
              foregroundColor: 'var(--foreground)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 14,
              rowHeight: 48,
              headerHeight: 44,
            })}
            animateRows={true}
            pagination={false}
            domLayout="normal"
            suppressCellFocus={true}
          />
        </div>
      </div>
    </div>
  );
}
