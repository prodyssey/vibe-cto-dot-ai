import { Lightbulb, BookOpen, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useBrowserNavigation } from '../../hooks';
import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import type { Scene as SceneType } from '../../types';

const ALTERNATIVES_SCENE: SceneType = {
  id: 'ignitionAlternatives',
  type: 'detail',
  title: 'Alternative Paths',
  description: 'Let\'s find the right way to support your journey',
  backgroundClass: 'bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900',
};

const ALTERNATIVES = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: 'Free Resources',
    description: 'Access our library of guides, templates, and tutorials',
    action: 'Browse Resources',
    url: '/resources',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Community',
    description: 'Join our community of founders and get peer support',
    action: 'Join Community',
    url: 'https://community.vibecto.com',
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: 'Office Hours',
    description: 'Get your questions answered in our weekly office hours',
    action: 'Register for Office Hours',
    url: 'https://calendly.com/vibecto/office-hours',
  },
];

export const IgnitionAlternativesScreen = () => {
  const { pushScene } = useBrowserNavigation();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={ALTERNATIVES_SCENE} className="max-w-4xl w-full">
          <div className="space-y-8">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-300">
                While Ignition might not be the right fit right now, we still want to help you succeed.
                Here are some ways we can support your journey:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {ALTERNATIVES.map((alt, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center"
                >
                  <div className="inline-flex p-3 rounded-lg bg-purple-500/20 text-purple-400 mb-4">
                    {alt.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{alt.title}</h3>
                  <p className="text-sm text-gray-400 mb-6">{alt.description}</p>
                  <Button
                    onClick={() => window.open(alt.url, '_blank')}
                    variant="outline"
                    className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    {alt.action}
                  </Button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-4">Ready to explore other services?</p>
              <Button
                onClick={() => pushScene('destinationSelection')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Back to Path Selection
              </Button>
            </div>
          </div>

          <SceneNavigation showReset />
        </Scene>
      </div>
    </div>
  );
};