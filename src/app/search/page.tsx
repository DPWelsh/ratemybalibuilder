import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { MaskedPhone } from '@/components/MaskedPhone';
import { StarRating } from '@/components/StarRating';
import { searchBuilders } from '@/lib/supabase/builders-server';
import { ArrowRightIcon, SearchXIcon, PlusCircleIcon } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ name?: string; phone?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const { name, phone } = params;

  // Perform search against Supabase
  const results = await searchBuilders(name, phone);

  const hasQuery = name || phone;

  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-6 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl">
        {/* Search Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl text-foreground sm:text-3xl">Search Results</h1>
          {hasQuery && (
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {name && <span>Name: &quot;{name}&quot;</span>}
              {name && phone && <span> &middot; </span>}
              {phone && <span>Phone: &quot;{phone}&quot;</span>}
            </p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {results.length} builder{results.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="relative">
            {/* Results list - free for everyone */}
            <div className="space-y-4">
                {results.map((builder) => (
                  <Card key={builder.id} className="border-0 shadow-md">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <h2 className="text-lg font-medium text-foreground sm:text-xl">
                            {builder.name}
                          </h2>
                          <MaskedPhone phone={builder.phone} masked={true} />
                        </div>
                        <StatusBadge status={builder.status} size="md" />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {builder.avg_rating > 0 && (
                          <div className="flex items-center gap-1.5">
                            <StarRating rating={builder.avg_rating} size="sm" />
                            <span>{builder.avg_rating.toFixed(1)}</span>
                          </div>
                        )}
                        <span>{builder.review_count} review{builder.review_count !== 1 ? 's' : ''}</span>
                      </div>

                      <div className="mt-4 sm:mt-6">
                        <Button asChild className="h-11 w-full sm:h-auto sm:w-auto">
                          <Link href={`/builder/${builder.id}`}>
                            View Details
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ) : (
          // No Results
          <Card className="border-0 shadow-md">
            <CardContent className="px-4 py-12 text-center sm:px-6 sm:py-16">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted sm:h-16 sm:w-16">
                <SearchXIcon className="h-7 w-7 text-muted-foreground sm:h-8 sm:w-8" />
              </div>
              <h2 className="text-lg font-medium text-foreground sm:text-xl">No builders found</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground sm:text-base">
                We don&apos;t have this builder in our database yet. Help other expats by submitting a review.
              </p>
              <Button asChild className="mt-6">
                <Link href="/submit-review">
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Submit a Review
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Back to search */}
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/">New Search</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
