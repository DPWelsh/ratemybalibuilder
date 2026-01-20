'use client';

import { MapPinIcon, WrenchIcon, ShieldCheckIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  locations,
  tradeTypes,
  Location,
  TradeType,
  BuilderStatus,
} from '@/lib/supabase/builders';

const statusOptions: { value: BuilderStatus; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'blacklisted', label: 'Flagged' },
];

interface FilterBarProps {
  selectedLocation: Location | 'all';
  selectedTradeType: TradeType | 'all';
  selectedStatus: BuilderStatus | 'all';
  onLocationChange: (value: Location | 'all') => void;
  onTradeTypeChange: (value: TradeType | 'all') => void;
  onStatusChange: (value: BuilderStatus | 'all') => void;
  onClear: () => void;
}

export function FilterBar({
  selectedLocation,
  selectedTradeType,
  selectedStatus,
  onLocationChange,
  onTradeTypeChange,
  onStatusChange,
  onClear,
}: FilterBarProps) {
  const hasActiveFilters =
    selectedLocation !== 'all' ||
    selectedTradeType !== 'all' ||
    selectedStatus !== 'all';

  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
      {/* Location Filter */}
      <Select
        value={selectedLocation}
        onValueChange={(value) => onLocationChange(value as Location | 'all')}
      >
        <SelectTrigger
          className={`w-full sm:w-[160px] ${
            selectedLocation !== 'all'
              ? 'border-[var(--color-prompt)] bg-[var(--color-prompt)]/10 text-[var(--color-prompt)] font-semibold'
              : ''
          }`}
        >
          <MapPinIcon className={`h-4 w-4 ${selectedLocation !== 'all' ? 'text-[var(--color-prompt)]' : 'text-muted-foreground'}`} />
          <SelectValue placeholder="All Areas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Areas</SelectItem>
          {locations.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Trade Type Filter */}
      <Select
        value={selectedTradeType}
        onValueChange={(value) => onTradeTypeChange(value as TradeType | 'all')}
      >
        <SelectTrigger
          className={`w-full sm:w-[180px] ${
            selectedTradeType !== 'all'
              ? 'border-[var(--color-prompt)] bg-[var(--color-prompt)]/10 text-[var(--color-prompt)] font-semibold'
              : ''
          }`}
        >
          <WrenchIcon className={`h-4 w-4 ${selectedTradeType !== 'all' ? 'text-[var(--color-prompt)]' : 'text-muted-foreground'}`} />
          <SelectValue placeholder="All Trades" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Trades</SelectItem>
          {tradeTypes.map((trade) => (
            <SelectItem key={trade} value={trade}>
              {trade}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={selectedStatus}
        onValueChange={(value) => onStatusChange(value as BuilderStatus | 'all')}
      >
        <SelectTrigger
          className={`w-full sm:w-[160px] ${
            selectedStatus !== 'all'
              ? 'border-[var(--color-prompt)] bg-[var(--color-prompt)]/10 text-[var(--color-prompt)] font-semibold'
              : ''
          }`}
        >
          <ShieldCheckIcon className={`h-4 w-4 ${selectedStatus !== 'all' ? 'text-[var(--color-prompt)]' : 'text-muted-foreground'}`} />
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {statusOptions.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="w-full sm:w-auto"
        >
          <XIcon className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
