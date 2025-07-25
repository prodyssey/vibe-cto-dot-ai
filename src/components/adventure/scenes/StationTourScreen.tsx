import { Info, Flame, Rocket, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useGameStore } from '../gameStore';
import { useBrowserNavigation } from '../hooks';
import { Scene } from '../Scene';
import { SceneNavigation } from '../SceneNavigation';
import type { Scene as SceneType } from '../types';

const TOUR_SCENE: SceneType = {
  id: 'stationTour',
  type: 'detail',
  title: 'Station Tour',
  description: 'Welcome to the VibeCTO Station tour. Learn about our services and find the path that suits you best.',
  backgroundClass: 'bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900',
};

const SERVICES = [
  {
    id: 'ignition',
    title: 'Ignition Forge',
    icon: <Flame className="w-8 h-8" />,
    description: 'For entrepreneurs with ideas ready to become reality',
    features: [
      '2-4 week intensive jumpstart',
      'From idea to working prototype',
      'Validation and iteration support',
      'Perfect for early-stage founders',
    ],
    nextScene: 'ignitionDetail',
    color: 'from-orange-600 to-red-600',
  },
  {
    id: 'launch',
    title: 'Launch Control',
    icon: <Rocket className="w-8 h-8" />,
    description: 'For startups ready to scale their proven concepts',
    features: [
      'Fractional CTO guidance',
      'Architecture & infrastructure',
      'Team building & processes',
      'Growth-stage support',
    ],
    nextScene: 'launchControlDetail',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'transformation',
    title: 'Transformation Command',
    icon: <Sparkles className="w-8 h-8" />,
    description: 'For companies seeking exponential acceleration',
    features: [
      'AI-powered transformation',
      'Enterprise solutions',
      'Strategic partnerships',
      'Innovation at scale',
    ],
    nextScene: 'transformationDetail',
    color: 'from-purple-600 to-indigo-600',
  },
];

export const StationTourScreen = () => {
  const { pushScene } = useBrowserNavigation();

  const handleServiceClick = (nextScene: string) => {
    pushScene(nextScene);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(107, 114, 128, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(107, 114, 128, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={TOUR_SCENE} className="max-w-5xl w-full">
          <div className="mb-8">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-semibold mb-1">Welcome to VibeCTO Station!</p>
                <p>We offer three distinct paths to help you transform your vision into reality. Each service is designed for a specific stage of your journey.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${service.color} mb-4`}>
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-1.5 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleServiceClick(service.nextScene)}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                  size="sm"
                >
                  Learn More
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-4">Not sure which path is right for you?</p>
            <Button
              onClick={() => pushScene('destinationSelection')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Take the Interactive Assessment
            </Button>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};