'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import {
  CheckIcon,
  XIcon,
  Loader2Icon,
  RefreshCwIcon,
  PencilIcon,
  SaveIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { tradeTypes, locations } from '@/lib/supabase/builders';

interface PendingReview {
  id: string;
  rating: number;
  review_text: string;
  photos: string[];
  created_at: string;
  builder: {
    id: string;
    name: string;
    phone: string;
    trade_type: string;
    location: string;
  };
  user: {
    email: string;
  };
}

interface EditingBuilder {
  reviewId: string;
  name: string;
  phone: string;
  trade_type: string;
  location: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingBuilder, setEditingBuilder] = useState<EditingBuilder | null>(null);
  const [savingBuilder, setSavingBuilder] = useState(false);

  const fetchReviews = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        review_text,
        photos,
        created_at,
        user_id,
        builder:builders (
          id,
          name,
          phone,
          trade_type,
          location
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching reviews:', error);
    }

    if (data) {
      // Map reviews and handle missing user info
      const mappedReviews = data.map(review => ({
        ...review,
        user: { email: review.user_id ? 'Registered User' : 'Anonymous' }
      }));
      setReviews(mappedReviews as unknown as PendingReview[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const startEditingBuilder = (review: PendingReview) => {
    setEditingBuilder({
      reviewId: review.id,
      name: review.builder?.name || '',
      phone: review.builder?.phone || '',
      trade_type: review.builder?.trade_type || 'General Contractor',
      location: review.builder?.location || 'Other',
    });
  };

  const cancelEditingBuilder = () => {
    setEditingBuilder(null);
  };

  const saveBuilderChanges = async (builderId: string) => {
    if (!editingBuilder) return;

    setSavingBuilder(true);

    try {
      const response = await fetch(`/api/admin/builders/${builderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingBuilder.name,
          phone: editingBuilder.phone,
          trade_type: editingBuilder.trade_type,
          location: editingBuilder.location,
        }),
      });

      if (response.ok) {
        // Update local state
        setReviews(reviews.map(r =>
          r.id === editingBuilder.reviewId
            ? {
                ...r,
                builder: {
                  ...r.builder,
                  name: editingBuilder.name,
                  phone: editingBuilder.phone,
                  trade_type: editingBuilder.trade_type,
                  location: editingBuilder.location,
                }
              }
            : r
        ));
        setEditingBuilder(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save builder changes');
      }
    } catch (error) {
      console.error('Error saving builder:', error);
      alert('Failed to save builder changes');
    }

    setSavingBuilder(false);
  };

  const handleAction = async (reviewId: string, action: 'approve' | 'reject') => {
    setProcessingId(reviewId);

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        // Remove from list
        setReviews(reviews.filter((r) => r.id !== reviewId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to process review');
      }
    } catch (error) {
      console.error('Error processing review:', error);
      alert('Failed to process review');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Pending Reviews</h1>
            <p className="mt-1 text-muted-foreground">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''} awaiting moderation
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchReviews}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {reviews.length === 0 ? (
          <Card className="mt-8 border-0">
            <CardContent className="px-6 py-12 text-center">
              <CheckIcon className="mx-auto h-12 w-12 text-[var(--status-recommended)]" />
              <h2 className="mt-4 text-lg font-medium text-foreground">All caught up!</h2>
              <p className="mt-2 text-muted-foreground">No pending reviews to moderate.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 space-y-6">
            {reviews.map((review) => {
              const isEditing = editingBuilder?.reviewId === review.id;

              return (
              <Card key={review.id} className="border-0 shadow-md">
                <CardContent className="p-5 sm:p-6">
                  {/* Header - Builder Info */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {isEditing ? (
                      /* Edit Mode */
                      <div className="flex-1 space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Builder Name</label>
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
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveBuilderChanges(review.builder?.id)}
                            disabled={savingBuilder}
                          >
                            {savingBuilder ? (
                              <Loader2Icon className="mr-1.5 h-3 w-3 animate-spin" />
                            ) : (
                              <SaveIcon className="mr-1.5 h-3 w-3" />
                            )}
                            Save
                          </Button>
                          <Button variant="outline" size="sm" onClick={cancelEditingBuilder}>
                            Cancel
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          By: {review.user?.email || 'Anonymous'} • Submitted: {new Date(review.created_at).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      /* View Mode */
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">
                            {review.builder?.name || 'Unknown Builder'}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            ({review.builder?.trade_type || 'Unknown Trade'})
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingBuilder(review)}
                            className="h-6 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <PencilIcon className="h-3 w-3" />
                            Edit
                          </Button>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {review.builder?.phone || 'N/A'} • {review.builder?.location || 'Unknown Location'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          By: {review.user?.email || 'Anonymous'} • Submitted: {new Date(review.created_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                    <StarRating rating={review.rating} size="md" />
                  </div>

                  {/* Review Text */}
                  <div className="mt-4 rounded-lg bg-secondary/50 p-4">
                    <p className="text-sm leading-relaxed">{review.review_text}</p>
                  </div>

                  {/* Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {review.photos.map((photo, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={index}
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleAction(review.id, 'approve')}
                        disabled={processingId === review.id}
                        className="gap-2"
                      >
                        {processingId === review.id ? (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckIcon className="h-4 w-4" />
                        )}
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAction(review.id, 'reject')}
                        disabled={processingId === review.id}
                        className="gap-2"
                      >
                        <XIcon className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
