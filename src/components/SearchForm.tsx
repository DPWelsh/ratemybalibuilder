'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRightIcon, Loader2Icon } from 'lucide-react';
import { PRICING, formatPrice } from '@/lib/pricing';

export function SearchForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name && !phone) return;

    setIsLoading(true);
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (phone) params.set('phone', phone);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="search-name" className="text-sm font-medium">
                Builder name
              </label>
              <Input
                id="search-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pak Wayan"
                className="h-11 sm:h-12"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="search-phone" className="text-sm font-medium">
                Phone / WhatsApp
              </label>
              <Input
                id="search-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812 XXX XXXX"
                className="h-11 sm:h-12"
              />
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-11 w-full sm:h-12"
            disabled={(!name && !phone) || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                Search builder ({formatPrice(PRICING.search)})
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        <p className="mt-3 text-center text-xs text-muted-foreground sm:mt-4 sm:text-sm">
          {formatPrice(PRICING.unlock)} to unlock findings.
        </p>
      </CardContent>
    </Card>
  );
}
