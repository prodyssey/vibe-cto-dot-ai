import type { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'

export const metadata: Metadata = {
  title: "About - VibeCTO.ai",
  description: "Learn about VibeCTO.ai and our mission to transform development with AI-augmented engineering.",
  alternates: {
    canonical: "https://vibecto.ai/about"
  }
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              About
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Learn about VibeCTO.ai and our mission to transform development with AI-augmented engineering.
            </p>
            <div className="text-gray-300">
              <p>More about information coming soon.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}