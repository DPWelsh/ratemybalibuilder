'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { StarRatingInput } from '@/components/StarRating';
import { CheckCircleIcon, ImagePlusIcon, XIcon, ArrowLeftIcon, Loader2Icon } from 'lucide-react';

export default function SubmitReviewPage() {
  const [builderName, setBuilderName] = useState('');
  const [builderPhone, setBuilderPhone] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePhotoUpload = () => {
    // Simulate photo upload with placeholder
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
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const isValid = builderName.trim() && builderPhone.trim() && rating > 0 && reviewText.trim().length >= 50;

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
          <div className="mt-6 rounded-lg bg-[var(--color-prompt)]/10 p-4">
            <p className="text-sm font-medium text-foreground">$20 credits earned</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Credits will be added to your account once the review is approved.
            </p>
          </div>
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
          Share your experience and earn $20 in credits when approved.
        </p>

        <Card className="mt-6 border-0 shadow-lg sm:mt-8">
          <CardContent className="p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Builder Info */}
              <div className="space-y-4">
                <h2 className="font-medium text-foreground">Builder Information</h2>

                <div className="space-y-1.5">
                  <label htmlFor="builderName" className="text-sm font-medium">
                    Builder / Company Name
                  </label>
                  <Input
                    id="builderName"
                    value={builderName}
                    onChange={(e) => setBuilderName(e.target.value)}
                    placeholder="e.g. Pak Wayan Construction"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="builderPhone" className="text-sm font-medium">
                    Phone / WhatsApp Number
                  </label>
                  <Input
                    id="builderPhone"
                    type="tel"
                    value={builderPhone}
                    onChange={(e) => setBuilderPhone(e.target.value)}
                    placeholder="+62 812 XXX XXXX"
                    className="h-11"
                    required
                  />
                </div>
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

              <p className="text-center text-xs text-muted-foreground">
                Reviews are checked before publishing. You&apos;ll earn $20 in credits once approved.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
