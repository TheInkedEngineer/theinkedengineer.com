import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import { OgTemplate } from '@/lib/og/template'
import { loadOgFonts } from '@/lib/og/fonts'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || '').slice(0, 120)
  const subtitle = (searchParams.get('subtitle') || '').slice(0, 160)
  const coverUrl = searchParams.get('cover') || undefined
  // badge removed from template; ignore any provided param

  const base = new URL(req.url).origin
  const fonts = await loadOgFonts(base)

  return new ImageResponse(
    <OgTemplate title={title || 'The Inked Engineer'} subtitle={subtitle} coverUrl={coverUrl} />,
    { width: 1200, height: 630, fonts }
  )
}
