"use client"

import { useState, useMemo } from "react"

type LiteYouTubeProps = {
  videoId: string
  title: string
  className?: string
  playing?: boolean
  interactive?: boolean
  onPlayRequest?: () => void
}

export function LiteYouTube({ videoId, title, className = "", playing, interactive = true, onPlayRequest }: LiteYouTubeProps) {
  const [internalPlaying, setInternalPlaying] = useState(false)
  const isControlled = typeof playing === "boolean"
  const isPlaying = isControlled ? (playing as boolean) : internalPlaying

  const thumbnail = useMemo(() => {
    // hqdefault is widely available; maxresdefault isn't guaranteed
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  }, [videoId])

  if (isPlaying) {
    const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    return (
      <div className={`relative aspect-video ${className}`}>
        <iframe
          src={src}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  const Preview = (
    <>
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${thumbnail})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/10" aria-hidden />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-yellow text-brand-black border-4 border-brand-black shadow-md">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
    </>
  )

  if (!interactive) {
    return <div className={`relative aspect-video w-full overflow-hidden ${className}`}>{Preview}</div>
  }

  const handleClick = () => {
    if (onPlayRequest) onPlayRequest()
    else setInternalPlaying(true)
  }

  return (
    <button
      type="button"
      aria-label={`Play video: ${title}`}
      className={`relative aspect-video w-full overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {Preview}
    </button>
  )
}
