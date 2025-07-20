import {
  Flame,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Lightbulb,
  Code,
  TestTube,
  Rocket,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { AnimatedButton } from "../../components/AnimatedButton";
import { useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import type { Scene as SceneType } from "../../types";

const PROCESS_SCENE: SceneType = {
  id: "ignitionProcess",
  type: "detail",
  title: "The Forge Process",
  description: "Watch how we transform your idea into reality",
  backgroundClass: "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
};

const PROCESS_STEPS = [
  {
    id: "discovery",
    title: "Discovery & Validation",
    icon: <Lightbulb className="w-6 h-6" />,
    description: "Deep dive into your vision, market, and assumptions",
    duration: "2-4 hours",
    activities: [
      "Vision alignment workshop(s)",
      "Market opportunity analysis",
      "Technical feasibility assessment",
      "Risk identification",
    ],
  },
  {
    id: "forge",
    title: "Design & Build",
    icon: <Flame className="w-6 h-6" />,
    description:
      "Transform insights into a working MVP through rapid design and development",
    duration: "2-4 weeks",
    activities: [
      "User journey mapping & feature prioritization",
      "Technical architecture & MVP scope definition",
      "Agile development sprints with twice weekly updates",
      "Deliverable: an MVP you can continue to vibe code with",
    ],
  },
  {
    id: "validate",
    title: "Test & Iterate",
    icon: <TestTube className="w-6 h-6" />,
    description: "Validate with real users and refine",
    duration: "1-2 months",
    activities: [
      "Weekly office hours",
      "ICP testing advice",
      "Growth strategy planning",
      "Ongoing support available",
    ],
  },
];

export const IgnitionProcessScreen = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { pushScene } = useBrowserNavigation();

  const handleStepClick = (index: number) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveStep(index);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleNext = () => {
    if (activeStep < PROCESS_STEPS.length - 1) {
      handleStepClick(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      handleStepClick(activeStep - 1);
    }
  };

  const handleContinue = () => {
    pushScene("ignitionBudget");
  };

  const currentStep = PROCESS_STEPS[activeStep];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-slate-900">
        {/* Process Flow Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <path
            d="M 100 100 Q 300 200 500 150 T 900 250"
            stroke="orange"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M 200 300 Q 400 250 600 350 T 1000 300"
            stroke="red"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={PROCESS_SCENE} className="max-w-5xl w-full">
          <div className="space-y-8">
            {/* Process Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${(activeStep + 1) * 33.33}%` }}
                />
              </div>

              {/* Timeline Steps */}
              <div className="relative grid grid-cols-3 gap-4">
                {PROCESS_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(idx)}
                    className="group text-center"
                  >
                    <div
                      className={cn(
                        "w-16 h-16 mx-auto rounded-full flex items-center justify-center",
                        "border-2 transition-all duration-300",
                        idx <= activeStep
                          ? "bg-gradient-to-br from-orange-500 to-red-500 border-transparent text-white"
                          : "bg-gray-800/50 border-gray-600 text-gray-400 hover:border-gray-500"
                      )}
                    >
                      {idx < activeStep ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : idx === activeStep ? (
                        <div className="animate-pulse">{step.icon}</div>
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </div>
                    <h4
                      className={cn(
                        "mt-3 text-sm font-medium transition-colors",
                        idx <= activeStep ? "text-white" : "text-gray-400"
                      )}
                    >
                      {step.title}
                    </h4>
                  </button>
                ))}
              </div>
            </div>

            {/* Step Details */}
            <div
              className={cn(
                "bg-gray-900/50 backdrop-blur-sm border rounded-xl p-8 transition-all duration-300",
                isAnimating
                  ? "opacity-0 transform scale-95"
                  : "opacity-100 transform scale-100",
                "border-orange-500/30"
              )}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                  {currentStep.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {currentStep.title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {currentStep.description}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-sm mb-6">
                    <Rocket className="w-4 h-4 mr-2" />
                    Duration: {currentStep.duration}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Key Activities
                    </h4>
                    <ul className="space-y-2">
                      {currentStep.activities.map((activity, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-gray-300 animate-fadeIn"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 mr-3 flex-shrink-0" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Step {activeStep + 1} of {PROCESS_STEPS.length}
              </div>

              <div className="flex gap-3">
                {activeStep > 0 && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Previous
                  </Button>
                )}

                {activeStep < PROCESS_STEPS.length - 1 ? (
                  <AnimatedButton
                    onClick={handleNext}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    particleColors={["#dc2626", "#ea580c", "#f97316"]}
                  >
                    Next Step
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </AnimatedButton>
                ) : (
                  <AnimatedButton
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    particleColors={["#dc2626", "#ea580c", "#f97316"]}
                  >
                    Continue to Budget Check
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </AnimatedButton>
                )}
              </div>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};
