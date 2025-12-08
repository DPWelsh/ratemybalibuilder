import Link from 'next/link';
import { SearchForm } from '@/components/SearchForm';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Don&apos;t get burned by a{' '}
          <span className="text-red-600">bad builder</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Check if your Bali builder is blacklisted, unknown, or recommended
          before you sign that contract. Protect your investment with real data
          from real expats.
        </p>

        <div className="mt-10 w-full max-w-lg">
          <SearchForm />
        </div>

        <div className="mt-8 flex items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-green-500">🟢</span>
            <span>Recommended</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">🟡</span>
            <span>Unknown</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-500">🔴</span>
            <span>Blacklisted</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-gray-200 bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How It Works
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                🔍
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                1. Search
              </h3>
              <p className="mt-2 text-gray-600">
                Enter the builder&apos;s name and phone number to search our database
              </p>
              <p className="mt-1 text-sm font-medium text-blue-600">$10</p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                🔓
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                2. Unlock
              </h3>
              <p className="mt-2 text-gray-600">
                Found them? Unlock full details including reviews, photos, and
                red flags
              </p>
              <p className="mt-1 text-sm font-medium text-blue-600">$20</p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                ✅
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                3. Decide
              </h3>
              <p className="mt-2 text-gray-600">
                Make an informed decision about your build with real feedback
                from expats
              </p>
              <p className="mt-1 text-sm font-medium text-green-600">
                Peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Earn Credits */}
      <section className="border-t border-gray-200 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Built something in Bali?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Help other expats by sharing your experience. Submit a review and
            earn <span className="font-semibold text-green-600">$20 in credits</span>.
          </p>
          <Link
            href="/submit-review"
            className="mt-8 inline-block rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Submit a Review
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-8">
        <div className="mx-auto max-w-4xl text-center text-sm text-gray-500">
          <p>
            RateMyBaliBuilder - Protecting expat builders since 2024
          </p>
          <p className="mt-2">
            Have questions?{' '}
            <a href="mailto:hello@ratemybalibuilder.com" className="text-blue-600 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
