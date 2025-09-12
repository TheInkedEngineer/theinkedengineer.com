import { ImageResponse } from 'next/og'
import { OgTemplate } from '@/lib/og/template'
import { loadOgFonts } from '@/lib/og/fonts'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const fonts = await loadOgFonts(base)
  return new ImageResponse(
    <OgTemplate title="Firas, TheInkedEngineer" subtitle="Software Engineer with a knack for design" />,
    { ...size, fonts }
  )
}
