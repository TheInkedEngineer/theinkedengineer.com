"use client"

import type React from "react"

import { useState, useRef } from "react"

interface MobileOptimizedCardProps {
  children: React.ReactNode
  className?: string
  onTap?: () => void
}

export function MobileOptimizedCard({ children, className = "", onTap }: MobileOptimizedCardProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    setIsPressed(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStart.x)
    const deltaY = Math.abs(touch.clientY - touchStart.y)

    // If user moves finger too much, cancel the press
    if (deltaX > 10 || deltaY > 10) {
      setIsPressed(false)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isPressed && onTap) {
      e.preventDefault()
      onTap()
    }
    setIsPressed(false)
    setTouchStart(null)
  }

  return (
    <div
      ref={cardRef}
      className={`
        transition-all duration-200 ease-out
        ${isPressed ? "scale-95 brightness-95" : "scale-100"}
        ${className}
      `}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        setIsPressed(false)
        setTouchStart(null)
      }}
    >
      {children}
    </div>
  )
}
