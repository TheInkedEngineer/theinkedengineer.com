"use client"

import Link from "next/link"
import { useState } from "react"
import { SegmentedSwitch } from "@/components/segmented-switch"
import { EaseIn } from "@/components/animate/EaseIn"
import { TiltCard } from "@/components/animate/TiltCard"
import { Card } from "@/components/ui/card"
import { spacing, typography } from "@/lib/design-system"
import { cn } from "@/lib/utils"
import { Title } from "@/components/ui/title"
import talks from "@/json-data/talks.json"
import { LiteYouTube } from "@/components/media/lite-youtube"
import { getAnimationDelay } from "@/lib/utils"

export type Mode = "articles" | "talks"
type ArticleMetadata = {
  slug: string
  title: string
  date: string
  description: string
  readTime: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear()).slice(-2)
  return `${month}.${year}`
}

type InsightsSwitcherProps = {
  articles: ArticleMetadata[]
  mode?: Mode
  onModeChange?: (mode: Mode) => void
}

export function InsightsSwitcher({ articles, mode: controlledMode, onModeChange }: InsightsSwitcherProps) {
  const [uncontrolledMode, setUncontrolledMode] = useState<Mode>("articles")
  const mode = controlledMode ?? uncontrolledMode
  const setMode = onModeChange ?? setUncontrolledMode

  const [playingTalkId, setPlayingTalkId] = useState<string | null>(null)

  return (
    <div className={cn(spacing.container)}>
      {/* Toggle */}
      <EaseIn>
        <div className="mb-10 flex justify-center">
          <SegmentedSwitch
            options={[
              { label: "Articles", value: "articles" },
              { label: "Talks", value: "talks" },
            ]}
            value={mode}
            onChange={(v) => setMode(v as Mode)}
          />
        </div>
      </EaseIn>

      {mode === "articles" ? (
        <div className="grid gap-6 md:gap-8 lg:gap-12">
          {articles.map((article, index) => (
            <EaseIn key={article.slug} delay={getAnimationDelay(index, 50, 200)}>
              <Link href={`/insights/${article.slug}`} className="group block">
                <TiltCard>
                  <Card variant="default" interactive className="group">
                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                      {/* Article Number */}
                      <div className="flex-shrink-0 self-start md:self-auto">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-pink rounded-full flex items-center justify-center">
                          <span className="text-lg md:text-2xl font-black text-brand-black">
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

                        <Title as="h2" variant="card" className="text-brand-black group-hover:text-brand-pink transition-colors">
                          {article.title}
                        </Title>

                        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
                          {article.description}
                        </p>

                        <div className="flex justify-end">
                          <span className="text-sm md:text-base font-bold text-brand-black group-hover:text-brand-pink transition-colors">
                            Read More
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TiltCard>
              </Link>
            </EaseIn>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {talks.map((talk, index) => (
            <EaseIn key={talk.title} delay={getAnimationDelay(index, 75, 300)}>
              <TiltCard>
                <Card
                  variant="default"
                  interactive
                  role="button"
                  tabIndex={0}
                  onClick={() => setPlayingTalkId(talk.videoId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setPlayingTalkId(talk.videoId)
                    }
                  }}
                  aria-label={`Play talk: ${talk.title}`}
                >
                  <div className="-mx-6 md:-mx-8 lg:-mx-10 -mt-6 md:-mt-8 lg:-mt-10 mb-6 overflow-hidden">
                    <LiteYouTube
                      videoId={talk.videoId}
                      title={talk.title}
                      playing={playingTalkId === talk.videoId}
                      interactive={false}
                    />
                  </div>
                  <div>
                    <Title as="h3" variant="card" className="text-brand-black mb-2">{talk.title}</Title>
                    <p className="text-brand-black/80 font-medium mb-3">{talk.event}</p>
                    <p className="text-brand-black leading-relaxed">{talk.description}</p>
                  </div>
                </Card>
              </TiltCard>
            </EaseIn>
          ))}
        </div>
      )}
    </div>
  )
}
