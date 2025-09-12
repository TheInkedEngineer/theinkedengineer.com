/*
 * Reusable composition for OG/Twitter images rendered via next/server ImageResponse.
 * Tailwind is not available in this environment, so inline styles are used.
 * We align with brand tokens defined in app/globals.css:
 * - brand yellow: #f4d35e
 * - brand pink:   #f8c0c8
 * - brand black:  #000000
 */

type OgTemplateProps = {
  title: string
  subtitle?: string
  coverUrl?: string
  background?: 'yellow' | 'pink'
}

const BRAND = {
  yellow: '#f4d35e',
  pink: '#f8c0c8',
  black: '#000000',
  white: '#ffffff',
}

export function OgTemplate({ title, subtitle, coverUrl, background = 'yellow' }: OgTemplateProps) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        position: 'relative',
        backgroundColor: background === 'pink' ? BRAND.pink : BRAND.yellow,
        color: BRAND.black,
        fontFamily: 'Delight, system-ui, sans-serif',
      }}
    >
      {(() => {
        const shapeColor = background === 'pink' ? BRAND.yellow : BRAND.pink
        return (
          <>
            {/* Geometric background shapes (brand accent) */}
            <div
              style={{
                position: 'absolute',
                top: -20,
                left: 220,
                width: 360,
                height: 90,
                backgroundColor: shapeColor,
                transform: 'rotate(-12deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 140,
                right: -30,
                width: 240,
                height: 80,
                backgroundColor: shapeColor,
                transform: 'rotate(36deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -20,
                left: -30,
                width: 300,
                height: 70,
                backgroundColor: shapeColor,
                transform: 'rotate(10deg)',
              }}
            />
          </>
        )
      })()}
      {/* Left content block */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 48,
          flex: 1,
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1.05 }}>{title}</div>
        {subtitle ? (
          <div style={{ fontSize: 32, fontWeight: 500, opacity: 0.7, maxWidth: 760, marginTop: 12 }}>{subtitle}</div>
        ) : null}
      </div>

      {/* Right cover image, optional */}
      {coverUrl ? (
        <div
          style={{
            height: '100%',
            width: 420,
            overflow: 'hidden',
            borderLeft: `4px solid ${BRAND.black}`,
            backgroundColor: BRAND.pink,
          }}
        >
          <img
            src={coverUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : null}
    </div>
  )
}
