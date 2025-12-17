'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2Icon, AlertTriangleIcon, CheckIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const reportReasons = [
  { value: 'abandoned_project', label: 'Abandoned project' },
  { value: 'poor_quality', label: 'Poor quality work' },
  { value: 'cost_overrun', label: 'Significant cost overruns' },
  { value: 'safety_issues', label: 'Safety violations' },
  { value: 'fraud', label: 'Fraud or dishonesty' },
  { value: 'no_show', label: 'No-show / disappeared' },
  { value: 'other', label: 'Other issue' },
];

function ReportForm() {
  const searchParams = useSearchParams();
  const builderId = searchParams.get('id');
  const builderName = searchParams.get('name');
  const builderPhone = searchParams.get('phone');

  const [name, setName] = useState(builderName || '');
  const [phone, setPhone] = useState(builderPhone || '');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reason) {
      setError('Please select a reason for your report');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builder_id: builderId || null,
          builder_name: name || null,
          builder_phone: phone || null,
          reason,
          details: details || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit report');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
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
          <h1 className="text-xl text-foreground sm:text-2xl">Report submitted</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Thank you for your report. Our team will review it and take appropriate action.
          </p>
          <Button asChild size="lg" variant="outline" className="mt-6 w-full sm:mt-8 sm:w-auto">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-0">
      <div className="w-full max-w-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-energy)]/10 sm:mb-6 sm:h-16 sm:w-16">
          <AlertTriangleIcon className="h-7 w-7 text-[var(--color-energy)] sm:h-8 sm:w-8" />
        </div>

        <h1 className="text-center text-2xl text-foreground sm:text-3xl">
          Report a builder
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground sm:mt-3 sm:text-base">
          Had a bad experience? Help warn other expats.
        </p>

        <Card className="mt-6 border-0 shadow-lg sm:mt-8">
          <CardContent className="p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive sm:p-4">
                  {error}
                </div>
              )}

              {!builderId && (
                <>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Builder Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Pak Made Construction"
                      className="h-11 sm:h-12"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone / WhatsApp
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+62 812 XXX XXXX"
                      className="h-11 sm:h-12"
                    />
                  </div>
                </>
              )}

              {builderId && builderName && (
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p className="font-medium">Reporting: {builderName}</p>
                  {builderPhone && <p className="text-muted-foreground">{builderPhone}</p>}
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-sm font-medium">
                  Reason for report *
                </label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="h-11 sm:h-12">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportReasons.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="details" className="text-sm font-medium">
                  Details (optional)
                </label>
                <Textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell us what happened..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full bg-[var(--color-energy)] hover:bg-[var(--color-energy)]/90 sm:h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground sm:mt-6 sm:text-sm">
          Reports are reviewed by our team before any action is taken.
        </p>
      </div>
    </div>
  );
}

export default function ReportBuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <ReportForm />
    </Suspense>
  );
}
