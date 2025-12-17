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
} from 'lucide-react';

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
  };
  user: {
    email: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

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
        builder:builders (
          id,
          name,
          phone
        ),
        user:profiles!reviews_user_id_fkey (
          email
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setReviews(data as unknown as PendingReview[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
            {reviews.map((review) => (
              <Card key={review.id} className="border-0 shadow-md">
                <CardContent className="p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">
                        Review for: {review.builder?.name || 'Unknown Builder'}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Phone: {review.builder?.phone || 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        By: {review.user?.email || 'Unknown'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {new Date(review.created_at).toLocaleString()}
                      </p>
                    </div>
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
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
