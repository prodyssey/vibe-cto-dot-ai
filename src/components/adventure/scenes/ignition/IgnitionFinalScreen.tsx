import {
  Flame,
  Calendar,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";

import { EmailOptIn } from "@/components/EmailOptIn";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackSavvyCalClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

import { AnimatedButton } from "../../components/AnimatedButton";
import { IgnitionWaitlistForm } from "../../components/IgnitionWaitlistForm";
import { SessionEmailForm } from "../../components/SessionEmailForm";
import { useGameStore } from "../../gameStore";
import { useGameCompletion, useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import type { Scene as SceneType } from "../../types";

const FINAL_SCENE: SceneType = {
  id: "ignitionFinal",
  type: "result",
  title: "Ignition awaits!",
  description: "You're ready to turn your launch key.",
  backgroundClass: "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
};

const NEXT_STEPS_WAITLIST = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Submit Your Contact Info",
    description: "Tell us how you prefer to be contacted",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "We'll Reach Out Within 2 Days",
    description: "Our team will contact you to schedule your discovery call",
  },
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Start Your Journey",
    description: "Begin your 2-4 week transformation",
  },
];

const NEXT_STEPS_REVIEW = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Application Under Review",
    description: "We're reviewing your rate reduction application",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Response Within 1-2 Business Days",
    description:
      "We'll contact you to schedule a virtual discussion if approved",
  },
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Custom Plan",
    description:
      "We'll work to align on a plan that works for you and our team",
  },
];

const NEXT_STEPS_DIRECT = [
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Schedule Alignment Call",
    description: "30-minute call to dive deep into your vision",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Prepare Your Ideas",
    description: "We'll send you a prep guide to maximize our time",
  },
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Start Building",
    description: "Begin your 2-4 week transformation journey",
  },
];

