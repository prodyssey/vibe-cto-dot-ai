import { Rocket, Phone, CheckCircle, Sparkles, Calendar, ArrowRight, RefreshCw } from "lucide-react";
import { useState } from "react";

import { EmailOptIn } from "@/components/EmailOptIn";
import { Button } from "@/components/ui/button";
import { trackSavvyCalClick } from "@/lib/analytics";
import { AnimatedButton, LaunchControlWaitlistForm, SessionEmailForm } from "../../components";

import { useGameStore } from "../../gameStore";
import { useGameCompletion, useBrowserNavigation } from "../../hooks";
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

const NEXT_STEPS_QUALIFIED = [
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Information Received",
    description: "We have your contact details and project information",
    timing: "Complete",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Review & Assessment",
    description: "Our team will evaluate your scaling needs and fit",
    timing: "1-2 business days",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "Potential Next Steps",
    description: "If we're a good match, we'll discuss your scaling journey",
    timing: "If applicable",
  },
];

const NEXT_STEPS_EXPLORING = [
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Information Received",
    description: "Thanks for your interest in Launch Control",
    timing: "Complete",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Resources Available",
    description: "Check out our scaling guides and best practices",
    timing: "Immediate",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "Future Opportunities",
    description: "We'll notify you about cohort programs or workshops",
    timing: "As available",
  },
];

