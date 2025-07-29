import { Rocket, CheckCircle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { trackSavvyCalClick } from "@/lib/analytics";

import { useGameStore } from "../../gameStore";
import { useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import { SessionEmailForm } from "../../components/SessionEmailForm";
import { AnimatedButton } from "../../components/AnimatedButton";
import { LaunchControlWaitlistForm } from "./LaunchControlWaitlistForm";
import type { Scene as SceneType } from "../../types";

const APPLICATION_SCENE: SceneType = {
  id: "launchControlApplication",
  type: "detail",
  title: "Mission Application",
  description: "Your journey to scaling excellence starts here",
  backgroundClass: "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
};

export const LaunchControlApplicationScreen = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [hasCollectedEmail, setHasCollectedEmail] = useState(false);
  const [hasSubmittedWaitlist, setHasSubmittedWaitlist] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isWaitlistActive, setIsWaitlistActive] = useState(false);
  const { sessionId, makeChoice, playerName, isGeneratedName, completeGame, choices } =
    useGameStore();
  const { pushScene } = useBrowserNavigation();

  // Check user's path through the adventure
  const budgetChoice = choices.find(c => c.sceneId === 'launchControlBudget');
  const rateReductionChoice = choices.find(c => c.sceneId === 'launchControlRateReduction');
  const needsReview = budgetChoice?.choiceId === 'ready-mid' || 
                     budgetChoice?.choiceId === 'ready-low' ||
                     rateReductionChoice?.choiceId === 'applied';

  useEffect(() => {
    // Check for waitlist status
    // TODO: Query database for active project count
    setIsWaitlistActive(false);

    // Determine which form to show
    if (needsReview || isWaitlistActive) {
      setShowWaitlistForm(true);
    } else {
      setShowEmailForm(true);
    }
  }, [needsReview, isWaitlistActive]);

  const handleEmailSubmit = async (email: string, name: string) => {
    console.log("handleEmailSubmit called with:", { email, name });

    // Store the submitted values
    setUserEmail(email);
    setUserName(name);
    setHasCollectedEmail(true);
    setShowEmailForm(false);

    // Save application completion
    makeChoice(APPLICATION_SCENE.id, "application-complete");

    // Open SavvyCal in new tab with Launch Control specific link
    const savvycalUrl = `https://savvycal.com/craigsturgis/vibecto-launch-control-alignment?email=${encodeURIComponent(
      email
    )}&display_name=${encodeURIComponent(name)}`;

    // Track conversion
    trackSavvyCalClick('launch_control_adventure_application', 'launch_control_alignment', {
      email: email,
      player_name: name,
      needs_review: needsReview
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

  const handleWaitlistSubmit = () => {
    setHasSubmittedWaitlist(true);
    setShowWaitlistForm(false);
    completeGame('waitlist');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={APPLICATION_SCENE} className="max-w-3xl w-full">
          <div className="space-y-8">
            {showWaitlistForm && !hasSubmittedWaitlist ? (
              <LaunchControlWaitlistForm 
                onSuccess={handleWaitlistSubmit}
                isWaitlist={isWaitlistActive}
              />
            ) : showEmailForm && !hasCollectedEmail ? (
              <SessionEmailForm
                sessionId={sessionId}
                playerName={playerName}
                isGeneratedName={isGeneratedName}
                onSuccess={handleEmailSubmit}
                onBack={() => pushScene("launchControlQualification")}
              />
            ) : hasSubmittedWaitlist ? (
              <div className="text-center space-y-4">
                <div className="p-8 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {needsReview ? 'Application Submitted!' : 'You\'re on the Waitlist!'}
                  </h4>
                  <p className="text-gray-300">
                    {needsReview 
                      ? 'We\'ll review your rate reduction application and reach out within 1-2 business days with a custom plan.'
                      : 'We\'ll notify you as soon as a spot opens up for Launch Control.'}
                  </p>
                </div>

                <Button
                  onClick={() => pushScene("launchControlFinal")}
                  variant="outline"
                  className="border-cyan-600 text-cyan-300 hover:bg-cyan-900/20"
                >
                  Continue to Mission Summary
                  <Rocket className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ) : hasCollectedEmail ? (
              <div className="text-center space-y-4">
                <div className="p-8 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Great! Your information has been saved
                  </h4>
                  <p className="text-gray-300">
                    If the booking window did not open, please click the button
                    below.
                  </p>
                </div>

                <AnimatedButton
                  onClick={() => {
                    const url = `https://savvycal.com/craigsturgis/vibecto-launch-control-alignment?email=${encodeURIComponent(
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
                  particleColors={["#06b6d4", "#0ea5e9", "#3b82f6"]}
                >
                  Open SavvyCal Booking
                  <ArrowRight className="ml-2 w-5 h-5" />
                </AnimatedButton>

                <p className="text-sm text-gray-400">
                  This will open in a new tab with your information pre-filled
                </p>

                <Button
                  onClick={() => pushScene("launchControlFinal")}
                  variant="outline"
                  className="border-cyan-600 text-cyan-300 hover:bg-cyan-900/20"
                >
                  Continue to Mission Summary
                  <Rocket className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ) : null}
          </div>

          <SceneNavigation showBack={!hasCollectedEmail && !hasSubmittedWaitlist} showReset />
        </Scene>
      </div>
    </div>
  );
};
