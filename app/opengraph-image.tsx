import { ImageResponse } from 'next/og';

/**
 * Social share image, generated at build time.
 *
 * Replaces the previous static og-image.png, which still carried the abandoned
 * teal palette (#66FCF1 / #1C242E) from an earlier design direction — so every
 * share misrepresented the current brand.
 */

export const alt = 'Finch Technology — cloud software built for Malaysian businesses';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 100%)',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: '#0369a1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            F
          </div>
          <div style={{ color: '#ffffff', fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Finch Technology
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#ffffff',
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              maxWidth: 900,
            }}
          >
            Software built for how Malaysian businesses actually operate.
          </div>
          <div style={{ marginTop: 28, color: '#bae6fd', fontSize: 28, lineHeight: 1.4 }}>
            We build and operate NexMenu — restaurant ordering, POS and kitchen operations.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#7dd3fc', fontSize: 24 }}>
          <span>finchtech.my</span>
          <span style={{ color: '#475569' }}>·</span>
          <span>Puchong, Selangor, Malaysia</span>
        </div>
      </div>
    ),
    size,
  );
}
