import { DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import { SceneTransition } from "../../animations";
import { useGameStore } from "../../gameStore";
import { useBrowserNavigation } from "../../hooks";
import { getScene } from "../../scenes";
import { saveChoice } from "../../utils";

export const LaunchControlBudgetScreen = () => {
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();
  const scene = getScene("launchControlBudget");

  if (!scene) return null;

  const budgetOptions = [
    {
      id: "ready-high",
      amount: "$40K - $75K+",
      description: "Ready to invest in production excellence",
      nextScene: "launchControlCapabilities",
      pathWeight: { launchControl: 3 },
    },
    {
      id: "ready-mid",
      amount: "$15K - $40K",
      description: "I can invest, but not a lot yet",
      nextScene: "launchControlRateReduction",
      pathWeight: { launchControl: 2 },
    },
    {
      id: "ready-low",
      amount: "$1 - $14,999",
      description: "I can't really invest yet",
      nextScene: "launchControlAlternatives",
      pathWeight: { launchControl: 1 },
    },
    {
      id: "not-ready",
      amount: "Just my time",
      description: "No budget available",
      nextScene: "launchControlAlternatives",
      pathWeight: { launchControl: 0 },
    },
  ];

  const handleBudgetChoice = async (option: (typeof budgetOptions)[0]) => {
    makeChoice("launchControlBudget", option.id, option.pathWeight);
    await saveChoice(
      sessionId,
      "launchControlBudget",
      option.id,
      `Budget: ${option.amount}`
    );
    pushScene(option.nextScene);
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
            Investment Readiness
          </h2>
          <p className="text-gray-300 text-lg">
            Launch Control is a comprehensive production readiness program. To
            ensure we can deliver the transformative results you need, let's
            discuss your investment capacity.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {budgetOptions.map((option) => (
            <Card
              key={option.id}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              onClick={() => handleBudgetChoice(option)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {option.amount}
                    </h3>
                    <p className="text-gray-400">{option.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Select →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
              6-12 weeks of hands-on transformation
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
