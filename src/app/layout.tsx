import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = "https://ratemybalibuilder.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RateMyBaliBuilder - Vet Your Builder Before You Build",
    template: "%s | RateMyBaliBuilder",
  },
  description: "Search our database of Bali builders. See ratings, reviews, and red flags from real expats. Protect your investment before signing that contract.",
  keywords: ["Bali builder", "Bali contractor", "Bali construction", "villa builder Bali", "expat Bali", "builder reviews", "contractor reviews Indonesia"],
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
    description: "Search our database of Bali builders. See ratings, reviews, and red flags from real expats. Protect your investment before signing that contract.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RateMyBaliBuilder - Vet Your Builder Before You Build",
    description: "Search our database of Bali builders. See ratings, reviews, and red flags from real expats.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex min-h-screen flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
