import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'RateMyBaliBuilder - Vet your builder before you build';
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
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)',
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            style={{ marginRight: 20 }}
          >
            <circle cx="50" cy="50" r="48" fill="#fff" />
            <polygon points="50,20 75,70 25,70" fill="#0a0a0a" />
          </svg>
          <span
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            RateMyBaliBuilder
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: 16,
            }}
          >
            Vet your builder
          </span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#f97316',
            }}
          >
            before you build
          </span>
        </div>

        {/* Status indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            marginTop: 48,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
              }}
            />
            <span style={{ color: '#a1a1aa', fontSize: 20 }}>Recommended</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#a855f7',
              }}
            />
            <span style={{ color: '#a1a1aa', fontSize: 20 }}>Unknown</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#f97316',
              }}
            />
            <span style={{ color: '#a1a1aa', fontSize: 20 }}>Blacklisted</span>
          </div>
        </div>

        {/* URL */}
        <span
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: '#71717a',
          }}
        >
          ratemybalibuilder.com
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
