'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StarRatingInput } from '@/components/StarRating';
import { CheckCircleIcon, ImagePlusIcon, XIcon, ArrowLeftIcon, Loader2Icon, SearchIcon, UserPlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { formatPhone } from '@/lib/utils';

interface BuilderOption {
  id: string;
  name: string;
  phone: string;
  company_name: string | null;
}

function SubmitReviewContent() {
  const searchParams = useSearchParams();
  const preselectedBuilderId = searchParams.get('builder');

  const [builders, setBuilders] = useState<BuilderOption[]>([]);
  const [loadingBuilders, setLoadingBuilders] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState<BuilderOption | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all builders on mount
  useEffect(() => {
    async function fetchBuilders() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('builders')
        .select('id, name, phone, company_name')
        .order('name');

      if (error) {
        console.error('Error fetching builders:', error);
      } else {
        setBuilders(data || []);

        // Pre-select builder if provided in URL
        if (preselectedBuilderId && data) {
          const builder = data.find(b => b.id === preselectedBuilderId);
          if (builder) {
            setSelectedBuilder(builder);
            setSearchQuery(builder.name);
          }
        }
      }
      setLoadingBuilders(false);
    }

    fetchBuilders();
  }, [preselectedBuilderId]);

  const handleBuilderSelect = (builder: BuilderOption) => {
    setSelectedBuilder(builder);
    setSearchQuery(builder.name);
    setShowDropdown(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowDropdown(true);
    // Clear selection if user types something different
    if (selectedBuilder && value !== selectedBuilder.name) {
      setSelectedBuilder(null);
    }
  };

  // Filter builders based on search query
  const filteredBuilders = builders.filter(builder => {
    const query = searchQuery.toLowerCase();
    return (
      builder.name.toLowerCase().includes(query) ||
      builder.phone.includes(query) ||
      (builder.company_name && builder.company_name.toLowerCase().includes(query))
    );
  }).slice(0, 10); // Limit to 10 results

  const handlePhotoUpload = () => {
    if (photos.length < 5) {
      const newPhoto = `https://picsum.photos/seed/${Date.now()}/400/300`;
      setPhotos([...photos, newPhoto]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuilder) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId: selectedBuilder.id,
          builderName: selectedBuilder.name,
          builderPhone: selectedBuilder.phone,
          rating,
          reviewText,
          photos,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = selectedBuilder && rating > 0 && reviewText.trim().length >= 50;

  if (isSubmitted) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-73px)] sm:px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--status-recommended)]/10 sm:mb-6">
            <CheckCircleIcon className="h-8 w-8 text-[var(--status-recommended)]" />
          </div>
          <h1 className="text-xl text-foreground sm:text-2xl">Review Submitted</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Thank you for helping the community. Your review will be checked and published within 24 hours.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/">Search Builders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/submit-review" onClick={() => window.location.reload()}>
                Submit Another
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-6 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-lg">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href="/">
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>

        <h1 className="text-2xl text-foreground sm:text-3xl">Submit a Review</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Share your experience to help others building in Bali.
        </p>

        <Card className="mt-6 border-0 shadow-lg sm:mt-8">
          <CardContent className="p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Builder Selection */}
              <div className="space-y-4">
                <h2 className="font-medium text-foreground">Select Builder</h2>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Search by name, phone, or company
                  </label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Type to search builders..."
                      className="h-11 pl-10"
                      disabled={loadingBuilders}
                    />
                    {loadingBuilders && (
                      <Loader2Icon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                    )}

                    {/* Dropdown results */}
                    {showDropdown && searchQuery && filteredBuilders.length > 0 && !selectedBuilder && (
                      <div className="absolute z-10 mt-1 w-full rounded-md border border-input bg-background shadow-lg">
                        <ul className="max-h-[250px] overflow-auto py-1">
                          {filteredBuilders.map((builder) => (
                            <li key={builder.id}>
                              <button
                                type="button"
                                onClick={() => handleBuilderSelect(builder)}
                                className="w-full px-3 py-2 text-left hover:bg-secondary/50 focus:bg-secondary/50 focus:outline-none"
                              >
                                <p className="font-medium text-foreground">{builder.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatPhone(builder.phone)}
                                  {builder.company_name && ` • ${builder.company_name}`}
                                </p>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* No results message */}
                    {showDropdown && searchQuery && filteredBuilders.length === 0 && !loadingBuilders && (
                      <div className="absolute z-10 mt-1 w-full rounded-md border border-input bg-background p-3 shadow-lg">
                        <p className="text-sm text-muted-foreground">No builders found matching &quot;{searchQuery}&quot;</p>
                        <Link
                          href="/add-builder"
                          className="mt-2 inline-flex items-center gap-1 text-sm text-[var(--color-prompt)] hover:underline"
                        >
                          <UserPlusIcon className="h-3 w-3" />
                          Add this builder
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {selectedBuilder && (
                  <div className="flex items-center justify-between rounded-lg bg-[var(--status-recommended)]/10 p-3">
                    <div>
                      <p className="font-medium text-foreground">{selectedBuilder.name}</p>
                      <p className="text-sm text-muted-foreground">{formatPhone(selectedBuilder.phone)}</p>
                      {selectedBuilder.company_name && (
                        <p className="text-sm text-muted-foreground">{selectedBuilder.company_name}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBuilder(null);
                        setSearchQuery('');
                      }}
                      className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {!selectedBuilder && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserPlusIcon className="h-4 w-4" />
                    <span>
                      Builder not listed?{' '}
                      <Link href="/add-builder" className="text-[var(--color-prompt)] hover:underline">
                        Add them first
                      </Link>
                    </span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Your Rating</label>
                <StarRatingInput value={rating} onChange={setRating} size="lg" />
                {rating === 0 && (
                  <p className="text-xs text-muted-foreground">Tap to rate</p>
                )}
              </div>

              {/* Review Text */}
              <div className="space-y-1.5">
                <label htmlFor="reviewText" className="text-sm font-medium">
                  Your Review
                </label>
                <textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience... What work did they do? How was the quality? Were they on time and on budget? Any issues?"
                  className="min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {reviewText.length}/50 characters minimum
                  {reviewText.length >= 50 && (
                    <span className="ml-2 text-[var(--status-recommended)]">
                      <CheckCircleIcon className="inline h-3 w-3" />
                    </span>
                  )}
                </p>
              </div>

              {/* Photo Upload */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Photos (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={`Upload ${index + 1}`}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -right-2 -top-2 rounded-full bg-foreground p-1 text-background shadow-md"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <button
                      type="button"
                      onClick={handlePhotoUpload}
                      className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-muted-foreground/70"
                    >
                      <ImagePlusIcon className="h-6 w-6" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Add up to 5 photos (before/after, issues found, etc.)
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="rounded-lg bg-[var(--status-blacklisted)]/10 p-3 text-sm text-[var(--status-blacklisted)]">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>

              {/* Show why button is disabled */}
              {!isValid && !isSubmitting && (
                <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                  <p className="font-medium mb-1">To submit your review:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {!selectedBuilder && <li>Select a builder</li>}
                    {rating === 0 && <li>Select a rating</li>}
                    {reviewText.trim().length < 50 && (
                      <li>Write at least 50 characters ({50 - reviewText.trim().length} more needed)</li>
                    )}
                  </ul>
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                Reviews are checked before publishing.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SubmitReviewPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <SubmitReviewContent />
    </Suspense>
  );
}
