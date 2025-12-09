'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { Review } from '@/lib/dummy-data';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % review.photos.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + review.photos.length) % review.photos.length);
  };

  return (
    <>
      <Card className="border-0 bg-secondary/30">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs text-muted-foreground sm:text-sm">{formattedDate}</span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-foreground sm:text-base">
            {review.text}
          </p>

          {review.photos.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {review.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="flex-shrink-0 overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={`Review photo ${index + 1}`}
                    className="h-20 w-20 object-cover transition-transform hover:scale-105 sm:h-24 sm:w-24"
                  />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <XIcon className="h-6 w-6" />
          </button>

          {review.photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Previous"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Next"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.photos[lightboxIndex]}
            alt={`Review photo ${lightboxIndex + 1}`}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {review.photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
              {lightboxIndex + 1} / {review.photos.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
