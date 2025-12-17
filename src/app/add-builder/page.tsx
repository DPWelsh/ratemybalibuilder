'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2Icon, UserPlusIcon, CheckIcon, ThumbsUpIcon, HelpCircleIcon, AlertTriangleIcon, StarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { tradeTypes, locations, BuilderStatus } from '@/lib/supabase/builders';

const statusOptions: {
  value: BuilderStatus;
  label: string;
  description: string;
  icon: typeof ThumbsUpIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    value: 'recommended',
    label: 'Recommended',
    description: 'Had a good experience',
    icon: ThumbsUpIcon,
    color: 'text-[var(--status-recommended)]',
    bgColor: 'bg-[var(--status-recommended)]/10',
    borderColor: 'border-[var(--status-recommended)]',
  },
  {
    value: 'unknown',
    label: 'Neutral',
    description: 'No experience yet',
    icon: HelpCircleIcon,
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary',
    borderColor: 'border-muted-foreground',
  },
  {
    value: 'blacklisted',
    label: 'Flagged',
    description: 'Bad experience, avoid',
    icon: AlertTriangleIcon,
    color: 'text-[var(--status-blacklisted)]',
    bgColor: 'bg-[var(--status-blacklisted)]/10',
    borderColor: 'border-[var(--status-blacklisted)]',
  },
];

export default function AddBuilderPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tradeType, setTradeType] = useState('General Contractor');
  const [location, setLocation] = useState('Other');
  const [status, setStatus] = useState<BuilderStatus | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdBuilderId, setCreatedBuilderId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/builders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          trade_type: tradeType,
          location,
          status: status || 'unknown',
          company_name: companyName || null,
          rating,
          review_text: reviewText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.existingId) {
          setError(`${data.error}. View their profile instead.`);
          setCreatedBuilderId(data.existingId);
        } else {
          setError(data.error || 'Failed to add builder');
        }
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setCreatedBuilderId(data.builder.id);
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-0">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-recommended)]/10 sm:mb-6 sm:h-16 sm:w-16">
            <CheckIcon className="h-7 w-7 text-[var(--status-recommended)] sm:h-8 sm:w-8" />
          </div>
          <h1 className="text-xl text-foreground sm:text-2xl">Submission received!</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Thank you for contributing. Your builder and review will be reviewed by our team before going live.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center">
            {createdBuilderId && (
              <Button asChild size="lg">
                <Link href={`/builder/${createdBuilderId}`}>
                  View Builder
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-0">
      <div className="w-full max-w-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-prompt)]/10 sm:mb-6 sm:h-16 sm:w-16">
          <UserPlusIcon className="h-7 w-7 text-[var(--color-prompt)] sm:h-8 sm:w-8" />
        </div>

        <h1 className="text-center text-2xl text-foreground sm:text-3xl">
          Add a builder
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground sm:mt-3 sm:text-base">
          Know a builder in Bali? Add them to help others.
        </p>

        <Card className="mt-6 border-0 shadow-lg sm:mt-8">
          <CardContent className="p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive sm:p-4">
                  {error}
                  {createdBuilderId && (
                    <Link
                      href={`/builder/${createdBuilderId}`}
                      className="ml-2 underline"
                    >
                      View profile
                    </Link>
                  )}
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Builder / Company Name *
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pak Made Construction"
                  required
                  className="h-11 sm:h-12"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone / WhatsApp *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812 XXX XXXX"
                  required
                  className="h-11 sm:h-12"
                />
                <p className="text-xs text-muted-foreground">Must start with +62</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-sm font-medium">
                    Trade Type
                  </label>
                  <Select value={tradeType} onValueChange={setTradeType}>
                    <SelectTrigger className="h-11 sm:h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tradeTypes.map((trade) => (
                        <SelectItem key={trade} value={trade}>
                          {trade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-sm font-medium">
                    Location
                  </label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-11 sm:h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-medium">
                  Your experience with this builder *
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {statusOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = status === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStatus(opt.value)}
                        className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all sm:gap-2 sm:p-4 ${
                          isSelected
                            ? `${opt.borderColor} ${opt.bgColor}`
                            : 'border-transparent bg-secondary/50 hover:bg-secondary'
                        }`}
                      >
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${isSelected ? opt.color : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-medium sm:text-sm ${isSelected ? opt.color : 'text-foreground'}`}>
                          {opt.label}
                        </span>
                        <span className="hidden text-[10px] text-muted-foreground sm:block">
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium">
                  Company Name (optional)
                </label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="If different from builder name"
                  className="h-11 sm:h-12"
                />
              </div>

              {/* Rating */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-medium">
                  Rate this builder *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <StarIcon
                        className={`h-8 w-8 sm:h-10 sm:w-10 ${
                          star <= rating
                            ? 'fill-[var(--color-energy)] text-[var(--color-energy)]'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="reviewText" className="text-sm font-medium">
                  Your review *
                </label>
                <Textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this builder (minimum 20 characters)"
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {reviewText.length}/20 characters minimum
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full sm:h-12"
                disabled={isLoading || !status || rating === 0 || reviewText.length < 20}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Builder & Review'
                )}
              </Button>

              {(!status || rating === 0 || reviewText.length < 20) && (
                <p className="text-center text-xs text-muted-foreground">
                  {!status
                    ? 'Please select your experience with this builder'
                    : rating === 0
                    ? 'Please rate this builder'
                    : 'Please write at least 20 characters in your review'}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground sm:mt-6">
          Have a review to share?{' '}
          <Link href="/submit-review" className="text-[var(--color-prompt)] hover:underline">
            Submit a review instead
          </Link>
        </p>
      </div>
    </div>
  );
}
