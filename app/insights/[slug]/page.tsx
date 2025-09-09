import Link from "next/link"
import { Navigation } from "@/components/navigation"
import ArticleActions from "@/components/article-actions"
import { notFound } from "next/navigation"
import { getArticleBySlug, markdownToHtml, formatDate } from "@/lib/markdown"
import { EaseIn } from "@/components/animate/EaseIn"

interface PageProps {
  params: Promise<{ slug: string }>
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

        <div className="relative z-10 container mx-auto px-6 py-12">
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

              <h1 className="text-4xl md:text-6xl font-black text-brand-black leading-tight">{article.title}</h1>
            </div>
          </EaseIn>
      </div>
    </div>

    {/* Floating top-right actions */}
    <ArticleActions />

    {/* Article Content */}
    <div className="container mx-auto px-6">
      <EaseIn y={16} duration={560} delay={120}>
        <div className="mx-auto">
          <article className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-brand-black">
            <div className="prose prose-lg max-w-none">
              <div className="article-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </article>
        </div>
      </EaseIn>
    </div>

      <Navigation />
    </div>
  )
}
