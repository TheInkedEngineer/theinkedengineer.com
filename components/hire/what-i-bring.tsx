"use client"

import { useState, useMemo } from "react"
import { SegmentedSwitch } from "@/components/segmented-switch"
import { EaseIn } from "@/components/animate/EaseIn"
import { Card } from "@/components/ui/card"
import { Title } from "@/components/ui/title"
import { spacing, typography } from "@/lib/design-system"
import { cn } from "@/lib/utils"

type SkillItem = { title: string; desc: string }
type SkillsContent = {
  companies: SkillItem[]
  freelance: SkillItem[]
  startups: SkillItem[]
}

const TABS = [
  { id: "companies", label: "Companies" },
  { id: "freelance", label: "Freelance & Collaborations" },
  { id: "startups", label: "Startups" },
] as const

type TabId = typeof TABS[number]["id"]

export function WhatIBring({ content }: { content: SkillsContent }) {
  const [activeTab, setActiveTab] = useState<TabId>("companies")

  const options = useMemo(() => TABS.map(({ id, label }) => ({ value: id, label })), [])
  const items = content[activeTab]

  return (
    <section className={cn(spacing.container, spacing.section)}>
      {/* Header */}
      <EaseIn>
        <Title as="h2" align="center" margin="xl">WHAT I BRING</Title>
      </EaseIn>

      {/* Intro */}
      <EaseIn>
        <div className="text-center mb-12">
          <p className={cn(typography.subtitle, "text-brand-black max-w-4xl mx-auto") }>
            I don't just write code — I design systems, lead teams, and ship products that last. Whether it's scaling an
            iOS app to millions of users, crafting a flexible CMS-powered website, or building intelligent AI bots, I
            bring a mix of technical depth, strategic thinking, and clean, future-proof engineering.
          </p>
        </div>
      </EaseIn>

      {/* Segmented Control */}
      <EaseIn delay={100}>
        <div className="flex justify-center mb-8">
          <SegmentedSwitch options={options} value={activeTab} onChange={(v) => setActiveTab(v as TabId)} />
        </div>
      </EaseIn>

      {/* Dynamic Content Card */}
      <EaseIn delay={150}>
        <Card className="bg-brand-black text-brand-yellow max-w-4xl mx-auto">
          <div className="p-0">
            <Title
              as="h3"
              variant="card"
              align="center"
              className="mb-8 underline decoration-2 underline-offset-4 decoration-brand-yellow text-brand-yellow"
            >
              For {TABS.find((t) => t.id === activeTab)?.label}
            </Title>
            <div className="grid md:grid-cols-2 gap-6">
              {items.map((item, index) => (
                <div key={`${activeTab}-${index}`} className="flex items-start gap-3">
                  <span className="text-brand-yellow mt-1 text-xl">●</span>
                  <div>
                    <span className="font-semibold text-lg block mb-1">{item.title}</span>
                    <span className="text-brand-yellow/80 text-sm leading-relaxed">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </EaseIn>
    </section>
  )
}

