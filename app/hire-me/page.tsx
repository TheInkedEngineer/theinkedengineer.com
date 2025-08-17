import { Navigation } from "@/components/navigation"
import { ArrowDownIcon, PlayIcon } from "lucide-react"

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

const talks = [
  {
    id: 1,
    title: "Building Scalable iOS Architecture",
    event: "iOS Dev Conference 2023",
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    description:
      "Deep dive into MVVM-C architecture patterns and dependency injection for large-scale iOS applications.",
  },
  {
    id: 2,
    title: "Design Systems in iOS Development",
    event: "SwiftConf 2023",
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    description: "Creating consistent, maintainable design systems that scale across multiple iOS applications.",
  },
  {
    id: 3,
    title: "System Design for Mobile Apps",
    event: "Mobile Dev Summit 2022",
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    description: "Architectural patterns and best practices for building robust, scalable mobile applications.",
  },
]

const skills = [
  {
    category: "Code Architecture",
    items: [
      "MVVM-C Pattern",
      "Dependency Injection",
      "Clean Architecture",
      "Modular Design",
      "Protocol-Oriented Programming",
    ],
  },
  {
    category: "System Design",
    items: [
      "Scalable Architecture",
      "Performance Optimization",
      "Data Flow Design",
      "API Integration",
      "Offline-First Design",
    ],
  },
  {
    category: "Design Systems",
    items: [
      "Component Libraries",
      "Design Tokens",
      "Accessibility Standards",
      "Cross-Platform Consistency",
      "Design-Dev Collaboration",
    ],
  },
]

export default function HirePage() {
  return (
    <div className="min-h-screen bg-[#F4D35E] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#F8C0C8] rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#F8C0C8] rotate-45 opacity-60 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-20 bg-[#F8C0C8] rounded-full opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-[#F8C0C8] rounded-full opacity-50 animate-bounce delay-500"></div>
      </div>

      <Navigation />

      <main className="relative z-10 px-4 py-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-black mb-8 leading-none">
            LET'S BUILD
            <br />
            SOMETHING
            <br />
            <span className="text-black underline decoration-4 underline-offset-8">AMAZING</span>
          </h1>
          <p className="text-xl md:text-2xl text-black max-w-3xl mx-auto mb-12 leading-relaxed">
            Staff iOS Engineer with 8+ years crafting scalable architectures, elegant design systems, and
            high-performance mobile experiences.
          </p>

          {/* CV Download Button */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/curriculum.pdf"
              download
              className="bg-black text-[#F4D35E] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all duration-300 flex items-center gap-3 group"
            >
              <ArrowDownIcon className="w-5 h-5 group-hover:animate-bounce" />
              Download CV
            </a>
          </div>
        </section>

        {/* Skills Overview */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-black mb-12 text-center">WHAT I BRING</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <div
                key={skillGroup.category}
                className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                <h3 className="text-2xl font-bold text-black mb-6 underline decoration-[#F8C0C8] decoration-4 underline-offset-4">
                  {skillGroup.category}
                </h3>
                <ul className="space-y-3">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <li key={skillIndex} className="text-black font-medium flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#F8C0C8] rounded-full"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Conference Talks */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-black mb-12 text-center">CONFERENCE TALKS</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {talks.map((talk, index) => (
              <div
                key={talk.id}
                className="bg-white/20 backdrop-blur-sm rounded-3xl overflow-hidden hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                {/* YouTube Embed */}
                <div className="relative aspect-video bg-black/10">
                  <iframe
                    src={`https://www.youtube.com/embed/${talk.videoId}`}
                    title={talk.title}
                    className="w-full h-full rounded-t-3xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <PlayIcon className="w-16 h-16 text-white" />
                  </div>
                </div>

                {/* Talk Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2">{talk.title}</h3>
                  <p className="text-black/80 font-medium mb-3">{talk.event}</p>
                  <p className="text-black leading-relaxed">{talk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-4xl mx-auto text-center mb-20">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-6">READY TO COLLABORATE?</h2>
            <p className="text-xl text-black mb-8 leading-relaxed">
              Whether you need architectural guidance, system design expertise, or a complete iOS solution, I'm here to
              help bring your vision to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:firas@theinkedengineer.com"
                className="bg-black text-[#F4D35E] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all duration-300"
              >
                Get In Touch
              </a>
              <a
                href="https://linkedin.com/in/theinkedengineer."
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-black text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-black hover:text-[#F4D35E] transition-all duration-300"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
