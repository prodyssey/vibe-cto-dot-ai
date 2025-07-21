import { 
  Rocket, 
  Calendar, 
  Phone, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Clock
} from 'lucide-react';
import { useState } from 'react';

import { EmailOptIn } from '@/components/EmailOptIn';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useGameStore } from '../../gameStore';
import { useGameCompletion } from '../../hooks';
import { Scene } from '../../Scene';
import type { Scene as SceneType } from '../../types';
import { SessionEmailForm } from '../../components/SessionEmailForm';
import { LaunchControlWaitlistForm } from './LaunchControlWaitlistForm';

const FINAL_SCENE: SceneType = {
  id: 'launchControlFinal',
  type: 'result',
  title: 'Mission Control Activated!',
  description: 'Your scaling journey is about to begin',
  backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
};

const NEXT_STEPS = [
  {
    icon: <Phone className="w-5 h-5" />,
    title: 'Technical Assessment Call',
    description: 'Deep dive into your architecture and scaling needs',
    timing: 'Within 24 hours',
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: 'Custom Scaling Roadmap',
    description: 'Detailed plan with timelines and milestones',
    timing: 'Within 48 hours',
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: 'Project Kickoff',
    description: 'Meet your dedicated team and start scaling',
    timing: 'Within 1 week',
  },
];

