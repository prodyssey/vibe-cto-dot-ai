import { AdventureGame } from "@/components/adventure/AdventureGame";
import { Navigation } from "@/components/Navigation";
import SEO from "@/components/SEO";

const Adventure = () => {
  return (
    <>
      <SEO
        title="Adventure - Explore Your Path | VibeCTO.ai"
        description="Embark on an interactive journey to discover your ideal tech solution. Choose your path between rapid MVP development or scaling with expert guidance."
        canonicalUrl="https://vibecto.ai/adventure"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
        <Navigation />
        <AdventureGame />
      </div>
    </>
  );
};

export default Adventure;