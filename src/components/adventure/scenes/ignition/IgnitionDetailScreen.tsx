import { useState, useEffect } from 'react';
import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import { TypewriterText } from '../../TypewriterText';
import { useGameStore } from '../../gameStore';
import { useBrowserNavigation } from '../../hooks';
import { Button } from '@/components/ui/button';
import { Flame, Zap, Cpu, Gauge, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Scene as SceneType } from '../../types';

const DETAIL_SCENE: SceneType = {
  id: 'ignitionDetail',
  type: 'detail',
  title: 'The Ignition Forge',
  description: '',
  backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
};

const FORGE_CAPABILITIES = [
  { icon: <Zap className="w-5 h-5" />, text: 'Rapid MVP Development' },
  { icon: <Cpu className="w-5 h-5" />, text: 'Tech Stack Selection' },
  { icon: <Gauge className="w-5 h-5" />, text: 'Assumption Testing' },
  { icon: <Flame className="w-5 h-5" />, text: 'Iterative Refinement' },
];

export const IgnitionDetailScreen = () => {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const { pushScene } = useBrowserNavigation();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    pushScene('ignitionProcess');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background - Industrial Forge */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-slate-900">
        {/* Animated Sparks */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: '0',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Forge Glow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
      </div>

      {/* Holographic Blueprints */}
      <div className="absolute top-20 left-10 opacity-30 animate-float">
        <div className="w-48 h-48 border-2 border-orange-400/50 rounded-lg transform rotate-12">
          <div className="p-4 font-mono text-xs text-orange-300">
            <div>{'<MVP>'}</div>
            <div className="ml-4">{'<Feature />'}</div>
            <div className="ml-4">{'<Validation />'}</div>
            <div>{'</MVP>'}</div>
          </div>
        </div>
      </div>

      <div className="absolute top-40 right-20 opacity-30 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-48 h-48 border-2 border-red-400/50 rounded-lg transform -rotate-12">
          <div className="p-4 font-mono text-xs text-red-300">
            <div>{'function transform() {'}</div>
            <div className="ml-4">{'idea.validate();'}</div>
            <div className="ml-4">{'return product;'}</div>
            <div>{'}'}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={DETAIL_SCENE} className="max-w-4xl">
          {showContent && (
            <div className="space-y-8 animate-fadeIn">
              {/* Welcome Message */}
              <div className="text-center">
                <TypewriterText
                  text="The Ignition Forge - where raw ideas transform into validated ventures. Here, we compress months of wandering into weeks of clarity."
                  className="text-xl text-gray-300 leading-relaxed"
                  onComplete={() => setShowButton(true)}
                  speed={30}
                />
              </div>

              {/* Terminal Display */}
              {showButton && (
                <div className="bg-gray-900/50 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 font-mono text-sm animate-fadeIn">
                  <div className="text-orange-400 mb-4">{'> IGNITION PROTOCOL OVERVIEW'}</div>
                  
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span><span className="text-orange-300">Duration:</span> 2-4 week intensive jumpstart</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span><span className="text-orange-300">Your commitment:</span> 2-4 hours intensive discovery</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span><span className="text-orange-300">Outcome:</span> Working MVP + validation framework</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span><span className="text-orange-300">Investment:</span> Starting at $15,000</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-orange-500/20">
                    <div className="text-orange-400 mb-3">{'> FORGE CAPABILITIES'}</div>
                    <div className="grid grid-cols-2 gap-3">
                      {FORGE_CAPABILITIES.map((capability, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-gray-300">
                          <span className="text-orange-400">{capability.icon}</span>
                          <span className="text-sm">{capability.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              {showButton && (
                <div className="text-center animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className={cn(
                      "group relative",
                      "bg-gradient-to-r from-orange-600 to-red-600",
                      "hover:from-orange-700 hover:to-red-700",
                      "text-white font-semibold px-8 py-4"
                    )}
                  >
                    <span className="relative z-10">Enter the Forge</span>
                    <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-md blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                  </Button>
                </div>
              )}
            </div>
          )}

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};