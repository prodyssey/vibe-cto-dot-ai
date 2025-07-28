import { EmailOptIn } from "@/components/EmailOptIn";
import { Navigation } from "@/components/Navigation";
import SEO from "@/components/SEO";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Paths } from "@/components/sections/Paths";
import { ProblemPromise } from "@/components/sections/ProblemPromise";
import { Proof } from "@/components/sections/Proof";
import { Resources } from "@/components/sections/Resources";

const Index = () => {
  return (
    <>
      <SEO
        title="VibeCTO.ai - From Vibes to Products | AI-Powered Development"
        description="Transform your ideas into real, secure, scalable products with elite AI-powered development guidance. Join the AI revolution in software development."
        canonicalUrl="https://vibecto.ai/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "VibeCTO.ai",
          "description": "Elite AI-powered development guidance to transform ideas into products",
          "url": "https://vibecto.ai/"
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="pt-20">
          <Hero />
          <ProblemPromise />
          <HowItWorks />
          {/* <Proof /> */}
          <Resources />
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
      </div>
    </>
  );
};

export default Index;
