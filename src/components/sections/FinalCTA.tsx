import { Calendar, ArrowRight, Clock } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { addSavvyCalTracking } from "@/lib/analytics";

export const FinalCTA = () => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (linkRef.current) {
      addSavvyCalTracking(linkRef.current, "final_cta_section", "clarity_call");
    }
  }, []);
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The best ideas don&apos;t have to wait—let&apos;s make them real
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Stop wondering &quot;what if&quot; and start shipping. But first,
            let's play a game...
          </p>

          <div className="space-y-8">
            <Button
              onClick={() => navigate("/adventure")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 md:px-12 py-4 md:py-6 text-lg md:text-xl font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Enter the VibeCTO Station
              <ArrowRight className="ml-2 md:ml-3 w-5 md:w-6 h-5 md:h-6" />
            </Button>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400 px-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>5 minutes</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>No commitment required</span>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>See something I vibe coded</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
