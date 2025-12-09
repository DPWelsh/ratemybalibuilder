'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, RowClickedEvent, ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { StarRating } from '@/components/StarRating';
import { FilterBar } from '@/components/FilterBar';
import { getBuilders, getBuilderStats, BuilderWithStats, BuilderStatus, Location, TradeType } from '@/lib/supabase/builders';
import { PRICING, formatPrice } from '@/lib/pricing';
import { UsersIcon, Loader2Icon } from 'lucide-react';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface BuilderRow {
  id: string;
  name: string;
  phone: string;
  status: BuilderStatus;
  location: Location;
  tradeType: TradeType;
  avgRating: number;
  reviewCount: number;
}

// Custom cell renderer for status badge
function StatusCellRenderer(params: ICellRendererParams<BuilderRow>) {
  if (!params.value) return null;
  return <StatusBadge status={params.value as BuilderStatus} size="sm" />;
}

// Custom cell renderer for star rating
function RatingCellRenderer(params: ICellRendererParams<BuilderRow>) {
  const rating = params.value as number;
  if (!rating || rating === 0) return <span className="text-muted-foreground">No ratings</span>;
  return (
    <div className="flex items-center gap-1.5">
      <StarRating rating={rating} size="sm" />
      <span className="text-sm">{rating.toFixed(1)}</span>
    </div>
  );
}

// Custom cell renderer for blurred phone number
function PhoneCellRenderer(params: ICellRendererParams<BuilderRow>) {
  const phone = params.value as string;
  if (!phone) return <span className="text-muted-foreground">-</span>;
  // Show first few digits, blur the rest
  const visible = phone.slice(0, 6);
  return (
    <span className="font-mono text-sm">
      {visible}<span className="text-muted-foreground/50 blur-[3px] select-none">••••••</span>
    </span>
  );
}

export default function BuildersPage() {
  const router = useRouter();

  // Data state
  const [builders, setBuilders] = useState<BuilderWithStats[]>([]);
  const [stats, setStats] = useState({ total: 0, recommended: 0, blacklisted: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [selectedLocation, setSelectedLocation] = useState<Location | 'all'>('all');
  const [selectedTradeType, setSelectedTradeType] = useState<TradeType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<BuilderStatus | 'all'>('all');

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [buildersData, statsData] = await Promise.all([
        getBuilders(),
        getBuilderStats(),
      ]);
      setBuilders(buildersData);
      setStats(statsData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const clearFilters = () => {
    setSelectedLocation('all');
    setSelectedTradeType('all');
    setSelectedStatus('all');
  };

  // Prepare and filter row data
  const rowData = useMemo<BuilderRow[]>(() => {
    return builders
      .filter((builder) => {
        const locationMatch = selectedLocation === 'all' || builder.location === selectedLocation;
        const tradeMatch = selectedTradeType === 'all' || builder.trade_type === selectedTradeType;
        const statusMatch = selectedStatus === 'all' || builder.status === selectedStatus;
        return locationMatch && tradeMatch && statusMatch;
      })
      .map((builder) => ({
        id: builder.id,
        name: builder.name,
        phone: builder.phone || '',
        status: builder.status,
        location: builder.location,
        tradeType: builder.trade_type,
        avgRating: builder.avg_rating,
        reviewCount: builder.review_count,
      }));
  }, [builders, selectedLocation, selectedTradeType, selectedStatus]);

  // Column definitions
  const columnDefs = useMemo<ColDef<BuilderRow>[]>(() => [
    {
      field: 'name',
      headerName: 'Builder Name',
      flex: 2,
      minWidth: 150,
      cellClass: 'font-medium',
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 160,
      cellRenderer: PhoneCellRenderer,
      sortable: false,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 120,
      sortable: true,
    },
    {
      field: 'tradeType',
      headerName: 'Trade',
      width: 160,
      sortable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      cellRenderer: StatusCellRenderer,
      sortable: true,
    },
    {
      field: 'avgRating',
      headerName: 'Rating',
      width: 140,
      cellRenderer: RatingCellRenderer,
      sortable: true,
    },
    {
      field: 'reviewCount',
      headerName: 'Reviews',
      width: 100,
      sortable: true,
    },
  ], []);

  // Default column settings
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    cellStyle: { display: 'flex', alignItems: 'center' },
  }), []);

  // Handle row click
  const onRowClicked = useCallback((event: RowClickedEvent<BuilderRow>) => {
    if (event.data) {
      router.push(`/builder/${event.data.id}`);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-6 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl text-foreground sm:text-3xl">Builder Database</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Browse all builders in our database. Click on any row to see more details.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3 sm:mb-8 sm:gap-4">
          <Card className="border-0 bg-secondary/50">
            <CardContent className="px-4 py-3 text-center sm:p-4">
              <p className="text-2xl font-medium text-foreground sm:text-3xl">{stats.total}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Total Builders</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-[var(--status-recommended)]/10">
            <CardContent className="px-4 py-3 text-center sm:p-4">
              <p className="text-2xl font-medium text-[var(--status-recommended)] sm:text-3xl">{stats.recommended}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Recommended</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-[var(--status-blacklisted)]/10">
            <CardContent className="px-4 py-3 text-center sm:p-4">
              <p className="text-2xl font-medium text-[var(--status-blacklisted)] sm:text-3xl">{stats.blacklisted}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Blacklisted</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <FilterBar
          selectedLocation={selectedLocation}
          selectedTradeType={selectedTradeType}
          selectedStatus={selectedStatus}
          onLocationChange={setSelectedLocation}
          onTradeTypeChange={setSelectedTradeType}
          onStatusChange={setSelectedStatus}
          onClear={clearFilters}
        />

        {/* AG Grid */}
        <div
          className="rounded-lg overflow-hidden shadow-md"
          style={{
            height: 'calc(100vh - 450px)',
            minHeight: '400px',
          }}
        >
          <AgGridReact<BuilderRow>
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onRowClicked={onRowClicked}
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
              rowHeight: 52,
              headerHeight: 48,
            })}
            rowSelection="single"
            animateRows={true}
            pagination={false}
            domLayout="normal"
            suppressCellFocus={true}
            rowClass="cursor-pointer"
          />
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">
          Click on any builder to view their profile and unlock full details
        </p>

        {/* CTA */}
        <Card className="mt-8 border-0 bg-secondary/50">
          <CardContent className="p-5 text-center sm:p-6">
            <UsersIcon className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-3 font-medium text-foreground">Know a builder not listed?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Submit a review and earn {formatPrice(PRICING.reviewCredit)} in credits
            </p>
            <Button asChild className="mt-4">
              <Link href="/submit-review">Submit a Review</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
