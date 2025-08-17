"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

const projects = {
  ios: [
    {
      id: "espresso-martini",
      title: "Espresso Martini",
      description:
        "A Vapor-powered, Swift local server. Test your apps with realistic API responses and edge cases.",
      tech: ["Swift", "Vapor"],
      status: "SDK",
      image: "/images/projects/espresso-martini.png",
      color: "from-amber-600 to-yellow-500",
      year: "2023",
      link: "https://github.com/TheInkedEngineer/Espresso-Martini",
    },
    {
      id: "spritz",
      title: "Spritz",
      description:
        "An Italian tax number (AKA Codice Fiscale) creator and validator SDK. Provides algorithm-based tax code generation and validation.",
      tech: ["Swift", "Algorithm", "SDK"],
      status: "SDK",
      image: "/images/projects/spritz.png",
      color: "from-green-400 to-blue-500",
      year: "2020",
      link: "https://github.com/TheInkedEngineer/spritz",
    },
    {
      id: "mocka",
      title: "Mocka",
      description:
        "A Mock Server Made for Developers by Developers. Built with Swift and SwiftUI for macOS, featuring Combine and Vapor integration.",
      tech: ["Swift", "SwiftUI", "Vapor"],
      status: "Mac Application",
      image: "/images/projects/mocka.png",
      color: "from-purple-500 to-pink-500",
      year: "2022",
      link: "https://github.com/wise-emotions/mocka",
    },
    {
      id: "toosie-slide",
      title: "Toosie Slide",
      description:
        "A simple Swift library to generate a carousel-like effect. Provides custom collection view flow layout for iOS applications.",
      tech: ["Swift", "UIKit", "SDK"],
      status: "SDK",
      image: "/images/projects/toosieSlide.png",
      color: "from-indigo-500 to-purple-600",
      year: "2019",
      link: "https://github.com/TheInkedEngineer/ToosieSlide",
    },
  ],
  web: [
    {
      id: "fattiicazzituoi",
      title: "fattiicazzituoi.it",
      description:
        "A SFW generator of ways to say `fatti i cazzi tuoi`.",
      tech: ["ViteJS", "Comedy"],
      status: "Live",
      image: "/images/projects/fct.png",
      color: "from-orange-500 to-yellow-700",
      year: "2022",
      link: "https://fattiicazzituoi.it",
    },
    {
      id: "giuliagiacone",
      title: "GiuliaGiacone.com",
      description:
        "I designed and built a portfolio website for a Milan based stylest. The goal was to build a fun, girly, minimal website.",
      tech: ["NextJS"],
      status: "Live",
      image: "/images/projects/giuliagiacone.png",
      color: "from-pink-400 to-purple-500",
      year: "2025",
      link: "https://giuliagiacone.com",
    },
    {
      id: "biancabeltramello",
      title: "BiancaBeltramello.com",
      description:
        "Modern and stylish portfolio website featuring contemporary design and smooth user experience. Showcases professional work beautifully.",
      tech: ["NextJS"],
      status: "Live",
      image: "/images/projects/biancabeltramello.png",
      color: "from-purple-400 to-purple-600",
      year: "2024",
      link: "https://biancabeltramello.com",
    },
  ],
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<"ios" | "web">("ios")

  return (
    <>
      <main className="min-h-[100vh] min-h-[100dvh] bg-[#F4D35E] pb-20">
        {/* Header Section */}
        <header className="relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-1/3 h-40 bg-[#F8C0C8] transform -rotate-12 -translate-y-16"></div>
            <div className="absolute top-32 right-0 w-1/4 h-32 bg-[#F8C0C8] transform rotate-45 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-1/5 h-24 bg-[#F8C0C8] transform rotate-12 -translate-x-8"></div>
          </div>

          <div className="relative z-10 container mx-auto px-6 py-16">
            <div className="max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-black text-black leading-none mb-6">
                THINGS I
                <br />
                BUILT
              </h1>
              <p className="text-xl md:text-2xl text-black font-medium max-w-2xl">
                From Apple platform applications and SDKs that delight users to Web applications and portoflios.
              </p>
            </div>
          </div>
        </header>

        {/* Category Toggle */}
        <div className="container mx-auto px-6 mb-12">
          <div className="flex justify-center">
            <div className="bg-black rounded-full p-2 flex gap-2">
              <button
                onClick={() => setActiveCategory("ios")}
                className={`px-8 py-4 font-bold rounded-full transition-all duration-300 ${
                  activeCategory === "ios"
                    ? "bg-[#F4D35E] text-black transform scale-105"
                    : "text-white hover:text-[#F4D35E]"
                }`}
              >
                Apple Platforms
              </button>
              <button
                onClick={() => setActiveCategory("web")}
                className={`px-8 py-4 font-bold rounded-full transition-all duration-300 ${
                  activeCategory === "web"
                    ? "bg-[#F4D35E] text-black transform scale-105"
                    : "text-white hover:text-[#F4D35E]"
                }`}
              >
                Web Development
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {projects[activeCategory].map((project, index) => (
              <div
                key={project.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-4 border-black hover:border-[#F8C0C8]"
              >
                {/* Project Image */}
                <div className={`h-64 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover mix-blend-overlay opacity-80"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-black/80 text-white text-sm font-bold rounded-full">
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
                  <h3 className="text-2xl font-black text-black mb-3 group-hover:text-[#F8C0C8] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-gray-700 mb-6 leading-relaxed">{project.description}</p>

                  {/* Tech + Desktop Link Row */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span key={tech} className="px-3 py-1 bg-[#F4D35E] text-black text-sm font-semibold rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                      {/* Desktop/tablet link */}
                      <Link
                        href={project.link}
                        className="hidden md:inline-flex items-center text-black font-bold group-hover:text-[#F8C0C8] transition-colors"
                        {...(project.link.startsWith("http") && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                      >
                        <span className="mr-2">{project.link.startsWith("http") ? "View Project" : "Coming Soon"}</span>
                        {project.link.startsWith("http") && (
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
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* Project Link (mobile only) */}
                  <div className="md:hidden">
                    <Link
                      href={project.link}
                      className="inline-flex items-center text-black font-bold group-hover:text-[#F8C0C8] transition-colors"
                      {...(project.link.startsWith("http") && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                    >
                      <span className="mr-2">{project.link.startsWith("http") ? "View Project" : "Coming Soon"}</span>
                      {project.link.startsWith("http") && (
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
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-black rounded-3xl p-12 border-4 border-[#F8C0C8]">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Got an idea?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                I'm always excited to work on new projects and collaborate with creative minds.
              </p>
              <Link
                href="mailto:firas@hey.com"
                className="inline-flex items-center px-8 py-4 bg-[#F4D35E] text-black font-bold rounded-full hover:bg-[#F8C0C8] transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">Let's build something amazing</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Navigation />
    </>
  )
}
