'use client';

import { MapPinIcon, WrenchIcon, HomeIcon, XIcon } from 'lucide-react';
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
  projectTypes,
  Location,
  TradeType,
  ProjectType,
} from '@/lib/dummy-data';

interface FilterBarProps {
  selectedLocation: Location | 'all';
  selectedTradeType: TradeType | 'all';
  selectedProjectType: ProjectType | 'all';
  onLocationChange: (value: Location | 'all') => void;
  onTradeTypeChange: (value: TradeType | 'all') => void;
  onProjectTypeChange: (value: ProjectType | 'all') => void;
  onClear: () => void;
}

export function FilterBar({
  selectedLocation,
  selectedTradeType,
  selectedProjectType,
  onLocationChange,
  onTradeTypeChange,
  onProjectTypeChange,
  onClear,
}: FilterBarProps) {
  const hasActiveFilters =
    selectedLocation !== 'all' ||
    selectedTradeType !== 'all' ||
    selectedProjectType !== 'all';

  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
      {/* Location Filter */}
      <Select
        value={selectedLocation}
        onValueChange={(value) => onLocationChange(value as Location | 'all')}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
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
        <SelectTrigger className="w-full sm:w-[180px]">
          <WrenchIcon className="h-4 w-4 text-muted-foreground" />
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

      {/* Project Type Filter */}
      <Select
        value={selectedProjectType}
        onValueChange={(value) => onProjectTypeChange(value as ProjectType | 'all')}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <HomeIcon className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projectTypes.map((project) => (
            <SelectItem key={project} value={project}>
              {project}
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
