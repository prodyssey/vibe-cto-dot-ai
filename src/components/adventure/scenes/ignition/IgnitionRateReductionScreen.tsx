import { GraduationCap, Heart, Sparkles, Star } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { AnimatedButton } from "../../components/AnimatedButton";
import { useGameStore } from "../../gameStore";
import { useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import type { Scene as SceneType } from "../../types";
import { saveChoice } from "../../utils";

const RATE_REDUCTION_SCENE: SceneType = {
  id: "ignitionRateReduction",
  type: "choice",
  title: "Rate Reduction Opportunity",
  description: "You may qualify for our reduced rate program",
  backgroundClass: "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
};

const QUALIFICATION_CATEGORIES = [
  {
    id: "student",
    title: "Student or Recent Graduate",
    icon: <GraduationCap className="w-6 h-6" />,
    description: "Currently enrolled or graduated within the last 2 years",
  },
  {
    id: "nonprofit",
    title: "Non-Profit Organization or Public Benefit Corporation",
    icon: <Heart className="w-6 h-6" />,
    description: "Building technology for social impact",
  },
  {
    id: "underrepresented",
    title: "Underrepresented Founder",
    icon: <Star className="w-6 h-6" />,
    description:
      "First-generation entrepreneur or from underrepresented background",
  },
  {
    id: "aligned",
    title: "Aligned Vision",
    icon: <Sparkles className="w-6 h-6" />,
    description:
      "Building something so aligned with the captain's interests that he'd personally invest",
  },
];

export const IgnitionRateReductionScreen = () => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();

  const toggleCategory = (categoryId: string) => {
    const newSelection = new Set(selectedCategories);
    if (newSelection.has(categoryId)) {
      newSelection.delete(categoryId);
    } else {
      newSelection.add(categoryId);
    }
    setSelectedCategories(newSelection);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Save rate reduction application
    const applicationData = {
      categories: Array.from(selectedCategories),
      additionalInfo,
    };

    makeChoice(RATE_REDUCTION_SCENE.id, "rate-reduction-applied");
    await saveChoice(
      sessionId,
      RATE_REDUCTION_SCENE.id,
      "rate-reduction-applied",
      JSON.stringify(applicationData)
    );

    // Continue to qualification
    pushScene("ignitionQualification");
  };

  const handleSkip = async () => {
    makeChoice(RATE_REDUCTION_SCENE.id, "rate-reduction-skipped");
    await saveChoice(
      sessionId,
      RATE_REDUCTION_SCENE.id,
      "rate-reduction-skipped",
      "Skipped rate reduction application"
    );

    pushScene("ignitionQualification");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-slate-900">
        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array(8)].map((_, i) => {
            const Icon = QUALIFICATION_CATEGORIES[i % 4].icon;
            return (
              <div
                key={i}
                className="absolute text-orange-400 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 5}s`,
                }}
              >
                {Icon}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={RATE_REDUCTION_SCENE} className="max-w-4xl w-full">
          <div className="space-y-6">
            {/* Rate Reduction Info */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <GraduationCap className="w-6 h-6 mr-2 text-orange-400" />
                Ignition Rate Reduction Program
              </h3>

              <div className="text-gray-300 space-y-3">
                <p>
                  We believe the greatest ideas shouldn&apos;t be limited by
                  budget alone. The VibeCTO rate reduction program offers up to 60%
                  off the Ignition program for qualified applicants.
                </p>
                <p className="text-sm text-orange-300">
                  Select all categories that apply to you:
                </p>
              </div>
            </div>

            {/* Qualification Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUALIFICATION_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    "text-left transition-all duration-300",
                    "bg-gray-800/30 backdrop-blur-sm border rounded-xl p-4",
                    "hover:bg-gray-800/50",
                    selectedCategories.has(category.id)
                      ? "border-orange-500 bg-gray-800/60"
                      : "border-gray-700/50"
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        selectedCategories.has(category.id)
                          ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                          : "bg-gray-700/50 text-gray-400"
                      )}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">
                        {category.title}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Tell us more about your situation (optional):
              </label>
              <Textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Share any additional context that might help us understand your needs..."
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
              >
                Skip for now
              </Button>

              <AnimatedButton
                onClick={handleSubmit}
                disabled={selectedCategories.size === 0 || isSubmitting}
                className={cn(
                  "bg-gradient-to-r from-orange-600 to-red-600",
                  selectedCategories.size === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-orange-700 hover:to-red-700"
                )}
                particleColors={["#dc2626", "#ea580c", "#f97316"]}
              >
                {isSubmitting ? "Submitting..." : "Apply for Reduced Rate"}
              </AnimatedButton>
            </div>

            {/* Note */}
            <p className="text-center text-sm text-gray-400">
              Your rate reduction application will be reviewed during the
              qualification process
            </p>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};
