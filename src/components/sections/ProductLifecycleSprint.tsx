"use client";

import {
  Calendar,
  ArrowRight,
  Brain,
  Zap,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const SPRINT_PHASES = [
  {
    id: "assessment",
    title: "Team Assessment & Discovery",
    icon: <Brain className="w-6 h-6" />,
    description: "Deep dive into your team's current velocity and bottlenecks",
    duration: "Weeks 1-2",
    activities: [
      "Current development workflow analysis",
      "Team capability assessment",
      "AI readiness evaluation",
      "Quick wins identification",
    ],
  },
  {
    id: "implementation",
    title: "AI Agent Implementation",
    icon: <Zap className="w-6 h-6" />,
    description:
      "Targeted initial deployment of AI agent workflows tailored to your organization and stack",
    duration: "Weeks 3-4",
    activities: [
      "Custom AI agent configuration",
      "Integration with existing tools",
      "Targeted team training",
      "Pilot project execution",
    ],
  },
  {
    id: "acceleration",
    title: "Velocity Acceleration",
    icon: <TrendingUp className="w-6 h-6" />,
    description: "Scale AI adoption across your entire product development org",
    duration: "Weeks 4+",
    activities: [
      "Process optimization",
      "Performance monitoring",
      "Team training expansion",
      "Ongoing support & refinement",
    ],
  },
];

export const ProductLifecycleSprint = () => {
  const router = useRouter();
  const [particles, setParticles] = useState<
    { left: string; top: string; delay: string; duration: string }[]
  >([]);

  useEffect(() => {
    // Generate particles on client-side only to avoid hydration mismatch
    const generatedParticles = [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <section className="relative py-8 lg:py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Three Sections Container */}
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Section 1: What is the AI Product Lifecycle Sprint */}
          <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 lg:mb-0 lg:flex-1">
            <div className="text-left mb-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4 leading-tight">
                AI Product Lifecycle Sprint
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
                A focused 4 week process to:
              </p>
              <ul className="text-sm sm:text-base text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Start or focus your AI product lifecycle journey
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Evaluate AI enabled product opportunities
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  See quick results with a pilot project
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Align on opportunities and measurement of success
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: What You Get */}
          <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 lg:mb-0 lg:flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white text-left mb-6">
              What You Get
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm">
                    4 weeks of live and async work with Craig
                  </h4>
                  <p className="text-xs text-gray-400">
                    Workshops and assessment to review current state and understand the landscape of your product, market, and company. Then, aligning to take action and measure results.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm">
                    Custom AI Agent Configuration Blueprint
                  </h4>
                  <p className="text-xs text-gray-400">
                    Tailored AI workflows integrated with your existing tools, stack, and product lifecycle + SDLC
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm">
                    AI Product Opportunities Review
                  </h4>
                  <p className="text-xs text-gray-400">
                    Identify where integrating AI into your product might represent a meaningful opportunity vs. a bolted on afterthought
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm">
                    Pilot Project Coaching + Execution
                  </h4>
                  <p className="text-xs text-gray-400">
                    Hands-on coaching and real implementation on a live project to prove value and
                    build confidence
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm">
                    Performance Monitoring Setup
                  </h4>
                  <p className="text-xs text-gray-400">
                    Establish customized metrics and KPIs to track the impact of improvements and ROI over time. Additional 3 months free access to VibeCTO.ai measurement tools to automate tracking.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm">
                    Access to best practices database
                  </h4>
                  <p className="text-xs text-gray-400">
                    Lifetime access to a database of tools, workflows, and best practices for AI enabled product development. Updated as the frontier advances.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Pricing */}
          <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-6 sm:p-8 shadow-2xl lg:flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white text-left mb-2">
              Investment
            </h3>
            <p className="text-sm text-gray-400 text-left mb-6">
              Pricing based on company size and the resulting complexity and impact potential
            </p>
            <div className="text-center">
              {/* Single Pricing Option */}
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6 hover:bg-white/[0.04] transition-colors duration-300">
                <div className="text-center mb-3">
                  <p>Starting at</p>
                  <div className="text-2xl font-bold text-blue-400 mb-2">
                    $12,500
                  </div>
                </div>
              </div>
            </div>
            
            {/* Note about continued engagement */}
            <div className="mt-6 p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg">
              <p className="text-xs text-gray-400 text-left">
                Continued engagement and ongoing support available based on capacity and fit.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section - Below all three sections */}
        <div className="text-center mt-12">
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Ready to supercharge your product development with AI? Book a
            strategic alignment call.
          </p>
          <a
            href="https://savvycal.com/craigsturgis/vibecto-dot-ai-chat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Reserve Your Sprint
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
