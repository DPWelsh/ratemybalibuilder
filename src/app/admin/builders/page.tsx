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
  SearchIcon,
  CheckIcon,
  XIcon,
  Trash2Icon,
  PencilIcon,
  SaveIcon,
} from 'lucide-react';
import { formatPhone, phonesMatch } from '@/lib/utils';
import { tradeTypes, locations } from '@/lib/supabase/builders';

interface Builder {
  id: string;
  name: string;
  phone: string;
  company_name: string | null;
  status: 'recommended' | 'unknown' | 'blacklisted';
  location: string;
  trade_type: string;
  website: string | null;
  google_reviews_url: string | null;
  created_at: string;
  is_published: boolean;
}

interface EditingBuilder {
  id: string;
  name: string;
  phone: string;
  location: string;
  trade_type: string;
  website: string;
  google_reviews_url: string;
}

export default function AdminBuildersPage() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingBuilder, setEditingBuilder] = useState<EditingBuilder | null>(null);

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
    void fetchBuilders();
  }, []);

  const startEditing = (builder: Builder) => {
    setEditingBuilder({
      id: builder.id,
      name: builder.name,
      phone: builder.phone,
      location: builder.location,
      trade_type: builder.trade_type,
      website: builder.website || '',
      google_reviews_url: builder.google_reviews_url || '',
    });
  };

  const cancelEditing = () => {
    setEditingBuilder(null);
  };

  const saveBuilder = async () => {
    if (!editingBuilder) return;

    setUpdatingId(editingBuilder.id);

    try {
      const response = await fetch(`/api/admin/builders/${editingBuilder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingBuilder.name,
          phone: editingBuilder.phone,
          location: editingBuilder.location,
          trade_type: editingBuilder.trade_type,
          website: editingBuilder.website || null,
          google_reviews_url: editingBuilder.google_reviews_url || null,
        }),
      });

      if (response.ok) {
        setBuilders(builders.map(b =>
          b.id === editingBuilder.id
            ? {
                ...b,
                name: editingBuilder.name,
                phone: editingBuilder.phone,
                location: editingBuilder.location,
                trade_type: editingBuilder.trade_type,
                website: editingBuilder.website || null,
                google_reviews_url: editingBuilder.google_reviews_url || null,
              }
            : b
        ));
        setEditingBuilder(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving builder:', error);
      alert('Failed to save changes');
    }

    setUpdatingId(null);
  };

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

  const togglePublished = async (builderId: string, isPublished: boolean) => {
    setUpdatingId(builderId);
    const supabase = createClient();

    const { error } = await supabase
      .from('builders')
      .update({ is_published: !isPublished })
      .eq('id', builderId);

    if (!error) {
      setBuilders(builders.map(b =>
        b.id === builderId ? { ...b, is_published: !isPublished } : b
      ));
    } else {
      alert('Failed to update publish status');
    }

    setUpdatingId(null);
  };

  const deleteBuilder = async (builderId: string, builderName: string) => {
    if (!confirm(`Are you sure you want to delete "${builderName}"? This action cannot be undone.`)) {
      return;
    }

    setUpdatingId(builderId);
    const supabase = createClient();

    await supabase
      .from('reviews')
      .delete()
      .eq('builder_id', builderId);

    const { error } = await supabase
      .from('builders')
      .delete()
      .eq('id', builderId);

    if (!error) {
      setBuilders(builders.filter(b => b.id !== builderId));
    } else {
      alert('Failed to delete builder');
    }

    setUpdatingId(null);
  };

  const pendingBuilders = builders.filter(b => !b.is_published);
  const publishedBuilders = builders.filter(b => b.is_published);

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
              {publishedBuilders.length} published, {pendingBuilders.length} pending review
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
            filteredBuilders.map((builder) => {
              const isEditing = editingBuilder?.id === builder.id;

              return (
                <Card key={builder.id} className={`border-0 shadow-sm ${!builder.is_published ? 'ring-2 ring-[var(--color-energy)]/50' : ''}`}>
                  <CardContent className="p-4 sm:p-5">
                    {isEditing ? (
                      /* Edit Mode */
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Name</label>
                            <Input
                              value={editingBuilder.name}
                              onChange={(e) => setEditingBuilder({ ...editingBuilder, name: e.target.value })}
                              className="h-9"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label>
                            <Input
                              value={editingBuilder.phone}
                              onChange={(e) => setEditingBuilder({ ...editingBuilder, phone: e.target.value })}
                              className="h-9"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Trade Type</label>
                            <select
                              value={editingBuilder.trade_type}
                              onChange={(e) => setEditingBuilder({ ...editingBuilder, trade_type: e.target.value })}
                              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              {tradeTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Location</label>
                            <select
                              value={editingBuilder.location}
                              onChange={(e) => setEditingBuilder({ ...editingBuilder, location: e.target.value })}
                              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              {locations.map((loc) => (
                                <option key={loc} value={loc}>{loc}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Website</label>
                            <Input
                              value={editingBuilder.website}
                              onChange={(e) => setEditingBuilder({ ...editingBuilder, website: e.target.value })}
                              placeholder="https://..."
                              className="h-9"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Google Reviews URL</label>
                            <Input
                              value={editingBuilder.google_reviews_url}
                              onChange={(e) => setEditingBuilder({ ...editingBuilder, google_reviews_url: e.target.value })}
                              placeholder="https://..."
                              className="h-9"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={saveBuilder}
                            disabled={updatingId === builder.id}
                          >
                            {updatingId === builder.id ? (
                              <Loader2Icon className="mr-2 h-3 w-3 animate-spin" />
                            ) : (
                              <SaveIcon className="mr-2 h-3 w-3" />
                            )}
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-foreground">{builder.name}</h3>
                            <StatusBadge status={builder.status} size="sm" />
                            {!builder.is_published && (
                              <span className="inline-flex items-center rounded-full bg-[var(--color-energy)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-energy)]">
                                Pending
                              </span>
                            )}
                          </div>
                          {builder.company_name && (
                            <p className="mt-1 text-sm text-muted-foreground">{builder.company_name}</p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span>{formatPhone(builder.phone)}</span>
                            <span>{builder.location}</span>
                            <span>{builder.trade_type}</span>
                            {builder.website && (
                              <a href={builder.website} target="_blank" rel="noopener noreferrer" className="text-[var(--color-prompt)] hover:underline">
                                Website
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          {/* Edit Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(builder)}
                            className="text-xs gap-1"
                          >
                            <PencilIcon className="h-3 w-3" />
                            Edit
                          </Button>

                          {/* Publish/Unpublish Button */}
                          <Button
                            variant={builder.is_published ? 'outline' : 'default'}
                            size="sm"
                            onClick={() => togglePublished(builder.id, builder.is_published)}
                            disabled={updatingId === builder.id}
                            className="text-xs gap-1"
                          >
                            {updatingId === builder.id ? (
                              <Loader2Icon className="h-3 w-3 animate-spin" />
                            ) : builder.is_published ? (
                              <>
                                <XIcon className="h-3 w-3" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <CheckIcon className="h-3 w-3" />
                                Publish
                              </>
                            )}
                          </Button>

                          {/* Status buttons */}
                          <Button
                            variant={builder.status === 'recommended' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateStatus(builder.id, 'recommended')}
                            disabled={updatingId === builder.id}
                            className="text-xs whitespace-nowrap"
                          >
                            Recommended
                          </Button>
                          <Button
                            variant={builder.status === 'unknown' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateStatus(builder.id, 'unknown')}
                            disabled={updatingId === builder.id}
                            className="text-xs"
                          >
                            Neutral
                          </Button>
                          <Button
                            variant={builder.status === 'blacklisted' ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => updateStatus(builder.id, 'blacklisted')}
                            disabled={updatingId === builder.id}
                            className="text-xs"
                          >
                            Flagged
                          </Button>

                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBuilder(builder.id, builder.name)}
                            disabled={updatingId === builder.id}
                            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2Icon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
