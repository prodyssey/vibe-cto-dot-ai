import { Clock, Users, CheckCircle } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { Scene } from '../../Scene';
import { SceneTransition } from '../../animations';
import { useGameStore } from '../../gameStore';
import { useBrowserNavigation } from '../../hooks';
import { getScene } from '../../scenes';
import { saveChoice } from '../../utils';
import { LaunchControlWaitlistForm } from './LaunchControlWaitlistForm';

export const LaunchControlWaitlistScreen = () => {
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();
  const scene = getScene('launchControlWaitlist');
  const [submitted, setSubmitted] = useState(false);

  if (!scene) return null;

  const handleSuccess = async () => {
    setSubmitted(true);
    makeChoice('launchControlWaitlist', 'joined', { launchControl: 2 });
    await saveChoice(sessionId, 'launchControlWaitlist', 'joined', 'Joined waitlist');
    
    // Navigate to final screen after a short delay
    setTimeout(() => {
      pushScene('launchControlFinal');
    }, 2000);
  };

  return (
    <SceneTransition sceneId="launchControlWaitlist" transitionType="slide">
      <Scene scene={scene} className="max-w-4xl">
        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <Clock className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Join the Launch Control Waitlist</h2>
              <p className="text-gray-300 text-lg">
                We're currently at capacity helping teams transform their production systems.
                Join our priority waitlist to be notified as soon as a spot opens up.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Limited Spots</p>
                  <p className="text-gray-400 text-sm">We work with 3-5 teams at a time</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Average Wait</p>
                  <p className="text-gray-400 text-sm">2-4 weeks for qualified teams</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Priority Access</p>
                  <p className="text-gray-400 text-sm">First in line when spots open</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Reserve Your Spot
                </h3>
                <LaunchControlWaitlistForm onSuccess={handleSuccess} isWaitlist={true} />
              </CardContent>
            </Card>

            <div className="mt-6 bg-blue-500/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
              <p className="text-blue-300 text-sm text-center">
                While you wait, we'll send you our production readiness checklist and scaling guides
                to help you prepare for Launch Control.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-500/20 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">You're on the List! 🎯</h3>
            <p className="text-gray-300 text-lg">
              We'll reach out as soon as a spot opens up. In the meantime, check your email
              for our production readiness resources.
            </p>
          </div>
        )}
      </Scene>
    </SceneTransition>
  );
};