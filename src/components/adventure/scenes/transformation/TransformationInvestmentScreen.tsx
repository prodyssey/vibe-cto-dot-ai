import {
  DollarSign,
  CheckCircle,
  Clock,
  Users,
  Zap,
} from "lucide-react";

import { CostOfDelayCalculator } from "@/components/CostOfDelayCalculator";

import { AnimatedButton } from "../../components/AnimatedButton";
import { useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import type { Scene as SceneType } from "../../types";

const INVESTMENT_SCENE: SceneType = {
  id: "transformationInvestment",
  type: "detail",
  title: "Investment Overview",
  description: "Understanding the investment in your team's acceleration",
  backgroundClass:
    "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
};

export const TransformationInvestmentScreen = () => {
  const { pushScene } = useBrowserNavigation();

  const handleContinue = () => {
    pushScene("transformationAlignment");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={INVESTMENT_SCENE} className="max-w-4xl w-full">
          <div className="space-y-8">
            {/* Investment Overview */}
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <DollarSign className="w-8 h-8 mr-3 text-purple-400" />
                Transformation Investment Overview
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-purple-300 mb-4 text-lg">
                    Intro Phase (2-4 weeks)
                  </h4>
                  <div className="text-3xl font-bold text-white mb-3">
                    Starting at $10,000
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Team assessment & AI readiness evaluation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Custom AI agent deployment for your stack</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Team training & best practices workshop</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Quick wins implementation</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-purple-300 mb-4 text-lg">
                    Ongoing Partnership
                  </h4>
                  <div className="text-2xl font-bold text-white mb-3">
                    Custom Pricing
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <Zap className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Continuous AI optimization</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Advanced measurement</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Strategic technical leadership support</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Team adoption support and coaching</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Why This Investment Makes Sense
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Clock className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">
                    Reduced Cost of Delay
                  </h4>
                  <p className="text-sm text-gray-400">
                    Ship features to your customers faster with AI-powered
                    development
                  </p>
                </div>
                <div className="text-center">
                  <Users className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">
                    Team Leverage
                  </h4>
                  <p className="text-sm text-gray-400">
                    Multiply your team's output
                  </p>
                </div>
                <div className="text-center">
                  <Zap className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">
                    Competitive Edge
                  </h4>
                  <p className="text-sm text-gray-400">
                    Stay ahead with cutting-edge AI integration
                  </p>
                </div>
              </div>
            </div>

            {/* Cost of Delay Calculator */}
            <CostOfDelayCalculator />

            {/* CTA */}
            <div className="text-center">
              <AnimatedButton
                onClick={handleContinue}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Schedule Alignment Call
                <Zap className="ml-2 w-5 h-5" />
              </AnimatedButton>
              <p className="text-sm text-gray-400 mt-4">
                Let's discuss how AI can transform your team's productivity
              </p>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};