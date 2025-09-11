import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductLifecycleSprint } from "@/components/sections/ProductLifecycleSprint";

export const metadata: Metadata = {
  title: "AI Product Lifecycle Sprint - VibeCTO.ai",
  description:
    "A focused 4-week process to start or accelerate your AI journey. Get quick results with custom AI agent configuration and pilot project execution.",
  openGraph: {
    title: "AI Product Lifecycle Sprint - VibeCTO.ai",
    description:
      "A focused 4-week process to start or accelerate your AI journey. Get quick results with custom AI agent configuration and pilot project execution.",
    url: "https://vibecto.ai/ai-product-lifecycle-sprint",
    images: [
      {
        url: "/vibe-cto-og.png",
        width: 1200,
        height: 630,
        alt: "AI Product Lifecycle Sprint - VibeCTO.ai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Product Lifecycle Sprint - VibeCTO.ai",
    description:
      "A focused 4-week process to start or accelerate your AI journey. Get quick results with custom AI agent configuration and pilot project execution.",
    images: ["/vibe-cto-og.png"],
  },
  alternates: {
    canonical: "https://vibecto.ai/ai-product-lifecycle-sprint",
  },
};

export default function AIProductLifecycleSprintPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Navigation />
        <div className="pt-20 flex-grow">
          <ProductLifecycleSprint />
        </div>
        <Footer />
      </div>
    </>
  );
}