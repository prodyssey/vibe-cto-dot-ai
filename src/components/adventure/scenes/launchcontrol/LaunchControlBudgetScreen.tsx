import { DollarSign, ArrowRight } from "lucide-react";
import { useState } from "react";

import { BudgetSlider } from "@/components/BudgetSlider";
import { Button } from "@/components/ui/button";

import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import { SceneTransition } from "../../animations";
import { useGameStore } from "../../gameStore";
import { useBrowserNavigation } from "../../hooks";
import { getScene } from "../../scenes";
import { saveChoice } from "../../utils";

const BUDGET_RANGES = [
  {
    min: 0,
    max: 999,
    label: "Just exploring",
    description: "Learning about scaling best practices",
    color: "from-gray-600 to-gray-700",
  },
  {
    min: 1000,
    max: 14999,
    label: "Starter budget",
    description: "Exploring my options",
    color: "from-orange-600 to-amber-600",
  },
  {
    min: 15000,
    max: 39999,
    label: "Growth budget",
    description: "I can invest, but not a lot yet",
    color: "from-blue-600 to-cyan-600",
  },
  {
    min: 40000,
    max: 75000,
    label: "Ready to scale",
    description: "Ready to invest in production excellence",
    color: "from-green-600 to-emerald-600",
  },
  {
    min: 75001,
    max: 150000,
    label: "Enterprise ready",
    description: "Ready for comprehensive transformation",
    color: "from-purple-600 to-indigo-600",
  },
];

export const LaunchControlBudgetScreen = () => {
  const [budgetValue, setBudgetValue] = useState<number>(0);
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();
  const scene = getScene("launchControlBudget");

  if (!scene) {
    return null;
  }

  const handleBudgetContinue = async () => {
    // Allow all budgets including $0
    
    // Determine budget category and path weight
    let budgetCategory = "exploring";
    let pathWeight = { launchControl: 0 };
    
    if (budgetValue >= 40000) {
      budgetCategory = "ready-high";
      pathWeight = { launchControl: 3 };
    } else if (budgetValue >= 15000) {
      budgetCategory = "ready-mid";
      pathWeight = { launchControl: 2 };
    } else if (budgetValue >= 1000) {
      budgetCategory = "ready-low";
      pathWeight = { launchControl: 1 };
    } else {
      budgetCategory = "exploring";
      pathWeight = { launchControl: 0 };
    }
    
    makeChoice("launchControlBudget", budgetCategory, pathWeight);
    await saveChoice(
      sessionId,
      "launchControlBudget",
      budgetCategory,
      `Budget: $${budgetValue.toLocaleString()}`
    );
    
    // All budgets go to qualification
    pushScene("launchControlQualification");
  };

  return (
    <SceneTransition sceneId="launchControlBudget" transitionType="slide">
      <Scene scene={scene} className="max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <DollarSign className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Your Scaling Journey
          </h2>
          <p className="text-gray-300 text-lg">
            Launch Control is a comprehensive production readiness program. To
            ensure we can deliver the transformative results you need, let's
            discuss your investment capacity.
          </p>
        </div>

        {/* Budget Slider */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 mb-8">
          <BudgetSlider
            min={0}
            max={150000}
            step={1000}
            value={budgetValue}
            onChange={setBudgetValue}
            ranges={BUDGET_RANGES}
            label="Scaling Investment Level"
            description="From $0 bootstrap to enterprise - we meet you where you are"
            showRecommendations={true}
          />
        </div>

        {/* Continue Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleBudgetContinue}
            disabled={false}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Qualification
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
          <h4 className="text-lg font-semibold text-white mb-2">
            What's Included
          </h4>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              Comprehensive architecture and security review
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              Production infrastructure setup and optimization
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              CI/CD pipeline and development workflow implementation
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              6-12+ weeks of hands-on transformation
            </li>
          </ul>
        </div>

        <div className="text-center mt-6 text-sm text-gray-400">
          Your response helps us tailor our approach to your specific needs and
          constraints.
        </div>

        <SceneNavigation showBack showReset />
      </Scene>
    </SceneTransition>
  );
};
