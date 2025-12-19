'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Grouped trade types for better organization
const tradeGroups = [
  {
    label: 'Popular',
    trades: ['General Contractor', 'Architect', 'Interior Designer'],
  },
  {
    label: 'Construction',
    trades: ['Pool Builder', 'Renovation Specialist', 'Mason', 'Roofer'],
  },
  {
    label: 'Specialists',
    trades: ['Plumber', 'Electrician', 'HVAC', 'Welder', 'Glass & Glazing'],
  },
  {
    label: 'Finishes',
    trades: ['Painter', 'Tiler', 'Carpenter', 'Furniture Maker'],
  },
  {
    label: 'Outdoor',
    trades: ['Landscaper'],
  },
];

// Single-select props
interface TradeComboboxSingleProps {
  value: string;
  onValueChange: (value: string) => void;
  multi?: false;
  error?: boolean;
}

// Multi-select props
interface TradeComboboxMultiProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  multi: true;
  error?: boolean;
}

type TradeComboboxProps = TradeComboboxSingleProps | TradeComboboxMultiProps;

// Helper to format display text for multi-select
function getDisplayText(values: string[]): string {
  if (values.length === 0) return '';
  if (values.length === 1) return values[0];
  if (values.length === 2) return values.join(', ');
  return `${values[0]}, ${values[1]} +${values.length - 2} more`;
}

export function TradeCombobox(props: TradeComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const { error, multi } = props;

  if (multi) {
    // Multi-select mode
    const { value, onValueChange } = props as TradeComboboxMultiProps;

    const toggleTrade = (trade: string) => {
      const normalizedTrade = tradeGroups
        .flatMap(g => g.trades)
        .find(t => t.toLowerCase() === trade.toLowerCase()) || trade;

      if (value.includes(normalizedTrade)) {
        onValueChange(value.filter(v => v !== normalizedTrade));
      } else {
        onValueChange([...value, normalizedTrade]);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-12 w-full justify-between font-normal bg-secondary hover:bg-secondary hover:border-foreground",
              error && "border-destructive border-2"
            )}
          >
            {value.length > 0 ? (
              <span className="truncate">{getDisplayText(value)}</span>
            ) : (
              <span className="text-muted-foreground">Select trades...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput placeholder="Search trades..." className="h-11 border-0 focus:ring-0" />
            </div>
            <CommandList>
              <CommandEmpty>No trade found.</CommandEmpty>
              {tradeGroups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.trades.map((trade) => (
                    <CommandItem
                      key={trade}
                      value={trade}
                      onSelect={toggleTrade}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value.some(v => v.toLowerCase() === trade.toLowerCase())
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {trade}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  // Single-select mode (default)
  const { value, onValueChange } = props as TradeComboboxSingleProps;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-12 w-full justify-between font-normal bg-secondary hover:bg-secondary hover:border-foreground",
            error && "border-destructive border-2"
          )}
        >
          {value || (
            <span className="text-muted-foreground">Select trade...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder="Search trades..." className="h-11 border-0 focus:ring-0" />
          </div>
          <CommandList>
            <CommandEmpty>No trade found.</CommandEmpty>
            {tradeGroups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.trades.map((trade) => (
                  <CommandItem
                    key={trade}
                    value={trade}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value?.toLowerCase() === trade.toLowerCase()
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {trade}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
