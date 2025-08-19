'use client'

import {
  Zap,
  Code,
  Rocket,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  Target,
} from "lucide-react";
import { useState } from "react";

import { EmailOptIn } from "@/components/EmailOptIn";
import { IgnitionQualificationForm } from "@/components/IgnitionQualificationForm";
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

export function IgnitionClient() {
  const [showQualificationForm, setShowQualificationForm] = useState(false);
  const features = [
    {
      icon: Zap,
      title: "Rapid MVP Development",
      description:
        "Transform insights into a working MVP through rapid design and development in 2-4 weeks",
    },
    {
      icon: Code,
      title: "Tech Stack Selection",
      description:
        "Expert guidance on choosing the right technologies and architecture for your MVP",
    },
    {
      icon: Target,
      title: "Assumption Testing",
      description:
        "Validate your core assumptions with real users and refine based on feedback",
    },
    {
      icon: Users,
      title: "Iterative Refinement",
      description:
        "Weekly office hours and ongoing support to help you iterate and grow",
    },
  ];

  const steps = [
    "Discovery & Validation (2-4 hours): Deep dive into your vision, market, and assumptions",
    "Design & Build (2-4 weeks): Transform insights into a working MVP with twice weekly updates",
    "Test & Iterate (1-2 months): Weekly office hours, ICP testing advice, and growth strategy",
    "Deliverable: An MVP you can continue to vibe code with",
    "Availability: Extremely limited - expert 0 to 1 builder support",
  ];

  return (
    <>
      <Navigation />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl">
                <Zap className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Ignition
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Where raw ideas transform into testable prototypes. Compress
              months of wandering into weeks of clarity with a working MVP +
              validation framework from an expert 0 to 1 builder.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-6 text-lg font-semibold rounded-xl"
                onClick={() => setShowQualificationForm(true)}
              >
                Let&apos;s Build Your Idea
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              {/* <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg"
              >
                Learn More
              </Button> */}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Your 2-4 week intensive jumpstart to transform ideas into
                testable reality.
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
                      <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl">
                        <feature.icon className="w-8 h-8 text-yellow-400" />
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

        {/* Process Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                The Process
              </h2>
              <p className="text-xl text-gray-300">
                From idea to testable product in just a few focused sessions.
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-lg font-medium">{step}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Email Opt-in Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <EmailOptIn
              title="Learn for yourself"
              description="Follow along with me as I build and share what I learn"
              className="max-w-2xl mx-auto"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to test your idea?
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Compress months of wandering into weeks of clarity. Transform
                your raw idea into a validated venture with expert guidance.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-12 py-6 text-xl font-semibold rounded-xl"
                onClick={() => setShowQualificationForm(true)}
              >
                Schedule Alignment Call
                <Rocket className="ml-3 w-6 h-6" />
              </Button>

              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>2-4 week intensive jumpstart</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Working testable prototype delivered</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Expert 0 to 1 builder</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Qualification Form Dialog */}
      <Dialog open={showQualificationForm} onOpenChange={setShowQualificationForm}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Start Your Ignition Journey
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Let&apos;s make sure Ignition is the right fit for your needs and timeline.
            </DialogDescription>
          </DialogHeader>
          
          <IgnitionQualificationForm
            onSuccess={() => {
              // Keep dialog open to show success state
              // It will handle the redirect automatically
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}