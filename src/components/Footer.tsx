import Link from 'next/link';
import Image from 'next/image';
import { TrustStats } from './TrustStats';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/50 text-foreground">
      {/* Main footer content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/icon.svg" alt="Logo" width={28} height={28} className="h-7 w-7" />
              <span className="font-['Raptor'] text-lg">RateMyBaliBuilder</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Helping you find trusted builders in Bali. Community-verified reviews you can count on.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Platform</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/builders" className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-prompt)]">
                  Browse Builders
                </Link>
              </li>
              <li>
                <Link href="/submit-review" className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-prompt)]">
                  Submit a Review
                </Link>
              </li>
              <li>
                <Link href="/buy-credits" className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-prompt)]">
                  Buy Credits
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Company</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-prompt)]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-prompt)]">
                  Contact
                </Link>
              </li>
              <li>
                <a href="mailto:hello@ratemybalibuilder.com" className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-prompt)]">
                  hello@ratemybalibuilder.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Legal</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-prompt)]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-prompt)]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-12 border-t border-border pt-8">
          <TrustStats variant="compact" className="justify-center text-muted-foreground" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} RateMyBaliBuilder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
