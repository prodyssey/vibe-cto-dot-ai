import { Flame, Zap, Cpu, Gauge, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

import { ForgeAnimation } from "../../animations";
import { ForgeBackground } from "../../assets";
import { AnimatedButton } from "../../components/AnimatedButton";
import { useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import type { Scene as SceneType } from "../../types";
import { TypewriterText } from "../../TypewriterText";

const DETAIL_SCENE: SceneType = {
  id: "ignitionDetail",
  type: "detail",
  title: "The Ignition Forge",
  description: "",
  backgroundClass: "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
};

const FORGE_CAPABILITIES = [
  { icon: <Zap className="w-5 h-5" />, text: "Rapid MVP Development" },
  { icon: <Cpu className="w-5 h-5" />, text: "Tech Stack Selection" },
  { icon: <Gauge className="w-5 h-5" />, text: "Assumption Testing" },
  { icon: <Flame className="w-5 h-5" />, text: "Iterative Refinement" },
];

export const IgnitionDetailScreen = () => {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const { pushScene } = useBrowserNavigation();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    pushScene("ignitionProcess");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Forge Background */}
      <div className="absolute inset-0">
        <ForgeBackground className="w-full h-full" />
      </div>

      {/* Holographic Blueprints */}
      <div className="absolute top-20 left-10 opacity-30 animate-float">
        <div className="w-48 h-48 border-2 border-orange-400/50 rounded-lg transform rotate-12">
          <div className="p-4 font-mono text-xs text-orange-300">
            <div>{"<MVP>"}</div>
            <div className="ml-4">{"<Feature />"}</div>
            <div className="ml-4">{"<Validation />"}</div>
            <div>{"</MVP>"}</div>
          </div>
        </div>
      </div>

      <div
        className="absolute top-40 right-20 opacity-30 animate-float"
        style={{ animationDelay: "2s" }}
      >
        <div className="w-48 h-48 border-2 border-red-400/50 rounded-lg transform -rotate-12">
          <div className="p-4 font-mono text-xs text-red-300">
            <div>{"function transform() {"}</div>
            <div className="ml-4">{"idea.validate();"}</div>
            <div className="ml-4">{"return product;"}</div>
            <div>{"}"}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={DETAIL_SCENE} className="max-w-4xl">
          {showContent && (
            <div className="space-y-8 animate-fadeIn">
              {/* Welcome Message */}
              <div className="text-center">
                <TypewriterText
                  text="The Ignition Forge - where raw ideas transform into validated ventures. Here, we compress months of wandering into weeks of clarity."
                  className="text-xl text-gray-300 leading-relaxed"
                  onComplete={() => setShowButton(true)}
                  speed={30}
                />
              </div>

              {/* Forge Animation */}
              {showButton && (
                <div className="flex justify-center animate-fadeIn">
                  <ForgeAnimation className="mb-8" />
                </div>
              )}

              {/* Terminal Display */}
              {showButton && (
                <div className="bg-gray-900/50 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 font-mono text-sm animate-fadeIn">
                  <div className="text-orange-400 mb-4">
                    {"> IGNITION PROTOCOL OVERVIEW"}
                  </div>

                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>
                        <span className="text-orange-300">Duration:</span> 2-4
                        week intensive jumpstart
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>
                        <span className="text-orange-300">
                          Your commitment:
                        </span>{" "}
                        2-4 hours intensive discovery
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>
                        <span className="text-orange-300">Outcome:</span>{" "}
                        Working MVP + validation framework from an expert 0 to 1
                        builder
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>
                        <span className="text-orange-300">Investment:</span>{" "}
                        Starting at $5,000 (with qualified rate reduction) to
                        $50,000+
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>
                        <span className="text-orange-300">Availability:</span>{" "}
                        Extremely limited
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-orange-500/20">
                    <div className="text-orange-400 mb-3">
                      {"> FORGE CAPABILITIES"}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {FORGE_CAPABILITIES.map((capability, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-gray-300"
                        >
                          <span className="text-orange-400">
                            {capability.icon}
                          </span>
                          <span className="text-sm">{capability.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              {showButton && (
                <div
                  className="text-center animate-fadeIn"
                  style={{ animationDelay: "0.5s" }}
                >
                  <AnimatedButton
                    onClick={handleContinue}
                    size="lg"
                    className={cn(
                      "bg-gradient-to-r from-orange-600 to-red-600",
                      "hover:from-orange-700 hover:to-red-700",
                      "text-white font-semibold px-8 py-4"
                    )}
                    particleColors={["#dc2626", "#ea580c", "#f97316"]}
                  >
                    Enter the Forge
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </AnimatedButton>
                </div>
              )}
            </div>
          )}

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};
