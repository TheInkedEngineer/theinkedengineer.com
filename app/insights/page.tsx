import { Navigation } from "@/components/navigation"
import { getAllArticles } from "@/lib/markdown"
import { EaseIn } from "@/components/animate/EaseIn"
import { InsightsSwitcher } from "@/components/insights/insights-switcher"

export default function InsightsPage() {
  const articles = getAllArticles()

  return (
    <>
      <main className="min-h-[100vh] min-h-[100dvh] bg-brand-yellow pb-20">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-0 right-0 w-1/3 h-32 bg-brand-pink transform rotate-12 translate-x-16 -translate-y-8"></div>
            <div className="absolute top-20 left-0 w-1/4 h-24 bg-brand-pink transform -rotate-6 -translate-x-8"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-16">
            <div className="max-w-4xl">
              <EaseIn>
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-brand-black leading-none mb-4 md:mb-6">
                  KNOWLEDGE
                  <br />
                  TO SHARE
                </h1>
              </EaseIn>
              <EaseIn delay={100}>
                <p className="text-lg sm:text-xl md:text-2xl text-brand-black font-medium max-w-2xl leading-relaxed">
                  Technical articles, thoughts, and experiences from building things with code.
                </p>
              </EaseIn>
            </div>
          </div>
        </div>

        {/* Insights/Talks Switcher */}
        <InsightsSwitcher articles={articles} />
      </main>

      <Navigation />
    </>
  )
}
