import type { Metadata } from 'next';
import { AddBuilderClient } from './AddBuilderClient';

export const metadata: Metadata = {
  title: 'Add a Builder',
  description: 'Add a builder, contractor, or tradesperson to the RateMyBaliBuilder database. Help others find reliable construction professionals in Bali.',
  keywords: [
    'add builder',
    'submit builder',
    'Bali contractor',
    'builder review',
    'recommend builder',
    'report builder',
  ],
  openGraph: {
    title: 'Add a Builder | RateMyBaliBuilder',
    description: 'Add a builder to our database and help others find reliable construction professionals in Bali.',
  },
};

export default function AddBuilderPage() {
  return <AddBuilderClient />;
}
