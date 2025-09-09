"use client"

import React from "react"

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTiltDeg?: number
  glare?: boolean
}

export function TiltCard({
  className = "",
  children,
  maxTiltDeg = 6,
  glare = true,
  ...props
}: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width - 0.5
    const py = y / rect.height - 0.5
    const rx = (-py * maxTiltDeg).toFixed(2)
    const ry = (px * maxTiltDeg).toFixed(2)

    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`
    if (glare) {
      el.style.setProperty("--glare-x", `${px}`)
      el.style.setProperty("--glare-y", `${py}`)
    }
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)"
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      {...props}
    >
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background:
              "radial-gradient(600px circle at calc(50% + var(--glare-x,0)*100%) calc(50% + var(--glare-y,0)*100%), rgba(255,255,255,0.15), transparent 40%)",
            maskImage: "linear-gradient(black, transparent 85%)",
            WebkitMaskImage: "linear-gradient(black, transparent 85%)",
            mixBlendMode: "screen",
          }}
        />
      )}
      {children}
    </div>
  )
}

