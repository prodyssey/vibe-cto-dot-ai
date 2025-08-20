import { BookOpen, Users, Rocket, ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailOptIn } from "@/components/EmailOptIn";

import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import { SceneTransition } from "../../animations";
import { useGameStore } from "../../gameStore";
import { useBrowserNavigation } from "../../hooks";
import { getScene } from "../../scenes";
import { saveChoice } from "../../utils";

export const LaunchControlAlternativesScreen = () => {
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const scene = getScene("launchControlAlternatives");

  if (!scene) {
    return null;
  }

  const alternatives = [
    {
      id: "newsletter",
      icon: Mail,
      title: "Get Scaling Insights",
      description:
        "Join our newsletter for weekly insights on scaling challenges, architecture patterns, and lessons from successful startups.",
      benefits: [
        "Tips and best practices for bridging prototype to production",
        "Case studies from other startups",
        "Early access to new resources",
        "Exclusive content for subscribers",
      ],
      cta: "Sign Up for Updates",
    },
    {
      id: "resources",
      icon: BookOpen,
      title: "Free Scaling Resources",
      description:
        "Access our comprehensive guides, architecture templates, and best practices for scaling your product on your own timeline.",
      benefits: [
        "Learn what we're learning from the forefront",
        "The best of our content",
        "More interactive guides",
      ],
      cta: "Browse Resources",
      action: () => {
        saveChoice(
          sessionId,
          "launchControlAlternatives",
          "resources",
          "Selected free resources"
        );
        window.location.href = "/resources";
      },
    },
    {
      id: "ignition",
      icon: Rocket,
      title: "Start with Ignition",
      description:
        "If you're still building your MVP or early prototype, Ignition might be a better fit to get you to a scalable foundation.",
      benefits: [
        "Rapid MVP development",
        "Product-market fit validation",
        "Technical foundation building",
        "Path to Launch Control when ready",
      ],
      cta: "Explore Ignition",
      action: () => {
        saveChoice(
          sessionId,
          "launchControlAlternatives",
          "ignition",
          "Redirected to Ignition"
        );
        makeChoice("launchControlAlternatives", "ignition", { ignition: 2, launch_control: 0, transformation: 0 });
        pushScene("ignitionDetail");
      },
    },
  ];

  return (
    <SceneTransition sceneId="launchControlAlternatives" transitionType="fade">
      <Scene scene={scene} className="max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Alternative Paths Forward
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            While Launch Control might not be the right fit today, we have other
            ways to support your journey. Choose the option that best matches
            your current needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {alternatives.map((alt) => (
            <Card
              key={alt.id}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col"
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
                    <alt.icon className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-white text-xl">
                  {alt.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-300 mb-4">{alt.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {alt.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start text-sm text-gray-400"
                    >
                      <span className="text-blue-400 mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                {alt.id === "newsletter" ? (
                  hasSignedUp ? (
                    <div className="text-center p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 font-medium">
                        Thanks for subscribing!
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Check your inbox for confirmation
                      </p>
                    </div>
                  ) : (
                    <EmailOptIn
                      variant="minimal"
                      buttonText="Subscribe"
                      className="w-full"
                      onSuccess={() => {
                        setHasSignedUp(true);
                        saveChoice(
                          sessionId,
                          "launchControlAlternatives",
                          "newsletter",
                          "Subscribed to newsletter"
                        );
                      }}
                    />
                  )
                ) : alt.action ? (
                  <Button
                    onClick={alt.action}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {alt.cta}
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => pushScene("destinationSelection")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Mission Selection
          </Button>
        </div>

        <SceneNavigation showBack showReset />
      </Scene>
    </SceneTransition>
  );
};
