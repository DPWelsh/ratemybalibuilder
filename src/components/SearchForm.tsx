'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TradeCombobox } from '@/components/TradeCombobox';
import { SearchIcon, ArrowRightIcon, Loader2Icon, ShieldCheckIcon } from 'lucide-react';

interface SearchFormProps {
  showSecurityBadge?: boolean;
  showHelpText?: boolean;
}

export function SearchForm({ showSecurityBadge = true, showHelpText = true }: SearchFormProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeType, setTradeType] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Need either a search query or a trade selected
    if (!searchQuery.trim() && !tradeType) return;

    setIsSearching(true);

    // Determine if input looks like a phone number (mostly digits)
    const digitsOnly = searchQuery.replace(/[^\d]/g, '');
    const isPhone = digitsOnly.length >= 6;

    // Log the search (don't await - fire and forget)
    fetch('/api/search-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: isPhone ? searchQuery : null,
        name: !isPhone && searchQuery ? searchQuery : null,
        trade_type: tradeType || null,
      }),
    }).catch(() => {
      // Don't block search if logging fails
    });

    // Navigate to builders page with search query and/or trade filter
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery);
    }
    if (tradeType) {
      params.set('trade', tradeType);
    }
    router.push(`/builders?${params.toString()}`);
  };

  const getButtonText = () => {
    if (searchQuery.trim()) return 'Search builder';
    if (tradeType) return `Browse ${tradeType}s`;
    return 'Search builder';
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              name="search"
              type="text"
              placeholder="Name or phone..."
              className="h-12 pl-11 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <TradeCombobox
              value={tradeType}
              onValueChange={setTradeType}
              placeholder="Any trade"
            />
          </div>
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full text-base"
          disabled={(!searchQuery.trim() && !tradeType) || isSearching}
        >
          {isSearching ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              {getButtonText()}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      {showHelpText && (
        <p className="mt-3 text-center text-xs text-muted-foreground sm:mt-4 sm:text-sm">
          Free to search. Help us grow by adding builders you know.
        </p>
      )}
      {showSecurityBadge && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheckIcon className="h-4 w-4 text-[var(--status-recommended)]" />
          <span>Community-verified reviews</span>
        </div>
      )}
    </div>
  );
}