export const LaunchControlFinalScreen = () => {
  const { playerName, completeGame, choices } = useGameStore();
  const { handleEmailSignup, handleExploreService } = useGameCompletion();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // Check user's path through the adventure
  const budgetChoice = choices['launchControlBudget']?.choiceId;
  const qualificationResult = choices['launchControlQualification']?.choiceId;
  const isQualified = qualificationResult === 'qualified';
  const hasHighBudget = budgetChoice === 'ready-high';
  const hasMidBudget = budgetChoice === 'ready-mid';
  
  // TODO: Replace with actual database query
  const isWaitlistActive = false;
  
  // Determine which flow to show
  const showDirectBooking = isQualified && hasHighBudget && !isWaitlistActive;
  const showReviewFlow = isQualified && hasMidBudget && !isWaitlistActive;
  const showWaitlistFlow = isQualified && isWaitlistActive;

  const handleScheduleCall = async () => {
    if (showDirectBooking) {
      setShowEmailForm(true);
    } else if (showReviewFlow || showWaitlistFlow) {
      setShowWaitlistForm(true);
    }
  };

  const handleEmailSubmit = async (email: string, name: string) => {
    setEmailSubmitted(true);
    await completeGame('explore_service');
    // Open calendar with pre-filled info
    const params = new URLSearchParams({
      name: name || playerName || '',
      email: email,
    });
    window.open(`https://savvycal.com/craigsturgis/launch-control-assessment?${params}`, '_blank');
  };

  const handleWaitlistSubmit = () => {
    setWaitlistSubmitted(true);
    completeGame('waitlist');
  };

  const handleEmailSignupWrapper = async () => {
    await handleEmailSignup();
  };

  const handleExploreServiceWrapper = async () => {
    await handleExploreService();
    window.location.href = '/launch-control';
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background - Launch Sequence */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900">
        {/* Rocket Launch Effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <div className="relative">
            {/* Rocket Trail */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-96 bg-gradient-to-t from-orange-400 via-yellow-400 to-transparent opacity-60 animate-pulse" />
            
            {/* Exhaust Particles */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 animate-float"
                style={{
                  left: `${-50 + Math.random() * 100}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <Sparkles className="w-4 h-4 text-orange-400 opacity-40" />
              </div>
            ))}
          </div>
        </div>

        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={FINAL_SCENE} className="max-w-4xl w-full">
          <div className="space-y-8">
            {/* Success Message */}
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 animate-bounce">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Congratulations, {playerName}!
              </h2>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {showDirectBooking ? (
                  <>You're cleared for launch! Let's schedule your technical assessment call to begin your scaling transformation.</>
                ) : showReviewFlow ? (
                  <>Your application has been received! We'll review your scaling needs and reach out within 1-2 business days with a custom plan.</>
                ) : showWaitlistFlow ? (
                  <>You're qualified for Launch Control! Join our priority waitlist and we'll notify you as soon as a spot opens up.</>
                ) : (
                  <>Thank you for your interest! Check out our resources to continue your scaling journey.</>
                )}
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Rocket className="w-6 h-6 mr-2 text-cyan-400" />
                Your Launch Sequence
              </h3>
              
              <div className="space-y-4 mb-8">
                {NEXT_STEPS.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start space-x-4 animate-fadeIn"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{step.title}</h4>
                      <p className="text-sm text-gray-400">{step.description}</p>
                      <p className="text-xs text-cyan-400 mt-1">{step.timing}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              {!showEmailForm && !showWaitlistForm && !emailSubmitted && !waitlistSubmitted ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">
                      {showDirectBooking ? 'Ready to accelerate?' : 
                       showReviewFlow ? 'Submit your contact info' :
                       showWaitlistFlow ? 'Join the waitlist' :
                       'Explore resources'}
                    </h4>
                    <Button
                      onClick={handleScheduleCall}
                      size="lg"
                      className={cn(
                        "w-full",
                        "bg-gradient-to-r from-blue-600 to-cyan-600",
                        "hover:from-blue-700 hover:to-cyan-700"
                      )}
                    >
                      {showDirectBooking ? 'Schedule Assessment Call' :
                       showReviewFlow ? 'Submit Contact Info' :
                       showWaitlistFlow ? 'Join Waitlist' :
                       'View Resources'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-xs text-gray-400 text-center">
                      {showDirectBooking ? '30-minute technical deep dive • No obligations' :
                       showReviewFlow ? 'We\'ll reach out within 1-2 business days' :
                       showWaitlistFlow ? 'Priority access when spots open' :
                       'Free scaling guides and templates'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Want scaling insights?</h4>
                    <div onClick={handleEmailSignupWrapper}>
                      <EmailOptIn
                        variant="minimal"
                        buttonText="Get Scaling Guide"
                        className="w-full"
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      Free guide • Scaling best practices • Case studies
                    </p>
                  </div>
                </div>
              ) : showEmailForm && !emailSubmitted ? (
                <div className="max-w-md mx-auto">
                  <SessionEmailForm 
                    onSubmit={handleEmailSubmit}
                    submitText="Continue to Calendar"
                  />
                </div>
              ) : showWaitlistForm && !waitlistSubmitted ? (
                <div className="max-w-md mx-auto">
                  <LaunchControlWaitlistForm 
                    onSuccess={handleWaitlistSubmit}
                    isWaitlist={showWaitlistFlow}
                  />
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <CheckCircle className="w-12 h-12 text-green-400" />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    {emailSubmitted ? 'Calendar opened!' : 'Submitted successfully!'}
                  </h4>
                  <p className="text-gray-300">
                    {emailSubmitted ? 
                      'Complete your booking in the calendar window that just opened.' :
                      showWaitlistFlow ?
                        'We\'ll notify you as soon as a spot opens up!' :
                        'We\'ll reach out within 1-2 business days to discuss your scaling needs.'}
                  </p>
                </div>
              )}
            </div>

            {/* Mission Stats */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between flex-wrap gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">24h</div>
                  <div className="text-sm text-gray-400">Response time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">10x</div>
                  <div className="text-sm text-gray-400">Average performance gain</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime guarantee</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">200+</div>
                  <div className="text-sm text-gray-400">Scaled startups</div>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="text-center space-y-4">
              <Button
                onClick={handleExploreServiceWrapper}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Visit Launch Control Page for More Details
              </Button>
              
              <p className="text-sm text-gray-500">
                Questions? Email us at scale@vibecto.com
              </p>
            </div>
          </div>
        </Scene>
      </div>
    </div>
  );
};