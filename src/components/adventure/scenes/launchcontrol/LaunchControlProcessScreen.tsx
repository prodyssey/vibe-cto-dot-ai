import {
  Rocket,
  Target,
  Users,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
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
  id: "launchControlProcess",
  type: "detail",
  title: "Mission Phases",
  description: "Your journey from prototype to production powerhouse",
  backgroundClass: "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
};

const MISSION_PHASES = [
  {
    id: "assessment",
    title: "Mission Assessment",
    icon: <Target className="w-6 h-6" />,
    duration: "Weeks 1-2",
    description:
      "Deep dive into your current architecture, performance bottlenecks, and scaling requirements",
    activities: [
      "Infrastructure audit & performance profiling",
      "Security assessment & vulnerability scanning",
      "Growth projections & capacity planning",
      "Team structure & skill gap analysis",
    ],
  },
  {
    id: "planning",
    title: "Flight Plan Execution",
    icon: <Rocket className="w-6 h-6" />,
    duration: "Weeks 2-12",
    description:
      "Implement the optimal architecture and development strategy for your growth trajectory",
    activities: [
      "Architecture design & tech stack optimization",
      "CI/CD pipeline implementation",
      "Monitoring & observability setup",
      "Team augmentation & knowledge transfer",
    ],
  },
  {
    id: "operations",
    title: "Orbital Operations",
    icon: <Shield className="w-6 h-6" />,
    duration: "Ongoing (Optional)",
    description: "Ongoing support to maintain peak performance",
    activities: [
      "Fractional CTO/CPO leadership",
      "Technical hiring & team building",
      "Product & engineering strategy",
      "Limited emergency support",
    ],
  },
];

export const LaunchControlProcessScreen = () => {
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
    if (activePhase < MISSION_PHASES.length - 1) {
      handlePhaseClick(activePhase + 1);
    }
  };

  const handlePrevious = () => {
    if (activePhase > 0) {
      handlePhaseClick(activePhase - 1);
    }
  };

  const handleContinue = () => {
    pushScene("launchControlContact");
  };

  const currentPhase = MISSION_PHASES[activePhase];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900">
        {/* Trajectory Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient
              id="trajectoryGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <path
              key={i}
              d={`M ${i * 200} 0 Q ${i * 200 + 100} ${window.innerHeight / 2} ${
                i * 200 + 200
              } ${window.innerHeight}`}
              stroke="url(#trajectoryGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={PROCESS_SCENE} className="max-w-5xl w-full">
          <div className="space-y-8">
            {/* Phase Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${(activePhase + 1) * 33.33}%` }}
                />
              </div>

              {/* Timeline Steps */}
              <div className="relative grid grid-cols-3 gap-4">
                {MISSION_PHASES.map((phase, idx) => (
                  <button
                    key={phase.id}
                    onClick={() => handlePhaseClick(idx)}
                    className="group text-center"
                  >
                    <div
                      className={cn(
                        "w-16 h-16 mx-auto rounded-full flex items-center justify-center",
                        "border-2 transition-all duration-300",
                        idx <= activePhase
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500 border-transparent text-white"
                          : "bg-gray-800/50 border-gray-600 text-gray-400 hover:border-gray-500"
                      )}
                    >
                      {idx < activePhase ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : idx === activePhase ? (
                        <div className="animate-pulse">{phase.icon}</div>
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </div>
                    <h4
                      className={cn(
                        "mt-3 text-sm font-medium transition-colors",
                        idx <= activePhase ? "text-white" : "text-gray-400"
                      )}
                    >
                      {phase.title}
                    </h4>
                  </button>
                ))}
              </div>
            </div>

            {/* Phase Details */}
            <div
              className={cn(
                "bg-gray-900/50 backdrop-blur-sm border rounded-xl p-8 transition-all duration-300",
                isAnimating
                  ? "opacity-0 transform scale-95"
                  : "opacity-100 transform scale-100",
                "border-cyan-500/30"
              )}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  {currentPhase.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {currentPhase.title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {currentPhase.description}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm mb-6">
                    <Clock className="w-4 h-4 mr-2" />
                    Duration: {currentPhase.duration}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Key Deliverables
                    </h4>
                    <ul className="space-y-2">
                      {currentPhase.activities.map((activity, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-gray-300 animate-fadeIn"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 mr-3 flex-shrink-0" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Integration Note */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-400" />
                Seamless Team Integration
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <h4 className="font-semibold text-blue-300 mb-2">
                    Your Team
                  </h4>
                  <p className="text-sm">
                    Maintains product vision and business logic, and ability to
                    safely vibe code new prototype features without impacting
                    production
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-300 mb-2">Our Team</h4>
                  <p className="text-sm">
                    Expert product engineers that take your vibe coded features
                    and turn them into production ready product code
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Phase {activePhase + 1} of {MISSION_PHASES.length}
              </div>

              <div className="flex gap-3">
                {activePhase > 0 && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Previous
                  </Button>
                )}

                {activePhase < MISSION_PHASES.length - 1 ? (
                  <AnimatedButton
                    onClick={handleNext}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    particleColors={["#0891b2", "#06b6d4", "#0ea5e9"]}
                  >
                    Next Phase
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </AnimatedButton>
                ) : (
                  <AnimatedButton
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    particleColors={["#0891b2", "#06b6d4", "#0ea5e9"]}
                  >
                    Continue to Investment Options
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
