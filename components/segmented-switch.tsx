"use client"

import { useEffect, useRef } from "react"

type Option = {
  label: string
  value: string
}

interface SegmentedSwitchProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SegmentedSwitch({ options, value, onChange, className = "" }: SegmentedSwitchProps) {
  const activeIndex = Math.max(0, options.findIndex((o) => o.value === value))
  return (
    <div className={`glass-switch no-shadow rounded-2xl overflow-hidden px-1.5 py-1.5 flex items-stretch gap-0 relative ${className}`}>
      <SelectionHighlight activeIndex={activeIndex} />
      {options.map((opt, i) => {
        const isActive = i === activeIndex
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative z-10 px-2 py-4 inline-flex items-center justify-center font-bold rounded-lg transition-colors duration-200 text-[clamp(12px,2.8vw,16px)] leading-tight ${
              isActive ? "text-brand-black" : "text-white hover:text-brand-yellow"
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function SelectionHighlight({ activeIndex }: { activeIndex: number }) {
  const highlightRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const buttonsRef = useRef<HTMLButtonElement[]>([])

  // Attach refs after mount by querying siblings (buttons)
  useEffect(() => {
    const container = highlightRef.current?.parentElement as HTMLDivElement | null
    if (!container) return
    containerRef.current = container
    buttonsRef.current = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[]
  }, [])

  const getMetrics = () => {
    const container = containerRef.current
    const buttons = buttonsRef.current
    const hl = highlightRef.current
    if (!container || !hl || buttons.length === 0) return null
    const cl = container.getBoundingClientRect()
    const idx = Math.min(Math.max(activeIndex, 0), buttons.length - 1)
    const br = buttons[idx].getBoundingClientRect()
    const left = br.left - cl.left
    const width = br.width
    const styles = window.getComputedStyle(container)
    const padTop = parseFloat(styles.paddingTop || "0")
    const padBottom = parseFloat(styles.paddingBottom || "0")
    const top = padTop
    const height = container.clientHeight - padTop - padBottom
    return { hl, left, width, top, height }
  }

  // Initialize highlight position
  useEffect(() => {
    const m = getMetrics()
    if (!m) return
    const { hl, left, width, top, height } = m
    hl.style.left = `${left}px`
    hl.style.width = `${width}px`
    hl.style.top = `${top}px`
    hl.style.height = `${height}px`
  }, [])

  useEffect(() => {
    const m = getMetrics()
    if (!m) return
    const { hl, left: targetLeft, width: targetWidth, top, height } = m

    const currentLeft = parseFloat(hl.style.left || "0")
    const currentWidth = parseFloat(hl.style.width || "0")
    const currentRight = currentLeft + currentWidth
    const targetRight = targetLeft + targetWidth
    const movingRight = targetLeft > currentLeft

    // Align vertical geometry with buttons
    hl.style.top = `${top}px`
    hl.style.height = `${height}px`

    if (movingRight) {
      // Keep left edge fixed, expand width to the new right edge
      const expandWidth = targetRight - currentLeft
      hl.style.transition = "width 260ms cubic-bezier(0.22, 1, 0.36, 1)"
      hl.style.width = `${expandWidth}px`
    } else {
      // Keep right edge fixed, animate left and width together
      const keepRight = currentRight
      const expandLeft = targetLeft
      const expandWidth = keepRight - expandLeft
      hl.style.transition = "left 260ms cubic-bezier(0.22, 1, 0.36, 1), width 260ms cubic-bezier(0.22, 1, 0.36, 1)"
      hl.style.left = `${expandLeft}px`
      hl.style.width = `${expandWidth}px`
    }

    const onEnd = () => {
      hl.style.transition = "left 120ms ease-out, width 120ms ease-out"
      hl.style.left = `${targetLeft}px`
      hl.style.width = `${targetWidth}px`
    }
    hl.addEventListener("transitionend", onEnd, { once: true })

    const onResize = () => {
      const m2 = getMetrics()
      if (!m2) return
      hl.style.transition = "none"
      hl.style.left = `${m2.left}px`
      hl.style.width = `${m2.width}px`
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [activeIndex])

  return (
    <div
      ref={highlightRef}
      className="absolute rounded-lg bg-brand-yellow/95"
      style={{ left: 0, width: 0, zIndex: 5, top: 0, height: 0 }}
      aria-hidden
    />
  )
}
