import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { LoadingAnimation } from "../animations";
import { SpaceStationLobby, WalkingFounders } from "../assets";
import { AnimatedButton } from "../components/AnimatedButton";
import { FadeInText } from "../FadeInText";
import { useBrowserNavigation, useMobile } from "../hooks";
import { useSound } from "../sound";
import type { Scene as SceneType } from "../types";

const ENTRY_SCENE: SceneType = {
  id: "entry",
  type: "intro",
  title: "Space Station Arrival",
  description: "",
  backgroundClass:
    "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
};

export const EntryScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const { pushScene } = useBrowserNavigation();
  const { isMobile, isSmallScreen } = useMobile();
  const { playSceneTransition, playMusic } = useSound();

  useEffect(() => {
    // Simulate asset loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Start ambient sound on first user interaction
  useEffect(() => {
    const startAmbientMusic = () => {
      playMusic("space-ambient");
      // Remove listeners after first play
      document.removeEventListener("click", startAmbientMusic);
      document.removeEventListener("touchstart", startAmbientMusic);
    };

    document.addEventListener("click", startAmbientMusic, { once: true });
    document.addEventListener("touchstart", startAmbientMusic, { once: true });

    return () => {
      document.removeEventListener("click", startAmbientMusic);
      document.removeEventListener("touchstart", startAmbientMusic);
    };
  }, [playMusic]);

  const handleBeginJourney = () => {
    playSceneTransition();
    pushScene("playerSetup");
  };

  const handleTypewriterComplete = () => {
    setTimeout(() => setShowButton(true), 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingAnimation
          type="orbit"
          size="lg"
          text="Initializing VibeCTO Station..."
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Space Station Lobby Background */}
      <div className="absolute inset-0">
        <SpaceStationLobby className="w-full h-full object-cover" />
      </div>

      {/* Holographic Displays */}
      {!isSmallScreen && (
        <>
          <div className="absolute top-10 left-10 animate-float">
            <div className="bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 font-mono text-xs text-purple-300">
              <div className="mb-2 text-purple-400">STARTUP METRICS</div>
              <div>
                IDEAS: <span className="text-green-400">∞</span>
              </div>
              <div>
                VIBES: <span className="text-blue-400">HIGH</span>
              </div>
              <div>
                PRODUCTS: <span className="text-orange-400">LOADING...</span>
              </div>
            </div>
          </div>

          <div
            className="absolute top-10 right-10 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 font-mono text-xs text-blue-300">
              <div className="mb-2 text-blue-400">STATION STATUS</div>
              <div>
                FORGE: <span className="text-orange-400">ONLINE</span>
              </div>
              <div>
                LAUNCH: <span className="text-green-400">READY</span>
              </div>
              <div>
                WARP: <span className="text-purple-400">CHARGED</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Neon Sign */}
      <div
        className={cn(
          "absolute left-1/2 transform -translate-x-1/2",
          isSmallScreen ? "top-8" : "top-20"
        )}
      >
        <div
          className={cn(
            "font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-neon text-center",
            isSmallScreen ? "text-2xl" : "text-4xl"
          )}
          style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
        >
          VIBECTO STATION
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-3xl p-6">
          <Card
            className={cn(
              "w-full bg-gray-900/90 backdrop-blur-md border-purple-500/40 shadow-2xl shadow-black/50",
              "relative" // Ensure card has relative positioning
            )}
          >
            <CardHeader className="text-center">
              <CardTitle
                className={cn(
                  "font-bold text-white mb-4",
                  isSmallScreen ? "text-2xl" : "text-3xl"
                )}
                style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}
              >
                {ENTRY_SCENE.title}
              </CardTitle>
            </CardHeader>
            <CardContent
              className={cn("space-y-6", isSmallScreen && "space-y-4")}
            >
              <div className="space-y-8 relative z-20">
                <div className="text-center space-y-4">
                  <FadeInText
                    text="Welcome to VibeCTO Station. Your vision is ready for acceleration. Which docking bay matches your current trajectory?"
                    className={cn(
                      "text-gray-300 leading-relaxed",
                      isSmallScreen ? "text-lg" : "text-xl"
                    )}
                    onComplete={handleTypewriterComplete}
                  />
                </div>

                {showButton && (
                  <div className="text-center animate-fadeIn">
                    <AnimatedButton
                      onClick={handleBeginJourney}
                      className={cn(
                        "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold",
                        isMobile
                          ? "px-6 py-3 min-h-[44px] w-full text-base"
                          : "px-8 py-4 text-lg",
                        "hover:from-purple-700 hover:to-blue-700"
                      )}
                      particleColors={["#a855f7", "#7c3aed", "#6366f1"]}
                    >
                      BEGIN JOURNEY
                      <ArrowRight
                        className={cn(
                          "inline-block ml-2",
                          isMobile ? "w-4 h-4" : "w-5 h-5"
                        )}
                      />
                    </AnimatedButton>
                  </div>
                )}
              </div>

              {/* Animated Founders - moved to background with lower z-index */}
              {!isSmallScreen && (
                <div className="absolute bottom-4 left-0 right-0 h-16 overflow-hidden pointer-events-none">
                  <WalkingFounders className="opacity-70" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
