import {
  Quote,
  Star,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import type { Scene as SceneType } from "../../types";

const TESTIMONIALS_SCENE: SceneType = {
  id: "launchControlTestimonials",
  type: "detail",
  title: "Mission Success Stories",
  description: "Real results from real founders",
  backgroundClass: "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
};

const SUCCESS_STORIES = [
  {
    id: "fintech",
    company: "PayFlow",
    industry: "FinTech",
    founder: "Sarah Chen",
    role: "CTO & Co-founder",
    quote:
      "Launch Control transformed our prototype into a platform handling 1M+ transactions daily. Their team integrated seamlessly with ours and delivered beyond expectations.",
    metrics: [
      { label: "Response Time", value: "50ms → 12ms" },
      { label: "Throughput", value: "100x increase" },
      { label: "Uptime", value: "99.99%" },
    ],
    color: "from-green-600 to-emerald-600",
  },
  {
    id: "healthtech",
    company: "MediTrack",
    industry: "HealthTech",
    founder: "Dr. James Wilson",
    role: "Founder & CEO",
    quote:
      "The expertise they brought in HIPAA compliance and healthcare integrations was invaluable. We scaled from 100 to 10,000 clinics in 6 months.",
    metrics: [
      { label: "Clinics Onboarded", value: "100 → 10,000" },
      { label: "API Reliability", value: "99.95%" },
      { label: "Compliance", value: "HIPAA Certified" },
    ],
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: "ecommerce",
    company: "ShopStream",
    industry: "E-commerce",
    founder: "Maria Rodriguez",
    role: "Technical Co-founder",
    quote:
      "During Black Friday, our platform handled 10x normal traffic without a hiccup. The performance optimizations they implemented saved us millions.",
    metrics: [
      { label: "Peak Traffic", value: "1M concurrent users" },
      { label: "Page Load", value: "3s → 0.8s" },
      { label: "Revenue Impact", value: "+40%" },
    ],
    color: "from-purple-600 to-pink-600",
  },
];

export const LaunchControlTestimonialsScreen = () => {
  const { pushScene } = useBrowserNavigation();
  const [activeStory, setActiveStory] = useState(0);

  const nextStory = () => {
    setActiveStory((prev) => (prev + 1) % SUCCESS_STORIES.length);
  };

  const prevStory = () => {
    setActiveStory(
      (prev) => (prev - 1 + SUCCESS_STORIES.length) % SUCCESS_STORIES.length
    );
  };

  const currentStory = SUCCESS_STORIES[activeStory];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900">
        {/* Success Metrics Animation */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            >
              <TrendingUp className="w-6 h-6 text-cyan-400 opacity-10" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={TESTIMONIALS_SCENE} className="max-w-5xl w-full">
          <div className="space-y-8">
            {/* Story Navigation */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={prevStory}
                className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-cyan-500/50 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-400" />
              </button>

              <div className="flex space-x-2">
                {SUCCESS_STORIES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStory(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      idx === activeStory
                        ? "w-8 bg-cyan-400"
                        : "bg-gray-600 hover:bg-gray-500"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={nextStory}
                className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-cyan-500/50 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Current Story */}
            <div className="animate-fadeIn" key={currentStory.id}>
              {/* Company Header */}
              <div className="text-center mb-8">
                <div
                  className={cn(
                    "inline-flex px-4 py-2 rounded-full text-white text-sm font-medium mb-4",
                    "bg-gradient-to-r",
                    currentStory.color
                  )}
                >
                  {currentStory.industry}
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  {currentStory.company}
                </h2>
                <p className="text-gray-400">
                  {currentStory.founder} • {currentStory.role}
                </p>
              </div>

              {/* Testimonial */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 mb-8">
                <Quote className="w-10 h-10 text-cyan-400 mb-4" />
                <p className="text-xl text-gray-300 italic leading-relaxed mb-6">
                  "{currentStory.quote}"
                </p>
                <div className="flex items-center">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-gray-400">
                    5.0 Client Satisfaction
                  </span>
                </div>
              </div>

              {/* Success Metrics */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {currentStory.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 text-center animate-fadeIn"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-3" />
                    <div className="text-sm text-gray-400 mb-1">
                      {metric.label}
                    </div>
                    <div className="text-xl font-bold text-white">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            {/* <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-blue-400 mr-2" />
                  <span className="text-gray-300">200+ Successful Missions</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
                  <span className="text-gray-300">Average 10x Performance Gain</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-6 h-6 text-yellow-400 mr-2" />
                  <span className="text-gray-300">4.9/5 Client Rating</span>
                </div>
              </div>
            </div> */}

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={() => pushScene("launchControlApplication")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                Start Your Success Story
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};
