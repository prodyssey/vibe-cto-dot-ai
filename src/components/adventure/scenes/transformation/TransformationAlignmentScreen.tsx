import { Calendar, Clock, Video, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { trackSavvyCalClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

import { useGameStore } from "../../gameStore";
import { useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import type { Scene as SceneType } from "../../types";
import { saveChoice } from "../../utils";

const ALIGNMENT_SCENE: SceneType = {
  id: "transformationAlignment",
  type: "choice",
  title: "Schedule Alignment Call",
  description: "Let's discuss how we can accelerate your team's velocity",
  backgroundClass: "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
};

const ALIGNMENT_OPTIONS = [
  {
    id: "schedule-now",
    title: "Schedule Alignment Call",
    subtitle: "30-minute strategy discussion",
    description: "Let's explore how AI can transform your team's productivity",
    icon: <Calendar className="w-6 h-6" />,
    features: [
      "Discuss your team's specific challenges",
      "AI readiness assessment",
      "Custom transformation roadmap",
      "ROI analysis for your use case",
    ],
    action: "external",
    url: "https://savvycal.com/craigsturgis/vibecto-30-minute-call",
    nextScene: "transformationFinal",
  },
  {
    id: "learn-more",
    title: "I Need More Information",
    subtitle: "Explore transformation resources",
    description: "View case studies and learn more about our approach",
    icon: <Video className="w-6 h-6" />,
    features: [
      "Success stories from similar teams",
      "Detailed process documentation",
      "Common questions answered",
      "Self-assessment tools",
    ],
    action: "navigate",
    nextScene: "transformationAlternatives",
  },
];

export const TransformationAlignmentScreen = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();

  const handleOptionSelect = async (option: typeof ALIGNMENT_OPTIONS[0]) => {
    setSelectedOption(option.id);
    
    // Save choice
    makeChoice(ALIGNMENT_SCENE.id, option.id);
    await saveChoice(
      sessionId,
      ALIGNMENT_SCENE.id,
      option.id,
      option.title
    );

    // Handle action
    if (option.action === "external" && option.url) {
      trackSavvyCalClick('transformation_alignment_screen', '30_minute_call', {
        option_id: option.id
      });
      window.open(option.url, "_blank");
      // Still navigate to final scene after opening external link
      setTimeout(() => {
        pushScene(option.nextScene);
      }, 500);
    } else {
      pushScene(option.nextScene);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        {/* Floating Calendar Icons */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[Calendar, Clock, Video].map((Icon, i) => (
            <Icon
              key={i}
              className="absolute text-purple-400 animate-float"
              size={40}
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${10 + i * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={ALIGNMENT_SCENE} className="max-w-4xl w-full">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Ready to explore how AI can multiply your team's productivity? 
                Let's have a focused conversation about your specific needs and opportunities.
              </p>
            </div>

            {/* Options */}
            <div className="space-y-6">
              {ALIGNMENT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    "w-full text-left transition-all duration-300",
                    "bg-gray-900/50 backdrop-blur-sm border rounded-lg p-6",
                    "hover:scale-[1.02] hover:shadow-xl",
                    selectedOption === option.id
                      ? "border-purple-500 shadow-lg shadow-purple-500/20"
                      : "border-purple-500/30 hover:border-purple-500/50"
                  )}
                >
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      "p-3 rounded-lg flex-shrink-0",
                      option.id === "schedule-now"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                        : "bg-gray-700"
                    )}>
                      {option.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {option.title}
                      </h3>
                      <p className="text-purple-300 text-sm mb-3">
                        {option.subtitle}
                      </p>
                      <p className="text-gray-300 mb-4">
                        {option.description}
                      </p>
                      
                      <div className="space-y-2">
                        {option.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <ArrowRight className="w-5 h-5 text-purple-400 flex-shrink-0 mt-2" />
                  </div>
                </button>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">
                Trusted by engineering teams at fast-growing companies
              </p>
              <div className="flex justify-center items-center space-x-6 text-purple-300">
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  100% Confidential
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  No Obligation
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Actionable Insights
                </span>
              </div>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};