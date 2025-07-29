import {
  Users,
  Cpu,
  BarChart3,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
} from "lucide-react";

import { useEffect, useRef } from "react";

import { Navigation } from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addSavvyCalTracking } from "@/lib/analytics";
import { CostOfDelayCalculator } from "@/components/CostOfDelayCalculator";

const Transformation = () => {
  const heroLinkRef = useRef<HTMLAnchorElement>(null);
  const bottomLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (heroLinkRef.current) {
      addSavvyCalTracking(heroLinkRef.current, 'transformation_hero_cta', 'transformation_alignment');
    }
    if (bottomLinkRef.current) {
      addSavvyCalTracking(bottomLinkRef.current, 'transformation_bottom_cta', 'transformation_alignment');
    }
  }, []);
  const features = [
    {
      icon: Cpu,
      title: "AI Enhancement",
      description:
        "Augment your team with AI agents tailored to your organization and stack",
    },
    {
      icon: BarChart3,
      title: "Compounded Velocity",
      description:
        "Multiply your development capacity with targeted AI workflows",
    },
    {
      icon: Shield,
      title: "Comprehensive Measurement",
      description: "Uncover bottlenecks and optimize for customer value",
    },
    {
      icon: Users,
      title: "Team Assessment & Discovery",
      description:
        "Deep dive into your team's current velocity and bottlenecks",
    },
  ];

  const benefits = [
    "3x Feature Velocity through AI-powered development",
    "75% Less Manual Work with intelligent automation",
    "10x Faster Innovation Cycles with continuous optimization",
    "50% Cost Reduction through efficiency gains",
    "Infinite Scaling Potential with elastic infrastructure",
  ];

  return (
    <>
      <SEO
        title="AI Transformation - Accelerate Your Engineering | VibeCTO.ai"
        description="Transform your engineering team with AI. Deploy specialized AI agents across your workflow to ship features faster while maintaining quality."
        canonicalUrl="https://vibecto.ai/transformation"
        keywords="AI transformation, AI Software Engineering, Agentic Engineering, Augmented Engineering, engineering acceleration, AI agents, development workflow, team productivity, AI integration"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "AI Engineering Transformation",
          description:
            "AI-powered transformation service for engineering teams",
          provider: {
            "@type": "Organization",
            name: "VibeCTO.ai",
          },
          serviceType: "AI Consulting",
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Transformation
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Step into the Metamorphosis Chamber where teams undergo radical
                transformation. Emerge with AI-augmented capabilities that
                multiply your development velocity and unlock new dimensions of
                possibility.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  ref={heroLinkRef}
                  href="https://savvycal.com/craigsturgis/vibecto-transformation-alignment"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl"
                  >
                    Schedule Strategy Call
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>

                {/* <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg"
              >
                Download Case Studies
              </Button> */}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-6 bg-black/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Your Evolution Awaits
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Leverage battle-tested strategies to integrate AI agents into
                  your existing workflows.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                          <feature.icon className="w-8 h-8 text-purple-400" />
                        </div>
                      </div>
                      <CardTitle className="text-white text-lg">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-center">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Cost of Delay Calculator Section */}
          <section className="py-20 px-6 bg-black/20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Calculate Your Transformation Impact
                </h2>
                <p className="text-lg text-gray-300">
                  See the financial impact of accelerating your development
                  timeline
                </p>
              </div>

              <CostOfDelayCalculator
                showByDefault={true}
                defaultTimeReduction={15}
                initialInitiatives={[
                  {
                    id: "1",
                    name: "AI-Powered Feature Development",
                    monthlyValue: 100000,
                    currentTimeMonths: 9,
                  },
                  {
                    id: "2",
                    name: "New Product Line Launch",
                    monthlyValue: 300000,
                    currentTimeMonths: 6,
                  },
                  {
                    id: "3",
                    name: "Platform Modernization",
                    monthlyValue: 200000,
                    currentTimeMonths: 12,
                  },
                ]}
              />
            </div>
          </section>

          {/* Benefits Section */}

          {/* <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Transform Your Development Process
                </h2>
                <p className="text-xl text-gray-300">
                  Real results from teams that have gone through our
                  transformation.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300"
                  >
                    <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0" />
                    <p className="text-white text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            </div>
          </section> */}

          {/* Process Section */}
          <section className="py-20 px-6 bg-black/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  The Transformation Process
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  See how we accelerate your team with AI-powered innovation.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <CardTitle className="text-white text-xl">
                      Team Assessment & Discovery
                    </CardTitle>
                    <p className="text-sm text-purple-400 mt-1">Weeks 1-2</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Deep dive into your team's current velocity and
                      bottlenecks. Current development workflow analysis and AI
                      readiness evaluation.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <CardTitle className="text-white text-xl">
                      AI Agent Implementation
                    </CardTitle>
                    <p className="text-sm text-purple-400 mt-1">Weeks 3-4</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Targeted initial deployment of AI agent workflows tailored
                      to your organization and stack. Custom configuration with
                      pilot project execution.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <CardTitle className="text-white text-xl">
                      Scale & Optimize
                    </CardTitle>
                    <p className="text-sm text-purple-400 mt-1">Weeks 4-12+</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Scale AI adoption across your entire product development
                      org. Process optimization with ongoing support &
                      refinement.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready for light speed development?
                </h2>

                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join leading teams who've transformed their product
                  development with AI agents.
                </p>

                <a
                  ref={bottomLinkRef}
                  href="https://savvycal.com/craigsturgis/vibecto-transformation-alignment"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-xl"
                  >
                    Schedule Your Strategy Call
                    <Sparkles className="ml-3 w-6 h-6" />
                  </Button>
                </a>

                <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>30-minute consultation</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Custom roadmap</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>ROI analysis</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Transformation;
