"use client"

import Link from "next/link"
import { useState } from "react"
import { SegmentedSwitch } from "@/components/segmented-switch"
import { EaseIn } from "@/components/animate/EaseIn"
import { TiltCard } from "@/components/animate/TiltCard"
import talks from "@/json-data/talks.json"
import { LiteYouTube } from "@/components/media/lite-youtube"

type Mode = "insights" | "talks"
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

export function InsightsSwitcher({ articles }: { articles: ArticleMetadata[] }) {
  const [mode, setMode] = useState<Mode>("insights")

  const [playingTalkId, setPlayingTalkId] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Toggle */}
      <EaseIn>
        <div className="mb-10 flex justify-center">
          <SegmentedSwitch
            options={[
              { label: "Insights", value: "insights" },
              { label: "Talks", value: "talks" },
            ]}
            value={mode}
            onChange={(v) => setMode(v as Mode)}
          />
        </div>
      </EaseIn>

      {mode === "insights" ? (
        <div className="grid gap-6 md:gap-8 lg:gap-12">
          {articles.map((article, index) => (
            <EaseIn key={article.slug} delay={Math.min(index * 40, 160)}>
              <Link href={`/insights/${article.slug}`} className="group block">
                <TiltCard>
                  <article className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 active:scale-98 border-4 border-brand-black hover:border-brand-pink">
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

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-brand-black mb-3 md:mb-4 group-hover:text-brand-pink transition-colors leading-tight">
                          {article.title}
                        </h2>

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
                  </article>
                </TiltCard>
              </Link>
            </EaseIn>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {talks.map((talk, index) => (
            <EaseIn key={talk.title} delay={Math.min(index * 120, 240)}>
              <TiltCard
                className="bg-white rounded-3xl overflow-hidden border-4 border-brand-black hover:border-brand-pink transition-colors duration-300 cursor-pointer"
                onClick={() => setPlayingTalkId(talk.videoId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setPlayingTalkId(talk.videoId)
                  }
                }}
                aria-label={`Play talk: ${talk.title}`}
              >
                <LiteYouTube
                  videoId={talk.videoId}
                  title={talk.title}
                  playing={playingTalkId === talk.videoId}
                  interactive={false}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-brand-black mb-2">{talk.title}</h3>
                  <p className="text-brand-black/80 font-medium mb-3">{talk.event}</p>
                  <p className="text-brand-black leading-relaxed">{talk.description}</p>
                </div>
              </TiltCard>
            </EaseIn>
          ))}
        </div>
      )}
    </div>
  )
}
