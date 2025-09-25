import { ImageResponse } from 'next/og'
import { OgTemplate } from '@/lib/og/template'
import { loadOgFonts } from '@/lib/og/fonts'
import { getAllArticleSlugs, getArticleBySlug } from '@/lib/markdown'

export const dynamicParams = false
export const runtime = 'nodejs'
export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }))
}
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  const title = article?.title || params.slug
  const subtitle = article?.description || article?.readTime || undefined
  const fonts = await loadOgFonts(process.env.NEXT_PUBLIC_SITE_URL)
  return new ImageResponse(
    <OgTemplate title={title} subtitle={subtitle} />,
    { ...size, fonts }
  )
}
