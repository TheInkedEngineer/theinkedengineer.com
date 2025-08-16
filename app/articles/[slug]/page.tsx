import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { notFound } from "next/navigation"

// Mock article data - in a real app, this would be loaded from markdown files
const getArticle = (slug: string) => {
  const articles: Record<string, any> = {
    "bridging-core-location-to-swift-6-concurrency": {
      title: "Bridging CoreLocation to Swift 6's Concurrency: Challenges and Solutions",
      date: "2024",
      category: "Swift",
      readTime: "8 min read",
      content: `
# Bridging CoreLocation to Swift 6's Concurrency: Challenges and Solutions

Swift's modern concurrency model, introduced with Swift 5.5, provides powerful tools like async/await and Actors, enabling developers to write more readable and maintainable asynchronous code. However, bridging older APIs, particularly those that rely on delegate patterns, can be challenging.

In this article, we'll explore how to bridge CoreLocation's delegate-based API to Swift's concurrency model, as it discusses the challenges faced during this process and the solutions to overcome them.

## The Traditional Delegate Pattern in CoreLocation

CoreLocation traditionally uses the delegate pattern to provide location updates. Developers subclass CLLocationManagerDelegate to receive location data.

### Implementing Location Updates with Delegates

Here's how you might traditionally implement a locationManager to get location updates and be notified when it changes:

\`\`\`swift
import CoreLocation

class LocationManager: NSObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    var didUpdateLocation: ((CLLocation) -> Void)?
    var didFailWithError: ((Error) -> Void)?
    
    override init() {
        super.init()
        locationManager.delegate = self
    }
    
    func requestWhenInUseAuthorization() {
        locationManager.requestWhenInUseAuthorization()
    }
    
    func startUpdatingLocation() {
        locationManager.startUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        // Handle locations
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        // Handle error
    }
}
\`\`\`

## Consuming LocationManager in a SwiftUI View

To use this LocationManager in a SwiftUI view, you set up the manager and handle updates via the callback:

\`\`\`swift
import SwiftUI

struct ContentView: View {
    @StateObject private var locationManager = LocationManager()
    @State private var currentLocation: CLLocation?
    
    var body: some View {
        VStack {
            if let location = currentLocation {
                Text("Location: \\(location.coordinate.latitude), \\(location.coordinate.longitude)")
            } else {
                Text("Requesting location...")
            }
        }
        .onAppear {
            locationManager.requestWhenInUseAuthorization()
            locationManager.startUpdatingLocation()
        }
        .onReceive(locationManager.$currentLocation) { location in
            currentLocation = location
        }
    }
}
\`\`\`

## Limitations of the Traditional Approach

While the traditional approach works, there are some limitations:

- **Not Leveraging Swift Concurrency**: The delegate pattern and callback closures don't take advantage of Swift's modern concurrency features like async/await and Actors.
- **Complex Asynchronous Flow**: Handling asynchronous operations with delegates and closures can become complex, especially when handling multiple asynchronous tasks or chaining operations.
- **Manual State Management**: Developers need to manually manage state and handle potential race conditions, which can make synchronous code harder to read and maintain.

By adopting Swift's concurrency features, we can streamline the code, reduce complexity, and make our asynchronous logic more intuitive. In the following sections, we'll explore how to implement this modern approach and simplify fetching the current location.

## Using withCheckedThrowingContinuation for Asynchronous Location Requests

Swift's withCheckedThrowingContinuation is a powerful tool for bridging between old callback-based APIs and Swift's modern async/await model. Let's break down how we can use it to simplify fetching the current location.

### The Asynchronous currentLocation Property

Here's how we expose the current location using withCheckedThrowingContinuation:

\`\`\`swift
import CoreLocation

class LocationManager: NSObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    private var currentLocationContinuation: CheckedContinuation<CLLocation, Error>?
    
    override init() {
        super.init()
        locationManager.delegate = self
    }
\`\`\`

This approach transforms the callback-based location API into a clean async function that integrates seamlessly with Swift's concurrency model.
      `,
    },
  }

  return articles[slug] || null
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticle(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#F4D35E] pb-20">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/4 h-40 bg-[#F8C0C8] transform rotate-45 translate-x-20 -translate-y-10"></div>
          <div className="absolute top-32 left-0 w-1/3 h-32 bg-[#F8C0C8] transform -rotate-12 -translate-x-16"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          <Link
            href="/articles"
            className="inline-flex items-center text-black font-bold text-lg mb-8 hover:text-[#F8C0C8] transition-colors"
          >
            <svg className="w-5 h-5 mr-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            Back to Articles
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-2 bg-black text-[#F4D35E] font-bold rounded-full">{article.category}</span>
              <span className="text-black font-medium">{article.date}</span>
              <span className="text-black">{article.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-black leading-tight">{article.title}</h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-black">
            <div className="prose prose-lg max-w-none">
              <div className="article-content" dangerouslySetInnerHTML={{ __html: formatMarkdown(article.content) }} />
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center">
            <Link
              href="/articles"
              className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-[#F8C0C8] hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              ← All Articles
            </Link>

            <div className="flex gap-4">
              <button className="px-6 py-3 bg-[#F8C0C8] text-black font-bold rounded-full hover:bg-black hover:text-white transition-all duration-300">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  )
}

// Simple markdown-to-HTML converter (in a real app, use a proper markdown parser)
function formatMarkdown(content: string): string {
  return content
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black text-black mb-6 mt-8">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-black mb-4 mt-6">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-black mb-3 mt-5">$1</h3>')
    .replace(
      /```swift\n([\s\S]*?)\n```/g,
      '<div class="bg-gray-900 text-green-400 p-6 rounded-xl my-6 overflow-x-auto"><pre><code>$1</code></pre></div>',
    )
    .replace(
      /```(.*?)\n([\s\S]*?)\n```/g,
      '<div class="bg-gray-100 p-6 rounded-xl my-6 overflow-x-auto"><pre><code>$2</code></pre></div>',
    )
    .replace(/`([^`]+)`/g, '<code class="bg-[#F4D35E] text-black px-2 py-1 rounded font-mono text-sm">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/^- (.*$)/gim, '<li class="mb-2">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
    .replace(/^(?!<[h|l|d])(.+)$/gm, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>')
}
