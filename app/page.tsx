"use client"

import { EaseIn } from "@/components/animate/EaseIn"

export default function HomePage() {
  return (
    <main id="main-content" className="relative md:fixed md:inset-0 w-full min-h-screen bg-brand-yellow overflow-x-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-24 left-0 w-28 h-28 bg-brand-pink rounded-full opacity-70 motion-safe:animate-pulse"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-brand-pink rotate-45 opacity-60 motion-safe:animate-pulse"></div>
        <div className="absolute top-[40%] right-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 bg-brand-pink rounded-full opacity-60 motion-safe:animate-pulse delay-100"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Desktop Layout */}
        <div className="hidden md:block relative p-8">
          <div className="absolute inset-0 p-8">
            <EaseIn>
              <p
                className="text-brand-black font-black uppercase leading-none text-[10vw] break-words"
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
            </EaseIn>
          </div>
        </div>

        {/* Mobile Layout - Brutalist full-page text with large type and scrolling */}
        <div className="md:hidden relative p-6 mb-8">
          <EaseIn>
            <p className="text-brand-black font-black uppercase leading-[0.9] text-[18vw] break-words" style={{ overflowWrap: 'anywhere' }}>
              <span className="opacity-30">HELLOIAM</span>
              <a href="https://linkedin.com/in/theinkedengineer" className="opacity-100">FIRAS</a>
              <span className="opacity-30">CHECKOUTTHE</span>
              <a href="/projects" className="opacity-100">PROJECTS</a>
              <span className="opacity-30">IBUILTTHE</span>
              <a href="/insights" className="opacity-100">INSIGHTS</a>
              <span className="opacity-30 ">ISHAREOR</span>
              <a href="/hire-me" className="opacity-100">HIREME</a>
              <span className="opacity-30 ">TOBUILDAMAZINGTHINGS</span>
            </p>
          </EaseIn>
        </div>
      </div>
    </main>
  )
}
