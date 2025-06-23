
import { Hero } from "@/components/sections/Hero";
import { ProblemPromise } from "@/components/sections/ProblemPromise";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Proof } from "@/components/sections/Proof";
import { Resources } from "@/components/sections/Resources";
import { FinalCTA } from "@/components/sections/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Hero />
      <ProblemPromise />
      <HowItWorks />
      <Proof />
      <Resources />
      <FinalCTA />
    </div>
  );
};

export default Index;
