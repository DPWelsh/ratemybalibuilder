import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppLayout } from "@/components/AppLayout";
import { Footer } from "@/components/Footer";

const siteUrl = "https://ratemybalibuilder.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RateMyBaliBuilder - Vet Your Builder Before You Build",
    template: "%s | RateMyBaliBuilder",
  },
  description: "Search our database of Bali builders. See ratings, reviews, and red flags from real clients. Protect your investment before signing that contract.",
  keywords: ["Bali builder", "Bali contractor", "Bali construction", "villa builder Bali", "builder reviews", "contractor reviews Indonesia", "Bali villa construction"],
  authors: [{ name: "RateMyBaliBuilder" }],
  creator: "RateMyBaliBuilder",
  publisher: "RateMyBaliBuilder",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "RateMyBaliBuilder",
    title: "RateMyBaliBuilder - Vet Your Builder Before You Build",
    description: "Search our database of Bali builders. See ratings, reviews, and red flags from real clients. Protect your investment before signing that contract.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RateMyBaliBuilder - Vet Your Builder Before You Build",
    description: "Search our database of Bali builders. See ratings, reviews, and red flags from real clients.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// JSON-LD structured data for the site
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "RateMyBaliBuilder",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.svg`,
      },
      description: "Community-driven platform for reviewing and vetting builders in Bali, Indonesia.",
      areaServed: {
        "@type": "Place",
        name: "Bali, Indonesia",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "RateMyBaliBuilder",
      description: "Search our database of Bali builders. See ratings, reviews, and red flags from real clients.",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/builders?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased flex min-h-screen flex-col" suppressHydrationWarning>
        <AppLayout>
          <div className="flex-1">{children}</div>
          <Footer />
        </AppLayout>
      </body>
    </html>
  );
}
