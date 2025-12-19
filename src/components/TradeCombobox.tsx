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

interface TradeComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: boolean;
}

export function TradeCombobox({ value, onValueChange, error }: TradeComboboxProps) {
  const [open, setOpen] = React.useState(false);

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
