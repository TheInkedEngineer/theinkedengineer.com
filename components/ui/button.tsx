"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "primary" | "secondary" | "ghost"
type ButtonSize = "sm" | "md" | "lg"

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children?: React.ReactNode
}

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & BaseProps & { href: string }
type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & BaseProps & { href?: undefined }

export function Button(props: AnchorProps | NativeButtonProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props as any

  const base = "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-300 focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50"

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-brand-yellow text-brand-black hover:bg-brand-black hover:text-brand-yellow",
    secondary: "bg-brand-black text-brand-yellow hover:bg-brand-pink",
    ghost: "bg-transparent border-2 border-current",
  }

  const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const classes = cn(base, variants[variant], sizes[size], className)

  if ((rest as AnchorProps).href) {
    const anchorProps = rest as AnchorProps
    return (
      <a {...anchorProps} className={classes}>
        {children}
      </a>
    )
  }

  const buttonProps = rest as NativeButtonProps
  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  )
}

