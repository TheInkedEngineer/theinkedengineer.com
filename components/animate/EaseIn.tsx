"use client"

import React from "react"

interface EaseInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /** ms */
  duration?: number
  /** ms */
  delay?: number
  /** translateY in px for the entrance offset */
  y?: number
  /** starting opacity */
  fromOpacity?: number
}

// Simple mount-only ease-in wrapper. Not intersection-based.
export function EaseIn({
  children,
  className = "",
  duration = 500,
  delay = 0,
  y = 12,
  fromOpacity = 0,
  ...props
}: EaseInProps) {
  const [entered, setEntered] = React.useState(false)
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEntered(true)
      return
    }
    const id = window.requestAnimationFrame(() => setEntered(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  const base = `transition-all ease-[cubic-bezier(.22,1,.36,1)] will-change-transform`

  return (
    <div
      className={`motion-reduce:transition-none ${base} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transform: entered ? "translateY(0)" : `translateY(${y}px)`,
        opacity: entered ? 1 : fromOpacity,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
