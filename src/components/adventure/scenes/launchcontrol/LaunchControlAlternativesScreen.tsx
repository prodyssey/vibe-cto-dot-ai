import { BookOpen, Users, Rocket, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import { SceneTransition } from '../../animations';
import { useGameStore } from '../../gameStore';
import { useBrowserNavigation } from '../../hooks';
import { getScene } from '../../scenes';
import { saveChoice } from '../../utils';

export const LaunchControlAlternativesScreen = () => {
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();
  const scene = getScene('launchControlAlternatives');

  if (!scene) return null;

  const alternatives = [
    {
      id: 'resources',
      icon: BookOpen,
      title: 'Free Scaling Resources',
      description: 'Access our comprehensive guides, architecture templates, and best practices for scaling your product on your own timeline.',
      benefits: [
        'Production readiness checklist',
        'Security hardening guides',
        'Performance optimization playbooks',
        'Infrastructure scaling templates',
      ],
      cta: 'Access Resources',
      action: () => {
        saveChoice(sessionId, 'launchControlAlternatives', 'resources', 'Selected free resources');
        window.open('https://github.com/vibectoai/scaling-resources', '_blank');
      },
    },
    {
      id: 'community',
      icon: Users,
      title: 'Technical Leaders Community',
      description: 'Join our community of CTOs and technical leaders navigating similar scaling challenges. Share experiences and learn from peers.',
      benefits: [
        'Weekly architecture review sessions',
        'Peer mentorship matching',
        'Scaling war stories and lessons learned',
        'Exclusive community events',
      ],
      cta: 'Join Community',
      action: () => {
        saveChoice(sessionId, 'launchControlAlternatives', 'community', 'Joined community');
        window.open('https://community.vibecto.ai', '_blank');
      },
    },
    {
      id: 'ignition',
      icon: Rocket,
      title: 'Start with Ignition',
      description: 'If you\'re still building your MVP or early prototype, Ignition might be a better fit to get you to a scalable foundation.',
      benefits: [
        'Rapid MVP development',
        'Product-market fit validation',
        'Technical foundation building',
        'Path to Launch Control when ready',
      ],
      cta: 'Explore Ignition',
      action: () => {
        saveChoice(sessionId, 'launchControlAlternatives', 'ignition', 'Redirected to Ignition');
        makeChoice('launchControlAlternatives', 'ignition', { ignition: 2 });
        pushScene('ignitionDetail');
      },
    },
  ];

  return (
    <SceneTransition sceneId="launchControlAlternatives" transitionType="fade">
      <Scene scene={scene} className="max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Alternative Paths Forward</h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            While Launch Control might not be the right fit today, we have other ways to support your journey.
            Choose the option that best matches your current needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {alternatives.map((alt) => (
            <Card
              key={alt.id}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col"
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
                    <alt.icon className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-white text-xl">{alt.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-300 mb-4">{alt.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {alt.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-400">
                      <span className="text-blue-400 mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={alt.action}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {alt.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-purple-500/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 mb-8">
          <h3 className="text-lg font-semibold text-white mb-2">Stay Connected</h3>
          <p className="text-gray-300 mb-4">
            Your scaling journey is unique, and timing is everything. Stay connected to know when the time is right
            for Launch Control, or to access new resources as they become available.
          </p>
          <Button
            variant="outline"
            className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
            onClick={() => {
              saveChoice(sessionId, 'launchControlAlternatives', 'newsletter', 'Subscribed to updates');
              pushScene('launchControlFinal');
            }}
          >
            Get Scaling Updates
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => pushScene('destinationSelection')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Mission Selection
          </Button>
        </div>

        <SceneNavigation showBack showReset />
      </Scene>
    </SceneTransition>
  );
};