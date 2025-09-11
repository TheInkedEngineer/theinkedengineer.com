"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { EaseIn } from "@/components/animate/EaseIn"
import { TiltCard } from "@/components/animate/TiltCard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Title } from "@/components/ui/title"
import projects from "@/json-data/projects.json"
import { SegmentedSwitch } from "@/components/segmented-switch"
import { getAnimationDelay, cn } from "@/lib/utils"
import { typography, spacing } from "@/lib/design-system"

export default function ProjectsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [activeCategory, setActiveCategory] = useState<"ios" | "web">("ios")

  // Initialize from `category` query param when present
  useEffect(() => {
    const c = (searchParams.get("category") || "").toLowerCase()
    if (c === "ios" || c === "web") {
      setActiveCategory(c as "ios" | "web")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const subtitle =
    activeCategory === "ios"
      ? "Swift-crafted apps and SDKs for Apple platforms—performance with polish."
      : "Modern web apps and playful frontends—pixels with purpose."

  return (
    <>
      <main className="min-h-[100vh] min-h-[100dvh] bg-brand-yellow pb-20">
        {/* Header Section */}
        <header className="relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-1/3 h-40 bg-brand-pink transform -rotate-12 -translate-y-16"></div>
            <div className="absolute top-32 right-0 w-1/4 h-32 bg-brand-pink transform rotate-45 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-1/5 h-24 bg-brand-pink transform rotate-12 -translate-x-8"></div>
          </div>

          <div className={cn("relative z-10", spacing.container, spacing.section)}>
            <div className="max-w-4xl">
              <EaseIn>
                <Title as="h1">
                  THINGS I
                  <br />
                  BUILT
                </Title>
              </EaseIn>
              <EaseIn delay={100}>
                <p className={cn(typography.subtitle, "text-brand-black max-w-2xl")}>{subtitle}</p>
              </EaseIn>
            </div>
          </div>
        </header>

        {/* Category Toggle */}
        <div className={cn(spacing.container, "mb-12")}>
          <EaseIn>
            <div className="flex justify-center">
              <SegmentedSwitch
                options={[
                  { label: "Apple Platforms", value: "ios" },
                  { label: "Web Development", value: "web" },
                ]}
                value={activeCategory}
                onChange={(v) => {
                  const next = v as "ios" | "web"
                  setActiveCategory(next)
                  const params = new URLSearchParams(searchParams)
                  params.set("category", next)
                  router.replace(`${pathname}?${params.toString()}`, { scroll: false })
                }}
              />
            </div>
          </EaseIn>
        </div>

        {/* Projects Grid */}
        <div className={cn(spacing.container)}>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {projects[activeCategory].map((project, index) => (
              <EaseIn key={project.id} delay={getAnimationDelay(index, 75, 300)}>
                <TiltCard>
                  <a
                    href={project.link}
                    className="block"
                    {...(project.link.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    <Card variant="default" interactive className="group">
                      {/* Project Image (edge-to-edge inside padded card) */}
                      <div className={`h-64 bg-gradient-to-br ${project.color} relative overflow-hidden -mx-6 md:-mx-8 lg:-mx-10 -mt-6 md:-mt-8 lg:-mt-10 mb-6`}>
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover mix-blend-overlay opacity-80"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-brand-black/80 text-white text-sm font-bold rounded-full">
                            {project.year}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-full ${
                              project.status === "Live" || project.status === "Live on App Store"
                                ? "bg-brand-black text-brand-yellow"
                                : project.status === "In Development" || project.status === "Beta"
                                  ? "bg-brand-yellow text-brand-black"
                                  : project.status === "Inactive"
                                    ? "bg-gray-200 text-gray-700"
                                    : "bg-brand-pink text-brand-black"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </div>

                      {/* Project Content */}
                      <Title as="h3" variant="card" className="text-brand-black group-hover:text-brand-pink transition-colors">
                        {project.title}
                      </Title>

                      <p className="text-gray-700 mb-6 leading-relaxed">{project.description}</p>

                      {/* Tech + Desktop Link Row */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech) => (
                              <Badge key={tech}>{tech}</Badge>
                            ))}
                          </div>
                          {/* Desktop/tablet CTA label (non-link; whole card is clickable) */}
                          <span className="hidden md:inline-flex items-center text-brand-black font-bold group-hover:text-brand-pink transition-colors">
                            <span className="mr-2">View Project</span>
                            <svg
                              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>

                      {/* Project Link (mobile only) */}
                      <div className="md:hidden inline-flex items-center text-brand-black font-bold group-hover:text-brand-pink transition-colors">
                        <span className="mr-2">View Project</span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </Card>
                  </a>
                </TiltCard>
              </EaseIn>
            ))}
          </div>

          {/* Call to Action (aligned with Hire Me) */}
          <div className="mt-16 text-center">
            <EaseIn>
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12">
                <Title as="h2" align="center">Got an idea?</Title>
                <p className={cn(typography.subtitle, "text-brand-black mb-8 max-w-2xl mx-auto") }>
                  I'm always excited to work on new projects and collaborate with creative minds.
                </p>
                <Link href="/hire-me">
                  <Button variant="primary" size="lg">
                    Let's build something amazing
                  </Button>
                </Link>
              </div>
            </EaseIn>
          </div>
        </div>
      </main>

      <Navigation />
    </>
  )
}
