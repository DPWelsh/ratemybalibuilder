import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/server';
import { BuilderPageClient } from './BuilderPageClient';

const siteUrl = 'https://ratemybalibuilder.com';

interface Builder {
  id: string;
  name: string;
  phone: string;
  company_name: string | null;
  instagram: string | null;
  website: string | null;
  google_reviews_url: string | null;
  status: 'recommended' | 'unknown' | 'blacklisted';
  location: string;
  trade_type: string;
  project_types: string[];
  notes: string | null;
  is_published: boolean;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getBuilder(id: string): Promise<Builder | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('builders')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const builder = await getBuilder(id);

  if (!builder || !builder.is_published) {
    return {
      title: 'Builder Not Found',
      description: 'This builder could not be found in our database.',
    };
  }

  const title = builder.company_name
    ? `${builder.name} - ${builder.company_name}`
    : builder.name;

  const description = `View reviews and ratings for ${builder.name}${builder.company_name ? ` (${builder.company_name})` : ''} - ${builder.trade_type} in ${builder.location}, Bali. See what clients say before hiring.`;

  const statusText = builder.status === 'recommended'
    ? 'Recommended'
    : builder.status === 'blacklisted'
      ? 'Flagged'
      : 'Unknown';

  return {
    title,
    description,
    keywords: [
      builder.name,
      builder.company_name,
      builder.trade_type,
      builder.location,
      'Bali builder',
      'Bali contractor',
      'builder reviews',
      ...(builder.project_types || []),
    ].filter(Boolean) as string[],
    openGraph: {
      title: `${title} | RateMyBaliBuilder`,
      description,
      url: `${siteUrl}/builder/${id}`,
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${title} | RateMyBaliBuilder`,
      description,
    },
    other: {
      'builder:status': statusText,
      'builder:trade': builder.trade_type,
      'builder:location': builder.location,
    },
  };
}

export default async function BuilderPage({ params }: PageProps) {
  const { id } = await params;
  const builder = await getBuilder(id);

  // Generate JSON-LD for the builder
  const jsonLd = builder && builder.is_published ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/builder/${id}`,
    name: builder.company_name || builder.name,
    description: `${builder.trade_type} in ${builder.location}, Bali`,
    url: `${siteUrl}/builder/${id}`,
    telephone: builder.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: builder.location,
      addressRegion: "Bali",
      addressCountry: "ID",
    },
    areaServed: {
      "@type": "Place",
      name: builder.location === "Bali Wide" ? "Bali, Indonesia" : `${builder.location}, Bali, Indonesia`,
    },
    ...(builder.website && { sameAs: [builder.website] }),
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BuilderPageClient builderId={id} initialBuilder={builder} />
    </>
  );
}
