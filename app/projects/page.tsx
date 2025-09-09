"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { EaseIn } from "@/components/animate/EaseIn"
import { TiltCard } from "@/components/animate/TiltCard"
import projects from "@/json-data/projects.json"
import { SegmentedSwitch } from "@/components/segmented-switch"

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<"ios" | "web">("ios")

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

          <div className="relative z-10 container mx-auto px-6 py-16">
            <div className="max-w-4xl">
              <EaseIn>
                <h1 className="text-6xl md:text-8xl font-black text-brand-black leading-none mb-6">
                  THINGS I
                  <br />
                  BUILT
                </h1>
              </EaseIn>
              <EaseIn delay={100}>
                <p className="text-xl md:text-2xl text-brand-black font-medium max-w-2xl">
                  From Apple platform applications and SDKs that delight users to Web applications and portoflios.
                </p>
              </EaseIn>
            </div>
          </div>
        </header>

        {/* Category Toggle */}
        <div className="container mx-auto px-6 mb-12">
          <EaseIn>
            <div className="flex justify-center">
              <SegmentedSwitch
                options={[
                  { label: "Apple Platforms", value: "ios" },
                  { label: "Web Development", value: "web" },
                ]}
                value={activeCategory}
                onChange={(v) => setActiveCategory(v as "ios" | "web")}
              />
            </div>
          </EaseIn>
        </div>

        {/* Projects Grid */}
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {projects[activeCategory].map((project, index) => (
              <EaseIn key={project.id} delay={Math.min(index * 60, 180)}>
                <TiltCard className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-4 border-brand-black hover:border-brand-pink">
                  <a
                    href={project.link}
                    className="block"
                    {...(project.link.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {/* Project Image */}
                    <div className={`h-64 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
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
                              ? "bg-green-500 text-white"
                              : project.status === "In Development" || project.status === "Beta"
                                ? "bg-yellow-500 text-black"
                                : "bg-blue-500 text-white"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-8">
                      <h3 className="text-2xl font-black text-brand-black mb-3 group-hover:text-brand-pink transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-gray-700 mb-6 leading-relaxed">{project.description}</p>

                      {/* Tech + Desktop Link Row */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech) => (
                              <span key={tech} className="px-3 py-1 bg-brand-yellow text-brand-black text-sm font-semibold rounded-full">
                                {tech}
                              </span>
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
                    </div>
                  </a>
                </TiltCard>
              </EaseIn>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <EaseIn>
              <div className="bg-brand-black rounded-3xl p-12 border-4 border-brand-pink">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Got an idea?</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  I'm always excited to work on new projects and collaborate with creative minds.
                </p>
                <Link
                  href="/hire-me"
                  className="inline-flex items-center px-8 py-4 bg-brand-yellow text-brand-black font-bold rounded-full hover:bg-brand-pink transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-2">Let's build something amazing</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
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
