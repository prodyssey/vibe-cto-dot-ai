import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

import { EmailOptIn } from '@/components/EmailOptIn';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

import { SceneTransition } from './animations';
import { Choice } from './Choice';
import { useGameStore } from './gameStore';
import { useBrowserNavigation, useGameCompletion } from './hooks';
import { Scene } from './Scene';
import { SceneNavigation } from './SceneNavigation';
import { getScene } from './scenes';
import { BranchSelectionScreen } from './scenes/BranchSelectionScreen';
import { EntryScreen } from './scenes/EntryScreen';
import { IgnitionAlternativesScreen } from './scenes/ignition/IgnitionAlternativesScreen';
import { IgnitionBudgetScreen } from './scenes/ignition/IgnitionBudgetScreen';
import { IgnitionDetailScreen } from './scenes/ignition/IgnitionDetailScreen';
import { IgnitionFinalScreen } from './scenes/ignition/IgnitionFinalScreen';
import { IgnitionPaymentInfoScreen } from './scenes/ignition/IgnitionPaymentInfoScreen';
import { IgnitionProcessScreen } from './scenes/ignition/IgnitionProcessScreen';
import { IgnitionQualificationScreen } from './scenes/ignition/IgnitionQualificationScreen';
import { InterstellarCapabilitiesScreen } from './scenes/interstellar/InterstellarCapabilitiesScreen';
import { InterstellarDetailScreen } from './scenes/interstellar/InterstellarDetailScreen';
import { InterstellarEngagementScreen } from './scenes/interstellar/InterstellarEngagementScreen';
import { InterstellarFeaturesScreen } from './scenes/interstellar/InterstellarFeaturesScreen';
import { InterstellarFinalScreen } from './scenes/interstellar/InterstellarFinalScreen';
import { InterstellarPartnershipScreen } from './scenes/interstellar/InterstellarPartnershipScreen';
import { InterstellarContactScreen } from './scenes/interstellar/InterstellarContactScreen';
import { LaunchControlApplicationScreen } from './scenes/launchcontrol/LaunchControlApplicationScreen';
import { LaunchControlCapabilitiesScreen } from './scenes/launchcontrol/LaunchControlCapabilitiesScreen';
import { LaunchControlDetailScreen } from './scenes/launchcontrol/LaunchControlDetailScreen';
import { LaunchControlFinalScreen } from './scenes/launchcontrol/LaunchControlFinalScreen';
import { LaunchControlProcessScreen } from './scenes/launchcontrol/LaunchControlProcessScreen';
import { LaunchControlTestimonialsScreen } from './scenes/launchcontrol/LaunchControlTestimonialsScreen';
import { LaunchControlTimelineScreen } from './scenes/launchcontrol/LaunchControlTimelineScreen';
import { PlayerSetupScreen } from './scenes/PlayerSetupScreen';
import { StationTourScreen } from './scenes/StationTourScreen';
import { saveGameProgress, saveSceneVisit, saveChoice, getPathInfo } from './utils';

export const AdventureGame = () => {
  const {
    currentSceneId,
    playerName,
    sessionId,
    visitedScenes,
    finalPath,
    makeChoice,
    calculateFinalPath,
  } = useGameStore();

  const { pushScene } = useBrowserNavigation();
  const { handleEmailSignup: handleEmailSignupBase, handleExploreService: handleExploreServiceBase } = useGameCompletion();
  const currentScene = getScene(currentSceneId);


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
    if (nextScene?.type === 'result') {
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
        .from('adventure_sessions')
        .update({ final_outcome: 'email_signup' })
        .eq('id', sessionId);
      
      await handleEmailSignupBase();
    } catch (error) {
      console.error('Error updating outcome:', error);
    }
  };

  const handleExploreService = async () => {
    try {
      await supabase
        .from('adventure_sessions')
        .update({ final_outcome: 'explore_service' })
        .eq('id', sessionId);
      
      await handleExploreServiceBase();
    } catch (error) {
      console.error('Error updating outcome:', error);
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
    return null;
  }

  // Entry scene
  if (currentSceneId === 'entry') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <EntryScreen />
      </SceneTransition>
    );
  }

  // Player setup scene
  if (currentSceneId === 'playerSetup') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <PlayerSetupScreen />
      </SceneTransition>
    );
  }

  // Branch selection scene
  if (currentSceneId === 'destinationSelection') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="portal">
        <BranchSelectionScreen />
      </SceneTransition>
    );
  }

  // Station tour scene
  if (currentSceneId === 'stationTour') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <StationTourScreen />
      </SceneTransition>
    );
  }

  // Ignition path scenes
  if (currentSceneId === 'ignitionDetail') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <IgnitionDetailScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'ignitionProcess') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <IgnitionProcessScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'ignitionBudget') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <IgnitionBudgetScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'ignitionQualification') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <IgnitionQualificationScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'ignitionFinal') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <IgnitionFinalScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'ignitionAlternatives') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <IgnitionAlternativesScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'ignitionPaymentInfo') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <IgnitionPaymentInfoScreen />
      </SceneTransition>
    );
  }

  // Launch Control path scenes
  if (currentSceneId === 'launchControlDetail') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <LaunchControlDetailScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'launchControlProcess') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <LaunchControlProcessScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'launchControlCapabilities') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <LaunchControlCapabilitiesScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'launchControlTimeline') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <LaunchControlTimelineScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'launchControlTestimonials') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <LaunchControlTestimonialsScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'launchControlApplication') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <LaunchControlApplicationScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'launchControlFinal') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <LaunchControlFinalScreen />
      </SceneTransition>
    );
  }

  // Interstellar path scenes
  if (currentSceneId === 'interstellarDetail') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <InterstellarDetailScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'interstellarCapabilities') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <InterstellarCapabilitiesScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'interstellarEngagement') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <InterstellarEngagementScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'interstellarFeatures') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <InterstellarFeaturesScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'interstellarPartnership') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <InterstellarPartnershipScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'interstellarContact') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="slide">
        <InterstellarContactScreen />
      </SceneTransition>
    );
  }
  if (currentSceneId === 'interstellarFinal') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="portal">
        <InterstellarFinalScreen />
      </SceneTransition>
    );
  }

  // Other choice scenes
  if (currentScene.type === 'choice' && currentScene.choices) {
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
  if (currentScene.type === 'detail') {
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="fade">
        <Scene scene={currentScene}>
          <div className="text-center">
            <Button
              onClick={() => pushScene(currentScene.nextScene || '')}
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
  if (currentScene.type === 'result' && finalPath) {
    const pathInfo = getPathInfo(finalPath);
    return (
      <SceneTransition sceneId={currentSceneId} transitionType="zoom">
        <Scene scene={currentScene} className="max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">🎯 Quest Complete!</h2>
            <p className="text-gray-300">
              {playerName}, your adventure has revealed the perfect path for your journey.
            </p>
          </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">{pathInfo.title}</h3>
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
            <h4 className="text-lg font-semibold text-white">Ready to dive deeper?</h4>
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
            <h4 className="text-lg font-semibold text-white">Want to learn more first?</h4>
            <div 
              onClick={handleEmailSignup}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
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