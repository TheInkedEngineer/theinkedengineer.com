"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "outline" | "solid"
type BadgeSize = "sm" | "md"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}

export function Badge({ className, variant = "default", size = "md", ...props }: BadgeProps) {
  const base = "inline-flex items-center font-semibold rounded-full transition-colors duration-300"
  const variants: Record<BadgeVariant, string> = {
    default: "bg-brand-yellow text-brand-black",
    outline: "bg-transparent text-brand-black border-2 border-current",
    solid: "bg-brand-black text-brand-yellow",
  }
  const sizes: Record<BadgeSize, string> = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  }
  return <span className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

