import Link from "next/link"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import ArticleActions from "@/components/article-actions"
import { notFound } from "next/navigation"
import { getAllArticleSlugs, getArticleBySlug, markdownToHtml, formatDate } from "@/lib/markdown"
import { EaseIn } from "@/components/animate/EaseIn"
import { Card } from "@/components/ui/card"
import { Title } from "@/components/ui/title"
import { spacing } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theinkedengineer.com"
  const url = new URL(`/insights/${article.slug}`, baseUrl).toString()
  const description = article.description || `${article.title} — ${article.readTime}`
  const imageUrl = new URL(`/insights/${article.slug}/opengraph-image`, baseUrl).toString()

  return {
    title: article.title,
    description,
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      publishedTime: article.date || undefined,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      creator: "@theinkedengineer",
      images: [imageUrl],
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const htmlContent = await markdownToHtml(article.content)

  return (
    <div className="min-h-[100vh] min-h-[100dvh] bg-brand-yellow pb-20">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/4 h-40 bg-brand-pink transform rotate-45 translate-x-20 -translate-y-10"></div>
          <div className="absolute top-32 left-0 w-1/3 h-32 bg-brand-pink transform -rotate-12 -translate-x-16"></div>
        </div>

        <div className={cn("relative z-10", spacing.container, spacing.section)}>
          <EaseIn y={10} duration={450}>
            <Link
              href="/insights"
              className="inline-flex items-center text-brand-black font-bold text-lg mb-8 hover:text-brand-pink transition-colors"
            >
              <svg className="w-5 h-5 mr-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Back to Insights
            </Link>
          </EaseIn>

          <EaseIn y={12} duration={520} delay={60}>
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-brand-black font-medium">{formatDate(article.date)}</span>
                <span className="text-brand-black">{article.readTime}</span>
              </div>

              <Title as="h1">{article.title}</Title>
            </div>
          </EaseIn>
        </div>
      </div>

      {/* Floating top-right actions */}
      <ArticleActions />

      {/* Article Content */}
      <div className={cn(spacing.container)}>
        <EaseIn y={16} duration={560} delay={120}>
          <div className="mx-auto">
            <Card variant="default">
              <div className="prose prose-lg max-w-none">
                <div className="article-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </div>
            </Card>
          </div>
        </EaseIn>
      </div>

      <Navigation />
    </div>
  )
}
