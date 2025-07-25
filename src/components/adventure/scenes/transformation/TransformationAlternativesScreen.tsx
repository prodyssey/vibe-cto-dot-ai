import { BookOpen, Users, Sparkles, ArrowRight, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGameStore } from "../../gameStore";
import { useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import type { Scene as SceneType } from "../../types";
import { saveChoice } from "../../utils";

const ALTERNATIVES_SCENE: SceneType = {
  id: "transformationAlternatives",
  type: "choice",
  title: "Alternative Paths",
  description: "Let's find the right solution for your current stage",
  backgroundClass: "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
};

const ALTERNATIVE_OPTIONS = [
  {
    id: "self-study",
    title: "Self-Study Resources",
    icon: <BookOpen className="w-8 h-8" />,
    description: "Learn AI development practices at your own pace",
    features: [
      "Free AI development guides",
      "Tool recommendations",
      "Best practices documentation",
      "Community forum access",
    ],
    action: () => window.open("/resources", "_blank"),
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: "workshop",
    title: "Team Workshop",
    icon: <Users className="w-8 h-8" />,
    description: "One-day intensive AI training for your team",
    features: [
      "Hands-on AI coding session",
      "Custom to your tech stack",
      "Team transformation blueprint",
      "90-day follow-up support",
    ],
    action: () => window.open("https://savvycal.com/craigsturgis/vibecto-30-minute-call", "_blank"),
    color: "from-purple-600 to-pink-600",
  },
  {
    id: "pilot-project",
    title: "Pilot Project",
    icon: <Sparkles className="w-8 h-8" />,
    description: "Start small with a proof-of-concept",
    features: [
      "Single feature AI integration",
      "Measurable results in 2 weeks",
      "Risk-free evaluation",
      "Scale up when ready",
    ],
    action: () => window.open("https://savvycal.com/craigsturgis/vibecto-30-minute-call", "_blank"),
    color: "from-green-600 to-emerald-600",
  },
];

export const TransformationAlternativesScreen = () => {
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();

  const handleOptionSelect = async (option: typeof ALTERNATIVE_OPTIONS[0]) => {
    // Save choice
    makeChoice(ALTERNATIVES_SCENE.id, option.id);
    await saveChoice(
      sessionId,
      ALTERNATIVES_SCENE.id,
      option.id,
      option.title
    );

    // Execute action
    option.action();
    
    // Navigate to final scene after a delay
    setTimeout(() => {
      pushScene("transformationFinal");
    }, 500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)`
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={ALTERNATIVES_SCENE} className="max-w-5xl w-full">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Not quite ready for full transformation? Here are some great ways to get started 
                with AI-powered development at a pace that works for you.
              </p>
            </div>

            {/* Alternative Options Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {ALTERNATIVE_OPTIONS.map((option) => (
                <Card 
                  key={option.id}
                  className="bg-gray-900/50 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <CardHeader>
                    <div className={`p-4 rounded-lg bg-gradient-to-r ${option.color} w-fit mx-auto mb-4`}>
                      {option.icon}
                    </div>
                    <CardTitle className="text-white text-center">
                      {option.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-center">
                      {option.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {option.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-400">
                          <Sparkles className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90`}
                    >
                      Learn More
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Still Interested */}
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-3">
                Changed Your Mind?
              </h3>
              <p className="text-gray-300 mb-4">
                If you'd like to discuss the full transformation program, I'm always happy to chat.
              </p>
              <Button
                onClick={() => pushScene("transformationAlignment")}
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
              >
                Back to Alignment Options
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};