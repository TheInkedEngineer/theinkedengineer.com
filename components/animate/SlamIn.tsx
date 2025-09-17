import React from "react"
import { cn } from "@/lib/utils"

type ElementTag = React.ElementType

interface SlamInProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  /** Render element tag, defaults to div */
  as?: ElementTag
  /** ms */
  duration?: number
  /** ms */
  delay?: number
  /** Start offset in px (negative goes from above) */
  y?: number
  /** Initial overshoot scale */
  scaleUp?: number
  /** Downward squash scale at impact */
  scaleDown?: number
  /** Small rebound scale before settling */
  scaleRebound?: number
  /** Control whether the animation runs */
  animate?: boolean
}

export function SlamIn({
  children,
  as: Tag = "div",
  className,
  duration = 1250,
  delay = 0,
  y = -56,
  scaleUp = 1.3,
  scaleDown = 0.4,
  scaleRebound = 1.2,
  animate = true,
  style,
  ...props
}: SlamInProps) {
  const inlineStyle = {
    ...(style || {}),
    // CSS variables used by the keyframes/class in globals.css
    ["--slam-duration" as any]: `${duration}ms`,
    ["--slam-delay" as any]: `${delay}ms`,
    ["--slam-y-start" as any]: `${y}px`,
    ["--slam-scale-up" as any]: scaleUp,
    ["--slam-scale-down" as any]: scaleDown,
    ["--slam-scale-rebound" as any]: scaleRebound,
  }

  return (
    <Tag
      className={cn(animate && "animate-slam-in", "motion-reduce:animate-none", className)}
      style={inlineStyle}
      {...props}
    >
      {children}
    </Tag>
  )
}
