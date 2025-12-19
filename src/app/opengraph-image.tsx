import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'RateMyBaliBuilder';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#171717',
        }}
      >
        {/* Logo container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          {/* Logo mark - matching your brand */}
          <div
            style={{
              width: 100,
              height: 100,
              backgroundColor: '#7D312D',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>

          {/* Brand name */}
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            RateMyBaliBuilder
          </span>
        </div>

        {/* Tagline */}
        <span
          style={{
            fontSize: 28,
            color: '#a1a1aa',
            marginTop: 24,
          }}
        >
          Vet your builder before you build
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
