import type React from "react"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
})

export const metadata = {
  title: {
    default: "The Inked Engineer - Firas",
    template: "%s | The Inked Engineer",
  },
  description:
    "Hi, I am Firas & I code. iOS developer and web enthusiast sharing technical articles and showcasing creative projects.",
  keywords: ["iOS development", "Swift", "Web development", "Next.js", "React", "Technical blog", "Software engineer"],
  authors: [{ name: "Firas", url: "https://theinkedengineer.com" }],
  creator: "Firas",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://theinkedengineer.com",
    title: "The Inked Engineer - Firas",
    description: "iOS developer and web enthusiast sharing technical articles and showcasing creative projects.",
    siteName: "The Inked Engineer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Inked Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Inked Engineer - Firas",
    description: "iOS developer and web enthusiast sharing technical articles and showcasing creative projects.",
    images: ["/og-image.png"],
    creator: "@theinkedengineer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="theme-color" content="#F4D35E" />
        <meta name="color-scheme" content="light" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="scroll-smooth">{children}</div>

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
      </body>
    </html>
  )
}
