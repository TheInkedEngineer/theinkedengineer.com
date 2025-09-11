"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { InsightsSwitcher, Mode } from "@/components/insights/insights-switcher"
import { EaseIn } from "@/components/animate/EaseIn"
import { Title } from "@/components/ui/title"
import { spacing, typography } from "@/lib/design-system"
import { cn } from "@/lib/utils"

type ArticleMetadata = {
  slug: string
  title: string
  date: string
  description: string
  readTime: string
}

export function InsightsPageClient({ articles }: { articles: ArticleMetadata[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [mode, setMode] = useState<Mode>("articles")

  // Initialize from `tab` query param when present
  useEffect(() => {
    const tab = (searchParams.get("tab") || "").toLowerCase()
    if (tab === "articles" || tab === "talks") {
      setMode(tab as Mode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleModeChange = (next: Mode) => {
    setMode(next)
    const params = new URLSearchParams(searchParams)
    params.set("tab", next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const subtitle =
    mode === "articles"
      ? "Hands-on essays and hard-won lessons—built at 2 a.m., edited at 9."
      : "Stage-tested ideas in 30 minutes or less—press play, get inspired."

  return (
    <>
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
                INSIGHTS
                <br />
                TO SHARE
              </Title>
            </EaseIn>
            <EaseIn delay={100}>
              <p className={cn(typography.subtitle, "text-brand-black max-w-2xl")}>{subtitle}</p>
            </EaseIn>
          </div>
        </div>
      </div>

      {/* Insights/Talks Switcher */}
      <InsightsSwitcher articles={articles} mode={mode} onModeChange={handleModeChange} />
    </>
  )
}
