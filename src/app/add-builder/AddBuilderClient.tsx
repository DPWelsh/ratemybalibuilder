'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2Icon, UserPlusIcon, CheckIcon, ThumbsUpIcon, HelpCircleIcon, AlertTriangleIcon, StarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { TradeCombobox } from '@/components/TradeCombobox';
import { LocationCombobox } from '@/components/LocationCombobox';
import { BuilderStatus } from '@/lib/supabase/builders';

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
    description: 'Good experience',
    icon: ThumbsUpIcon,
    color: 'text-[var(--status-recommended)]',
    bgColor: 'bg-[var(--status-recommended)]/10',
    borderColor: 'border-[var(--status-recommended)]',
  },
  {
    value: 'unknown',
    label: 'Neutral',
    description: 'No experience',
    icon: HelpCircleIcon,
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary',
    borderColor: 'border-muted-foreground',
  },
  {
    value: 'blacklisted',
    label: 'Flagged',
    description: 'Avoid',
    icon: AlertTriangleIcon,
    color: 'text-[var(--status-blacklisted)]',
    bgColor: 'bg-[var(--status-blacklisted)]/10',
    borderColor: 'border-[var(--status-blacklisted)]',
  },
];

// Format phone number as user types: +62 812-3456-7890
function formatPhoneInput(value: string): string {
  // Remove all non-digits
  let digits = value.replace(/\D/g, '');

  // Handle common Indonesian formats
  if (digits.startsWith('0')) {
    digits = '62' + digits.substring(1);
  } else if (digits.startsWith('8') && digits.length <= 12) {
    digits = '62' + digits;
  }

  if (!digits) return '';

  // Format as +62 xxx-xxxx-xxxx
  if (digits.length <= 2) {
    return '+' + digits;
  } else if (digits.length <= 5) {
    return '+' + digits.slice(0, 2) + ' ' + digits.slice(2);
  } else if (digits.length <= 9) {
    return '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 5) + '-' + digits.slice(5);
  } else {
    return '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 5) + '-' + digits.slice(5, 9) + '-' + digits.slice(9, 13);
  }
}

// Check if phone looks valid (has enough digits)
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function AddBuilderClient() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tradeTypes, setTradeTypes] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<BuilderStatus | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdBuilderId, setCreatedBuilderId] = useState<string | null>(null);

  // Auto-format phone as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setPhone(formatted);
  };

  // Clear error when user makes changes
  useEffect(() => {
    if (error) setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, phone, tradeTypes, location, status, rating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!name.trim()) {
      setError('Please enter the builder name');
      return;
    }
    if (!isValidPhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }
    if (tradeTypes.length === 0) {
      setError('Please select at least one trade');
      return;
    }
    if (!location) {
      setError('Please select a location');
      return;
    }
    if (!status) {
      setError('Please select your experience');
      return;
    }
    if (rating === 0) {
      setError('Please rate the builder');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/builders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          trade_type: tradeTypes.join(', '),
          location: location,
          status,
          rating,
          review_text: reviewText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.existingId) {
          setError(`This builder already exists`);
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

  const resetForm = () => {
    setName('');
    setPhone('');
    setTradeTypes([]);
    setLocation('');
    setStatus(null);
    setRating(0);
    setHoverRating(0);
    setReviewText('');
    setError('');
    setSuccess(false);
    setCreatedBuilderId(null);
    setIsLoading(false);
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
            Thank you for contributing. Your submission will be reviewed by our team.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={resetForm}>
              Add Another
            </Button>
            {createdBuilderId && (
              <Button asChild variant="outline" size="lg">
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
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-prompt)]/10 sm:mb-4 sm:h-14 sm:w-14">
            <UserPlusIcon className="h-6 w-6 text-[var(--color-prompt)] sm:h-7 sm:w-7" />
          </div>
          <h1 className="text-2xl text-foreground sm:text-3xl">Add a Builder</h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2">
            Help others find reliable builders in Bali
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertTriangleIcon className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                  {createdBuilderId && (
                    <Link
                      href={`/builder/${createdBuilderId}`}
                      className="ml-auto shrink-0 underline"
                    >
                      View
                    </Link>
                  )}
                </div>
              )}

              {/* Builder Name */}
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Builder Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pak Made, CV Bali Builds"
                  className="h-12"
                  autoComplete="off"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                  WhatsApp / Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="0812 3456 7890"
                  className="h-12 font-mono"
                  autoComplete="off"
                />
              </div>

              {/* Trade & Location side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Trade</label>
                  <TradeCombobox value={tradeTypes} onValueChange={setTradeTypes} multi />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Location</label>
                  <LocationCombobox value={location} onValueChange={setLocation} />
                </div>
              </div>

              {/* Experience Status */}
              <div>
                <label className="mb-2 block text-sm font-medium">Your Experience</label>
                <div className="grid grid-cols-3 gap-2">
                  {statusOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = status === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStatus(opt.value)}
                        className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                          isSelected
                            ? `${opt.borderColor} ${opt.bgColor}`
                            : 'border-border bg-secondary/30 hover:bg-secondary/60'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? opt.color : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-medium ${isSelected ? opt.color : 'text-foreground'}`}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating - larger touch targets */}
              <div>
                <label className="mb-2 block text-sm font-medium">Rating</label>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="rounded-lg p-1.5 transition-transform hover:scale-110 active:scale-95"
                    >
                      <StarIcon
                        className={`h-9 w-9 sm:h-10 sm:w-10 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'fill-[var(--color-energy)] text-[var(--color-energy)]'
                            : 'text-muted-foreground/25'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label htmlFor="reviewText" className="mb-1.5 block text-sm font-medium">
                  Review <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <Textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already listed?{' '}
          <Link href="/submit-review" className="text-[var(--color-prompt)] hover:underline">
            Submit a review
          </Link>
        </p>
      </div>
    </div>
  );
}
