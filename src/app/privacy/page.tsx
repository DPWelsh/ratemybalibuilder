import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-12 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl tracking-tight text-foreground sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: December 2024
        </p>

        <div className="mt-8 space-y-8 text-muted-foreground sm:mt-12">
          <section>
            <h2 className="text-xl font-medium text-foreground">1. Introduction</h2>
            <p className="mt-3">
              RateMyBaliBuilder (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">2. Information We Collect</h2>
            <div className="mt-3 space-y-3">
              <p>
                <strong className="text-foreground">Account Information:</strong> When you create
                an account, we collect your email address and password (encrypted).
              </p>
              <p>
                <strong className="text-foreground">Review Content:</strong> When you submit a
                review, we collect the information you provide about builders, including names,
                phone numbers, ratings, and written reviews.
              </p>
              <p>
                <strong className="text-foreground">Payment Information:</strong> When you
                purchase credits, payment processing is handled by Stripe. We do not store your
                credit card information.
              </p>
              <p>
                <strong className="text-foreground">Usage Data:</strong> We automatically collect
                certain information about your device and how you interact with our service,
                including IP address, browser type, and pages visited.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">3. How We Use Your Information</h2>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>To provide and maintain our service</li>
              <li>To process transactions and manage your account</li>
              <li>To display reviews and builder information to other users</li>
              <li>To communicate with you about your account or our services</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To improve our service and develop new features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">4. Information Sharing</h2>
            <div className="mt-3 space-y-3">
              <p>
                <strong className="text-foreground">Public Reviews:</strong> Reviews you submit
                are visible to other users who unlock builder profiles. Your email address is
                never publicly displayed.
              </p>
              <p>
                <strong className="text-foreground">Service Providers:</strong> We may share
                information with third-party service providers (such as Stripe for payments and
                Supabase for data storage) who help us operate our service.
              </p>
              <p>
                <strong className="text-foreground">Legal Requirements:</strong> We may disclose
                information if required by law or to protect our rights, safety, or property.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">5. Data Security</h2>
            <p className="mt-3">
              We implement appropriate technical and organizational measures to protect your
              personal information. However, no method of transmission over the Internet is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">6. Your Rights</h2>
            <p className="mt-3">You have the right to:</p>
            <ul className="mt-2 list-inside list-disc space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us at{' '}
              <a
                href="mailto:privacy@ratemybalibuilder.com"
                className="text-[var(--color-prompt)] hover:underline"
              >
                privacy@ratemybalibuilder.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">7. Cookies</h2>
            <p className="mt-3">
              We use essential cookies to maintain your session and preferences. We do not use
              tracking cookies for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">8. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the &quot;Last updated&quot;
              date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">9. Contact Us</h2>
            <p className="mt-3">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a
                href="mailto:privacy@ratemybalibuilder.com"
                className="text-[var(--color-prompt)] hover:underline"
              >
                privacy@ratemybalibuilder.com
              </a>{' '}
              or visit our{' '}
              <Link href="/contact" className="text-[var(--color-prompt)] hover:underline">
                Contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
