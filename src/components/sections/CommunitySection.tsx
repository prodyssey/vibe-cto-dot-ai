'use client'

import { Users, MessageSquare, Code, Zap } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CommunitySignupModal } from "@/components/CommunitySignupModal";

export const CommunitySection = () => {
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Peer Support",
      description: "Get help from other founders and builders working on similar challenges"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Code Reviews",
      description: "Share code snippets and architectural decisions for feedback"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Resource Sharing",
      description: "Access exclusive guides, templates, and tools curated by the community"
    }
  ];

  return (
    <>
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                Coming Soon
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join the Builder Community
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Connect with other founders, builders, and creators who are using AI to accelerate their projects. 
              Share knowledge, get feedback, and grow together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 text-center"
              >
                <div className="inline-flex p-3 rounded-lg bg-purple-500/20 text-purple-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Be the first to know
              </h3>
              <p className="text-gray-300 mb-8">
                We're building something special. Join the waitlist to get early access to our exclusive 
                community of builders when we launch.
              </p>
              
              <Button
                onClick={() => setShowCommunityModal(true)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                <Users className="mr-2 w-5 h-5" />
                Join Community Waitlist
              </Button>

              <p className="text-sm text-gray-400 mt-4">
                Free to join • No spam • Early access when we launch
              </p>
            </div>
          </div>
        </div>
      </section>

      <CommunitySignupModal
        isOpen={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
        source="website-community-section"
      />
    </>
  );
};