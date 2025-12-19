import type { Metadata } from 'next';
import { BuildersPageClient } from './BuildersPageClient';

const siteUrl = 'https://ratemybalibuilder.com';

export const metadata: Metadata = {
  title: 'Browse Builders',
  description: 'Search and browse our complete database of Bali builders, contractors, and tradespeople. Filter by location, trade type, and status. Read reviews before hiring.',
  keywords: [
    'Bali builders',
    'Bali contractors',
    'Bali construction',
    'builder database',
    'contractor directory',
    'Bali villa builders',
    'Bali plumbers',
    'Bali electricians',
    'Bali architects',
    'construction reviews',
  ],
  openGraph: {
    title: 'Browse Builders | RateMyBaliBuilder',
    description: 'Search and browse our complete database of Bali builders, contractors, and tradespeople. Filter by location, trade type, and status.',
    url: `${siteUrl}/builders`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Builders | RateMyBaliBuilder',
    description: 'Search and browse our complete database of Bali builders, contractors, and tradespeople.',
  },
};

// JSON-LD for the builders listing page
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bali Builders Directory",
  description: "Complete database of builders, contractors, and tradespeople in Bali, Indonesia",
  url: `${siteUrl}/builders`,
  itemListElement: {
    "@type": "ListItem",
    position: 1,
    item: {
      "@type": "LocalBusiness",
      name: "Bali Builder",
      description: "A builder or contractor in Bali",
    },
  },
};

export default function BuildersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BuildersPageClient />
    </>
  );
}
