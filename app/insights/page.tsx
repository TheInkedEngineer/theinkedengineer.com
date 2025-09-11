import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { getAllArticles } from "@/lib/markdown"
import { InsightsPageClient } from "@/components/insights/insights-page-client"

export default function InsightsPage() {
  const articles = getAllArticles()

  return (
    <>
      <main className="min-h-[100vh] min-h-[100dvh] bg-brand-yellow pb-20">
        <Suspense fallback={null}>
          <InsightsPageClient articles={articles} />
        </Suspense>
      </main>

      <Navigation />
    </>
  )
}
