'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Loader2Icon,
  RefreshCwIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react';

interface Builder {
  id: string;
  name: string;
  phone: string;
  company_name: string | null;
  status: 'recommended' | 'unknown' | 'blacklisted';
  location: string;
  trade_type: string;
  created_at: string;
}

export default function AdminBuildersPage() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBuilders = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from('builders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBuilders(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBuilders();
  }, []);

  const updateStatus = async (builderId: string, newStatus: 'recommended' | 'unknown' | 'blacklisted') => {
    setUpdatingId(builderId);
    const supabase = createClient();

    const { error } = await supabase
      .from('builders')
      .update({ status: newStatus })
      .eq('id', builderId);

    if (!error) {
      setBuilders(builders.map(b =>
        b.id === builderId ? { ...b, status: newStatus } : b
      ));
    } else {
      alert('Failed to update status');
    }

    setUpdatingId(null);
  };

  const filteredBuilders = builders.filter(builder =>
    builder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    builder.phone.includes(searchQuery) ||
    (builder.company_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Manage Builders</h1>
            <p className="mt-1 text-muted-foreground">
              {builders.length} builder{builders.length !== 1 ? 's' : ''} in database
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchBuilders}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Builders List */}
        <div className="mt-6 space-y-4">
          {filteredBuilders.length === 0 ? (
            <Card className="border-0">
              <CardContent className="px-6 py-12 text-center">
                <p className="text-muted-foreground">No builders found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredBuilders.map((builder) => (
              <Card key={builder.id} className="border-0 shadow-sm">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-foreground">{builder.name}</h3>
                        <StatusBadge status={builder.status} size="sm" />
                      </div>
                      {builder.company_name && (
                        <p className="mt-1 text-sm text-muted-foreground">{builder.company_name}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>{builder.phone}</span>
                        <span>{builder.location}</span>
                        <span>{builder.trade_type}</span>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={builder.status === 'recommended' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStatus(builder.id, 'recommended')}
                        disabled={updatingId === builder.id}
                        className="text-xs"
                      >
                        {updatingId === builder.id ? (
                          <Loader2Icon className="h-3 w-3 animate-spin" />
                        ) : (
                          'Recommended'
                        )}
                      </Button>
                      <Button
                        variant={builder.status === 'unknown' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStatus(builder.id, 'unknown')}
                        disabled={updatingId === builder.id}
                        className="text-xs"
                      >
                        Unknown
                      </Button>
                      <Button
                        variant={builder.status === 'blacklisted' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => updateStatus(builder.id, 'blacklisted')}
                        disabled={updatingId === builder.id}
                        className="text-xs"
                      >
                        Blacklisted
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
