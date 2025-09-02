import type { Metadata } from "next";
import { EmailOptIn } from "@/components/EmailOptIn";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Paths } from "@/components/sections/Paths";
import { ProblemPromise } from "@/components/sections/ProblemPromise";
import { Proof } from "@/components/sections/Proof";
import { Resources } from "@/components/sections/Resources";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "VibeCTO.ai - From vibes to product | AI-Powered Development",
  description:
    "Elite AI augmented engineering and vibe coding guidance. Transform your ideas into real, secure, scalable products with AI-powered development help.",
  openGraph: {
    title: "VibeCTO.ai - From vibes to product | AI-Powered Development",
    description:
      "Elite AI augmented engineering and vibe coding guidance. Transform your ideas into real, secure, scalable products with AI-powered development help.",
    url: "https://vibecto.ai/",
    images: [
      {
        url: "/vibe-cto-og.png",
        width: 1200,
        height: 630,
        alt: "VibeCTO.ai - From vibes to product",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeCTO.ai - From vibes to product | AI-Powered Development",
    description:
      "Elite AI augmented engineering and vibe coding guidance. Transform your ideas into real, secure, scalable products with AI-powered development help.",
    images: ["/vibe-cto-og.png"],
  },
  alternates: {
    canonical: "https://vibecto.ai/",
  },
};

export default async function HomePage() {
  const posts = await getAllPosts();
  const featuredPosts = posts.filter((post) => post.featured).slice(0, 3);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Navigation />
        <div className="pt-20 flex-grow">
          <Hero />
          <ProblemPromise />
          <Proof />
          <HowItWorks />
          <Resources posts={featuredPosts} />
          <div className="py-16 px-6">
            <EmailOptIn
              title="Follow along"
              description="Get the latest as I build and share what I learn"
              className="max-w-2xl mx-auto"
            />
          </div>
          <Paths />
          <FinalCTA />
        </div>
        <Footer />
      </div>
    </>
  );
}
