import { Flame, Rocket, Sparkles, Radio } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  IgnitionPortal,
  LaunchControlPortal,
  TransformationPortal,
} from "../assets";
import { useGameStore } from "../gameStore";
import { useBrowserNavigation, useMobile, useReducedMotion } from "../hooks";
import { Scene } from "../Scene";
import { useSound } from "../sound";
import type { Scene as SceneType } from "../types";
import { saveChoice, saveSceneVisit } from "../utils";

const BRANCH_SCENE: SceneType = {
  id: "destinationSelection",
  type: "choice",
  title: "Choose Your Path",
  description:
    "Three paths lead to product success. Where are you in your journey?",
  backgroundClass:
    "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
};

interface Portal {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  fullDescription: string;
  color: string;
  glowColor: string;
  nextScene: string;
  pathWeight: {
    ignition: number;
    launch_control: number;
    transformation: number;
  };
}

const PORTALS: Portal[] = [
  {
    id: "transformation-path",
    title: "Transformation",
    icon: <Sparkles className="w-12 h-12" />,
    description:
      "✨ We're well on our way - but want help to go further, faster",
    fullDescription:
      "Accelerate your velocity with AI-powered transformation and enterprise solutions.",
    color: "from-purple-600 to-indigo-600",
    glowColor: "shadow-purple-500/50",
    nextScene: "transformationDetail",
    pathWeight: {
      ignition: 0,
      launch_control: 0,
      transformation: 3,
    },
  },
  {
    id: "ignition-path",
    title: "Ignition",
    icon: <Flame className="w-12 h-12" />,
    description:
      "🔥 I have an idea I believe in - but need help getting started",
    fullDescription:
      "Transform your vision into reality with our 2-4 week intensive jumpstart program.",
    color: "from-orange-600 to-red-600",
    glowColor: "shadow-orange-500/50",
    nextScene: "ignitionDetail",
    pathWeight: {
      ignition: 3,
      launch_control: 0,
      transformation: 0,
    },
  },
  {
    id: "launch-control-path",
    title: "Launch Control",
    icon: <Rocket className="w-12 h-12" />,
    description:
      "🚀 I've got a real vibe coded prototype with traction - ready to gear up for scale",
    fullDescription:
      "Scale your prototype into a production-ready system with fractional CTO guidance.",
    color: "from-blue-600 to-cyan-600",
    glowColor: "shadow-blue-500/50",
    nextScene: "launchControlDetail",
    pathWeight: {
      ignition: 0,
      launch_control: 3,
      transformation: 0,
    },
  },
];

