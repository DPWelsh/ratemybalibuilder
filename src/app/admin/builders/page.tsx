'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2Icon,
  RefreshCwIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
  Trash2Icon,
  PencilIcon,
} from 'lucide-react';
import { formatPhone } from '@/lib/utils';

ModuleRegistry.registerModules([AllCommunityModule]);

interface Builder {
  id: string;
  name: string;
  phone: string;
  company_name: string | null;
  status: 'recommended' | 'unknown' | 'blacklisted';
  location: string;
  trade_type: string;
  website: string | null;
  created_at: string;
  is_published: boolean;
  submitted_by_email: string | null;
}

interface BuilderRow {
  id: string;
  name: string;
  phone: string;
  location: string;
  trade_type: string;
  status: string;
  is_published: boolean;
  submitted_by: string;
}

// Status cell renderer
function StatusCellRenderer(params: ICellRendererParams<BuilderRow>) {
  const status = params.value as string;
  const colors: Record<string, string> = {
    recommended: 'bg-[var(--status-recommended)]/10 text-[var(--status-recommended)]',
    unknown: 'bg-secondary text-muted-foreground',
    blacklisted: 'bg-[var(--status-blacklisted)]/10 text-[var(--status-blacklisted)]',
  };
  const labels: Record<string, string> = {
    recommended: 'Recommended',
    unknown: 'Neutral',
    blacklisted: 'Flagged',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || ''}`}>
      {labels[status] || status}
    </span>
  );
}

// Published cell renderer
function PublishedCellRenderer(params: ICellRendererParams<BuilderRow>) {
  const isPublished = params.value as boolean;
  if (isPublished) {
    return <CheckIcon className="h-4 w-4 text-[var(--status-recommended)]" />;
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
      Pending
    </span>
  );
}

export default function AdminBuildersPage() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBuilders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/builders');
      const data = await res.json();
      if (data.builders) {
        setBuilders(data.builders);
      }
    } catch (error) {
      console.error('Failed to fetch builders:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void fetchBuilders();
  }, []);

  const updateStatus = async (builderId: string, newStatus: 'recommended' | 'unknown' | 'blacklisted') => {
    setActionLoading(builderId);
    const supabase = createClient();

    const { error } = await supabase
      .from('builders')
      .update({ status: newStatus })
      .eq('id', builderId);

    if (!error) {
      setBuilders(builders.map(b =>
        b.id === builderId ? { ...b, status: newStatus } : b
      ));
    }
    setActionLoading(null);
  };

  const togglePublished = async (builderId: string, isPublished: boolean) => {
    setActionLoading(builderId);
    const supabase = createClient();

    const { error } = await supabase
      .from('builders')
      .update({ is_published: !isPublished })
      .eq('id', builderId);

    if (!error) {
      setBuilders(builders.map(b =>
        b.id === builderId ? { ...b, is_published: !isPublished } : b
      ));
    }
    setActionLoading(null);
  };

  const deleteBuilder = async (builderId: string, builderName: string) => {
    if (!confirm(`Delete "${builderName}"? This cannot be undone.`)) return;

    setActionLoading(builderId);
    const supabase = createClient();

    await supabase.from('reviews').delete().eq('builder_id', builderId);
    const { error } = await supabase.from('builders').delete().eq('id', builderId);

    if (!error) {
      setBuilders(builders.filter(b => b.id !== builderId));
    }
    setActionLoading(null);
  };

  // Actions cell renderer
  const ActionsCellRenderer = useCallback((params: ICellRendererParams<BuilderRow>) => {
    if (!params.data) return null;
    const { id, name, status, is_published } = params.data;
    const isLoading = actionLoading === id;

    return (
      <div className="flex items-center gap-1.5">
        {/* Publish/Unpublish - most important action */}
        <Button
          size="sm"
          variant={is_published ? 'outline' : 'default'}
          onClick={() => togglePublished(id, is_published)}
          disabled={isLoading}
          className={`h-7 text-xs px-2.5 ${!is_published ? 'bg-[var(--status-recommended)] hover:bg-[var(--status-recommended)]/90' : ''}`}
        >
          {isLoading ? (
            <Loader2Icon className="h-3 w-3 animate-spin" />
          ) : is_published ? (
            'Unpublish'
          ) : (
            <>
              <CheckIcon className="h-3 w-3 mr-1" />
              Publish
            </>
          )}
        </Button>
        {/* Status dropdown-style buttons */}
        <div className="flex items-center border rounded-md overflow-hidden">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => updateStatus(id, 'recommended')}
            disabled={isLoading}
            className={`h-7 text-xs px-2 rounded-none border-r ${status === 'recommended' ? 'bg-[var(--status-recommended)]/20 text-[var(--status-recommended)]' : ''}`}
            title="Recommended"
          >
            Rec
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => updateStatus(id, 'unknown')}
            disabled={isLoading}
            className={`h-7 text-xs px-2 rounded-none border-r ${status === 'unknown' ? 'bg-secondary' : ''}`}
            title="Neutral"
          >
            Neu
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => updateStatus(id, 'blacklisted')}
            disabled={isLoading}
            className={`h-7 text-xs px-2 rounded-none ${status === 'blacklisted' ? 'bg-[var(--status-blacklisted)]/20 text-[var(--status-blacklisted)]' : ''}`}
            title="Flagged"
          >
            Flag
          </Button>
        </div>
        {/* Delete */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => deleteBuilder(id, name)}
          disabled={isLoading}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2Icon className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }, [actionLoading, builders]);

  const pendingCount = builders.filter(b => !b.is_published).length;
  const publishedCount = builders.filter(b => b.is_published).length;

  const rowData = useMemo<BuilderRow[]>(() => {
    return builders
      .filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.phone.includes(search) ||
        b.location.toLowerCase().includes(search.toLowerCase()) ||
        b.trade_type.toLowerCase().includes(search.toLowerCase()) ||
        (b.submitted_by_email?.toLowerCase().includes(search.toLowerCase()))
      )
      .map((b) => ({
        id: b.id,
        name: b.name,
        phone: formatPhone(b.phone),
        location: b.location,
        trade_type: b.trade_type,
        status: b.status,
        is_published: b.is_published,
        submitted_by: b.submitted_by_email || '-',
      }));
  }, [builders, search]);

  const columnDefs = useMemo<ColDef<BuilderRow>[]>(() => [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 160,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 110,
    },
    {
      field: 'trade_type',
      headerName: 'Trade',
      width: 130,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 115,
      cellRenderer: StatusCellRenderer,
    },
    {
      field: 'is_published',
      headerName: 'Published',
      width: 95,
      cellRenderer: PublishedCellRenderer,
    },
    {
      field: 'submitted_by',
      headerName: 'Submitted By',
      width: 180,
      cellRenderer: (params: ICellRendererParams<BuilderRow>) => {
        const email = params.value as string;
        if (email === '-') return <span className="text-muted-foreground">-</span>;
        // Show just the part before @ to save space
        const shortEmail = email.split('@')[0];
        return <span className="text-xs" title={email}>{shortEmail}</span>;
      },
    },
    {
      headerName: 'Actions',
      width: 260,
      sortable: false,
      cellRenderer: ActionsCellRenderer,
    },
  ], [ActionsCellRenderer]);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    cellStyle: { display: 'flex', alignItems: 'center' },
  }), []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Manage Builders</h1>
            <p className="mt-1 text-muted-foreground">
              {publishedCount} published, {pendingCount} pending
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchBuilders}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="mt-6 relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, location, or trade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* AG Grid */}
        <div
          className="mt-6 rounded-lg overflow-hidden shadow-md"
          style={{
            height: 'calc(100vh - 280px)',
            minHeight: '400px',
          }}
        >
          <AgGridReact<BuilderRow>
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
            getRowStyle={(params) => {
              if (!params.data?.is_published) {
                return { backgroundColor: 'rgba(245, 158, 11, 0.05)' };
              }
              return undefined;
            }}
          />
        </div>
      </div>
    </div>
  );
}
