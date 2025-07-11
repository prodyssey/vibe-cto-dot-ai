import { AdventureGame } from "@/components/adventure/AdventureGame";
import { Navigation } from "@/components/Navigation";

const Adventure = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <AdventureGame />
    </div>
  );
};

export default Adventure;