"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Add no-scroll class to body for iOS Safari fix
    document.body.classList.add('no-scroll')
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main id="main-content" className="fixed inset-0 w-full h-full bg-[#F4D35E] overflow-hidden">
      {/* Animated Lines Background */}
      <div className="lines" aria-hidden="true">
        <div className="line top"></div>
        <div className="line middle"></div>
        <div className="line bottom"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full">
        {/* Desktop Layout */}
        <div className="hidden md:block h-full relative">
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
                  things I built
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
        <div className="md:hidden h-full relative p-4">
          {/* Title Section */}
          <div className="absolute top-16 left-6">
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
                  things I built
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

      {/* Navigation positioned inside main */}
      <div className="relative z-50">
        <Navigation />
      </div>
    </main>
  )
}
