"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type CardVariant = "default" | "compact" | "hero"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  interactive?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = "default", interactive = false, ...props }, ref) => {
    const base = "rounded-2xl md:rounded-3xl border-4 border-brand-black hover:border-brand-pink bg-white shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300"
    const padding =
      variant === "compact"
        ? "p-4 md:p-6"
        : variant === "hero"
          ? "p-8 md:p-12"
          : "p-6 md:p-8 lg:p-10"
    const heroExtras = variant === "hero" ? "bg-brand-black text-white" : ""
    const motion = interactive ? "transform hover:-translate-y-2 cursor-pointer" : ""

    return (
      <div ref={ref} className={cn(base, padding, heroExtras, motion, className)} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

