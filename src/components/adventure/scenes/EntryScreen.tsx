import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Scene } from '../Scene';
import { TypewriterText } from '../TypewriterText';
import { useGameStore } from '../gameStore';
import { useBrowserNavigation } from '../hooks';
import type { Scene as SceneType } from '../types';

const ENTRY_SCENE: SceneType = {
  id: 'entry',
  type: 'intro',
  title: 'Space Station Arrival',
  description: '',
  backgroundClass: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
};

export const EntryScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const { pushScene } = useBrowserNavigation();

  useEffect(() => {
    // Simulate asset loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleBeginJourney = () => {
    pushScene('playerSetup');
  };

  const handleTypewriterComplete = () => {
    setTimeout(() => setShowButton(true), 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-purple-400" />
          </div>
          <p className="text-purple-300 animate-pulse">Initializing VibeCTO Station...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            >
              <div className="w-1 h-1 bg-white rounded-full opacity-70" />
            </div>
          ))}
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      </div>

      {/* Holographic Displays */}
      <div className="absolute top-10 left-10 animate-float">
        <div className="bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 font-mono text-xs text-purple-300">
          <div className="mb-2 text-purple-400">STARTUP METRICS</div>
          <div>IDEAS: <span className="text-green-400">∞</span></div>
          <div>VIBES: <span className="text-blue-400">HIGH</span></div>
          <div>PRODUCTS: <span className="text-orange-400">LOADING...</span></div>
        </div>
      </div>

      <div className="absolute top-10 right-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 font-mono text-xs text-blue-300">
          <div className="mb-2 text-blue-400">STATION STATUS</div>
          <div>FORGE: <span className="text-orange-400">ONLINE</span></div>
          <div>LAUNCH: <span className="text-green-400">READY</span></div>
          <div>WARP: <span className="text-purple-400">CHARGED</span></div>
        </div>
      </div>

      {/* Neon Sign */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-neon">
          VIBECTO STATION
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={ENTRY_SCENE} className="max-w-3xl">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <TypewriterText
                text="Welcome to VibeCTO Station. Your vision is ready for phase transition. Which docking bay matches your current trajectory?"
                className="text-xl text-gray-300 leading-relaxed"
                onComplete={handleTypewriterComplete}
              />
            </div>

            {showButton && (
              <div className="text-center animate-fadeIn">
                <Button
                  onClick={handleBeginJourney}
                  size="lg"
                  className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg"
                >
                  <span className="relative z-10">BEGIN JOURNEY</span>
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-md blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                </Button>
              </div>
            )}
          </div>

          {/* Animated Founders */}
          <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
            <div className="flex space-x-8 animate-scroll">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 text-gray-600 text-4xl">
                  🚶‍♂️
                </div>
              ))}
            </div>
          </div>
        </Scene>
      </div>
    </div>
  );
};