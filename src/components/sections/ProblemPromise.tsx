import { Sparkles, Zap, ArrowRight, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const ProblemPromise = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  return (
    <section className="py-20 px-6 bg-black/40 backdrop-blur-sm" id="journey">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Where are you in your journey?
          </h2>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Whether you're just starting or scaling up, I've got the exact
            guidance you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Transformation Card */}
          <Card className="relative group bg-gray-900/80 backdrop-blur-sm border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Rocket className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Team ready to accelerate?
                </h3>
              </div>

              <p className="text-gray-50 mb-6 leading-relaxed text-lg">
                Transform your team&apos;s velocity with AI agents.
                Enterprise-grade strategies to ship faster, measure impact, and
                maintain quality and security.
              </p>

              <ul className="space-y-3 mb-8 text-gray-50">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                  <span className="text-base">AI agent integration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                  <span className="text-base">Sophisticated measurement</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                  <span className="text-base">Experienced support</span>
                </li>
              </ul>

              <Button
                onClick={() => handleNavigation("/transformation")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 text-base"
              >
                Explore Transformation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Ignition Card */}
          <Card className="relative group bg-gray-900/80 backdrop-blur-sm border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Need a jump start?
                </h3>
              </div>

              <p className="text-gray-50 mb-6 leading-relaxed text-lg">
                I'll work with you to get your idea to a working vibe coded
                prototype fast. Benefit from years of experience going from 0 to
                1. Test and iterate from a good foundation.
              </p>

              <ul className="space-y-3 mb-8 text-gray-50">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span className="text-base">Discovery workshops</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span className="text-base">
                    A rapid prototype you can build on
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span className="text-base">Assumption testing guidance</span>
                </li>
              </ul>

              <Button
                onClick={() => handleNavigation("/ignition")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base"
              >
                Explore Ignition
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Launch Control Card */}
          <Card className="relative group bg-gray-900/80 backdrop-blur-sm border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Prototype hitting its limits?
                </h3>
              </div>

              <p className="text-gray-50 mb-6 leading-relaxed text-lg">
                Scale your vibe-coded prototype into a production-ready system.
                Get fractional CTO guidance to handle security, performance, and
                team growth.
              </p>

              <ul className="space-y-3 mb-8 text-gray-50">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span className="text-base">
                    Architecture & scaling strategy
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span className="text-base">Security & compliance</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span className="text-base">Team & process optimization</span>
                </li>
              </ul>

              <Button
                onClick={() => handleNavigation("/launch-control")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base"
              >
                Explore Launch Control
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
