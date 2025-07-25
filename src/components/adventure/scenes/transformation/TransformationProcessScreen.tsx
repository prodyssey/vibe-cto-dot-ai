import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Brain,
  Zap,
  Users,
  TrendingUp,
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
  id: "transformationProcess",
  type: "detail",
  title: "The Transformation Process",
  description: "See how we accelerate your team with AI-powered innovation",
  backgroundClass: "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
};

const PROCESS_PHASES = [
  {
    id: "assessment",
    title: "Team Assessment & Discovery",
    icon: <Brain className="w-6 h-6" />,
    description: "Deep dive into your team's current velocity and bottlenecks",
    duration: "Week 1",
    activities: [
      "Current development workflow analysis",
      "Team capability assessment",
      "AI readiness evaluation",
      "Quick wins identification",
    ],
  },
  {
    id: "implementation",
    title: "AI Agent Implementation",
    icon: <Zap className="w-6 h-6" />,
    description: "Deploy custom AI agents tailored to your tech stack",
    duration: "Weeks 2-3",
    activities: [
      "Custom AI agent configuration",
      "Integration with existing tools",
      "Team training workshops",
      "Pilot project execution",
    ],
  },
  {
    id: "acceleration",
    title: "Velocity Acceleration",
    icon: <TrendingUp className="w-6 h-6" />,
    description: "Scale AI adoption across your entire development process",
    duration: "Week 4+",
    activities: [
      "Process optimization",
      "Performance monitoring",
      "Continuous improvement",
      "Ongoing support & refinement",
    ],
  },
];

export const TransformationProcessScreen = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { pushScene } = useBrowserNavigation();

  const handlePhaseClick = (index: number) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActivePhase(index);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleNext = () => {
    if (activePhase < PROCESS_PHASES.length - 1) {
      handlePhaseClick(activePhase + 1);
    }
  };

  const handlePrevious = () => {
    if (activePhase > 0) {
      handlePhaseClick(activePhase - 1);
    }
  };

  const handleContinue = () => {
    pushScene("transformationInvestment");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        {/* Floating AI Particles */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full animate-float"
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
        <Scene scene={PROCESS_SCENE} className="max-w-5xl w-full">
          <div className="space-y-8">
            {/* Process Timeline */}
            <div className="relative">
              {/* Progress Bar */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{
                    width: `${((activePhase + 1) / PROCESS_PHASES.length) * 100}%`,
                  }}
                />
              </div>

              {/* Phase Indicators */}
              <div className="relative flex justify-between mb-16">
                {PROCESS_PHASES.map((phase, index) => (
                  <button
                    key={phase.id}
                    onClick={() => handlePhaseClick(index)}
                    className={cn(
                      "flex flex-col items-center transition-all duration-300",
                      index <= activePhase ? "opacity-100" : "opacity-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                        index === activePhase
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 scale-110"
                          : index < activePhase
                          ? "bg-purple-700"
                          : "bg-gray-700"
                      )}
                    >
                      {phase.icon}
                    </div>
                    <span className="text-sm text-white mt-2 font-medium">
                      {phase.duration}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Phase Content */}
            <div
              className={cn(
                "bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 transition-all duration-300",
                isAnimating && "opacity-0 scale-95"
              )}
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                {PROCESS_PHASES[activePhase].icon}
                <span className="ml-3">{PROCESS_PHASES[activePhase].title}</span>
              </h3>

              <p className="text-gray-300 mb-6 text-lg">
                {PROCESS_PHASES[activePhase].description}
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold text-purple-300">Key Activities:</h4>
                {PROCESS_PHASES[activePhase].activities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2 text-gray-300"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <span>{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Outcomes */}
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
                Expected Outcomes
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-300">10x</div>
                  <p className="text-gray-400">Feature Velocity</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-300">75%</div>
                  <p className="text-gray-400">Less Manual Work</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-300">3x</div>
                  <p className="text-gray-400">Developer Productivity</p>
                </div>
              </div>
            </div>

            {/* Phase Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={activePhase === 0}
                className={cn(
                  "text-gray-400 hover:text-white",
                  activePhase === 0 && "opacity-50 cursor-not-allowed"
                )}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Phase
              </Button>

              <div className="flex space-x-2">
                {PROCESS_PHASES.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === activePhase
                        ? "w-8 bg-purple-500"
                        : "bg-gray-600"
                    )}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={handleNext}
                disabled={activePhase === PROCESS_PHASES.length - 1}
                className={cn(
                  "text-gray-400 hover:text-white",
                  activePhase === PROCESS_PHASES.length - 1 &&
                    "opacity-50 cursor-not-allowed"
                )}
              >
                Next Phase
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <AnimatedButton
                onClick={handleContinue}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Continue to Investment Details
                <ArrowRight className="ml-2 w-5 h-5" />
              </AnimatedButton>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};