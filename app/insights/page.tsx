import { Navigation } from "@/components/navigation"
import { getAllArticles } from "@/lib/markdown"
import { EaseIn } from "@/components/animate/EaseIn"
import { InsightsSwitcher } from "@/components/insights/insights-switcher"
import { Title } from "@/components/ui/title"
import { typography, spacing } from "@/lib/design-system"
import { cn } from "@/lib/utils"

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

          <div className={cn("relative z-10", spacing.container, spacing.section)}>
            <div className="max-w-4xl">
              <EaseIn>
                <Title as="h1">
                  KNOWLEDGE
                  <br />
                  TO SHARE
                </Title>
              </EaseIn>
              <EaseIn delay={100}>
                <p className={cn(typography.subtitle, "text-brand-black max-w-2xl") }>
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
