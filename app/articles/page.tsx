import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { getAllArticles, formatDate } from "@/lib/markdown"

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <>
      <main className="min-h-screen bg-[#F4D35E] pb-20">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-0 right-0 w-1/3 h-32 bg-[#F8C0C8] transform rotate-12 translate-x-16 -translate-y-8"></div>
            <div className="absolute top-20 left-0 w-1/4 h-24 bg-[#F8C0C8] transform -rotate-6 -translate-x-8"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-16">
            <div className="max-w-4xl">
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-black leading-none mb-4 md:mb-6">
                STUFF I
                <br />
                WROTE
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-black font-medium max-w-2xl leading-relaxed">
                Technical articles, thoughts, and experiences from building things with code.
              </p>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 md:gap-8 lg:gap-12">
            {articles.map((article, index) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className="group block">
                <article className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 active:scale-98 border-4 border-black hover:border-[#F8C0C8]">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    {/* Article Number */}
                    <div className="flex-shrink-0 self-start md:self-auto">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F8C0C8] rounded-full flex items-center justify-center">
                        <span className="text-lg md:text-2xl font-black text-black">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4">
                        <span className="text-gray-600 font-medium text-sm md:text-base">{formatDate(article.date)}</span>
                        <span className="text-gray-600 text-sm md:text-base">{article.readTime}</span>
                      </div>

                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-black mb-3 md:mb-4 group-hover:text-[#F8C0C8] transition-colors leading-tight">
                        {article.title}
                      </h2>

                      <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
                        {article.description}
                      </p>

                      <div className="flex items-center text-black font-bold group-hover:text-[#F8C0C8] transition-colors">
                        <span className="mr-2 text-sm md:text-base">Read Article</span>
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-2 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Navigation />
    </>
  )
}
