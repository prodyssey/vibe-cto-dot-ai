import { Scene } from '../../Scene';
import { useGameStore } from '../../gameStore';
import { useGameCompletion } from '../../hooks';
import { Button } from '@/components/ui/button';
import { EmailOptIn } from '@/components/EmailOptIn';
import { 
  Flame, 
  Calendar, 
  MessageSquare, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Scene as SceneType } from '../../types';

const FINAL_SCENE: SceneType = {
  id: 'ignitionFinal',
  type: 'result',
  title: 'Welcome to the Forge!',
  description: 'You\'re ready to transform your idea into reality',
  backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
};

const NEXT_STEPS = [
  {
    icon: <Calendar className="w-5 h-5" />,
    title: 'Schedule Discovery Call',
    description: '30-minute call to dive deep into your vision',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Prepare Your Ideas',
    description: 'We\'ll send you a prep guide to maximize our time',
  },
  {
    icon: <Flame className="w-5 h-5" />,
    title: 'Start Building',
    description: 'Begin your 2-4 week transformation journey',
  },
];

export const IgnitionFinalScreen = () => {
  const { playerName, completeGame } = useGameStore();
  const { handleEmailSignup, handleExploreService } = useGameCompletion();

  const handleScheduleCall = async () => {
    await completeGame('explore_service');
    // In a real implementation, this would open a calendar booking widget
    window.open('https://calendly.com/vibecto/ignition-discovery', '_blank');
  };

  const handleEmailSignupWrapper = async () => {
    await handleEmailSignup();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-slate-900">
        {/* Success Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              <Flame className="w-4 h-4 text-orange-400 opacity-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={FINAL_SCENE} className="max-w-4xl w-full">
          <div className="space-y-8">
            {/* Success Message */}
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-6">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Congratulations, {playerName}!
              </h2>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                You're ready to join the Ignition program and transform your idea into a working product in just 2-4 weeks.
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-orange-500/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Your Next Steps</h3>
              
              <div className="space-y-4 mb-8">
                {NEXT_STEPS.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start space-x-4 animate-fadeIn"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{step.title}</h4>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Ready to start now?</h4>
                  <Button
                    onClick={handleScheduleCall}
                    size="lg"
                    className={cn(
                      "w-full",
                      "bg-gradient-to-r from-orange-600 to-red-600",
                      "hover:from-orange-700 hover:to-red-700"
                    )}
                  >
                    Schedule Discovery Call
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    Takes 2 minutes • Find a time that works for you
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Want to learn more first?</h4>
                  <div onClick={handleEmailSignupWrapper}>
                    <EmailOptIn
                      variant="minimal"
                      buttonText="Get Ignition Guide"
                      className="w-full"
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Free guide • What to expect • Success stories
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="text-center space-y-4">
              <Button
                onClick={handleExploreService}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Visit Ignition Page for More Details
              </Button>
              
              <p className="text-sm text-gray-500">
                Questions? Email us at ignition@vibecto.com
              </p>
            </div>
          </div>
        </Scene>
      </div>
    </div>
  );
};