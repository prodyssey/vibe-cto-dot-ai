'use client'

import { Navigation } from "@/components/Navigation";
import { EmailOptIn } from "@/components/EmailOptIn";

export function ResourcesClient() {
  return (
    <>
      <Navigation />
      <div className="pt-20">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Resources
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Insights, guides, and resources for AI-augmented engineering and product development.
              </p>
              <div className="text-gray-300">
                <p>Resources coming soon. Stay tuned for insights on AI-augmented engineering!</p>
              </div>
            </div>
          </div>
          
          <div className="py-16 px-6">
            <EmailOptIn
              title="Stay updated"
              description="Get the latest resources and insights as they're published"
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
}