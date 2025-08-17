import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { notFound } from "next/navigation"
import { getArticleBySlug, markdownToHtml, formatDate } from "@/lib/markdown"

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
    <div className="min-h-screen bg-[#F4D35E] pb-20">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/4 h-40 bg-[#F8C0C8] transform rotate-45 translate-x-20 -translate-y-10"></div>
          <div className="absolute top-32 left-0 w-1/3 h-32 bg-[#F8C0C8] transform -rotate-12 -translate-x-16"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          <Link
            href="/articles"
            className="inline-flex items-center text-black font-bold text-lg mb-8 hover:text-[#F8C0C8] transition-colors"
          >
            <svg className="w-5 h-5 mr-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            Back to Articles
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-black font-medium">{formatDate(article.date)}</span>
              <span className="text-black">{article.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-black leading-tight">{article.title}</h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-black">
            <div className="prose prose-lg max-w-none">
              <div className="article-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center">
            <Link
              href="/articles"
              className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-[#F8C0C8] hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              ← All Articles
            </Link>

            <div className="flex gap-4">
              <button className="px-6 py-3 bg-[#F8C0C8] text-black font-bold rounded-full hover:bg-black hover:text-white transition-all duration-300">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  )
}
