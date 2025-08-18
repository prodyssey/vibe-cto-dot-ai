import { DollarSign, ArrowRight } from "lucide-react";
import { useState } from "react";

import { BudgetSlider } from "@/components/BudgetSlider";
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

const BUDGET_RANGES = [
  {
    min: 0,
    max: 999,
    label: "Just exploring",
    description: "I'd like to understand vibe coding better first",
    color: "from-gray-600 to-gray-700",
  },
  {
    min: 1000,
    max: 4999,
    label: "Starter budget",
    description: "I want to learn more about what's possible",
    color: "from-orange-600 to-amber-600",
  },
  {
    min: 5000,
    max: 14999,
    label: "Growth budget",
    description: "I've got a budget, but it's limited",
    color: "from-blue-600 to-cyan-600",
  },
  {
    min: 15000,
    max: 50000,
    label: "Ready to invest",
    description: "I understand the investment and I'm ready to transform my idea",
    color: "from-green-600 to-emerald-600",
  },
  {
    min: 50001,
    max: 100000,
    label: "Premium investment",
    description: "Ready for comprehensive transformation",
    color: "from-purple-600 to-indigo-600",
  },
];

export const IgnitionBudgetScreen = () => {
  const [budgetValue, setBudgetValue] = useState<number>(0);
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();

  const handleBudgetContinue = async () => {
    // Allow all budgets including $0
    
    // Determine budget category
    let budgetCategory = "exploring";
    if (budgetValue >= 15000) {
      budgetCategory = "ready-high";
    } else if (budgetValue >= 5000) {
      budgetCategory = "ready-mid";
    } else if (budgetValue >= 1000) {
      budgetCategory = "ready-low";
    } else {
      budgetCategory = "exploring";
    }
    
    // Save choice
    makeChoice(BUDGET_SCENE.id, budgetCategory);
    await saveChoice(
      sessionId,
      BUDGET_SCENE.id,
      budgetCategory,
      `Budget: $${budgetValue.toLocaleString()}`
    );

    // All budgets go to qualification
    pushScene("ignitionQualification");
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
                What You Get with Ignition
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

            {/* Budget Slider */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6">
              <BudgetSlider
                min={0}
                max={100000}
                step={500}
                value={budgetValue}
                onChange={setBudgetValue}
                ranges={BUDGET_RANGES}
                label="Your Ignition Investment"
                description="Starting from $0 - every founder's journey is unique"
                showRecommendations={true}
              />
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <Button
                onClick={handleBudgetContinue}
                disabled={false}
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Qualification
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
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
