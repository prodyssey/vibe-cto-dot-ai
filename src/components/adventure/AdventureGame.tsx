import { useEffect } from 'react';
import { ArrowRight, Sparkles, Shuffle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmailOptIn } from '@/components/EmailOptIn';
import { supabase } from '@/integrations/supabase/client';

import { Choice } from './Choice';
import { useGameStore } from './gameStore';
import { Scene } from './Scene';
import { SceneNavigation } from './SceneNavigation';
import { getScene } from './scenes';
import { generateRandomName, saveGameProgress, saveSceneVisit, saveChoice, getPathInfo } from './utils';

export const AdventureGame = () => {
  const navigate = useNavigate();
  const {
    currentSceneId,
    playerName,
    isGeneratedName,
    sessionId,
    visitedScenes,
    finalPath,
    setPlayerName,
    setSessionId,
    navigateToScene,
    makeChoice,
    calculateFinalPath,
  } = useGameStore();

  const currentScene = getScene(currentSceneId);

  const handleGenerateRandomName = () => {
    const randomName = generateRandomName();
    setPlayerName(randomName, true);
  };

  const startGame = async () => {
    if (!playerName.trim()) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('adventure_sessions')
        .insert({
          player_name: playerName,
          is_generated_name: isGeneratedName,
          current_scene_id: 'destinationSelection',
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      setSessionId(data.id);
      navigateToScene('destinationSelection');
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

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
      navigateToScene(choice.nextScene);
      
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
      
      // Navigate to appropriate path page
      if (finalPath === 'ignition') {
        navigate('/ignition');
      } else if (finalPath === 'launch_control') {
        navigate('/launch-control');
      } else if (finalPath === 'interstellar') {
        navigate('/interstellar');
      }
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
  }, [currentSceneId, sessionId]);

  // Handle different scene types
  if (!currentScene) {
    return null;
  }

  // Entry scene
  if (currentSceneId === 'entry') {
    return (
      <Scene scene={currentScene}>
        <div className="text-center">
          <Button
            onClick={() => navigateToScene('playerSetup')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
            size="lg"
          >
            Begin Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </Scene>
    );
  }

  // Player setup scene
  if (currentSceneId === 'playerSetup') {
    return (
      <Scene scene={currentScene}>
        <div>
          <Label htmlFor="playerName" className="text-white text-sm font-medium">
            Enter your name or generate a retro gaming alias
          </Label>
          <div className="flex gap-3 mt-2">
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value, false)}
              placeholder="Your name or alias"
              className="bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-400"
            />
            <Button
              onClick={handleGenerateRandomName}
              variant="outline"
              className="border-purple-500/50 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 whitespace-nowrap"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Random
            </Button>
          </div>
          {isGeneratedName && (
            <p className="text-purple-400 text-sm mt-2">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Generated retro gaming name!
            </p>
          )}
        </div>
        <Button
          onClick={startGame}
          disabled={!playerName.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
          size="lg"
        >
          Begin Quest
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </Scene>
    );
  }

  // Choice scenes
  if (currentScene.type === 'choice' && currentScene.choices) {
    return (
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
    );
  }

  // Detail scenes
  if (currentScene.type === 'detail') {
    return (
      <Scene scene={currentScene}>
        <div className="text-center">
          <Button
            onClick={() => navigateToScene(currentScene.nextScene || '')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
            size="lg"
          >
            Continue Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        <SceneNavigation showBack showReset />
      </Scene>
    );
  }

  // Result scenes
  if (currentScene.type === 'result' && finalPath) {
    const pathInfo = getPathInfo(finalPath);
    return (
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
    );
  }

  return null;
};