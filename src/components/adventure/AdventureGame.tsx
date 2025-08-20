import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

import { EmailOptIn } from "@/components/EmailOptIn";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

import { SceneTransition } from "./animations";
import { Choice } from "./Choice";
import { useGameStore } from "./gameStore";
import { useBrowserNavigation, useGameCompletion } from "./hooks";
import { Scene } from "./Scene";
import { SceneNavigation } from "./SceneNavigation";
import { getScene } from "./scenes";
import { BranchSelectionScreen } from "./scenes/BranchSelectionScreen";
import { EntryScreen } from "./scenes/EntryScreen";
import { IgnitionAlternativesScreen } from "./scenes/ignition/IgnitionAlternativesScreen";
import { IgnitionBudgetScreen } from "./scenes/ignition/IgnitionBudgetScreen";
import { IgnitionContactScreen } from "./scenes/ignition/IgnitionContactScreen";
import { IgnitionDetailScreen } from "./scenes/ignition/IgnitionDetailScreen";
import { IgnitionFinalScreen } from "./scenes/ignition/IgnitionFinalScreen";
import { IgnitionPaymentInfoScreen } from "./scenes/ignition/IgnitionPaymentInfoScreen";
import { IgnitionProcessScreen } from "./scenes/ignition/IgnitionProcessScreen";
import { IgnitionQualificationScreen } from "./scenes/ignition/IgnitionQualificationScreen";
import { TransformationAlignmentScreen } from "./scenes/transformation/TransformationAlignmentScreen";
import { TransformationAlternativesScreen } from "./scenes/transformation/TransformationAlternativesScreen";
import { TransformationDetailScreen } from "./scenes/transformation/TransformationDetailScreen";
import { TransformationFinalScreen } from "./scenes/transformation/TransformationFinalScreen";
import { TransformationInvestmentScreen } from "./scenes/transformation/TransformationInvestmentScreen";
import { TransformationProcessScreen } from "./scenes/transformation/TransformationProcessScreen";
import { LaunchControlAlternativesScreen } from "./scenes/launchcontrol/LaunchControlAlternativesScreen";
import { LaunchControlApplicationScreen } from "./scenes/launchcontrol/LaunchControlApplicationScreen";
import { LaunchControlBudgetScreen } from "./scenes/launchcontrol/LaunchControlBudgetScreen";
import { LaunchControlContactScreen } from "./scenes/launchcontrol/LaunchControlContactScreen";
import { LaunchControlDetailScreen } from "./scenes/launchcontrol/LaunchControlDetailScreen";
import { LaunchControlFinalScreen } from "./scenes/launchcontrol/LaunchControlFinalScreen";
import { LaunchControlProcessScreen } from "./scenes/launchcontrol/LaunchControlProcessScreen";
import { LaunchControlQualificationScreen } from "./scenes/launchcontrol/LaunchControlQualificationScreen";
import { LaunchControlTestimonialsScreen } from "./scenes/launchcontrol/LaunchControlTestimonialsScreen";
import { LaunchControlWaitlistScreen } from "./scenes/launchcontrol/LaunchControlWaitlistScreen";
import { PlayerSetupScreen } from "./scenes/PlayerSetupScreen";
import { StationTourScreen } from "./scenes/StationTourScreen";
import {
  saveGameProgress,
  saveSceneVisit,
  saveChoice,
  getPathInfo,
} from "./utils";

