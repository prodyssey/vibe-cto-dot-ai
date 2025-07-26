import { Rocket, Phone, CheckCircle, Sparkles, Calendar } from "lucide-react";

import { EmailOptIn } from "@/components/EmailOptIn";
import { Button } from "@/components/ui/button";

import { useGameStore } from "../../gameStore";
import { useGameCompletion } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import type { Scene as SceneType } from "../../types";

const FINAL_SCENE: SceneType = {
  id: "launchControlFinal",
  type: "result",
  title: "Mission Control Activated!",
  description: "Your scaling journey is about to begin",
  backgroundClass: "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
};

const NEXT_STEPS_DIRECT = [
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Alignment Call",
    description:
      "30-minute call to understand your scaling challenges and goals",
    timing: "Book now via SavvyCal",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Mission Assessment",
    description:
      "Deep dive into your architecture, bottlenecks, and requirements",
    timing: "Weeks 1-2",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "Flight Plan Execution",
    description: "Implement optimal architecture and scaling strategy",
    timing: "Weeks 2-12",
  },
];

const NEXT_STEPS_REVIEW = [
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Application Review",
    description: "We're reviewing your rate reduction application",
    timing: "Within 1-2 business days",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Custom Plan Discussion",
    description: "Virtual call to align on a plan that works for everyone",
    timing: "If approved",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "Begin Your Journey",
    description: "Start your transformation with adjusted pricing",
    timing: "After agreement",
  },
];

const NEXT_STEPS_WAITLIST = [
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Waitlist Confirmation",
    description: "You're on our priority list for Launch Control",
    timing: "Confirmed",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Spot Opens Up",
    description: "We'll contact you as soon as capacity becomes available",
    timing: "Varies",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "Fast Track Onboarding",
    description: "Priority scheduling when your spot is ready",
    timing: "When available",
  },
];

export const LaunchControlFinalScreen = () => {
  const { playerName, choices } = useGameStore();
  const { handleEmailSignup, handleExploreService } = useGameCompletion();

  // Check user's path through the adventure
  const budgetChoice = choices.find(c => c.sceneId === 'launchControlBudget');
  const rateReductionChoice = choices.find(c => c.sceneId === 'launchControlRateReduction');
  const needsReview = budgetChoice?.choiceId === 'ready-mid' || 
                     budgetChoice?.choiceId === 'ready-low' ||
                     rateReductionChoice?.choiceId === 'applied';
  
  // TODO: Replace with actual database query
  const isWaitlistActive = false;

  const handleEmailSignupWrapper = async () => {
    await handleEmailSignup();
  };

  const handleExploreServiceWrapper = async () => {
    await handleExploreService();
    window.location.href = "/launch-control";
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
                {needsReview 
                  ? `Thank you, ${playerName}!`
                  : isWaitlistActive
                  ? `You're on the list, ${playerName}!`
                  : `Mission Briefing Complete, ${playerName}!`}
              </h2>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {needsReview 
                  ? "Your application has been submitted! We'll review it and get back to you within 1-2 business days."
                  : isWaitlistActive
                  ? "You're on our priority waitlist! We'll notify you as soon as a spot opens up."
                  : "You've booked your alignment call. Get ready to transform your startup from prototype to production powerhouse."}
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Rocket className="w-6 h-6 mr-2 text-cyan-400" />
                Your Launch Sequence
              </h3>

              <div className="space-y-4 mb-8">
                {(needsReview 
                  ? NEXT_STEPS_REVIEW 
                  : isWaitlistActive 
                  ? NEXT_STEPS_WAITLIST 
                  : NEXT_STEPS_DIRECT).map((step, idx) => (
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
                      <p className="text-sm text-gray-400">
                        {step.description}
                      </p>
                      <p className="text-xs text-cyan-400 mt-1">
                        {step.timing}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    Mission Status
                  </h4>
                  <div className="text-center p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-white font-medium">
                      {needsReview 
                        ? "Application Submitted" 
                        : isWaitlistActive 
                        ? "Waitlist Confirmed"
                        : "Alignment Call Booked"}
                    </p>
                    <p className="text-sm text-gray-300 mt-2">
                      {needsReview 
                        ? "We'll contact you within 1-2 business days"
                        : isWaitlistActive 
                        ? "You're on our priority list"
                        : "Check your email for calendar confirmation"}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    {needsReview 
                      ? "Rate reduction applications are reviewed quickly"
                      : isWaitlistActive 
                      ? "We'll notify you as soon as a spot opens"
                      : "We'll send a prep guide before your call"}
                  </p>
                </div>

                {/* <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    Want scaling insights?
                  </h4>
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
                </div> */}
              </div>
            </div>

            {/* Mission Stats */}
            {/* <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
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
            </div> */}

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
                Questions? Email us at craig@vibecto.ai
              </p>
            </div>
          </div>

          <SceneNavigation showReset />
        </Scene>
      </div>
    </div>
  );
};
