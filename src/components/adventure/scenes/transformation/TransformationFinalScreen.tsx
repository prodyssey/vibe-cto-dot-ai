import {
  Sparkles,
  Calendar,
  ArrowRight,
  CheckCircle,
  Brain,
  Zap,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackSavvyCalClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

import { useGameStore } from "../../gameStore";
import { useBrowserNavigation, useGameCompletion } from "../../hooks";
import { Scene } from "../../Scene";
import type { Scene as SceneType } from "../../types";

const FINAL_SCENE: SceneType = {
  id: "transformationFinal",
  type: "result",
  title: "Welcome to the Observatory",
  description: "Your journey to the stars begins now",
  backgroundClass:
    "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
};

const NEXT_STEPS = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Team Assessment & Discovery",
    description: "Deep dive into your team's current velocity and bottlenecks",
    timing: "Weeks 1-2",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "AI Agent Implementation",
    description: "Custom AI workflows tailored to your organization and stack",
    timing: "Weeks 3-4",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Velocity Acceleration",
    description: "Scale AI adoption across your entire product development org",
    timing: "Weeks 4-12+",
  },
];

export const TransformationFinalScreen = () => {
  const { playerName, completeGame } = useGameStore();
  const { handleEmailSignup, handleExploreService } = useGameCompletion();
  const { pushScene } = useBrowserNavigation();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [hasCollectedEmail, setHasCollectedEmail] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

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
    const savvycalUrl = `https://savvycal.com/craigsturgis/vibecto-transformation-alignment?email=${encodeURIComponent(
      email
    )}&display_name=${encodeURIComponent(name)}`;

    // Track conversion
    trackSavvyCalClick(
      "transformation_adventure_final",
      "transformation_alignment",
      {
        email: email,
        player_name: name,
      }
    );

    // Try to open in new tab
    const newWindow = window.open(savvycalUrl, "_blank");

    // Complete the game
    await completeGame("explore_service");
  };

  const handleEmailSignupWrapper = async () => {
    await handleEmailSignup();
  };

  const handleExploreServiceWrapper = async () => {
    await handleExploreService();
    window.location.href = "/transformation";
  };

  const handleViewAlternatives = () => {
    pushScene("transformationAlternatives");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background - Constellation Celebration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        {/* Starfield with constellation connections */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="starGlow">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Draw constellation */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const r = 150 + Math.random() * 100;
            const cx = 50 + (r * Math.cos(angle)) / 5;
            const cy = 50 + (r * Math.sin(angle)) / 5;

            return (
              <g key={i}>
                <circle
                  cx={`${cx}%`}
                  cy={`${cy}%`}
                  r="4"
                  fill="url(#starGlow)"
                  className="animate-twinkle"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
                {i > 0 && (
                  <line
                    x1={`${cx}%`}
                    y1={`${cy}%`}
                    x2="50%"
                    y2="50%"
                    stroke="rgba(139, 92, 246, 0.3)"
                    strokeWidth="1"
                    className="animate-fadeIn"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                )}
              </g>
            );
          })}

          {/* Central star */}
          <circle
            cx="50%"
            cy="50%"
            r="8"
            fill="url(#starGlow)"
            className="animate-pulse"
          />
        </svg>

        {/* Nebula particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            >
              <Sparkles className="w-3 h-3 text-purple-400 opacity-30" />
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
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 mb-6 animate-bounce">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to Warp Speed, {playerName}!
              </h2>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                You've taken the first step toward transforming your team's
                velocity with AI-powered development. Let's accelerate your path
                to greater productivity.
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-purple-400" />
                Your Transformation Journey
              </h3>

              <div className="space-y-4 mb-8">
                {NEXT_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-4 animate-fadeIn"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{step.title}</h4>
                      <p className="text-sm text-gray-400">
                        {step.description}
                      </p>
                      <p className="text-xs text-purple-400 mt-1">
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
                    Ready to accelerate?
                  </h4>
                  <Button
                    onClick={handleScheduleCall}
                    size="lg"
                    className={cn(
                      "w-full",
                      "bg-gradient-to-r from-purple-600 to-indigo-600",
                      "hover:from-purple-700 hover:to-indigo-700"
                    )}
                  >
                    Schedule Alignment Call
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    30-minute deep dive • AI transformation roadmap
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    Need more budget?
                  </h4>
                  <Button
                    onClick={handleViewAlternatives}
                    variant="outline"
                    size="lg"
                    className="w-full border-purple-500/50 text-purple-300 hover:text-purple-200 hover:border-purple-500 hover:bg-purple-900/20"
                  >
                    View Alternative Options
                    <MessageSquare className="ml-2 w-5 h-5" />
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    AI tools • Learning resources • Community
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            {/* <div className="bg-gray-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between flex-wrap gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-400">3x</div>
                  <div className="text-sm text-gray-400">Feature Velocity</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">75%</div>
                  <div className="text-sm text-gray-400">Less Manual Work</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">10x</div>
                  <div className="text-sm text-gray-400">
                    Developer Productivity
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    2-4 Weeks
                  </div>
                  <div className="text-sm text-gray-400">To First Results</div>
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
                Visit Transformation Page for More Details
              </Button>

              <p className="text-sm text-gray-500">
                Questions? Email our team at craig@vibecto.ai
              </p>
            </div>
          </div>
        </Scene>
      </div>

      {/* Email Collection Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-purple-500/50 rounded-lg p-6 max-w-md w-full animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-4">
              Almost there! Let's connect.
            </h3>
            <p className="text-gray-300 mb-6">
              We'll use this info to prepare for our strategy call and send you
              the meeting details.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                const name = formData.get("name") as string;
                if (email && name) {
                  await handleEmailSubmit(email, name);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <Input
                  type="text"
                  name="name"
                  required
                  placeholder="Jane Smith"
                  className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Email
                </label>
                <Input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@company.com"
                  className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Continue to Scheduling
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowEmailForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
