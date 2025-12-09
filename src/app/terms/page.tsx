import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-12 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl tracking-tight text-foreground sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: December 2024
        </p>

        <div className="mt-8 space-y-8 text-muted-foreground sm:mt-12">
          <section>
            <h2 className="text-xl font-medium text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using RateMyBaliBuilder (&quot;the Service&quot;), you agree to be bound
              by these Terms of Service. If you do not agree to these terms, please do not use
              our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">2. Description of Service</h2>
            <p className="mt-3">
              RateMyBaliBuilder is a platform that allows users to search for and review builders,
              contractors, and tradespeople in Bali, Indonesia. We provide information based on
              community-submitted reviews to help users make informed decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">3. User Accounts</h2>
            <div className="mt-3 space-y-3">
              <p>
                You must create an account to use certain features of our Service. You are
                responsible for maintaining the confidentiality of your account credentials and
                for all activities that occur under your account.
              </p>
              <p>
                You agree to provide accurate, current, and complete information during
                registration and to update such information as necessary.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">4. Credits and Payments</h2>
            <div className="mt-3 space-y-3">
              <p>
                <strong className="text-foreground">Credits:</strong> Our Service uses a
                credit-based system. Credits are used to search for builders and unlock detailed
                profiles.
              </p>
              <p>
                <strong className="text-foreground">Purchases:</strong> All credit purchases are
                final and non-refundable, except as required by law.
              </p>
              <p>
                <strong className="text-foreground">Promotional Credits:</strong> Free promotional
                credits may be offered at our discretion and may expire or be modified at any
                time.
              </p>
              <p>
                <strong className="text-foreground">Review Credits:</strong> Credits earned by
                submitting approved reviews are subject to our review guidelines and approval
                process.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">5. User Content</h2>
            <div className="mt-3 space-y-3">
              <p>
                <strong className="text-foreground">Reviews:</strong> When you submit a review,
                you grant us a non-exclusive, worldwide, royalty-free license to use, display,
                and distribute that content on our platform.
              </p>
              <p>
                <strong className="text-foreground">Accuracy:</strong> You represent that all
                information you submit is accurate and based on genuine personal experience.
              </p>
              <p>
                <strong className="text-foreground">Prohibited Content:</strong> You agree not to
                submit content that is defamatory, false, misleading, harassing, or that violates
                any applicable law.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">6. Review Guidelines</h2>
            <p className="mt-3">All reviews must:</p>
            <ul className="mt-2 list-inside list-disc space-y-2">
              <li>Be based on genuine personal experience</li>
              <li>Be accurate and truthful to the best of your knowledge</li>
              <li>Not contain personal attacks, hate speech, or discriminatory language</li>
              <li>Not include confidential or proprietary information</li>
              <li>Not be submitted in exchange for payment or incentives from the builder</li>
            </ul>
            <p className="mt-3">
              We reserve the right to remove reviews that violate these guidelines and to suspend
              or terminate accounts that repeatedly violate our policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">7. Disclaimer of Warranties</h2>
            <div className="mt-3 space-y-3">
              <p>
                The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any
                kind. We do not guarantee the accuracy, completeness, or reliability of any
                information on our platform.
              </p>
              <p>
                <strong className="text-foreground">No Endorsement:</strong> The inclusion of a
                builder in our database does not constitute an endorsement or recommendation.
                Users should conduct their own due diligence before engaging any service provider.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">8. Limitation of Liability</h2>
            <p className="mt-3">
              To the maximum extent permitted by law, RateMyBaliBuilder shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages arising from
              your use of the Service, including but not limited to damages resulting from
              reliance on builder information or reviews.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">9. Indemnification</h2>
            <p className="mt-3">
              You agree to indemnify and hold harmless RateMyBaliBuilder and its officers,
              directors, employees, and agents from any claims, damages, losses, or expenses
              arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">10. Modifications</h2>
            <p className="mt-3">
              We reserve the right to modify these Terms at any time. We will notify users of
              significant changes by posting a notice on our website. Continued use of the
              Service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">11. Termination</h2>
            <p className="mt-3">
              We may suspend or terminate your account at any time for violations of these Terms
              or for any other reason at our discretion. Upon termination, your right to use the
              Service will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">12. Governing Law</h2>
            <p className="mt-3">
              These Terms shall be governed by and construed in accordance with the laws of
              Indonesia, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground">13. Contact</h2>
            <p className="mt-3">
              For questions about these Terms, please contact us at{' '}
              <a
                href="mailto:legal@ratemybalibuilder.com"
                className="text-[var(--color-prompt)] hover:underline"
              >
                legal@ratemybalibuilder.com
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
