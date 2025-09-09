import { Navigation } from "@/components/navigation"
import { ArrowDownIcon } from "lucide-react"
import { EaseIn } from "@/components/animate/EaseIn"
import { TiltCard } from "@/components/animate/TiltCard"
import skills from "@/json-data/skills.json"

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

      <main className="relative z-10 px-4 py-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto text-center mb-20">
          <EaseIn>
            <h1 className="text-6xl md:text-8xl font-black text-brand-black mb-8 leading-none">
              LET'S BUILD
              <br />
              SOMETHING
              <br />
              <span className="text-brand-black underline decoration-brand-black decoration-4 underline-offset-8">AMAZING</span>
            </h1>
          </EaseIn>
          <EaseIn delay={100}>
            <p className="text-xl md:text-2xl text-brand-black max-w-3xl mx-auto mb-12 leading-relaxed">
              Staff iOS Engineer with 10+ years crafting scalable architectures, elegant design systems, and
              high-performance mobile experiences.
            </p>
          </EaseIn>

          {/* CV Download Button */}
          <EaseIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/curriculum.pdf"
                download
                className="bg-brand-yellow text-brand-black px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-black hover:text-brand-yellow transition-colors duration-300 flex items-center gap-3 group"
              >
                <ArrowDownIcon className="w-5 h-5 group-hover:animate-bounce" />
                Download CV
              </a>
            </div>
          </EaseIn>
        </section>

        {/* Skills Overview */}
        <section className="max-w-6xl mx-auto mb-20">
          <EaseIn>
            <h2 className="text-4xl md:text-6xl font-black text-brand-black mb-12 text-center">WHAT I BRING</h2>
          </EaseIn>

          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <EaseIn key={skillGroup.category} delay={index * 100}>
                <TiltCard className="bg-brand-black rounded-3xl p-8 transition-colors duration-300">
                  <h3 className="text-2xl font-bold text-brand-yellow mb-6 underline decoration-brand-yellow decoration-4 underline-offset-4">
                    {skillGroup.category}
                  </h3>
                  <ul className="space-y-3">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <li key={skillIndex} className="text-brand-yellow font-medium flex items-center gap-3">
                        <div className="w-2 h-2 bg-brand-yellow rounded-full"></div>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </EaseIn>
            ))}
          </div>
        </section>

        

        {/* Call to Action */}
        <section className="max-w-4xl mx-auto text-center mb-20">
          <EaseIn>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-black text-brand-black mb-6">READY TO COLLABORATE?</h2>
              <p className="text-xl text-brand-black mb-8 leading-relaxed">
                Whether you need architectural guidance, system design expertise, or a complete iOS solution, I'm here to
                help bring your vision to life.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:firas@theinkedengineer.com"
                  className="bg-brand-yellow text-brand-black px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-black hover:text-brand-yellow transition-colors"
                >
                  Get In Touch
                </a>
              </div>
            </div>
          </EaseIn>
        </section>
      </main>
    </div>
  )
}
