import { Navigation } from "@/components/Navigation";
import { AdventureGame } from "@/components/adventure/AdventureGame";

const Adventure = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <AdventureGame />
    </div>
  );
};

export default Adventure;