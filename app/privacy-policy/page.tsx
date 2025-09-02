import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy - VibeCTO.ai",
  description: "VibeCTO.ai privacy policy and data handling practices",
  openGraph: {
    title: "Privacy Policy - VibeCTO.ai",
    description: "VibeCTO.ai privacy policy and data handling practices",
    url: "https://vibecto.ai/privacy-policy/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - VibeCTO.ai",
    description: "VibeCTO.ai privacy policy and data handling practices",
  },
  alternates: {
    canonical: "https://vibecto.ai/privacy-policy/",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Navigation />
      <div className="pt-20 pb-16 px-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 text-lg mb-6">
                <strong>Effective Date:</strong> September 2, 2025
              </p>
              
              <div className="space-y-6 text-gray-300">
                <p className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4 text-yellow-200">
                  <strong>Note:</strong> This page structure has been created but requires content from prodyssey.com/privacy-policy/ to be manually copied and adapted with "Prodyssey" replaced by "VibeCTO.ai" and dates updated to September 2, 2025.
                </p>
                
                <p>
                  This privacy policy describes how VibeCTO.ai collects, uses, and protects your personal information.
                </p>
                
                {/* Content will be added here from prodyssey.com */}
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400">
                    Content to be updated with privacy policy details from prodyssey.com/privacy-policy/
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}