"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  type NavItem = { href: string; label: string; external?: boolean }

  const navItems: NavItem[] = [
    { href: "/", label: "home"},
    { href: "/projects", label: "projects"},
    { href: "/insights", label: "insights"},
    { href: "/hire-me", label: "hire me"},
  ]

  // Nav remains always visible; removed hide-on-scroll behavior

  return (
    <nav
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-max`}
    >
      {/* SVG filter defs for displacement */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="liquidGlassDisplace" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.009" numOctaves="2" seed="11" stitchTiles="stitch" result="noise">
              <animate attributeName="baseFrequency" dur="18s" values="0.003 0.007; 0.006 0.012; 0.003 0.007" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="mx-4 mb-4 rounded-2xl liquid-glass bg-white/10 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/20 overflow-hidden isolate relative">
        <div className="liquid-displace-overlay" style={{ filter: "url(#liquidGlassDisplace)" }} />
        <div className="flex justify-center items-center py-3 px-4">
          <div className="flex gap-2 md:gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center justify-center px-3 py-3 md:px-4 md:py-3 rounded-xl transition-transform duration-300 transform hover:scale-110 whitespace-nowrap text-brand-black`}
                  {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {/* Label */}
                  <span className="text-xs md:text-sm font-bold tracking-wide uppercase">{item.label}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full nav-dot" />
                  )}

                  {/* Removed hover background; scaling only retained */}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
