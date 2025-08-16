"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export function MobileNavigation() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const navItems = [
    { href: "/", label: "home", icon: "🏠" },
    { href: "/articles", label: "articles", icon: "📝" },
    { href: "/projects", label: "projects", icon: "🚀" },
    { href: "mailto:firas@hey.com", label: "contact", external: true, icon: "✉️" },
  ]

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        setLastScrollY(window.scrollY)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar)
      return () => {
        window.removeEventListener("scroll", controlNavbar)
      }
    }
  }, [lastScrollY])

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-2 mb-2 md:mx-4 md:mb-4 bg-black/95 backdrop-blur-xl rounded-2xl border-2 border-[#F8C0C8] shadow-2xl">
        <div className="flex justify-center items-center py-2 md:py-3 px-2 md:px-4">
          <div className="flex gap-1 md:gap-6 w-full justify-around md:justify-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex flex-col items-center px-2 py-3 md:px-4 md:py-3 rounded-xl transition-all duration-300 transform active:scale-95 min-w-[60px] md:min-w-auto ${
                    isActive
                      ? "bg-[#F4D35E] text-black scale-105"
                      : "text-white hover:text-[#F4D35E] hover:bg-white/10 active:bg-white/20"
                  }`}
                  {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <span className="text-xl md:text-lg mb-1">{item.icon}</span>

                  <span className="text-xs md:text-sm font-bold tracking-wide uppercase leading-none">
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#F8C0C8] rounded-full animate-pulse" />
                  )}

                  {/* Enhanced hover/focus effect */}
                  <div className="absolute inset-0 rounded-xl bg-[#F4D35E]/20 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Decorative bottom accent */}
        <div className="h-1 bg-gradient-to-r from-[#F4D35E] via-[#F8C0C8] to-[#F4D35E] rounded-b-2xl" />
      </div>
    </nav>
  )
}
