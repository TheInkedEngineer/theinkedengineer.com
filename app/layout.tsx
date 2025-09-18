import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://theinkedengineer.com"),
  title: {
    default: "Firas, The Inked Engineer",
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
    title: "Firas, The Inked Engineer",
    description: "iOS developer and web enthusiast sharing technical articles and showcasing creative projects.",
    siteName: "The Inked Engineer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Firas, The Inked Engineer",
    description: "iOS developer and web enthusiast sharing technical articles and showcasing creative projects.",
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
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`overflow-x-hidden`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#F4D35E" />
        <meta name="color-scheme" content="light" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Next.js will inject a manifest link for app/manifest.ts */}
      </head>
      <body className={`antialiased overflow-x-hidden`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
