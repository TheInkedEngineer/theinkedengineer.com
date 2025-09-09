"use client"

import { useState } from "react"

export default function ArticleActions() {
  const [copied, setCopied] = useState(false)

  const handleTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      window.scrollTo(0, 0)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = document.title
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="fixed top-12 right-2 md:top-12 md:right-4 z-[60]">
      <div className="pointer-events-auto liquid-glass bg-white/10 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/20 shadow-lg rounded-2xl overflow-hidden isolate flex items-center gap-1 md:gap-2 px-2 py-1">
      <button
        aria-label="Back to top"
        onClick={handleTop}
        className="flex items-center gap-1 md:gap-2 px-2 py-1 rounded-full text-brand-black hover:scale-105 transition-transform"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M6 11L12 5L18 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xs font-bold">Top</span>
      </button>

      <div className="w-px h-4 bg-white/30" />

      <button
        aria-label="Share"
        onClick={handleShare}
        className="flex items-center gap-1 md:gap-2 px-2 py-1 rounded-full text-brand-black hover:scale-105 transition-transform"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M12 15V3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M8 7L12 3L16 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xs font-bold">{copied ? "Copied" : "Share"}</span>
      </button>
      </div>
    </div>
  )
}
