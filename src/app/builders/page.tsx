'use client';

import { useMemo, useCallback, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, RowClickedEvent, ModuleRegistry, AllCommunityModule, themeQuartz, IFilterParams, IDoesFilterPassParams } from 'ag-grid-community';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { StarRating } from '@/components/StarRating';
import { FilterBar } from '@/components/FilterBar';
import { getBuilders, getBuilderStats, BuilderWithStats, BuilderStatus, Location, TradeType, locations, tradeTypes } from '@/lib/supabase/builders';
import { UsersIcon, Loader2Icon, GlobeIcon, StarIcon, SearchIcon, ChevronDownIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Custom dropdown filter component for AG Grid
interface DropdownFilterProps extends IFilterParams<BuilderRow> {
  options: string[];
}

const DropdownFilter = forwardRef((props: DropdownFilterProps, ref) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    doesFilterPass(params: IDoesFilterPassParams<BuilderRow>) {
      if (!selectedValue) return true;
      const value = props.colDef.field ? params.data[props.colDef.field as keyof BuilderRow] : '';
      return value === selectedValue;
    },
    isFilterActive() {
      return selectedValue !== '';
    },
    getModel() {
      return selectedValue ? { value: selectedValue } : null;
    },
    setModel(model: { value: string } | null) {
      setSelectedValue(model?.value || '');
    },
  }));

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    props.filterChangedCallback();
  };

  const handleClear = () => {
    setSelectedValue('');
    setIsOpen(false);
    props.filterChangedCallback();
  };

  return (
    <div className="p-2 min-w-[160px]">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
        >
          <span className={selectedValue ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedValue || 'All'}
          </span>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[200px] overflow-auto rounded-md border bg-popover shadow-md">
            <button
              type="button"
              onClick={handleClear}
              className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent text-muted-foreground"
            >
              All
            </button>
            {props.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`flex w-full items-center px-3 py-2 text-sm hover:bg-accent ${
                  selectedValue === option ? 'bg-accent font-medium' : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
DropdownFilter.displayName = 'DropdownFilter';

interface BuilderRow {
  id: string;
  name: string;
  phone: string;
  website: string | null;
  googleReviews: string | null;
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

// Custom cell renderer for phone number (now free - show full)
function PhoneCellRenderer(params: ICellRendererParams<BuilderRow>) {
  const phone = params.value as string;
  if (!phone) return <span className="text-muted-foreground">-</span>;
  return <span className="font-mono text-sm">{phone}</span>;
}

// Custom cell renderer for website (now free - show link)
function WebsiteCellRenderer(params: ICellRendererParams<BuilderRow>) {
  const website = params.value as string | null;
  if (!website) return <span className="text-muted-foreground">-</span>;
  return (
    <a
      href={website.startsWith('http') ? website : `https://${website}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-[var(--color-prompt)] hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      <GlobeIcon className="h-3.5 w-3.5" />
      <span className="text-sm">Visit</span>
    </a>
  );
}

// Custom cell renderer for Google reviews (now free - show link)
function GoogleReviewsCellRenderer(params: ICellRendererParams<BuilderRow>) {
  const url = params.value as string | null;
  if (!url) return <span className="text-muted-foreground">-</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-[var(--color-prompt)] hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      <StarIcon className="h-3.5 w-3.5" />
      <span className="text-sm">Reviews</span>
    </a>
  );
}

export default function BuildersPage() {
  const router = useRouter();

  // Data state
  const [builders, setBuilders] = useState<BuilderWithStats[]>([]);
  const [stats, setStats] = useState({ total: 0, recommended: 0, blacklisted: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
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
    setSearchQuery('');
    setSelectedLocation('all');
    setSelectedTradeType('all');
    setSelectedStatus('all');
  };

  // Prepare and filter row data
  const rowData = useMemo<BuilderRow[]>(() => {
    const query = searchQuery.toLowerCase().trim();
    return builders
      .filter((builder) => {
        // Text search across all relevant fields
        const searchMatch = !query ||
          builder.name.toLowerCase().includes(query) ||
          builder.phone?.toLowerCase().includes(query) ||
          builder.company_name?.toLowerCase().includes(query) ||
          builder.location?.toLowerCase().includes(query) ||
          builder.trade_type?.toLowerCase().includes(query) ||
          builder.status?.toLowerCase().includes(query);

        const locationMatch = selectedLocation === 'all' || builder.location === selectedLocation;
        const tradeMatch = selectedTradeType === 'all' || builder.trade_type === selectedTradeType;
        const statusMatch = selectedStatus === 'all' || builder.status === selectedStatus;
        return searchMatch && locationMatch && tradeMatch && statusMatch;
      })
      .map((builder) => ({
        id: builder.id,
        name: builder.name,
        phone: builder.phone || '',
        website: builder.website,
        googleReviews: builder.google_reviews_url,
        status: builder.status,
        location: builder.location,
        tradeType: builder.trade_type,
        avgRating: builder.avg_rating,
        reviewCount: builder.review_count,
      }));
  }, [builders, searchQuery, selectedLocation, selectedTradeType, selectedStatus]);

  // Column definitions
  const columnDefs = useMemo<ColDef<BuilderRow>[]>(() => [
    {
      field: 'name',
      headerName: 'Builder Name',
      flex: 2,
      minWidth: 250,
      cellClass: 'font-medium',
      tooltipField: 'name',
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 160,
      cellRenderer: PhoneCellRenderer,
    },
    {
      field: 'website',
      headerName: 'Website',
      width: 130,
      cellRenderer: WebsiteCellRenderer,
      sortable: false,
    },
    {
      field: 'googleReviews',
      headerName: 'Google',
      width: 130,
      cellRenderer: GoogleReviewsCellRenderer,
      sortable: false,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
      filter: DropdownFilter,
      filterParams: {
        options: locations,
      },
    },
    {
      field: 'tradeType',
      headerName: 'Trade',
      width: 200,
      filter: DropdownFilter,
      filterParams: {
        options: tradeTypes,
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      cellRenderer: StatusCellRenderer,
      filter: DropdownFilter,
      filterParams: {
        options: ['recommended', 'unknown', 'blacklisted'],
      },
    },
    {
      field: 'avgRating',
      headerName: 'Rating',
      width: 140,
      cellRenderer: RatingCellRenderer,
    },
    {
      field: 'reviewCount',
      headerName: 'Reviews',
      width: 100,
    },
  ], []);

  // Default column settings
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    floatingFilter: true,
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

        {/* Search */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, phone, location, trade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 pl-10"
            />
          </div>
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
            tooltipShowDelay={300}
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
              Help others by adding builders you know
            </p>
            <Button asChild className="mt-4">
              <Link href="/add-builder">Add a Builder</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
