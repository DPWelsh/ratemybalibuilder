import Link from 'next/link';
import { TrustStats } from './TrustStats';

export function Footer() {
  return (
    <footer className="border-t bg-card px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
          <div className="text-sm text-muted-foreground">
            RateMyBaliBuilder
          </div>
          <TrustStats variant="compact" />
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground sm:justify-end sm:gap-6">
            <Link href="/about" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
