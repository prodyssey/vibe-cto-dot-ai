import { Sparkles, Orbit, Zap, Infinity } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useBrowserNavigation } from '../../hooks';
import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import type { Scene as SceneType } from '../../types';

const TRANSFORMATION_SCENE: SceneType = {
  id: 'transformationDetail',
  type: 'detail',
  title: 'The Observatory',
  description: 'Where visionaries chart courses to unexplored territories',
  backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
};

export const TransformationDetailScreen = () => {
  const { pushScene } = useBrowserNavigation();
  const [showConstellation, setShowConstellation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConstellation(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background - Deep Space */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        {/* Nebula Effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 70%)
            `,
          }}
        />
        
        {/* Stars Field */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>

        {/* Constellation Network */}
        {showConstellation && (
          <svg className="absolute inset-0 w-full h-full animate-fadeIn">
            <defs>
              <linearGradient id="constellationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Draw constellation lines */}
            {[...Array(8)].map((_, i) => {
              const startX = Math.random() * 100;
              const startY = Math.random() * 100;
              const endX = Math.random() * 100;
              const endY = Math.random() * 100;
              return (
                <line
                  key={i}
                  x1={`${startX}%`}
                  y1={`${startY}%`}
                  x2={`${endX}%`}
                  y2={`${endY}%`}
                  stroke="url(#constellationGradient)"
                  strokeWidth="1"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              );
            })}
          </svg>
        )}

        {/* Warp Speed Lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scroll"
              style={{
                left: '0',
                right: '0',
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={TRANSFORMATION_SCENE} className="max-w-4xl w-full">
          <div className="space-y-8">
            {/* Observatory Interface */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-500/50 rounded-lg p-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Orbit className="w-6 h-6 text-purple-400 animate-spin" style={{ animationDuration: '10s' }} />
                  <span className="text-purple-300 font-mono text-sm">OBSERVATORY_INTERFACE_v3.0</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
              
              <div className="space-y-2 text-purple-300 font-mono text-sm">
                <p className="animate-typewriter">{'>'} Scanning enterprise horizons...</p>
                <p className="animate-typewriter" style={{ animationDelay: '1s' }}>
                  {'>'} Identifying acceleration vectors...
                </p>
                <p className="animate-typewriter" style={{ animationDelay: '2s' }}>
                  {'>'} Quantum leap opportunities detected: 47
                </p>
                <p className="animate-typewriter" style={{ animationDelay: '3s' }}>
                  {'>'} Strategic transformation paths available
                </p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="text-center space-y-6">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 mb-4">
                <Sparkles className="w-12 h-12 text-white animate-pulse" />
              </div>
              
              <h2 className="text-3xl font-bold text-white">
                You've Achieved Escape Velocity
              </h2>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Now it's time to explore new dimensions. The Observatory provides AI-powered transformation, 
                quantum computing capabilities, and strategic partnerships to propel established enterprises 
                into unexplored territories.
              </p>
            </div>

            {/* Key Capabilities */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 text-center group hover:scale-105 transition-transform">
                <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:animate-bounce" />
                <h3 className="text-lg font-semibold text-white mb-2">AI Acceleration</h3>
                <p className="text-sm text-gray-400">Transform with cutting-edge AI</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 text-center group hover:scale-105 transition-transform">
                <Infinity className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:animate-spin" />
                <h3 className="text-lg font-semibold text-white mb-2">Infinite Scale</h3>
                <p className="text-sm text-gray-400">Enterprise-grade infrastructure</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 text-center group hover:scale-105 transition-transform">
                <Orbit className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:animate-pulse" />
                <h3 className="text-lg font-semibold text-white mb-2">Strategic Orbits</h3>
                <p className="text-sm text-gray-400">Navigate market disruptions</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={() => pushScene('transformationCapabilities')}
                size="lg"
                className={cn(
                  "bg-gradient-to-r from-purple-600 to-indigo-600",
                  "hover:from-purple-700 hover:to-indigo-700",
                  "text-white font-semibold px-8 py-6 text-lg",
                  "shadow-lg shadow-purple-500/25"
                )}
              >
                Explore Advanced Capabilities
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};