import { ArrowRight, Sparkles, Shuffle, Terminal } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { playerSetupFormSchema, validateForm } from '@/lib/validation';

import { AnimatedButton } from '../components/AnimatedButton';
import { useGameStore } from '../gameStore';
import { useBrowserNavigation } from '../hooks';
import { Scene } from '../Scene';
import type { Scene as SceneType } from '../types';
import { generateRandomName } from '../utils';



const PLAYER_SETUP_SCENE: SceneType = {
  id: 'playerSetup',
  type: 'intro',
  title: 'Pilot Registration',
  description: 'Before you embark on your journey, we need to register you in the station logs.',
  backgroundClass: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
};

export const PlayerSetupScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    playerName,
    isGeneratedName,
    setPlayerName,
    setSessionId,
    startSession,
  } = useGameStore();
  const { pushScene } = useBrowserNavigation();

  const handleGenerateRandomName = () => {
    const randomName = generateRandomName();
    setPlayerName(randomName, true);
  };

  const startGame = async () => {
    setError(null);
    
    // Validate player name
    const validation = validateForm(playerSetupFormSchema, { playerName });
    if (!validation.success) {
      setError(validation.errors.playerName || 'Invalid name');
      return;
    }

    setIsLoading(true);

    try {
      // Get the existing session ID from the game store
      const { sessionId: existingSessionId } = useGameStore.getState();
      
      // If no session ID exists, generate one for offline mode
      if (!existingSessionId) {
        console.log('No session ID found, generating one for offline mode');
        const newSessionId = crypto.randomUUID();
        setSessionId(newSessionId);
      }

      try {
        // Try to update Supabase if available, with timeout
        if (existingSessionId) {
          const dbOperationWithTimeout = Promise.race([
            // Database operation
            (async () => {
              // Set session context for RLS policies
              await supabase.rpc('set_config', {
                setting_name: 'app.current_session_id',
                setting_value: existingSessionId,
                is_local: false
              });

              // Update the existing session record with player information
              const { data, error } = await supabase
                .from('adventure_sessions')
                .update({
                  player_name: playerName,
                  is_generated_name: isGeneratedName,
                  current_scene_id: 'destinationSelection',
                })
                .eq('id', existingSessionId)
                .select()
                .single();

              if (error) {
                throw error;
              }
              return data;
            })(),
            // Timeout after 5 seconds
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Database timeout')), 5000)
            )
          ]);

          await dbOperationWithTimeout;
        }
      } catch (dbError) {
        console.warn('Database update failed, continuing in offline mode:', dbError);
        // Continue without database - game will work offline
      }
      
      // Always proceed to next scene regardless of database status
      setIsLoading(false);
      pushScene('destinationSelection');
    } catch (error) {
      console.error('Error starting game:', error);
      setIsLoading(false);
      // Show error but allow retry
      setError('Unable to initialize game. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Terminal Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
        </div>
      </div>

      {/* Terminal Window */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={PLAYER_SETUP_SCENE} className="max-w-2xl">
          {/* Terminal Header */}
          <div className="bg-gray-800/50 rounded-t-lg border border-gray-700/50 px-4 py-2 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="font-mono text-sm text-green-400">pilot_registration.exe</span>
          </div>

          {/* Terminal Body */}
          <div className="bg-gray-900/50 rounded-b-lg border-x border-b border-gray-700/50 p-6 font-mono">
            <div className="space-y-4">
              <div className="text-green-400 text-sm">
                {'>'} INITIALIZING PILOT REGISTRATION PROTOCOL...
              </div>
              <div className="text-green-400 text-sm animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                {'>'} PLEASE ENTER YOUR DESIGNATION:
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="playerName" className="text-green-400 text-sm font-mono">
                  PILOT_NAME:
                </Label>
                <div className="flex gap-3 mt-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 font-mono">
                      {'>'}
                    </span>
                    <Input
                      id="playerName"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value, false)}
                      placeholder="Enter designation..."
                      className="pl-8 bg-gray-800/80 border-gray-600 text-green-300 placeholder:text-gray-500 font-mono"
                      disabled={isLoading}
                    />
                  </div>
                  <AnimatedButton
                    onClick={handleGenerateRandomName}
                    variant="outline"
                    className="border-green-500/50 text-green-400 bg-green-500/10 hover:bg-green-500/20 whitespace-nowrap font-mono"
                    disabled={isLoading}
                    particleColors={['#10b981', '#34d399', '#6ee7b7']}
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    RANDOM
                  </AnimatedButton>
                </div>
                {isGeneratedName && (
                  <p className="text-green-400 text-xs mt-2 font-mono animate-fadeIn">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    GENERATED RETRO CALLSIGN ACCEPTED
                  </p>
                )}
                {error && (
                  <p className="text-red-400 text-sm font-mono mt-2">{'>'} ERROR: {error}</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-700/50">
                <AnimatedButton
                  onClick={startGame}
                  disabled={!playerName.trim() || isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-mono uppercase tracking-wider"
                  size="lg"
                  particleColors={['#10b981', '#3b82f6', '#06b6d4']}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      INITIALIZING...
                    </>
                  ) : (
                    <>
                      CONFIRM REGISTRATION
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </AnimatedButton>
              </div>

              {isLoading && (
                <div className="text-green-400 text-xs font-mono animate-pulse">
                  {'>'} ESTABLISHING SECURE CONNECTION TO STATION MAINFRAME...
                </div>
              )}
            </div>
          </div>
        </Scene>
      </div>
    </div>
  );
};