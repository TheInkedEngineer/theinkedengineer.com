"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <main id="main-content" className="relative min-h-screen w-full bg-[#F4D35E] overflow-hidden">
        {/* Animated Lines Background */}
        <div className="lines" aria-hidden="true">
          <div className="line top"></div>
          <div className="line middle"></div>
          <div className="line bottom"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen">
          {/* Desktop Layout */}
          <div className="hidden md:block md:h-screen relative">
            {/* Title Section */}
            <div className="absolute top-8 left-8">
              <h1 className="mega-title leading-none">
                THE INKED
                <br />
                ENGINEER
              </h1>
            </div>

            {/* Description Section - positioned with bottom 25% from screen bottom */}
            <div className="absolute bottom-[25vh] right-8">
              <div className="description text-right">
                <p className="mb-2">
                  Hi, I am <strong>Firas</strong> & I code.
                </p>
                <p className="mb-2">
                  Checkout{" "}
                  <Link href="/projects" className="hover:opacity-80 transition-opacity">
                    things I worked on
                  </Link>
                  .
                </p>
                <p>
                  Read{" "}
                  <Link href="/articles" className="hover:opacity-80 transition-opacity">
                    stuff I wrote
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden min-h-screen relative p-4">
            {/* Title Section */}
            <div className="absolute top-4 left-4">
              <h1 className="mega-title leading-none">
                THE INKED
                <br />
                ENGINEER
              </h1>
            </div>

            {/* Description Section - positioned with bottom 25% from screen bottom */}
            <div className="absolute bottom-[25vh] right-4">
              <div className="description text-right">
                <p className="mb-2">
                  Hi, I am <strong>Firas</strong> & I code.
                </p>
                <p className="mb-2">
                  Checkout{" "}
                  <Link href="/projects" className="hover:opacity-80 transition-opacity">
                    things I worked on
                  </Link>
                  .
                </p>
                <p>
                  Read{" "}
                  <Link href="/articles" className="hover:opacity-80 transition-opacity">
                    stuff I wrote
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Navigation />
    </>
  )
}
