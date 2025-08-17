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
import { logger } from "@/lib/logger";

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

const NEXT_STEPS_QUALIFIED = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Information Received",
    description: "We have your contact details",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "We'll Review Your Submission",
    description: "Our team will evaluate your project fit",
  },
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Potential Next Steps",
    description: "If we're a good match, we'll discuss your journey",
  },
];

const NEXT_STEPS_EXPLORING = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Information Received",
    description: "Thanks for your interest in Ignition",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Resources Available",
    description: "Check out our free guides and resources",
  },
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Future Opportunities",
    description: "We'll notify you about cohort programs or workshops",
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

  // Check user's budget selection
  const budgetChoice = choices.find((c) => c.sceneId === "ignitionBudget");
  const isHighBudget = budgetChoice?.choiceId === "ready-high";
  const isMidBudget = budgetChoice?.choiceId === "ready-mid";
  const isLowBudget = budgetChoice?.choiceId === "ready-low";
  const isNoBudget = budgetChoice?.choiceId === "not-ready";
  
  // Check if contact info was already collected
  const hasContactInfo = choices.find((c) => c.sceneId === "ignitionContact" && c.choiceId === "submitted");
  
  // High budget users can schedule directly
  const canScheduleDirect = isHighBudget;

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
    // Check if we already have contact info from earlier
    const contactInfo = choices.find((c) => c.sceneId === "ignitionContact" && c.choiceId === "submitted");
    
    if (contactInfo && contactInfo.data?.email && contactInfo.data?.name) {
      // We already have the contact info, use it directly
      await handleEmailSubmit(contactInfo.data.email, contactInfo.data.name);
    } else {
      // We don't have contact info, show the form
      setShowEmailForm(true);
    }
  };

  const handleEmailSubmit = async (email: string, name: string) => {
    logger.debug("handleEmailSubmit called");

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
      logger.warn("Popup was blocked. User will need to click the link manually.");
    }

    // Mark game as completed
    try {
      await completeGame("explore_service");
    } catch (error) {
      logger.error("Error completing game:", error);
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
                Thank you, {playerName}!
              </h2>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {canScheduleDirect
                  ? "You're ready to join the Ignition program and transform your idea into a working prototype in just 2-4 weeks."
                  : isMidBudget
                  ? "We've received your information and will review your submission to see if we're a good fit."
                  : isLowBudget || isNoBudget
                  ? "Thanks for your interest! Check out our resources below to learn more about vibe coding."
                  : "Thanks for your interest in Ignition! We'll share resources to help you on your journey."}
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
                {(canScheduleDirect && !isWaitlistActive
                  ? NEXT_STEPS_DIRECT
                  : (isLowBudget || isNoBudget || budgetChoice?.choiceId === "exploring")
                  ? NEXT_STEPS_EXPLORING
                  : NEXT_STEPS_QUALIFIED
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
              {hasContactInfo ? (
                // If contact info was already collected, show success message
                <div className="text-center p-8 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">
                    You're all set!
                  </h4>
                  <p className="text-gray-300">
                    {canScheduleDirect
                      ? "Your information has been saved. Schedule your alignment call when you're ready."
                      : (isLowBudget || isNoBudget || budgetChoice?.choiceId === "exploring")
                      ? "Thanks for your interest! We'll keep you updated on future opportunities."
                      : "We've received your information and will review your submission."}
                  </p>
                  {canScheduleDirect && (
                    <AnimatedButton
                      onClick={() => {
                        const contactInfo = choices.find((c) => c.sceneId === "ignitionContact" && c.choiceId === "submitted");
                        const email = contactInfo?.data?.email || "";
                        const name = contactInfo?.data?.name || "";
                        const url = email && name 
                          ? `https://savvycal.com/craigsturgis/vibecto-ignition-alignment?email=${encodeURIComponent(email)}&display_name=${encodeURIComponent(name)}`
                          : `https://savvycal.com/craigsturgis/vibecto-ignition-alignment`;
                        trackSavvyCalClick('ignition_adventure_final', 'ignition_alignment', {
                          email: email,
                          player_name: name
                        });
                        window.open(url, "_blank", "noopener,noreferrer");
                      }}
                      size="lg"
                      className="mt-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      particleColors={["#dc2626", "#ea580c", "#f97316"]}
                    >
                      Schedule Your Call
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </AnimatedButton>
                  )}
                </div>
              ) : showEmailForm ? (
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
              ) : hasCollectedEmail && canScheduleDirect && !isWaitlistActive ? (
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
                    {!canScheduleDirect ? (
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
                          We'll contact you within 1-2 business days
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
                          {hasContactInfo 
                            ? "Click to open scheduling with your info" 
                            : "We'll collect your info and open scheduling"}
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

            {/* Alternative Resources for Lower Budget Users */}
            {(isLowBudget || isNoBudget) && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">
                  While you wait, here are some resources:
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    <span>Check out our <a href="/resources" className="text-orange-400 hover:text-orange-300 underline">free resources</a> on vibe coding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    <span>Join our community newsletter for tips and case studies</span>
                  </li>
                  {isLowBudget && (
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>We'll discuss payment plan options when we connect</span>
                    </li>
                  )}
                  {isNoBudget && (
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>We'll notify you about future cohort programs or group workshops</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

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