export const BranchSelectionScreen = () => {
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);
  const { sessionId, visitedScenes, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();
  const { isSmallScreen, isTouch } = useMobile();
  const reducedMotion = useReducedMotion();
  const { playPortalSelect, playButtonHover } = useSound();

  const handlePortalClick = async (portal: Portal) => {
    // Play portal selection sound
    playPortalSelect();

    // Fade out current music and play path-specific music
    // TODO: Uncomment when we have music files
    // fadeOutMusic(500);
    // setTimeout(() => {
    //   if (portal.id === 'ignition-path') {
    //     playMusic('music-ignition');
    //   } else if (portal.id === 'launch-control-path') {
    //     playMusic('music-launch');
    //   } else if (portal.id === 'transformation-path') {
    //     playMusic('music-transformation');
    //   }
    // }, 500);

    // Save choice to store
    makeChoice(BRANCH_SCENE.id, portal.id, portal.pathWeight);

    // Save to database
    await saveChoice(sessionId, BRANCH_SCENE.id, portal.id, portal.description);

    // Navigate to next scene
    pushScene(portal.nextScene);

    // Save scene visit
    const visitCount = (visitedScenes[portal.nextScene] || 0) + 1;
    await saveSceneVisit(sessionId, portal.nextScene, visitCount);
  };

  const handlePortalHover = (portal: Portal) => {
    if (!isTouch) {
      setHoveredPortal(portal.id);
      playButtonHover();
    }
  };

  const handleStationTour = async () => {
    const tourChoice = {
      id: "explore-station",
      text: "📡 Just exploring the station...",
      nextScene: "stationTour",
    };

    makeChoice(BRANCH_SCENE.id, tourChoice.id);
    await saveChoice(
      sessionId,
      BRANCH_SCENE.id,
      tourChoice.id,
      tourChoice.text
    );
    pushScene(tourChoice.nextScene);

    const visitCount = (visitedScenes[tourChoice.nextScene] || 0) + 1;
    await saveSceneVisit(sessionId, tourChoice.nextScene, visitCount);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Energy Grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(239, 68, 68, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)
              `,
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={BRANCH_SCENE} className="max-w-6xl w-full">
          {/* Portals Grid */}
          <div
            className={cn(
              "grid gap-6 mb-8",
              isSmallScreen
                ? "grid-cols-1 gap-4"
                : "grid-cols-1 md:grid-cols-3 md:gap-8"
            )}
          >
            {PORTALS.map((portal) => (
              <button
                key={portal.id}
                onClick={() => handlePortalClick(portal)}
                onMouseEnter={() => !isTouch && handlePortalHover(portal)}
                onMouseLeave={() => !isTouch && setHoveredPortal(null)}
                onTouchStart={() => isTouch && setHoveredPortal(portal.id)}
                onTouchEnd={() =>
                  isTouch && setTimeout(() => setHoveredPortal(null), 300)
                }
                className={cn(
                  "group relative w-full",
                  isTouch && "active:scale-95 transition-transform"
                )}
              >
                {/* Portal Container */}
                <div
                  className={cn(
                    "relative rounded-2xl overflow-hidden transition-all duration-500",
                    "border-2 border-gray-700/50 bg-gray-900/50 backdrop-blur-sm",
                    isSmallScreen ? "h-64" : "h-80",
                    !isTouch && "hover:border-transparent hover:scale-105",
                    hoveredPortal === portal.id &&
                      `shadow-2xl ${portal.glowColor}`
                  )}
                >
                  {/* Energy Field Background */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity",
                      `bg-gradient-to-br ${portal.color}`
                    )}
                  />

                  {/* Animated Energy Lines */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                        "animate-pulse"
                      )}
                    >
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "absolute h-px w-full",
                            `bg-gradient-to-r ${portal.color}`
                          )}
                          style={{
                            top: `${25 + i * 25}%`,
                            animation: `scroll ${3 + i}s linear infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Portal Asset - moved to back with lower z-index */}
                  <div className="absolute inset-0 z-0">
                    {portal.id === "ignition-path" && (
                      <IgnitionPortal
                        isActive={hoveredPortal === portal.id}
                        reducedMotion={reducedMotion}
                      />
                    )}
                    {portal.id === "launch-control-path" && (
                      <LaunchControlPortal
                        isActive={hoveredPortal === portal.id}
                        reducedMotion={reducedMotion}
                      />
                    )}
                    {portal.id === "transformation-path" && (
                      <TransformationPortal
                        isActive={hoveredPortal === portal.id}
                        reducedMotion={reducedMotion}
                      />
                    )}
                  </div>

                  
                  {/* Portal Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-6 text-center z-20">
                    {/* Icon (now smaller, for accent) */}
                    <div
                      className={cn(
                        "mb-4 text-white opacity-60 group-hover:opacity-80 transition-all",
                        "w-8 h-8"
                      )}
                    >
                      {portal.icon}
                    </div>

                    {/* Title with compact dark backdrop */}
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 mb-2 max-w-[90%]">
                      <h3
                        className="text-2xl font-bold text-white"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                      >
                        {portal.title}
                      </h3>
                    </div>

                    {/* Description with compact dark backdrop */}
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 mb-4 max-w-[90%]">
                      <p className="text-base text-gray-100 font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                        {portal.description}
                      </p>
                    </div>

                    {/* Hover Details */}
                    <div
                      className={cn(
                        "absolute bottom-4 left-4 right-4",
                        "opacity-0 group-hover:opacity-100",
                        "transform translate-y-4 group-hover:translate-y-0",
                        "transition-all duration-300"
                      )}
                    >
                      <p className="text-sm text-white bg-black/50 backdrop-blur-sm rounded-lg p-3 font-medium border border-white/10" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                        {portal.fullDescription}
                      </p>
                    </div>
                  </div>

                  {/* Portal Glow Effect */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-30",
                      "transition-opacity duration-500"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                        "w-32 h-32 rounded-full blur-3xl",
                        `bg-gradient-to-r ${portal.color}`
                      )}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Station Tour Option */}
          <div className="text-center">
            <button
              onClick={handleStationTour}
              className="group inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <Radio className="w-5 h-5 group-hover:animate-pulse" />
              <span className="text-sm">Just exploring the station...</span>
            </button>
          </div>
        </Scene>
      </div>
    </div>
  );
};