export const IgnitionFinalScreen = () => {
  const {
    playerName,
    isGeneratedName,
    sessionId,
    completeGame,
    resetGame,
    choices,
  } = useGameStore();
  const { handleEmailSignup, handleExploreService } = useGameCompletion();
  const { pushScene } = useBrowserNavigation();
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [isWaitlistActive, setIsWaitlistActive] = useState(false); // Default to no waitlist
  const [hasSubmittedWaitlist, setHasSubmittedWaitlist] = useState(false);
  const [hasCollectedEmail, setHasCollectedEmail] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  // Check if user selected a budget under $15K or applied for rate reduction
  const budgetChoice = choices.find((c) => c.sceneId === "ignitionBudget");
  const rateReductionChoice = choices.find(
    (c) => c.sceneId === "ignitionRateReduction"
  );
  const needsReview =
    budgetChoice?.choiceId === "ready-mid" ||
    budgetChoice?.choiceId === "ready-low" ||
    rateReductionChoice?.choiceId === "rate-reduction-applied";

  // Check if there are active projects (in real app, this would be from database)
  useEffect(() => {
    // For now, we'll simulate this with a simple check
    // In production, query the database for active project slots
    const checkActiveProjects = async () => {
      // TODO: Query database for active project count
      // For now, default to direct booking (no waitlist)
      setIsWaitlistActive(false);
    };
    checkActiveProjects();
  }, []);

  const handleScheduleCall = async () => {
    // Always show email collection form first
    setShowEmailForm(true);
  };

  const handleEmailSubmit = async (email: string, name: string) => {
    console.log("handleEmailSubmit called with:", { email, name });

    // Store the submitted values
    setUserEmail(email);
    setUserName(name);
    setHasCollectedEmail(true);
    setShowEmailForm(false);

    // Open SavvyCal in new tab
    const savvycalUrl = `https://savvycal.com/craigsturgis/vibecto-ignition-alignment?email=${encodeURIComponent(
      email
    )}&display_name=${encodeURIComponent(name)}`;

    // Track conversion
    trackSavvyCalClick('ignition_adventure_final', 'ignition_alignment', {
      email: email,
      player_name: name
    });

    // Try to open in new tab
    const newWindow = window.open(savvycalUrl, "_blank");

    // Safari and other browsers may block this, so we'll show a message with a button
    if (!newWindow || newWindow.closed) {
      console.warn(
        "Popup was blocked. User will need to click the link manually."
      );
    }

    // Mark game as completed
    try {
      await completeGame("explore_service");
    } catch (error) {
      console.error("Error completing game:", error);
    }
  };

  const handleWaitlistSuccess = () => {
    setHasSubmittedWaitlist(true);
    setShowWaitlistForm(false);
  };

  const handleStartOver = () => {
    resetGame();
    pushScene("entry");
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
                {needsReview
                  ? `Thank you, ${playerName}!`
                  : `Congratulations, ${playerName}!`}
              </h2>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {needsReview
                  ? "Your application has been submitted! We'll review it and get back to you within 1-2 business days."
                  : "You're ready to join the Ignition program and transform your idea into a working prototype in just 2-4 weeks."}
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-orange-500/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Your Next Steps
              </h3>

              {isWaitlistActive && (
                <div className="mb-6 p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                  <p className="text-sm text-orange-300">
                    <strong>Note:</strong> We're currently at capacity. You'll
                    be added to our waitlist and contacted as soon as a spot
                    opens up.
                  </p>
                </div>
              )}

              <div className="space-y-4 mb-8">
                {(needsReview
                  ? NEXT_STEPS_REVIEW
                  : isWaitlistActive
                  ? NEXT_STEPS_WAITLIST
                  : NEXT_STEPS_DIRECT
                ).map((step, idx) => (
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
                      <p className="text-sm text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              {showEmailForm ? (
                <SessionEmailForm
                  sessionId={sessionId}
                  playerName={playerName}
                  isGeneratedName={isGeneratedName}
                  onSuccess={handleEmailSubmit}
                  onBack={() => setShowEmailForm(false)}
                />
              ) : showWaitlistForm ? (
                <IgnitionWaitlistForm
                  sessionId={sessionId}
                  playerName={playerName}
                  isGeneratedName={isGeneratedName}
                  onSuccess={handleWaitlistSuccess}
                  isWaitlistActive={isWaitlistActive}
                />
              ) : hasSubmittedWaitlist ? (
                <div className="text-center p-8 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">
                    You're on the list!
                  </h4>
                  <p className="text-gray-300">
                    We'll reach out within 2 business days at your preferred
                    contact.
                  </p>
                </div>
              ) : hasCollectedEmail && !needsReview && !isWaitlistActive ? (
                <div className="text-center space-y-4">
                  <div className="p-8 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Great! Your information has been saved
                    </h4>
                    <p className="text-gray-300">
                      If the booking window did not open, please click the
                      button below.
                    </p>
                  </div>

                  <AnimatedButton
                    onClick={() => {
                      const url = `https://savvycal.com/craigsturgis/vibecto-ignition-alignment?email=${encodeURIComponent(
                        userEmail
                      )}&display_name=${encodeURIComponent(userName)}`;
                      trackSavvyCalClick('ignition_adventure_backup_button', 'ignition_alignment', {
                        email: userEmail,
                        player_name: userName
                      });
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                    size="lg"
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    particleColors={["#dc2626", "#ea580c", "#f97316"]}
                  >
                    Open SavvyCal Booking
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </AnimatedButton>

                  <p className="text-sm text-gray-400">
                    This will open in a new tab with your information pre-filled
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">
                      Let's go!
                    </h4>
                    {needsReview ? (
                      <>
                        <AnimatedButton
                          onClick={() => setShowWaitlistForm(true)}
                          size="lg"
                          className={cn(
                            "w-full",
                            "bg-gradient-to-r from-orange-600 to-red-600",
                            "hover:from-orange-700 hover:to-red-700"
                          )}
                          particleColors={["#dc2626", "#ea580c", "#f97316"]}
                        >
                          Submit Contact Info
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </AnimatedButton>
                        <p className="text-xs text-gray-400 text-center">
                          {isWaitlistActive
                            ? "Currently accepting waitlist applications"
                            : "We'll contact you within 1-2 business days"}
                        </p>
                      </>
                    ) : isWaitlistActive ? (
                      <>
                        <AnimatedButton
                          onClick={() => setShowWaitlistForm(true)}
                          size="lg"
                          className={cn(
                            "w-full",
                            "bg-gradient-to-r from-orange-600 to-red-600",
                            "hover:from-orange-700 hover:to-red-700"
                          )}
                          particleColors={["#dc2626", "#ea580c", "#f97316"]}
                        >
                          Join the Waitlist
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </AnimatedButton>
                        <p className="text-xs text-gray-400 text-center">
                          We'll contact you within 2 business days
                        </p>
                      </>
                    ) : (
                      <>
                        <AnimatedButton
                          onClick={handleScheduleCall}
                          size="lg"
                          className={cn(
                            "w-full",
                            "bg-gradient-to-r from-orange-600 to-red-600",
                            "hover:from-orange-700 hover:to-red-700"
                          )}
                          particleColors={["#dc2626", "#ea580c", "#f97316"]}
                        >
                          Schedule Call
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </AnimatedButton>
                        <p className="text-xs text-gray-400 text-center">
                          We'll collect your info and open scheduling
                        </p>
                      </>
                    )}
                  </div>

                  {/* <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">
                      Want to learn more first?
                    </h4>
                    <div onClick={() => handleEmailSignup()}>
                      <EmailOptIn
                        variant="minimal"
                        buttonText="Get Ignition Guide"
                        className="w-full"
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      Free guide • What to expect • Program details
                    </p>
                  </div> */}
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => (window.location.href = "/ignition")}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  Visit Ignition Page
                </Button>

                <Button
                  onClick={handleStartOver}
                  variant="ghost"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
              </div>
            </div>
          </div>
        </Scene>
      </div>
    </div>
  );
};
