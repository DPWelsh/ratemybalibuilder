'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
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

// Grouped locations
const locationGroups = [
  {
    label: 'Coverage',
    locations: ['Bali Wide'],
  },
  {
    label: 'Popular Areas',
    locations: ['Canggu', 'Seminyak', 'Ubud', 'Uluwatu'],
  },
  {
    label: 'Other Areas',
    locations: ['Sanur', 'Denpasar', 'Tabanan', 'Other'],
  },
];

interface LocationComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function LocationCombobox({ value, onValueChange }: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-12 w-full justify-between font-normal"
        >
          {value ? (
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {value}
            </span>
          ) : (
            <span className="text-muted-foreground">Select location...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search locations..." className="h-11" />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            {locationGroups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.locations.map((location) => (
                  <CommandItem
                    key={location}
                    value={location}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                    className="cursor-pointer data-[selected=true]:bg-secondary data-[selected=true]:text-foreground"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value?.toLowerCase() === location.toLowerCase()
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {location}
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
