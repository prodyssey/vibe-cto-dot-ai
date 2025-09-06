'use client'

import {
  Shield,
  Code2,
  GitBranch,
  Layers,
  Rocket,
  Calendar,
} from "lucide-react";
import { useState } from "react";

import { EmailOptIn } from "@/components/EmailOptIn";
import { Footer } from "@/components/Footer";
import { LaunchControlQualificationForm } from "@/components/LaunchControlQualificationForm";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LaunchControlClient() {
  const [showQualificationForm, setShowQualificationForm] = useState(false);
  const services = [
    {
      icon: Shield,
      title: "Performance Optimization",
      description:
        "Avoid scaling bottlenecks and ensure your system can handle growth without breaking",
    },
    {
      icon: Code2,
      title: "Product Development Lifecycle",
      description:
        "Incorporate Augmented Product Engineers into your team and workflow for maximum velocity",
    },
    {
      icon: GitBranch,
      title: "Navigate Traction",
      description:
        "Get guidance from someone who's been there on scaling from prototype to production",
    },
    {
      icon: Layers,
      title: "Team Integration",
      description:
        "Seamlessly blend your vision with production-ready engineering excellence",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TechStart",
      content:
        "Launch Control helped us avoid critical security vulnerabilities and set up a proper CI/CD pipeline. Our product is now rock-solid.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "CEO, InnovateNow",
      content:
        "The architecture review transformed our codebase. We can now onboard developers without fear of breaking things.",
      rating: 5,
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Navigation />

        <div className="pt-20 flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Launch Control
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your product has achieved liftoff. Now it's time to reach escape
              velocity. Launch Control provides the technical infrastructure,
              product development readiness, and strategic guidance to scale
              your successful prototype into a market-capturing product.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg font-semibold rounded-xl"
                onClick={() => setShowQualificationForm(true)}
              >
                Begin Mission Assessment
                <Rocket className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What We Do
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Expert guidance to ensure your product is secure, scalable,
                and maintainable.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
                        <service.icon className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-center">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Mission Phases
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Your journey from prototype to production powerhouse follows a
                proven flight path designed for sustainable scaling.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Mission Assessment (Weeks 1-2)
                  </h3>
                  <p className="text-gray-300">
                    Deep dive into your current architecture, performance
                    bottlenecks, security vulnerabilities, and scaling
                    requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Flight Plan Execution (Weeks 2-12)
                  </h3>
                  <p className="text-gray-300">
                    Implement the optimal architecture and development
                    strategy for your growth trajectory with CI/CD,
                    monitoring, and team augmentation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Orbital Operations (Ongoing - Optional)
                  </h3>
                  <p className="text-gray-300">
                    Fractional CTO/CPO leadership, technical hiring, product
                    strategy, and limited emergency support to maintain peak
                    performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Email Opt-in Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <EmailOptIn
              title="Learn with me"
              description="Follow along as I build and share what I learn"
              className="max-w-2xl mx-auto"
            />
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Build with Confidence?
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Stop worrying about your code breaking in production. Get the
                expert guidance you need to build systems that last.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-semibold rounded-xl"
                onClick={() => setShowQualificationForm(true)}
              >
                Start Mission Planning
                <Rocket className="ml-3 w-6 h-6" />
              </Button>

              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-400">
                <span>No commitment required</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>30-minute architecture review</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Custom technical roadmap included</span>
              </div>
            </div>
          </div>
        </section>
        </div>

        <Footer />

        {/* Qualification Form Dialog */}
      <Dialog
        open={showQualificationForm}
        onOpenChange={setShowQualificationForm}
      >
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Launch Control Mission Assessment
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Let&apos;s ensure your product is ready for the scaling mission
              ahead.
            </DialogDescription>
          </DialogHeader>

          <LaunchControlQualificationForm
            onSuccess={() => {
              // Keep dialog open to show success state
              // It will handle the redirect automatically
            }}
          />
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}