import { Rocket, Monitor, Activity, Zap } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import type { Scene as SceneType } from "../../types";

const LAUNCH_CONTROL_SCENE: SceneType = {
  id: "launchControlDetail",
  type: "detail",
  title: "Mission Command",
  description: "Welcome to the nerve center of startup scaling operations",
  backgroundClass: "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
};

export const LaunchControlDetailScreen = () => {
  const { pushScene } = useBrowserNavigation();
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTerminal(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background - Mission Control Style */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(cyan 1px, transparent 1px),
              linear-gradient(90deg, cyan 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Animated Radar Sweep */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-96 h-96">
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping" />
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{ animationDuration: "10s" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 bg-gradient-to-b from-cyan-400 to-transparent opacity-60" />
            </div>
          </div>
        </div>

        {/* Floating Control Panels */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
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
              <Monitor className="w-6 h-6 text-cyan-400 opacity-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={LAUNCH_CONTROL_SCENE} className="max-w-4xl w-full">
          <div className="space-y-8">
            {/* Mission Control Terminal */}
            {showTerminal && (
              <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-6 font-mono text-sm animate-fadeIn">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-4 text-gray-400">
                    MISSION_CONTROL_v2.0
                  </span>
                </div>

                <div className="space-y-2 text-cyan-300">
                  <p className="animate-typewriter">
                    {">"} System Status: OPERATIONAL
                  </p>
                  <p
                    className="animate-typewriter"
                    style={{ animationDelay: "1s" }}
                  >
                    {">"} Launch readiness: CONFIRMED
                  </p>
                  <p
                    className="animate-typewriter"
                    style={{ animationDelay: "2s" }}
                  >
                    {">"} Mission type: SCALE & GROWTH
                  </p>
                  <p
                    className="animate-typewriter"
                    style={{ animationDelay: "3s" }}
                  >
                    {">"} Initializing scaling protocols...
                  </p>
                </div>
              </div>
            )}

            {/* Mission Briefing */}
            <div className="text-center space-y-6">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
                <Rocket className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-white">
                Your Product Has Achieved Liftoff
              </h2>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Now it's time to reach escape velocity. Launch Control provides
                the technical infrastructure, product development readiness, and
                strategic guidance to scale your successful prototype into a
                market-capturing product.
              </p>
            </div>

            {/* Key Metrics Display */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 text-center">
                <Activity className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Performance Optimization
                </h3>
                <p className="text-sm text-gray-400">
                  Avoid scaling bottlenecks
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 text-center">
                <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Product Development Lifecycle
                </h3>
                <p className="text-sm text-gray-400">
                  Incorporate Augmented Product Engineers into your team and
                  workflow
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 text-center">
                <Monitor className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Navigate traction
                </h3>
                <p className="text-sm text-gray-400">
                  Get guidance from someone who&apos;s been there
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={() => pushScene("launchControlProcess")}
                size="lg"
                className={cn(
                  "bg-gradient-to-r from-blue-600 to-cyan-600",
                  "hover:from-blue-700 hover:to-cyan-700",
                  "text-white font-semibold px-8 py-6 text-lg",
                  "shadow-lg shadow-cyan-500/25"
                )}
              >
                Explore Mission Parameters
                <Rocket className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};
