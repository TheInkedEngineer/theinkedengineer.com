"use client"

import { useState } from "react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  status: string
  image: string
  color: string
  year: string
  link: string
}

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-4 border-brand-black hover:border-brand-pink"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Image */}
      <div className={`h-64 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover mix-blend-overlay opacity-80"
        />

        {/* Animated overlay */}
        <div
          className={`absolute inset-0 bg-brand-black/20 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-brand-black/80 text-white text-sm font-bold rounded-full">{project.year}</span>
        </div>

        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
              project.status === "Live" || project.status === "Live on App Store"
                ? "bg-green-500 text-white"
                : project.status === "In Development" || project.status === "Beta"
                  ? "bg-yellow-500 text-brand-black"
                  : "bg-blue-500 text-white"
            } ${isHovered ? "scale-110" : ""}`}
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
              {project.tech.map((tech, techIndex) => (
                <span
                  key={tech}
                  className={`px-3 py-1 bg-brand-yellow text-brand-black text-sm font-semibold rounded-full transition-all duration-300 ${
                    isHovered ? "transform scale-105" : ""
                  }`}
                  style={{ transitionDelay: `${techIndex * 50}ms` }}
                >
                  {tech}
                </span>
              ))}
            </div>
            {/* Desktop/tablet link */}
            <Link
              href={project.link}
              className="hidden md:inline-flex items-center text-brand-black font-bold group-hover:text-brand-pink transition-colors"
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
            className="inline-flex items-center text-brand-black font-bold group-hover:text-brand-pink transition-colors"
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
  )
}