export const LaunchControlFinalScreen = () => {
  const { playerName, isGeneratedName, sessionId, completeGame, resetGame, choices } = useGameStore();
  const { handleEmailSignup, handleExploreService } = useGameCompletion();
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [hasSubmittedWaitlist, setHasSubmittedWaitlist] = useState(false);
  const [hasCollectedEmail, setHasCollectedEmail] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  // Check user's path through the adventure
  const budgetChoice = choices.find(c => c.sceneId === 'launchControlBudget');
  const isHighBudget = budgetChoice?.choiceId === 'ready-high';
  const isMidBudget = budgetChoice?.choiceId === 'ready-mid';
  const isLowBudget = budgetChoice?.choiceId === 'ready-low';
  const isNoBudget = budgetChoice?.choiceId === 'exploring';
  
  // Check if contact info was already collected
  const hasContactInfo = choices.find((c) => c.sceneId === "launchControlContact" && c.choiceId === "submitted");
  
  // High budget users can schedule directly ($15K+ based on our threshold)
  const canScheduleDirect = isHighBudget;
  
  // Check if waitlist is active (in production, this would be from database)
  const isWaitlistActive = false; // Default to no waitlist

  const handleScheduleCall = async () => {
    // Check if we already have contact info from earlier
    const contactInfo = choices.find((c) => c.sceneId === "launchControlContact" && c.choiceId === "submitted");
    
    if (contactInfo && contactInfo.data?.email && contactInfo.data?.name) {
      // We already have the contact info, use it directly
      await handleEmailSubmit(contactInfo.data.email, contactInfo.data.name);
    } else {
      // We don't have contact info, show the form
      setShowEmailForm(true);
    }
  };

  const handleEmailSubmit = async (email: string, name: string) => {
    // Store the submitted values
    setUserEmail(email);
    setUserName(name);
    setHasCollectedEmail(true);
    setShowEmailForm(false);

    // Open SavvyCal in new tab
    const savvycalUrl = `https://savvycal.com/craigsturgis/vibecto-launch-control?email=${encodeURIComponent(
      email
    )}&display_name=${encodeURIComponent(name)}`;

    // Track conversion
    trackSavvyCalClick('launch_control_adventure_final', 'launch_control_alignment', {
      email: email,
      player_name: name
    });

    // Try to open in new tab
    const newWindow = window.open(savvycalUrl, "_blank");

    // Safari and other browsers may block this, so we'll show a message with a button
    if (!newWindow || newWindow.closed) {
      console.warn("Popup was blocked. User will need to click the link manually.");
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
    window.location.href = "/adventure";
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
                Thank you, {playerName}!
              </h2>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {canScheduleDirect
                  ? "You've qualified for Launch Control! Get ready to transform your startup from prototype to production powerhouse."
                  : isMidBudget
                  ? "We've received your information and will review your submission to see if we're a good fit for your scaling needs."
                  : isLowBudget
                  ? "Thanks for your interest! We'll review your information and explore if there are options that might work."
                  : "Thanks for your interest in scaling best practices! Check out our resources below to learn more."}
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Rocket className="w-6 h-6 mr-2 text-cyan-400" />
                Your Launch Sequence
              </h3>

              <div className="space-y-4 mb-8">
                {(canScheduleDirect && !isWaitlistActive
                  ? NEXT_STEPS_DIRECT
                  : (isMidBudget
                    ? NEXT_STEPS_QUALIFIED
                    : NEXT_STEPS_EXPLORING
                  )).map((step, idx) => (
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
                      : (isLowBudget || isNoBudget)
                      ? "Thanks for your interest! We'll keep you updated on future opportunities."
                      : "We've received your information and will review your submission."}
                  </p>
                  {canScheduleDirect && (
                    <AnimatedButton
                      onClick={() => {
                        const contactInfo = choices.find((c) => c.sceneId === "launchControlContact" && c.choiceId === "submitted");
                        const email = contactInfo?.data?.email || "";
                        const name = contactInfo?.data?.name || "";
                        const url = email && name 
                          ? `https://savvycal.com/craigsturgis/vibecto-launch-control?email=${encodeURIComponent(email)}&display_name=${encodeURIComponent(name)}`
                          : `https://savvycal.com/craigsturgis/vibecto-launch-control`;
                        trackSavvyCalClick('launch_control_adventure_final', 'launch_control_alignment', {
                          email: email,
                          player_name: name
                        });
                        window.open(url, "_blank", "noopener,noreferrer");
                      }}
                      size="lg"
                      className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      particleColors={["#0ea5e9", "#06b6d4", "#14b8a6"]}
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
                <LaunchControlWaitlistForm
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
                    We'll reach out within 2 business days at your preferred contact.
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
                      If the booking window did not open, please click the button below.
                    </p>
                  </div>
                  <AnimatedButton
                    onClick={() => {
                      const url = `https://savvycal.com/craigsturgis/vibecto-launch-control?email=${encodeURIComponent(
                        userEmail
                      )}&display_name=${encodeURIComponent(userName)}`;
                      trackSavvyCalClick('launch_control_adventure_backup_button', 'launch_control_alignment', {
                        email: userEmail,
                        player_name: userName
                      });
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    particleColors={["#0ea5e9", "#06b6d4", "#14b8a6"]}
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
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                          particleColors={["#0ea5e9", "#06b6d4", "#14b8a6"]}
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
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                          particleColors={["#0ea5e9", "#06b6d4", "#14b8a6"]}
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
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                          particleColors={["#0ea5e9", "#06b6d4", "#14b8a6"]}
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
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">
                      Mission Status
                    </h4>
                    <div className="text-center p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-white font-medium">
                        {canScheduleDirect
                          ? "Ready for Launch Control"
                          : isMidBudget
                          ? "Information Submitted"
                          : "Thanks for Your Interest"}
                      </p>
                      <p className="text-sm text-gray-300 mt-2">
                        {canScheduleDirect
                          ? "Ready to schedule your alignment call"
                          : isMidBudget
                          ? "We'll review your submission"
                          : isLowBudget
                          ? "We'll explore options for your budget"
                          : "Check out our resources below"}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      {canScheduleDirect
                        ? "We'll send a prep guide before your call"
                        : isMidBudget
                        ? "If we're a good fit, we'll reach out"
                        : "Resources and opportunities available"}
                    </p>
                  </div>
                </div>
              )}
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

            {/* Alternative Resources for Lower Budget Users */}
            {(isLowBudget || isNoBudget) && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">
                  Here are some helpful resources:
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span>Review our <a href="/resources" className="text-cyan-400 hover:text-cyan-300 underline">scaling best practices</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span>Check out case studies of successful scaling journeys</span>
                  </li>
                  {isLowBudget && (
                    <>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        <span>Consider starting with <a href="/ignition" className="text-cyan-400 hover:text-cyan-300 underline">Ignition</a> to build your MVP first</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        <span>Explore payment plan options if applicable</span>
                      </li>
                    </>
                  )}
                  {isNoBudget && (
                    <>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        <span>Learn about production readiness through our resources</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        <span>We'll notify you about future cohort programs or workshops</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}

            {/* Additional Options */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => (window.location.href = "/launch-control")}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  Visit Launch Control Page
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
