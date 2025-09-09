"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Only prevent scroll on desktop where layout is fixed
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
    if (isDesktop) {
      document.body.classList.add('no-scroll')
    }
    // Cleanup: always remove if present
    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main id="main-content" className="relative md:fixed md:inset-0 w-full md:h-full min-h-screen bg-brand-yellow overflow-x-hidden md:overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-24 left-0 w-28 h-28 bg-brand-pink rounded-full opacity-70 motion-safe:animate-pulse"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-brand-pink rotate-45 opacity-60 motion-safe:animate-pulse"></div>
        <div className="absolute top-[40%] right-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 bg-brand-pink rounded-full opacity-60 motion-safe:animate-pulse delay-100"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full">
        {/* Desktop Layout */}
        <div className="hidden md:block h-full relative p-8">
          <div className="absolute inset-0 p-8">
            <p
              className="text-brand-black font-extrabold uppercase leading-[0.9] text-[10vw] break-words"
              style={{ overflowWrap: 'anywhere' }}
            >
              <span className="opacity-50">HELLOIAM</span>
              <a href="https://linkedin.com/in/theinkedengineer" className="opacity-100" target="_blank">FIRAS</a>
              <span className="opacity-50">CHECKOUTTHE</span>
              <a href="/projects" className="opacity-100">PROJECTS</a>
              <span className="opacity-50">IBUILTTHE</span>
              <a href="/insights" className="opacity-100">INSIGHTS</a>
              <span className="opacity-50">ISHAREOR</span>
              <a href="/hire-me" className="opacity-100">HIREME</a>
              <span className="opacity-50">TOBUILDAMAZINGTHINGS</span>
            </p>
          </div>
        </div>

        {/* Mobile Layout - Brutalist full-page text with large type and scrolling */}
        <div
          className="md:hidden relative p-6 mb-8"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' }}
        >
          <p className="text-brand-black font-extrabold uppercase leading-[0.9] text-[18vw] break-words" style={{ overflowWrap: 'anywhere' }}>
            <span className="opacity-24">HELLOIAM</span>
            <a href="https://linkedin.com/in/theinkedengineer" className="opacity-100">FIRAS</a>
            <span className="opacity-24">CHECKOUTTHE</span>
            <a href="/projects" className="opacity-100">PROJECTS</a>
            <span className="opacity-24">IBUILTTHE</span>
            <a href="/insights" className="opacity-100">INSIGHTS</a>
            <span className="opacity-24 ">ISHAREOR</span>
            <a href="/hire-me" className="opacity-100">HIREME</a>
            <span className="opacity-24 ">TOBUILDAMAZINGTHINGS</span>
          </p>
        </div>
      </div>
    </main>
  )
}
