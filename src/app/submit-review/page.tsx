import type { Metadata } from 'next';
import { SubmitReviewClient } from './SubmitReviewClient';

export const metadata: Metadata = {
  title: 'Submit a Review',
  description: 'Share your experience with a builder in Bali. Help others make informed decisions by submitting honest reviews of contractors and tradespeople.',
  keywords: [
    'submit review',
    'builder review',
    'Bali contractor review',
    'rate builder',
    'construction feedback',
  ],
  openGraph: {
    title: 'Submit a Review | RateMyBaliBuilder',
    description: 'Share your experience with a builder in Bali. Help others make informed decisions.',
  },
};

export default function SubmitReviewPage() {
  return <SubmitReviewClient />;
}
