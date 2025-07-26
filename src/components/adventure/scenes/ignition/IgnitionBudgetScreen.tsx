import { DollarSign, CheckCircle, XCircle, Info } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useGameStore } from "../../gameStore";
import { useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import type { Scene as SceneType } from "../../types";
import { saveChoice } from "../../utils";

const BUDGET_SCENE: SceneType = {
  id: "ignitionBudget",
  type: "choice",
  title: "Investment Check",
  description: "Let's ensure we're aligned on the investment required",
  backgroundClass: "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
};

const BUDGET_OPTIONS = [
  {
    id: "ready-high",
    title: "$15K - $50K+",
    amount: "Ready to invest",
    description:
      "I understand the investment and I'm ready to transform my idea",
    icon: <CheckCircle className="w-6 h-6" />,
    color: "from-green-600 to-emerald-600",
    nextScene: "ignitionQualification",
  },
  {
    id: "ready-mid",
    title: "$5K - $15K",
    amount: "Limited budget available",
    description: "I've got a budget, but it's limited",
    icon: <CheckCircle className="w-6 h-6" />,
    color: "from-blue-600 to-cyan-600",
    nextScene: "ignitionRateReduction",
  },
  {
    id: "ready-low",
    title: "$1 - $4,999",
    amount: "Not ready yet",
    description: "Let's explore alternative options",
    icon: <XCircle className="w-6 h-6" />,
    color: "from-orange-600 to-amber-600",
    nextScene: "ignitionAlternatives",
  },
  {
    id: "not-ready",
    title: "Just my time",
    amount: "No budget available",
    description: "But I'd like to learn more about vibe coding on my own",
    icon: <XCircle className="w-6 h-6" />,
    color: "from-gray-600 to-gray-700",
    nextScene: "ignitionAlternatives",
  },
];

export const IgnitionBudgetScreen = () => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();

  const handleBudgetChoice = async (option: (typeof BUDGET_OPTIONS)[0]) => {
    // Save choice
    makeChoice(BUDGET_SCENE.id, option.id);
    await saveChoice(
      sessionId,
      BUDGET_SCENE.id,
      option.id,
      `${option.title}: ${option.amount}`
    );

    // Navigate to next scene based on budget selection
    pushScene(option.nextScene);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-slate-900">
        {/* Floating Dollar Signs */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array(10)].map((_, i) => (
            <DollarSign
              key={i}
              className="absolute text-orange-400 animate-float"
              size={40}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={BUDGET_SCENE} className="max-w-4xl w-full">
          <div className="space-y-8">
            {/* Investment Overview */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-orange-400" />
                Ignition Investment Overview
              </h3>

              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <h4 className="font-semibold text-orange-300 mb-2">
                    What&apos;s Included:
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 2-4+ week intensive jumpstart</li>
                    <li>
                      • Working vibe codeable MVP from an expert 0 to 1 builder
                    </li>
                    <li>• Guidance for testing + validation</li>
                    <li>• 4 weeks of prototyping support (can be extended)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-300 mb-2">
                    Investment Range:
                  </h4>
                  <div className="text-2xl font-bold text-white mb-2">
                    $5,000 - $50,000+
                  </div>
                  <p className="text-sm">
                    Final cost depends on scope, complexity, and eligibility for
                    reduced rates
                  </p>
                  <p className="text-sm mt-2 text-orange-300">
                    Payment options available
                  </p>
                </div>
              </div>
            </div>

            {/* Budget Options */}
            <div className="space-y-4">
              {BUDGET_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleBudgetChoice(option)}
                  onMouseEnter={() => setHoveredOption(option.id)}
                  onMouseLeave={() => setHoveredOption(null)}
                  className={cn(
                    "w-full text-left transition-all duration-300",
                    "bg-gray-800/30 backdrop-blur-sm border rounded-xl p-6",
                    "hover:scale-[1.02] hover:bg-gray-800/50",
                    hoveredOption === option.id
                      ? "border-transparent shadow-xl"
                      : "border-gray-700/50"
                  )}
                  style={{
                    boxShadow:
                      hoveredOption === option.id
                        ? `0 10px 40px -10px ${
                            option.color.includes("green")
                              ? "rgba(34, 197, 94, 0.3)"
                              : option.color.includes("blue")
                              ? "rgba(59, 130, 246, 0.3)"
                              : option.color.includes("orange")
                              ? "rgba(251, 146, 60, 0.3)"
                              : "rgba(107, 114, 128, 0.3)"
                          }`
                        : "none",
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={cn(
                        "p-3 rounded-lg bg-gradient-to-br text-white",
                        option.color
                      )}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-1">
                        {option.title}
                      </h4>
                      <div className="text-xl font-bold text-gray-300 mb-2">
                        {option.amount}
                      </div>
                      <p className="text-sm text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Additional Info */}
            {/* <div className="text-center text-sm text-gray-400">
              <p>All investments are backed by our satisfaction guarantee</p>
              <p>We only succeed when you succeed</p>
            </div> */}
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};
