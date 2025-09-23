import { Navigation } from "@/components/navigation"
import { ArrowDownIcon } from "lucide-react"
import { EaseIn } from "@/components/animate/EaseIn"
import { Button } from "@/components/ui/button"
import { Title } from "@/components/ui/title"
import { typography, spacing } from "@/lib/design-system"
import { cn } from "@/lib/utils"
import skills from "@/json-data/skills.json"
import { WhatIBring } from "@/components/hire/what-i-bring"

export const metadata = {
  title: "Hire Me - Firas | Staff iOS Engineer",
  description:
    "Staff iOS Engineer specializing in code architecture, system design, and design systems. Available for hire.",
  openGraph: {
    title: "Hire Me - Firas | Staff iOS Engineer",
    description:
      "Staff iOS Engineer specializing in code architecture, system design, and design systems. Available for hire.",
    url: "https://theinkedengineer.com/hire",
  },
}

export default function HirePage() {
  return (
    <div id="hire-me-page" className="min-h-screen bg-brand-pink relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-yellow rounded-full opacity-80 motion-safe:animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-brand-yellow rotate-45 opacity-60 motion-safe:animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-20 bg-brand-yellow rounded-full opacity-70 motion-safe:animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-brand-yellow rounded-full opacity-50 motion-safe:animate-bounce delay-500"></div>
      </div>

      <Navigation />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className={cn(spacing.container, spacing.section, "text-center") }>
          <EaseIn>
            <Title as="h1" align="center" margin="lg" className="leading-none">
              LET'S BUILD SOMETHING
              <br />
              <span className="text-brand-black text-[18vw] md:text-[14vw] lg:text-[10vw] underline decoration-brand-black decoration-4 underline-offset-8">AMAZING</span>
            </Title>
          </EaseIn>
          <EaseIn delay={100}>
            <p className={cn(typography.subtitle, "text-brand-black mx-auto mb-12") }>
              Software Engineer with 10+ years of experience building scalable mobile architectures, elegant design systems, and high-performance mobile applications. 
              Currently a Staff iOS Engineer specializing in mobility and fintech, while also crafting websites and AI-driven bots on the side — always with a strong focus on intuitive UI/UX design.
            </p>
          </EaseIn>

          {/* CV Download Button */}
          {/* <EaseIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button href="/curriculum.pdf" download variant="primary" size="lg" className="group">
                <ArrowDownIcon className="w-5 h-5 group-hover:animate-bounce" />
                Download CV
              </Button>
            </div>
          </EaseIn> */}
          <EaseIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                href="mailto:firas@hey.com?subject=Requesting%20Curriculum&body=Hi%20Firas%2C%20I%20would%20like%20you%20to%20work%20with%20us%20at%20_company%20name_"
                variant="primary"
                size="lg"
              >
                Request Curriculum
              </Button>
            </div>
          </EaseIn>
        </section>

        {/* What I Bring (segmented, JSON-driven) */}
        <WhatIBring content={skills as any} />

        {/* Call to Action */}
        <section className={cn(spacing.container, spacing.section, "text-center") }>
          <EaseIn>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12">
              <Title as="h2" align="center">READY TO COLLABORATE?</Title>
              <p className={cn(typography.subtitle, "text-brand-black mb-8") }>
                From iOS architecture and concurrency to CMS-backed web and AI-powered bots, I bring scalable systems,
                thoughtful design, and leadership that ships. Whether you're a company, a startup, or hiring for
                freelance, let's build something that lasts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="mailto:firas@hey.com" variant="primary" size="lg">
                  Get In Touch
                </Button>
              </div>
            </div>
          </EaseIn>
        </section>
      </main>
    </div>
  )
}
