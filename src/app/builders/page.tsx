'use client';

import { useMemo, useCallback, useState, useEffect, forwardRef, useImperativeHandle, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, RowClickedEvent, ModuleRegistry, AllCommunityModule, themeQuartz, IFilterParams, IDoesFilterPassParams, CellValueChangedEvent } from 'ag-grid-community';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { StarRating } from '@/components/StarRating';
import { FilterBar } from '@/components/FilterBar';
import { getBuilders, getBuilderStats, BuilderWithStats, BuilderStatus, Location, TradeType, locations, tradeTypes } from '@/lib/supabase/builders';
import { createClient } from '@/lib/supabase/client';
import { UsersIcon, Loader2Icon, GlobeIcon, StarIcon, SearchIcon, CheckIcon, PencilIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatPhone, phonesMatch } from '@/lib/utils';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Custom multi-select checkbox filter component for AG Grid (like Enterprise Set Filter)
interface SetFilterProps extends IFilterParams<BuilderRow> {
  options: string[];
}

const SetFilter = forwardRef((props: SetFilterProps, ref) => {
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState('');

  const filteredOptions = props.options.filter(option =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  const allSelected = selectedValues.size === 0 || selectedValues.size === props.options.length;

  useImperativeHandle(ref, () => ({
    doesFilterPass(params: IDoesFilterPassParams<BuilderRow>) {
      if (selectedValues.size === 0) return true;
      const value = props.colDef.field ? params.data[props.colDef.field as keyof BuilderRow] : '';
      return selectedValues.has(value as string);
    },
    isFilterActive() {
      return selectedValues.size > 0 && selectedValues.size < props.options.length;
    },
    getModel() {
      if (selectedValues.size === 0 || selectedValues.size === props.options.length) return null;
      return { values: Array.from(selectedValues) };
    },
    setModel(model: { values: string[] } | null) {
      if (model?.values) {
        setSelectedValues(new Set(model.values));
      } else {
        setSelectedValues(new Set());
      }
    },
  }));

  const handleToggle = (value: string) => {
    const newSelected = new Set(selectedValues);
    if (newSelected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    setSelectedValues(newSelected);
    props.filterChangedCallback();
  };

  const handleSelectAll = () => {
    if (allSelected) {
      // If all selected (or none), select none
      setSelectedValues(new Set());
    } else {
      // Select all
      setSelectedValues(new Set());
    }
    props.filterChangedCallback();
  };

  return (
    <div className="p-2 min-w-[200px]">
      {/* Search */}
      <div className="relative mb-2">
        <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Options list */}
      <div className="max-h-[250px] overflow-auto">
        {/* Select All */}
        <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent">
          <div className={`flex h-4 w-4 items-center justify-center rounded border ${
            allSelected ? 'border-primary bg-primary' : 'border-input'
          }`}>
            {allSelected && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
          </div>
          <span className="text-sm font-medium">(Select All)</span>
        </label>

        {/* Individual options */}
        {filteredOptions.map((option) => {
          const isChecked = selectedValues.size === 0 || selectedValues.has(option);
          return (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded border ${
                  isChecked ? 'border-primary bg-primary' : 'border-input'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleToggle(option);
                }}
              >
                {isChecked && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
              </div>
              <span className="text-sm">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
});
SetFilter.displayName = 'SetFilter';

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

// Custom cell renderer for star rating (signed in)
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

// Custom cell renderer for blurred rating (not signed in)
function BlurredRatingCellRenderer() {
  return (
    <Link href="/login" className="flex items-center gap-1.5 group" onClick={(e) => e.stopPropagation()}>
      <div className="blur-sm select-none pointer-events-none">
        <StarRating rating={4} size="sm" />
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-[var(--color-prompt)] group-hover:underline">Sign in</span>
    </Link>
  );
}

// Custom cell renderer for phone number (now free - show full)
function PhoneCellRenderer(params: ICellRendererParams<BuilderRow>) {
  const phone = params.value as string;
  if (!phone) return <span className="text-muted-foreground">-</span>;
  return <span className="font-mono text-sm">{formatPhone(phone)}</span>;
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

function BuildersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL params
  const initialQuery = searchParams.get('q') || '';
  const initialTrade = searchParams.get('trade') || '';

  // Data state
  const [builders, setBuilders] = useState<BuilderWithStats[]>([]);
  const [stats, setStats] = useState({ total: 0, recommended: 0, blacklisted: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Filter state - initialized from URL params
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedLocation, setSelectedLocation] = useState<Location | 'all'>('all');
  const [selectedTradeType, setSelectedTradeType] = useState<TradeType | 'all'>(
    tradeTypes.includes(initialTrade as TradeType) ? (initialTrade as TradeType) : 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<BuilderStatus | 'all'>('all');

  // Fetch data and check admin status on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const supabase = createClient();

      // Check if user is signed in and admin
      const { data: { user } } = await supabase.auth.getUser();
      setIsSignedIn(!!user);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        setIsAdmin(profile?.is_admin || false);
      }

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

  // Handle cell value change (admin edit)
  const onCellValueChanged = useCallback(async (event: CellValueChangedEvent<BuilderRow>) => {
    if (!event.data || !isAdmin) return;

    const supabase = createClient();
    const field = event.colDef.field;
    const newValue = event.newValue;
    const builderId = event.data.id;

    // Map grid field names to database column names
    const fieldMap: Record<string, string> = {
      name: 'name',
      phone: 'phone',
      website: 'website',
      googleReviews: 'google_reviews_url',
      location: 'location',
      tradeType: 'trade_type',
      status: 'status',
    };

    const dbField = field ? fieldMap[field] : null;
    if (!dbField) return;

    const { error } = await supabase
      .from('builders')
      .update({ [dbField]: newValue })
      .eq('id', builderId);

    if (error) {
      console.error('Error updating builder:', error);
      // Revert the change in the grid
      event.node.setDataValue(field!, event.oldValue);
    } else {
      // Update local state to keep in sync
      setBuilders(prev => prev.map(b =>
        b.id === builderId
          ? { ...b, [dbField]: newValue }
          : b
      ));
    }
  }, [isAdmin]);

  // Prepare and filter row data
  const rowData = useMemo<BuilderRow[]>(() => {
    const query = searchQuery.toLowerCase().trim();
    // Check if query looks like a phone number (mostly digits)
    const queryDigits = searchQuery.replace(/[^\d]/g, '');
    const isPhoneQuery = queryDigits.length >= 6;

    return builders
      .filter((builder) => {
        // Phone number search - use smart matching
        if (isPhoneQuery) {
          const phoneMatch = phonesMatch(builder.phone, searchQuery);
          if (phoneMatch) return true;
        }

        // Text search across all relevant fields
        const searchMatch = !query ||
          builder.name.toLowerCase().includes(query) ||
          builder.company_name?.toLowerCase().includes(query) ||
          builder.location?.toLowerCase().includes(query) ||
          builder.trade_type?.toLowerCase().includes(query) ||
          builder.status?.toLowerCase().includes(query) ||
          // Also do simple phone includes for partial matches
          builder.phone?.toLowerCase().includes(query);

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
      minWidth: 200,
      cellClass: 'font-medium',
      tooltipField: 'name',
      editable: editMode,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 180,
      minWidth: 180,
      cellRenderer: editMode ? undefined : PhoneCellRenderer,
      editable: editMode,
    },
    {
      field: 'avgRating',
      headerName: 'Rating',
      width: 140,
      cellRenderer: isSignedIn ? RatingCellRenderer : BlurredRatingCellRenderer,
      sort: 'desc',
      editable: false, // Rating is calculated from reviews
    },
    {
      field: 'website',
      headerName: 'Website',
      width: editMode ? 150 : 100,
      cellRenderer: editMode ? undefined : WebsiteCellRenderer,
      sortable: false,
      editable: editMode,
    },
    {
      field: 'googleReviews',
      headerName: 'Google',
      width: editMode ? 150 : 100,
      cellRenderer: editMode ? undefined : GoogleReviewsCellRenderer,
      sortable: false,
      editable: editMode,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 130,
      filter: SetFilter,
      filterParams: {
        options: locations,
      },
      editable: editMode,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: locations,
      },
    },
    {
      field: 'tradeType',
      headerName: 'Trade',
      width: 170,
      filter: SetFilter,
      filterParams: {
        options: tradeTypes,
      },
      editable: editMode,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: tradeTypes,
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      cellRenderer: editMode ? undefined : StatusCellRenderer,
      filter: SetFilter,
      filterParams: {
        options: ['recommended', 'blacklisted'],
      },
      editable: editMode,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['recommended', 'blacklisted'],
      },
    },
  ], [editMode, isSignedIn]);

  // Default column settings
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    floatingFilter: false,
    cellStyle: { display: 'flex', alignItems: 'center' },
  }), []);

  // Handle row click (disabled when in edit mode)
  const onRowClicked = useCallback((event: RowClickedEvent<BuilderRow>) => {
    if (editMode) return; // Don't navigate when editing
    if (event.data) {
      router.push(`/builder/${event.data.id}`);
    }
  }, [router, editMode]);

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
        <div className="mb-6 flex items-start justify-between sm:mb-8">
          <div>
            <h1 className="text-2xl text-foreground sm:text-3xl">Builder Database</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Browse all builders in our database. Click on any row to see more details.
            </p>
          </div>
          {isAdmin && (
            <Button
              variant={editMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setEditMode(!editMode)}
              className="gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              {editMode ? 'Exit Edit Mode' : 'Edit Mode'}
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3 sm:mb-8 sm:gap-4">
          <Card
            className={`border-0 cursor-pointer transition-all hover:scale-[1.02] ${
              selectedStatus === 'all' ? 'bg-secondary ring-2 ring-foreground/20' : 'bg-secondary/50'
            }`}
            onClick={() => setSelectedStatus('all')}
          >
            <CardContent className="px-4 py-3 text-center sm:p-4">
              <p className="text-2xl font-medium text-foreground sm:text-3xl">{stats.total}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Total Builders</p>
            </CardContent>
          </Card>
          <Card
            className={`border-0 cursor-pointer transition-all hover:scale-[1.02] ${
              selectedStatus === 'recommended' ? 'bg-[var(--status-recommended)]/20 ring-2 ring-[var(--status-recommended)]' : 'bg-[var(--status-recommended)]/10'
            }`}
            onClick={() => setSelectedStatus(selectedStatus === 'recommended' ? 'all' : 'recommended')}
          >
            <CardContent className="px-4 py-3 text-center sm:p-4">
              <p className="text-2xl font-medium text-[var(--status-recommended)] sm:text-3xl">{stats.recommended}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Recommended</p>
            </CardContent>
          </Card>
          <Card
            className={`border-0 cursor-pointer transition-all hover:scale-[1.02] ${
              selectedStatus === 'blacklisted' ? 'bg-[var(--status-blacklisted)]/20 ring-2 ring-[var(--status-blacklisted)]' : 'bg-[var(--status-blacklisted)]/10'
            }`}
            onClick={() => setSelectedStatus(selectedStatus === 'blacklisted' ? 'all' : 'blacklisted')}
          >
            <CardContent className="px-4 py-3 text-center sm:p-4">
              <p className="text-2xl font-medium text-[var(--status-blacklisted)] sm:text-3xl">{stats.blacklisted}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Flagged</p>
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
          className="rounded-lg overflow-hidden shadow-md relative"
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
            onCellValueChanged={onCellValueChanged}
            singleClickEdit={true}
            stopEditingWhenCellsLoseFocus={true}
            noRowsOverlayComponent={() => null}
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
            rowClass={editMode ? '' : 'cursor-pointer'}
            tooltipShowDelay={300}
          />

          {/* No results message */}
          {rowData.length === 0 && !isLoading && (
            <div className="absolute left-0 right-0 top-[48px] bottom-0 flex flex-col items-center justify-center bg-card border-t border-border">
              <SearchIcon className="h-10 w-10 text-muted-foreground/40" />
              <h3 className="mt-3 text-base font-medium text-foreground">No builders found</h3>
              <p className="mt-1.5 text-sm text-muted-foreground text-center max-w-xs px-4">
                {searchQuery ? (
                  <>No results for &ldquo;{searchQuery}&rdquo;</>
                ) : (
                  <>No builders match the current filters</>
                )}
              </p>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
                <Button asChild size="sm">
                  <Link href="/add-builder">Add this builder</Link>
                </Button>
              </div>
            </div>
          )}
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

export default function BuildersPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <BuildersPageContent />
    </Suspense>
  );
}
