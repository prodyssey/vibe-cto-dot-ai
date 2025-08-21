import type { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmailOptIn } from '@/components/EmailOptIn'
import { OptimizedImage } from '@/components/OptimizedImage'
import { Briefcase, Code, Lightbulb, Users, Gamepad2 } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "About - VibeCTO.ai | Behind the Vibes",
  description: "Learn about the mission behind VibeCTO.ai and how Craig Sturgis is helping builders transform ideas into reality faster with AI-powered guidance.",
  alternates: {
    canonical: "https://vibecto.ai/about"
  }
}

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-white mb-6">
                Unlocking the Joy of Building
              </h1>
            </div>

            {/* About Craig Section */}
            <Card className="bg-gray-800/50 backdrop-blur-lg border-purple-500/20 p-8 mb-12 overflow-hidden">
              <h2 className="text-3xl font-bold text-white mb-8">
                Who's Behind This
              </h2>

              {/* Avatar and intro */}
              <div className="grid lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-2 flex justify-center">
                  <div className="relative group">
                    {/* Background card for avatar */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl scale-105 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
                      <OptimizedImage
                        src="/lovable-uploads/8dee8e22-c18f-4fb2-b2ea-7fbe8d2fe25a.png"
                        alt="Craig Sturgis - VibeCTO Avatar"
                        width={288}
                        height={288}
                        priority
                        className="w-64 h-64 lg:w-72 lg:h-72 object-contain hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1024px) 256px, 288px"
                      />
                      <p className="mt-4 text-center text-purple-300 font-medium italic">
                        "Let's build something great together"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-4 text-gray-300">
                  <p className="text-lg leading-relaxed">
                    I'm Craig Sturgis—founder, product engineer, and someone
                    who's been in the trenches of software product development
                    for long enough to know what can actually work.
                  </p>
                  <p className="leading-relaxed">
                    I've been making software since I was a kid typing BASIC out
                    of a library book. The joy of building and learning is
                    fundamental to who I am and it's my mission to foster it in
                    as many people and organizations as I can.
                  </p>
                  <p>
                    My journey hasn't been a straight line. From co-founding
                    startups to leading product at a public company and scale
                    ups, from writing code to coaching executives and teams, I've
                    learned that the best solutions come from understanding both
                    the technical and human sides of building products.
                  </p>
                  <p className="leading-relaxed">
                    When I first tried AI applied to product development, I
                    could see how this could empower so many of the dreams I've
                    had my whole career. I've been an early adopter as this wave
                    continues to build, and I'm interested in taking a pragmatic
                    approach to adopt the best now while keeping an eye on what
                    develops.
                  </p>
                  <p>
                    I want you on this journey with me. The more the merrier 😄
                  </p>
                </div>
              </div>

              {/* Experience Badges */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="bg-purple-600/20 text-purple-300 border-purple-500/30"
                >
                  <Briefcase className="w-3 h-3 mr-1" />
                  Cofounder + CTO @ Haven
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-600/20 text-purple-300 border-purple-500/30"
                >
                  <Code className="w-3 h-3 mr-1" />
                  VP Product @ SmarterHQ
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-600/20 text-purple-300 border-purple-500/30"
                >
                  <Users className="w-3 h-3 mr-1" />
                  Director of Product @ Angie's List
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-600/20 text-purple-300 border-purple-500/30"
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Fractional CTO
                </Badge>
              </div>
            </Card>

            {/* What Makes This Different */}
            <Card className="bg-gray-800/50 backdrop-blur-lg border-purple-500/20 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                What Makes VibeCTO.ai Different
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">
                    Real Experience
                  </h3>
                  <p className="text-gray-300">
                    This isn't theoretical. Every framework, every piece of
                    guidance comes from actual experience building and scaling
                    products.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">
                    Practical Focus
                  </h3>
                  <p className="text-gray-300">
                    No fluff, no unnecessary complexity. Just straightforward
                    guidance on using the latest tools to make great product,
                    faster.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">
                    AI-Native Approach
                  </h3>
                  <p className="text-gray-300">
                    Built from the ground up to leverage AI tools effectively,
                    not as an afterthought but as a core part of the development
                    process.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">
                    Community Driven
                  </h3>
                  <p className="text-gray-300">
                    Learning happens best in community. VibeCTO.ai is building a
                    network of builders who share knowledge and push each other
                    forward.
                  </p>
                </div>
              </div>
            </Card>

            {/* CTA Section */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Start Building?
              </h2>
              <p className="text-xl text-purple-200 mb-8">
                Choose your own adventure or stay updated on the journey
              </p>
              <div className="flex justify-center mb-12">
                <Link href="/adventure">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <Gamepad2 className="mr-2 w-5 h-5" />
                    Pick Your Path (Fun)
                  </Button>
                </Link>
              </div>
            </div>

            {/* Email Opt-in Section */}
            <div className="py-12">
              <EmailOptIn
                title="Join the Journey"
                description="Get updates on new tools, techniques, and insights for AI-powered development"
                className="max-w-2xl mx-auto"
              />
            </div>

            {/* Connect Section */}
            <Card className="bg-gray-800/50 backdrop-blur-lg border-purple-500/20 p-8 mt-12">
              <h3 className="text-2xl font-bold text-white mb-4">
                Let's Connect
              </h3>
              <p className="text-gray-300 mb-6">
                Want to learn more about the journey or share your own? I'm
                always up for a conversation about building great products.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://craigsturgis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Personal Site →
                </a>
                <a
                  href="https://prodyssey.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Prodyssey →
                </a>
                <a
                  href="https://www.linkedin.com/in/craigsturgis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  LinkedIn →
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}