export const AdventureGame = () => {
  const {
    currentSceneId,
    playerName,
    sessionId,
    visitedScenes,
    finalPath,
    makeChoice,
    calculateFinalPath,
    setSessionId,
    startSession,
    navigateToScene,
    resetGame,
  } = useGameStore();

  const { pushScene } = useBrowserNavigation();
  const {
    handleEmailSignup: handleEmailSignupBase,
    handleExploreService: handleExploreServiceBase,
  } = useGameCompletion();
  const currentScene = getScene(currentSceneId);

  // Initialize session and handle invalid scenes
  useEffect(() => {
    // Handle scene migrations for renamed scenes
    const sceneMapping: Record<string, string> = {
      'interstellarDetail': 'transformationDetail',
      'interstellarCapabilities': 'transformationProcess',
      'interstellarEngagement': 'transformationProcess',
      'interstellarFeatures': 'transformationProcess',
      'interstellarPartnership': 'transformationAlignment',
      'interstellarContact': 'transformationAlignment',
      'interstellarFinal': 'transformationFinal',
      'interstellarProcess': 'transformationProcess',
      'transformationCapabilities': 'transformationProcess',
      'transformationEngagement': 'transformationProcess',
      'transformationFeatures': 'transformationProcess',
      'transformationPartnership': 'transformationAlignment',
      'transformationContact': 'transformationAlignment',
    };
    
    // Check if we need to migrate the scene
    if (sceneMapping[currentSceneId]) {
      logger.debug('Migrating scene to', sceneMapping[currentSceneId]);
      navigateToScene(sceneMapping[currentSceneId]);
      return;
    }
    
    // Check if current scene exists
    if (!currentScene && currentSceneId) {
      logger.warn('Invalid scene detected - resetting to entry');
      // Reset to entry scene if current scene doesn't exist
      navigateToScene('entry');
      return;
    }
    
    if (!sessionId) {
      // Generate a unique session ID (UUID format for database compatibility)
      const newSessionId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
      setSessionId(newSessionId);
      startSession();
      
      // Save initial session record first, then scene visit to avoid RLS issues
      const initializeSession = async () => {
        try {
          // Set session context first for RLS policies
          await supabase.rpc('set_config', {
            setting_name: 'app.current_session_id',
            setting_value: newSessionId,
            is_local: false
          });

          const gameState = useGameStore.getState();
          const progress = {
            sessionId: newSessionId,
            playerName: gameState.playerName,
            currentSceneId: gameState.currentSceneId,
            visitedScenes: gameState.visitedScenes,
            choices: gameState.choices,
            finalPath: gameState.finalPath || undefined,
            completedAt: undefined,
            discoveredPaths: Array.from(gameState.discoveredPaths),
            unlockedContent: gameState.unlockedContent,
            preferences: gameState.preferences,
          };
          
          // Save session first to satisfy RLS policy
          await saveGameProgress(progress);
          
          // Then save initial scene visit
          await saveSceneVisit(newSessionId, currentSceneId, 1);
        } catch (error) {
          console.error('Error initializing session:', error);
        }
      };
      
      initializeSession();
    }
  }, [sessionId, setSessionId, startSession, currentSceneId, currentScene, navigateToScene]);

  // Debug logging
  useEffect(() => {
    logger.debug('AdventureGame state:', { 
      hasCurrentScene: !!currentScene,
      hasSessionId: !!sessionId 
    });
  }, [currentSceneId, currentScene, sessionId]);

  const handleChoice = async (choice: {
    id: string;
    text: string;
    nextScene: string;
    pathWeight?: Record<string, number>;
  }) => {
    if (!currentScene) {
      return;
    }

    // Save choice to store and database
    makeChoice(currentSceneId, choice.id, choice.pathWeight);
    await saveChoice(sessionId, currentSceneId, choice.id, choice.text);

    // Navigate to next scene
    if (choice.nextScene) {
      pushScene(choice.nextScene);

      // Save scene visit
      const visitCount = (visitedScenes[choice.nextScene] || 0) + 1;
      await saveSceneVisit(sessionId, choice.nextScene, visitCount);
    }

    // If this is a result scene, calculate final path
    const nextScene = getScene(choice.nextScene);
    if (nextScene?.type === "result") {
      const path = calculateFinalPath();
      await saveGameProgress({
        sessionId,
        playerName,
        currentSceneId: choice.nextScene,
        visitedScenes,
        choices: useGameStore.getState().choices,
        finalPath: path,
        completedAt: new Date().toISOString(),
      });
    }
  };

  const handleEmailSignup = async () => {
    try {
      await supabase
        .from("adventure_sessions")
        .update({ final_outcome: "email_signup" })
        .eq("id", sessionId);

      await handleEmailSignupBase();
    } catch (error) {
      console.error("Error updating outcome:", error);
    }
  };

  const handleExploreService = async () => {
    try {
      await supabase
        .from("adventure_sessions")
        .update({ final_outcome: "explore_service" })
        .eq("id", sessionId);

      await handleExploreServiceBase();
    } catch (error) {
      console.error("Error updating outcome:", error);
    }
  };

  // Auto-save progress on scene changes
  useEffect(() => {
    if (sessionId && currentSceneId) {
      saveGameProgress({
        sessionId,
        playerName,
        currentSceneId,
        visitedScenes,
        choices: useGameStore.getState().choices,
        finalPath,
      });
    }
  }, [currentSceneId, sessionId, playerName, visitedScenes, finalPath]);

  // Handle different scene types
  if (!currentScene) {
    logger.error('No scene found for id:', currentSceneId);
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Loading...</h2>
          <p className="text-gray-400 mb-4">Redirecting to start</p>
          <Button
            onClick={() => {
              resetGame();
              navigateToScene('entry');
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Start Fresh Adventure
          </Button>
        </div>
      </div>
    );
  }

  // Entry scene
  if (currentSceneId === "entry") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <EntryScreen />
      </SceneTransition>
    );
  }

  // Player setup scene
  if (currentSceneId === "playerSetup") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <PlayerSetupScreen />
      </SceneTransition>
    );
  }

  // Branch selection scene
  if (currentSceneId === "destinationSelection") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="portal">
        <BranchSelectionScreen />
      </SceneTransition>
    );
  }

  // Station tour scene
  if (currentSceneId === "stationTour") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <StationTourScreen />
      </SceneTransition>
    );
  }

  // Ignition path scenes
  if (currentSceneId === "ignitionDetail") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <IgnitionDetailScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "ignitionProcess") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <IgnitionProcessScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "ignitionContact") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <IgnitionContactScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "ignitionBudget") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <IgnitionBudgetScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "ignitionQualification") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <IgnitionQualificationScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "ignitionFinal") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <IgnitionFinalScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "ignitionAlternatives") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <IgnitionAlternativesScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "ignitionPaymentInfo") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <IgnitionPaymentInfoScreen />
      </SceneTransition>
    );
  }

  // Launch Control path scenes
  if (currentSceneId === "launchControlDetail") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <LaunchControlDetailScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "launchControlContact") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <LaunchControlContactScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "launchControlBudget") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <LaunchControlBudgetScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "launchControlProcess") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <LaunchControlProcessScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "launchControlQualification") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <LaunchControlQualificationScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "launchControlAlternatives") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <LaunchControlAlternativesScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "launchControlWaitlist") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <LaunchControlWaitlistScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "launchControlTestimonials") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <LaunchControlTestimonialsScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "launchControlApplication") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <LaunchControlApplicationScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "launchControlFinal") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <LaunchControlFinalScreen />
      </SceneTransition>
    );
  }

  // Transformation path scenes
  if (currentSceneId === "transformationDetail") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <TransformationDetailScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "transformationProcess") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <TransformationProcessScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "transformationInvestment") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <TransformationInvestmentScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "transformationAlignment") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <TransformationAlignmentScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "transformationAlternatives") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <TransformationAlternativesScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === "transformationFinal") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="portal">
        <TransformationFinalScreen />
      </SceneTransition>
    );
  }

  // Other choice scenes
  if (currentScene.type === "choice" && currentScene.choices) {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <Scene scene={currentScene}>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
            <span>Player: {playerName}</span>
          </div>
          <div className="space-y-4">
            {currentScene.choices.map((choice) => (
              <Choice
                key={choice.id}
                choice={choice}
                onClick={() => handleChoice(choice)}
              />
            ))}
          </div>
          <SceneNavigation showReset />
        </Scene>
      </SceneTransition>
    );
  }

  // Detail scenes
  if (currentScene.type === "detail") {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <Scene scene={currentScene}>
          <div className="text-center">
            <Button
              onClick={() => pushScene(currentScene.nextScene || "")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
              size="lg"
            >
              Continue Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <SceneNavigation showBack showReset />
        </Scene>
      </SceneTransition>
    );
  }

  // Result scenes
  if (currentScene.type === "result" && finalPath) {
    const pathInfo = getPathInfo(finalPath);
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <Scene scene={currentScene} className="max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              🎯 Quest Complete!
            </h2>
            <p className="text-gray-300">
              {playerName}, your adventure has revealed the perfect path for
              your journey.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              {pathInfo.title}
            </h3>
            <p className="text-gray-300 text-lg mb-6">{pathInfo.description}</p>
            <ul className="space-y-2 text-gray-300 max-w-md mx-auto">
              {pathInfo.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">
                Ready to dive deeper?
              </h4>
              <Button
                onClick={handleExploreService}
                className={`w-full bg-gradient-to-r ${pathInfo.color} text-white font-semibold`}
                size="lg"
              >
                Explore {pathInfo.title}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">
                Want to learn more first?
              </h4>
              <div
                onClick={handleEmailSignup}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleEmailSignup();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <EmailOptIn
                  variant="minimal"
                  buttonText="Get Updates"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <SceneNavigation showReset />
        </Scene>
      </SceneTransition>
    );
  }

  return null;
};
