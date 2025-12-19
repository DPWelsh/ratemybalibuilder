import type { Metadata } from 'next';
import { ContactPageClient } from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with RateMyBaliBuilder. Have questions about builders in Bali? Want to report an issue or give feedback? We respond within 24 hours.',
  openGraph: {
    title: 'Contact Us | RateMyBaliBuilder',
    description: 'Get in touch with RateMyBaliBuilder. Have questions about builders in Bali? We respond within 24 hours.',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
